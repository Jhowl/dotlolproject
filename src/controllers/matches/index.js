import { heroes } from "dotaconstants";

import Controller from "../controller.js";

class Matches extends Controller {
  constructor({ where = '', whereInner='', values = [], join='', groupBy='', filters = {} }) {
    super({ tableName: "matches" });
    this.where = where;
    this.whereInner = whereInner;
    this.values = values;
    this.matches = [];
    this.join = join;
    this.groupBy = groupBy;
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

    if (filters.outcome) {
      preparedFilters.outcome = filters.outcome;
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

    if (this.filters.outcome) {
      if (this.filters.outcome === 'win') {
        where += ` AND (
          (radiant_team_id = $1 and radiant_win = TRUE)
          OR
          (dire_team_id = $1 and radiant_win = FALSE)
        ) `;

      } else if (this.filters.outcome === 'lose') {
        where += ` AND (
          (radiant_team_id = $1 and radiant_win = FALSE)
          OR
          (dire_team_id = $1 and radiant_win = TRUE)
        ) `;
      }
    }

    return where;
  }

  async getMatches() {
    if (this.matches.length) {
      return this.matches;
    }

    const search = this.getSearchCoditions();

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
      ${this.groupBy}
      ORDER BY
          m.start_time DESC
      LIMIT 100;
    `;

    const res = await this.query(query, this.values);
    this.matches = res;

    return this.matches;
  }

  getSearchCoditions = () => {
    const heroes = this.filters.heroes ? `AND EXISTS (SELECT 1 FROM players WHERE players.match_id = m.match_id AND players.hero_id IN (${this.filters.heroes}))` : '';
    const teams = this.filters.teams ? `AND (m.radiant_team_id IN (${this.filters.teams}) OR m.dire_team_id IN (${this.filters.teams}))` : '';
    const leagues = this.filters.leagues ? `AND m.league_id IN (${this.filters.leagues})` : '';
    const patches = this.filters.patches ? `AND m.patch IN (${this.filters.patches})` : '';
    const startDate = this.filters.startDate ? `AND m.start_time >= '${this.filters.startDate}'` : '';
    const endDate = this.filters.endDate ? `AND m.start_time <= '${this.filters.endDate}'` : '';

    const where = this.whereInner ? this.whereInner : this.where;
    const search = `${where} ${teams} ${heroes} ${leagues} ${patches} ${startDate} ${endDate}`;

    return search;
  }


  getAverageDireRadiantScoreByHero = async () => {
    const search = this.getSearchCoditions();

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
        GROUP BY
            m.id, p.hero_id
    )
    , HeroAggregates AS (
        SELECT
            hero_id,
            COUNT(DISTINCT match_id) AS heroMatches,
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
        CASE WHEN heroMatches > 0 THEN matchesScore / heroMatches ELSE 0 END as average_score,
        CASE WHEN heroMatches > 0 THEN total_duration / heroMatches ELSE 0 END as average_duration
    FROM
        HeroAggregates
    ORDER BY
        heroMatches DESC;`

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
    const search = this.getSearchCoditions();

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
        GROUP BY
            m.match_id, p.hero_id, score
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

  getDurationsAndScoreByDay = async () => {
    const query = `
      SELECT
        TO_CHAR(DATE_TRUNC('day', start_time), 'YYYY-MM-DD') AS interval_start,
        AVG(duration) AS average_duration,
        AVG(radiant_score + dire_score) AS total_score,
        COUNT(match_id) AS total_matches
      FROM
        matches
      ${this.getWhereFilter()}
      GROUP BY
        TO_CHAR(DATE_TRUNC('day', start_time), 'YYYY-MM-DD')
      ORDER BY
        interval_start
    `; // by day

    // const query = `
    //   SELECT
    //     DATE_TRUNC('day', m.start_time) - INTERVAL '1 day' * MOD(EXTRACT(DAY FROM DATE_TRUNC('day', m.start_time)) - 1, 15) AS interval_start,
    //     COUNT(m.match_id) AS total_matches,
    //     SUM(m.radiant_score + m.dire_score) AS total_score,
    //     AVG(m.duration) AS average_duration
    //   FROM
    //     matches m
    //   ${this.getWhereFilter()}
    //   GROUP BY
    //     interval_start
    //   ORDER BY
    //     interval_start;
    // `;


    const res = await this.query(query, this.values);
    const labels = res?.map(item => item.interval_start);

    const data = {
      labels: labels,
      chart: res,
    };

    return data;
  }

  getDurationsAndScoreByWeek = async () => {
    const query = `
      SELECT
        TO_CHAR(DATE_TRUNC('week', start_time), 'YYYY-MM-DD') AS interval_start,
        AVG(duration) AS average_duration,
        AVG(radiant_score + dire_score) AS total_score,
        COUNT(match_id) AS total_matches
      FROM
        matches
      ${this.getWhereFilter()}
      GROUP BY
        TO_CHAR(DATE_TRUNC('week', start_time), 'YYYY-MM-DD')
      ORDER BY
        interval_start
    `;

    const res = await this.query(query, this.values);
    const labels = res?.map(item => item.interval_start);

    const data = {
      labels: labels,
      chart: res,
    };

    return data;
  }

  async getStandartDeviationMatchesScore() {
    const query = `
      WITH MatchScores AS (
        SELECT
            m.id AS match_id,
            m.radiant_score + m.dire_score AS total_score
        FROM
            matches m
        ${this.getWhereFilter()}
    )
    SELECT
        ROUND(COUNT(CASE WHEN total_score < 30.5 THEN 1 END) * 100.0 / COUNT(*), 2) AS less_than_30_5,
        ROUND(COUNT(CASE WHEN total_score < 32.5 THEN 1 END) * 100.0 / COUNT(*), 2) AS less_than_32_5,
        ROUND(COUNT(CASE WHEN total_score < 34.5 THEN 1 END) * 100.0 / COUNT(*), 2) AS less_than_34_5,
        ROUND(COUNT(CASE WHEN total_score < 36.5 THEN 1 END) * 100.0 / COUNT(*), 2) AS less_than_36_5,
        ROUND(COUNT(CASE WHEN total_score < 38.5 THEN 1 END) * 100.0 / COUNT(*), 2) AS less_than_38_5,
        ROUND(COUNT(CASE WHEN total_score < 40.5 THEN 1 END) * 100.0 / COUNT(*), 2) AS less_than_40_5,
        ROUND(COUNT(CASE WHEN total_score < 42.5 THEN 1 END) * 100.0 / COUNT(*), 2) AS less_than_42_5,
        ROUND(COUNT(CASE WHEN total_score < 44.5 THEN 1 END) * 100.0 / COUNT(*), 2) AS less_than_44_5,
        ROUND(COUNT(CASE WHEN total_score < 46.5 THEN 1 END) * 100.0 / COUNT(*), 2) AS less_than_46_5,
        ROUND(COUNT(CASE WHEN total_score < 48.5 THEN 1 END) * 100.0 / COUNT(*), 2) AS less_than_48_5,
        ROUND(COUNT(CASE WHEN total_score < 50.5 THEN 1 END) * 100.0 / COUNT(*), 2) AS less_than_50_5,
        ROUND(COUNT(CASE WHEN total_score < 52.5 THEN 1 END) * 100.0 / COUNT(*), 2) AS less_than_52_5,
        ROUND(COUNT(CASE WHEN total_score < 54.5 THEN 1 END) * 100.0 / COUNT(*), 2) AS less_than_54_5,
        ROUND(COUNT(CASE WHEN total_score < 56.5 THEN 1 END) * 100.0 / COUNT(*), 2) AS less_than_56_5,
        ROUND(COUNT(CASE WHEN total_score < 58.5 THEN 1 END) * 100.0 / COUNT(*), 2) AS less_than_58_5,
        ROUND(COUNT(CASE WHEN total_score < 60.5 THEN 1 END) * 100.0 / COUNT(*), 2) AS less_than_60_5,
        ROUND(COUNT(CASE WHEN total_score < 62.5 THEN 1 END) * 100.0 / COUNT(*), 2) AS less_than_62_5,
        ROUND(COUNT(CASE WHEN total_score < 64.5 THEN 1 END) * 100.0 / COUNT(*), 2) AS less_than_64_5,
        ROUND(COUNT(CASE WHEN total_score < 66.5 THEN 1 END) * 100.0 / COUNT(*), 2) AS less_than_66_5,
        ROUND(COUNT(CASE WHEN total_score < 68.5 THEN 1 END) * 100.0 / COUNT(*), 2) AS less_than_68_5,
        ROUND(COUNT(CASE WHEN total_score < 70.5 THEN 1 END) * 100.0 / COUNT(*), 2) AS less_than_70_5
    FROM
        MatchScores;`;

    const res = await this.query(query, this.values);
    return res[0];
  }

  async getStandartDeviationMatchesDuration() {
    const query =`
      WITH MatchDurations AS (
        SELECT
            m.id AS match_id,
            m.duration
        FROM
            matches m
          ${this.getWhereFilter()}
    )
    SELECT
        ROUND(COUNT(CASE WHEN duration < 1800 THEN 1 END) * 100.0 / COUNT(*), 2) AS less_than_1800,
        ROUND(COUNT(CASE WHEN duration < 1920 THEN 1 END) * 100.0 / COUNT(*), 2) AS less_than_1920,
        ROUND(COUNT(CASE WHEN duration < 2040 THEN 1 END) * 100.0 / COUNT(*), 2) AS less_than_2040,
        ROUND(COUNT(CASE WHEN duration < 2160 THEN 1 END) * 100.0 / COUNT(*), 2) AS less_than_2160,
        ROUND(COUNT(CASE WHEN duration < 2280 THEN 1 END) * 100.0 / COUNT(*), 2) AS less_than_2280,
        ROUND(COUNT(CASE WHEN duration < 2400 THEN 1 END) * 100.0 / COUNT(*), 2) AS less_than_2400,
        ROUND(COUNT(CASE WHEN duration < 2520 THEN 1 END) * 100.0 / COUNT(*), 2) AS less_than_2520,
        ROUND(COUNT(CASE WHEN duration < 2640 THEN 1 END) * 100.0 / COUNT(*), 2) AS less_than_2640
    FROM
        MatchDurations;`

    const res = await this.query(query, this.values);
    return res[0];
  }

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
