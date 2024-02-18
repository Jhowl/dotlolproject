import Matches from '../matches/index.js'

import { heroes } from 'dotaconstants'

class Explorer {

  async getExplorerLeagues() {
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
    const matchesTeam = new Matches({where: ''});

    const [
      matches,
      heroesScoreAverage,
      statistics,
      standartDeviations,
      // leagues,
      // heroes
    ] = await Promise.all([
      matchesTeam.getMatches(),
      matchesTeam.getAverageDireRadiantScoreByHero(),
      matchesTeam.statistics(),
      matchesTeam.getStandarDeviations(),
      // this.getTeamLeagues(),
      // this.getHeroesPlayed()
    ]);

    return {
      matches,
      heroesScoreAverage,
      statistics,
      standartDeviations,
      // leagues,
      // heroes
    };
  }

  async dataRest(filters) {

    const matchesTeam = new MatchesTeam(filters);

    const [
      matches,
      winrate,
      heroesScoreAverage,
      statistics,
      standartDeviations
    ] = await Promise.all([
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

export default Explorer;
