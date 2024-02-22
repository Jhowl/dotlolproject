import Matches from './index.js';

class Hero extends Matches {
  constructor(id, filters = {}) {
    super({
      where: 'WHERE match_id IN (SELECT match_id FROM players WHERE hero_id = $1)',
      join: 'JOIN players p ON m.match_id = p.match_id',
      whereInner: 'WHERE p.match_id IN (SELECT match_id FROM players WHERE hero_id = $1)',
      values: [id],
      filters
    });
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
      SUM(CASE WHEN first_tower_team = $1 THEN 1 ELSE 0 END) AS first_tower,
      COUNT(*) AS total_matches
    `;

    const statistics = await this.getWhere(this.getWhereFilter(), this.values, columns);

    return statistics[0];
  }

  async getLeagues(id) {
    const query = `
     SELECT DISTINCT
        m.league_id,
        l.league_name
      FROM
        matches m
      JOIN
        players p ON m.match_id = p.match_id
      JOIN
        leagues l ON m.league_id = l.league_id
      WHERE
        p.hero_id = $1
    `;

    const leagues = await this.query(query, [id]);

    return leagues;
  }

  async getTeams(id) {
    const query = `
      SELECT DISTINCT
        t.team_id,
        t.name
      FROM
        players p
      JOIN
        teams t ON p.team_id = t.team_id
      WHERE
        p.hero_id = $1
      `;

    const teams = await this.query(query, [id]);

    return teams;
  }

  getWinratePercentage = async (id) => {
    const leagues = this.filters.leagues ? `AND m.league_id IN (${this.filters.leagues})` : '';
    const teams = this.filters.teams ? `AND p.team_id IN (${this.filters.teams})` : '';

    const query = `
    WITH MatchHeroStats AS (
      SELECT
          p.hero_id,
          m.radiant_win,
          CASE
              WHEN p.team_id = m.radiant_team_id THEN 'radiant'
              ELSE 'dire'
          END AS hero_side
      FROM
          matches m
      JOIN
          players p ON m.match_id = p.match_id
    )
    , HeroWinStats AS (
        SELECT
            hero_id,
            COUNT(*) AS total_matches,
            SUM(CASE WHEN radiant_win AND hero_side = 'radiant' THEN 1
                    WHEN NOT radiant_win AND hero_side = 'dire' THEN 1
                    ELSE 0
                END) AS wins
        FROM
            MatchHeroStats
        GROUP BY
            hero_id
    )
    SELECT
        hws.hero_id,
        hws.total_matches,
        COALESCE(hws.wins, 0) AS wins,
        CASE
            WHEN hws.total_matches > 0 THEN ROUND((COALESCE(hws.wins, 0) * 100.0) / hws.total_matches, 2)
            ELSE 0
        END AS winrate_percentage
    FROM
        HeroWinStats hws
    JOIN
        players p ON hws.hero_id = p.hero_id
    JOIN
        matches m ON p.match_id = m.match_id
    WHERE
        (hws.hero_id = $1 OR $1 IS NULL)
    GROUP BY
        hws.hero_id, hws.total_matches, hws.wins
      `;


    const res = await this.query(query, this.values);
    const { total_matches, wins } = res[0];
    return (wins / total_matches) * 100;
  }
}

export default Hero;
