import Controller from "../controller.js";
import LeagueMatches from "../matches/leagues.js";
class League extends Controller {
  constructor(slug) {
    super({ tableName: "leagues" });
    this.slug = slug;
    this.league = { league_id: null };
  }

  async setLeague() {
    const league = await this.getBySlug();
    this.league = league;
  }

  async getBySlug() {
    const query = `SELECT * FROM leagues WHERE slug = $1`;
    const value = [this.slug];

    const res = await this.query(query, value);
    return res[0];
  }

  async getLastsLeagues() {
    const query = `
      SELECT l.league_id as id, l.name, MAX(m.start_time) AS start_time
      FROM matches m
      JOIN leagues l ON m.league_id = l.league_id
      GROUP BY l.league_id, l.name
      ORDER BY MAX(m.start_time)
      DESC;
    `;
    const leagues = await this.query(query);

    return leagues;
  }

  async getTeams() {
    const query = `
      SELECT
        t.team_id as id,
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


  async data() {
    await this.setLeague();

    const leagueMatches = new LeagueMatches(this.league.league_id);

    const [
      info,
      matches,
      heroesScoreAverage,
      statistics,
      standartDeviations,
      teams,
      heroes
    ] = await Promise.all([
      this.getBySlug(),
      leagueMatches.getMatches(),
      leagueMatches.getAverageDireRadiantScoreByHero(),
      leagueMatches.leagueStatistics(),
      leagueMatches.getStandarDeviations(),
      this.getTeams(),
      leagueMatches.getHeroes()
    ]);

    return {
      info,
      matches,
      heroesScoreAverage,
      statistics,
      standartDeviations,
      teams,
      heroes
    };
  }

  async dataRest(filters = {}) {
    await this.setLeague();

    const leagueMatches = new LeagueMatches(this.league.league_id, filters);

    const [
      info,
      matches,
      heroesScoreAverage,
      statistics,
      standartDeviations
    ] = await Promise.all([
      this.getBySlug(),
      leagueMatches.getMatches(),
      leagueMatches.getAverageDireRadiantScoreByHero(),
      leagueMatches.leagueStatistics(),
      leagueMatches.getStandarDeviations(),
    ]);

    return {
      info,
      matches,
      heroesScoreAverage,
      statistics,
      standartDeviations
    };
  }
}

export default League;
