import { heroes } from "dotaconstants";

import Controller from "../controller.js";

class Matches extends Controller {
  constructor({ where = '', whereInner='', values = [], join='', filters = {} }) {
    super({ tableName: "matches" });
    this.where = where;
    this.whereInner = whereInner;
    this.values = values;
    this.matches = [];
    this.join = join;
    this.filters = this.prepareFilters(filters);
  }

  prepareFilters = (filters) => {
    const preparedFilters = {};

    if (Object.keys(filters).length === 0) {
      return preparedFilters;
    }

    if (filters.teams) {
      preparedFilters.teams = filters.teams;
    }

    if (filters.leagues) {
      preparedFilters.leagues = filters.leagues;
    }

    if (filters.heroes) {
      preparedFilters.heroes = filters.heroes.split(',');
    }

    if (filters.patches) {
      preparedFilters.patches = filters.patches;
    }

    if (filters.startDate) {
      preparedFilters.startDate = filters.startDate;
    }

    if (filters.endDate) {
      preparedFilters.endDate = filters.endDate;
    }

    return preparedFilters;
  }

  getWhereFilter = () => {
    let where = this.where;

    if (this.filters && Object.keys(this.filters).length === 0) {
      return where;
    }

    if (this.filters.teams) {
      where += ` AND (radiant_team_id IN (${this.filters.teams}) OR dire_team_id IN (${this.filters.teams}))`;
    }

    if (this.filters.leagues) {
      where += ` AND league_id IN (${this.filters.leagues})`;
    }

    if (this.filters.heroes) {

      where += ` AND match_id IN (SELECT match_id FROM players WHERE hero_id IN (${this.filters.heroes.join(',')}))`;
    }

    if (this.filters.patches) {
      where += ` AND patch IN (${this.filters.patches})`;
    }

    if (this.filters.startDate) {
      where += ` AND start_time >= ${this.filters.startDate}`;
    }

    if (this.filters.endDate) {
      where += ` AND start_time <= ${this.filters.endDate}`;
    }

    return where;
  }

  async getMatches() {
    if (this.matches.length) {
      return this.matches;
    }

    const heroes = this.filters.heroes ? `AND EXISTS (SELECT 1 FROM players WHERE players.match_id = m.match_id AND players.hero_id IN (${this.filters.heroes}))` : '';
    const leagues = this.filters.leagues ? `AND m.league_id IN (${this.filters.leagues})` : '';
    const patches = this.filters.patches ? `AND m.patch IN (${this.filters.patches})` : '';
    const startDate = this.filters.startDate ? `AND m.start_time >= '${this.filters.startDate}'` : '';
    const endDate = this.filters.endDate ? `AND m.start_time <= '${this.filters.endDate}'` : '';

    const where = this.whereInner ? this.whereInner : this.where;
    const search = `${where} ${heroes} ${leagues} ${patches} ${startDate} ${endDate}`;

    const query = `
      SELECT
        m.match_id,
        m.duration,
        m.dire_score,
        m.radiant_score,
        m.start_time,
        CASE
            WHEN m.radiant_win THEN rt.name
            ELSE dt.name
        END AS winner,
        rt.name AS radiant_name,
        dt.name AS dire_name,
        l.name  AS league_name,
        rt.name AS first_tower_team_name,
        m.first_tower_time
      FROM
          matches m
      JOIN
          teams rt ON m.radiant_team_id = rt.team_id
      JOIN
          teams dt ON m.dire_team_id = dt.team_id
      JOIN
          leagues l ON m.league_id = l.league_id
      ${this.join}
      ${search}
      ORDER BY
          m.start_time DESC
      LIMIT 100;
    `;

    const res = await this.query(query, this.values);
    this.matches = res;

    return this.matches;
  }

  getAverageDireRadiantScoreByHero = async () => {
    const heroes = this.filters.heroes ? `AND EXISTS (SELECT 1 FROM players WHERE players.match_id = m.match_id AND players.hero_id IN (${this.filters.heroes}))` : '';
    const leagues = this.filters.leagues ? `AND m.league_id IN (${this.filters.leagues})` : '';
    const patches = this.filters.patches ? `AND m.patch IN (${this.filters.patches})` : '';
    const startDate = this.filters.startDate ? `AND m.start_time >= '${this.filters.startDate}'` : '';
    const endDate = this.filters.endDate ? `AND m.start_time <= '${this.filters.endDate}'` : '';

    const where = this.whereInner ? this.whereInner : this.where;
    const search = `${where} ${heroes} ${leagues} ${patches} ${startDate} ${endDate}`;

    const query = `
      WITH MatchHeroStats AS (
        SELECT
            m.id AS match_id,
            m.radiant_score + m.dire_score AS score,
            m.duration,
            p.hero_id
        FROM
            matches m
        JOIN
            players p ON m.match_id = p.match_id
        ${search}
    )
    , HeroAggregates AS (
        SELECT
            hero_id,
            COUNT(match_id) AS heroMatches,
            SUM(score) AS matchesScore,
            SUM(duration) AS total_duration
        FROM
            MatchHeroStats
        GROUP BY
            hero_id
    )
    SELECT
        hero_id,
        heroMatches as total_matches,
        matchesScore / heroMatches as score,
        total_duration / heroMatches as duration
    FROM
        HeroAggregates
    ORDER BY
        heroMatches DESC;
      `;

    const res = await this.query(query, this.values);
    return res;
  };

