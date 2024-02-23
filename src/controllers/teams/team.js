import Controller from "../controller.js";
import MatchesTeam from "../matches/team.js";

import { heroes } from "dotaconstants";

class Team extends Controller {
  constructor(slug) {
    super({ tableName: "teams" });
    this.slug = slug;
    this.team = { team_id: null }; // Initialize team with team_id property
  }

  async setTeam() {
    const team = await this.getBySlug();
    this.team = team;
  }

  async getBySlug() {
    const query = `SELECT * FROM teams WHERE slug = $1`;
    const value = [this.slug];

    const res = await this.query(query, value);
    return res[0];
  }

  async getTeamLeagues() {
    const query = `
      SELECT
        l.name,
        l.league_id as id
      FROM
        leagues l
      JOIN
        matches m ON l.league_id = m.league_id
      WHERE
        m.radiant_team_id = $1 OR m.dire_team_id = $1
      GROUP BY
        l.name,
        l.league_id
      ORDER BY
        l.name
    `;

    const leagues = await this.query(query, [this.team.team_id]);

    return leagues;
  }

  getLastsTeamsPlayed() {
    const query = `
      SELECT t.team_id, t.name, t.logo_url, MAX(m.start_time) AS start_time
      FROM teams t
      JOIN players p ON t.team_id = p.team_id
      JOIN matches m ON p.match_id = m.match_id
      GROUP BY t.team_id, t.name, t.logo_url
      ORDER BY MAX(m.start_time)
      DESC;
    `;

    return this.query(query);
  }

  async getHeroesPlayed() {
    const query = `
      SELECT DISTINCT
          hero_id as id
      FROM
          players
      WHERE
          team_id = $1
      `

    const result = await this.query(query, [this.team.team_id]);

    if (result.length) {
      return result.map(hero =>({
        name: heroes[hero.id].localized_name,
        ...hero
      }));
    }

    return result;
  }

  async data() {
    await this.setTeam();

    const matchesTeam = new MatchesTeam(this.team.team_id);

    const [
      info,
      matches,
      winrate,
      heroesScoreAverage,
      statistics,
      standartDeviations,
      leagues,
      heroes
    ] = await Promise.all([
      this.getBySlug(),
      matchesTeam.getMatches(),
      matchesTeam.getWinratePercentage(),
      matchesTeam.getAverageDireRadiantScoreByHero(),
      matchesTeam.statistics(),
      matchesTeam.getStandarDeviations(),
      this.getTeamLeagues(),
      this.getHeroesPlayed()
    ]);

    return {
      info,
      matches,
      winrate,
      heroesScoreAverage,
      statistics,
      standartDeviations,
      leagues,
      heroes
    };
  }

  async dataRest(filters) {
    await this.setTeam();

    const matchesTeam = new MatchesTeam(this.team.team_id, filters);

    const [
      info,
      matches,
      winrate,
      heroesScoreAverage,
      statistics,
      standartDeviations
    ] = await Promise.all([
      this.getBySlug(),
      matchesTeam.getMatches(),
      matchesTeam.getWinratePercentage(),
      matchesTeam.getAverageDireRadiantScoreByHero(),
      matchesTeam.statistics(),
      matchesTeam.getStandarDeviations()
    ]);

    return {
      info,
      matches,
      winrate,
      heroesScoreAverage,
      statistics,
      standartDeviations
    };
  }
}

export default Team;
