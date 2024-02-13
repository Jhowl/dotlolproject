import Controller from "../controller.js";
import matches from "../matches/index.js";

class League extends Controller {
  constructor(slug) {
    super({ tableName: "leagues" });
    this.slug = slug;
    this.league = { league_id: null }; // Initialize league with league_id property
    this.matches = [];
    this.where = 'WHERE league_id = $1';
  }

  async setLeague() {
    const league = await this.getBySlug();
    this.league = league;
  }

  async get() {
    const league = await this.getBySlug();
    const winrate = await matches.getWinratePercentage(this.league.league_id);
    const heroesScoreAverage = await matches.getAverageDireRadiantScoreByHero(this.where, [this.league.league_id]);
    const statistics = await this.leagueStatistics();

    return {
      league,
      matches: await this.getMatches(),
      winrate,
      heroesScoreAverage,
      statistics
    };
  }

  async getBySlug() {
    const query = `SELECT * FROM leagues WHERE slug = $1`;
    const value = [this.slug];

    const res = await this.query(query, value);
    return res[0];
  }

  async getMatches() {
    if (this.matches.length) {
      return this.matches;
    }

    const leagueMatches = await matches.getWhere(this.where, [this.league.league_id]);
    this.matches = leagueMatches;

    return this.matches;
  }

  async leagueStatistics() {
    const columns =`
      MIN(radiant_score + dire_score) AS min_score,
      MAX(radiant_score + dire_score) AS max_score,
      AVG(radiant_score + dire_score) AS avg_score,
      MIN(duration) AS min_duration,
      MAX(duration) AS max_duration,
      AVG(duration) AS avg_duration,
      AVG(get_first_tower_time) as average_tower_time,
      COUNT(*) AS total_matches
    `;

    const statistics = await matches.getWhere(this.where, [this.league.league_id], columns);

    return statistics[0];
  }

  async getStandarDeviations() {
    const standartDeviations = await matches.getStandarDeviations(this.where, [this.league.league_id]);

    return standartDeviations;
  }

  async getWinrate() {
    const winrate = await matches.getWinratePercentage(this.league.league_id);
    return winrate;
  }

  async getAverageDireRadiantScoreByHero() {
    const heroesScoreAverage = await matches.getAverageDireRadiantScoreByHero(this.where, [this.league.league_id]);

    return heroesScoreAverage;
  }

  async getTeams() {
    const query = `
      SELECT
        t.team_id,
        t.name
      FROM
        matches m
      JOIN
        teams t ON m.radiant_team_id = t.team_id OR m.dire_team_id = t.team_id
      WHERE
        m.league_id = $1
      GROUP BY
        t.team_id,
        t.name
      ORDER BY
        t.name
    `;

    const leagues = await this.query(query, [this.league.league_id]);

    return leagues;
  }

  async dataLeague() {
    await this.setLeague();

    const [
      info,
      matches,
      winrate,
      heroesScoreAverage,
      statistics,
      standartDeviations,
      teams
    ] = await Promise.all([
      this.getBySlug(),
      this.getMatches(),
      this.getWinrate(),
      this.getAverageDireRadiantScoreByHero(),
      this.leagueStatistics(),
      this.getStandarDeviations(),
      this.getTeams()
    ]);

    return {
      info,
      matches,
      winrate,
      heroesScoreAverage,
      statistics,
      standartDeviations,
      teams
    };
  }
}

export default League;
