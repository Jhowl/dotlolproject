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


  async data(filters = {}) {
    await this.setLeague();

    const leagueMatches = new LeagueMatches(this.league.league_id, filters);

    const [
      info,
      matches,
      heroesScoreAverage,
      statistics,
      standartDeviations,
      teams
    ] = await Promise.all([
      this.getBySlug(),
      leagueMatches.getMatches(),
      leagueMatches.getAverageDireRadiantScoreByHero(),
      leagueMatches.leagueStatistics(),
      leagueMatches.getStandarDeviations(),
      this.getTeams()
    ]);

    return {
      info,
      matches,
      heroesScoreAverage,
      statistics,
      standartDeviations,
      teams
    };
  }
}

export default League;