  getDurationsAndScore = async () => {
    const query = `
      SELECT
        duration,
        radiant_score,
        dire_score
      FROM
        matches
      ${this.getWhereFilter()}
    `;

    const res = await this.query(query, this.values);

    return res;
  };

  async getHeroes() {
    const where = this.whereInner ? this.whereInner : this.where;

    const query = `
      SELECT DISTINCT
          p.hero_id
      FROM
          matches m
      JOIN
          players p ON m.match_id = p.match_id
      ${where}
    `;

    const res = await this.query(query, this.values);

    return res.map(hero => ({
      name: heroes[hero.hero_id].localized_name,
      id: hero.hero_id
    }));
  }

  getStandarDeviations = async () => {
    const heroes = this.filters.heroes ? `AND EXISTS (SELECT 1 FROM players WHERE players.match_id = m.match_id AND players.hero_id IN (${this.filters.heroes}))` : '';
    const leagues = this.filters.leagues ? `AND m.league_id IN (${this.filters.leagues})` : '';
    const patches = this.filters.patches ? `AND m.patch IN (${this.filters.patches})` : '';
    const startDate = this.filters.startDate ? `AND m.start_time >= ${this.filters.startDate}` : '';
    const endDate = this.filters.endDate ? `AND m.start_time <= ${this.filters.endDate}` : '';

    const where = this.whereInner ? this.whereInner : this.where;
    const search = `${where} ${heroes} ${leagues} ${patches} ${startDate} ${endDate}`;

    const query = `
      WITH MatchHeroStats AS (
        SELECT
            m.match_id AS match_id,
            m.radiant_score + m.dire_score AS score,
            p.hero_id
        FROM
            matches m
        JOIN
            players p ON m.match_id = p.match_id
        ${search}
    )
    , HeroScoreData AS (
      SELECT
          hero_id,
          COUNT(*) AS total_matches,
          SUM(CASE WHEN mhs.score < 44.5 THEN 1 ELSE 0 END) AS threshold_44_5,
          SUM(CASE WHEN mhs.score < 48.5 THEN 1 ELSE 0 END) AS threshold_48_5,
          SUM(CASE WHEN mhs.score < 52.5 THEN 1 ELSE 0 END) AS threshold_52_5
      FROM
          MatchHeroStats mhs
      GROUP BY
          hero_id
  )
  , HeroScorePercentages AS (
      SELECT
          hero_id,
          total_matches,
          threshold_44_5,
          threshold_48_5,
          threshold_52_5,
          CONCAT(ROUND((threshold_44_5 * 100.0) / total_matches, 2), '%') AS threshold_44_5_percent,
          CONCAT(ROUND((threshold_48_5 * 100.0) / total_matches, 2), '%') AS threshold_48_5_percent,
          CONCAT(ROUND((threshold_52_5 * 100.0) / total_matches, 2), '%') AS threshold_52_5_percent
      FROM
          HeroScoreData
  )
  SELECT
      hero_id,
      total_matches,
      threshold_44_5,
      threshold_44_5_percent,
      threshold_48_5,
      threshold_48_5_percent,
      threshold_52_5,
      threshold_52_5_percent
  FROM
      HeroScorePercentages;
    `;

    const res = await this.query(query, this.values);
    return res;
  };

  getFirstTowerAverage = async () => {
    const query = `
      SELECT
        AVG(first_tower_time) as average_tower_time
      FROM
        matches
      ${this.getWhereFilter()}
    `;

    const res = await this.query(query, this.values);
    return res[0];
  };

  async statistics() {
    const columns =`
      MIN(radiant_score + dire_score) AS min_score,
      MAX(radiant_score + dire_score) AS max_score,
      AVG(radiant_score + dire_score) AS avg_score,
      MIN(duration) AS min_duration,
      MAX(duration) AS max_duration,
      AVG(duration) AS avg_duration,
      AVG(first_tower_time) as average_tower_time,
      COUNT(*) AS total_matches
    `;

    const statistics = await this.getWhere(this.getWhereFilter(), this.values, columns);

    return statistics[0];
  }
}

export default Matches;
