import Matches from './index.js';

class Team extends Matches {
  constructor(id, filters = {}) {
    super({
      where: 'WHERE (radiant_team_id = $1 OR dire_team_id = $1)',
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

  getWinratePercentage = async () => {
    const query = `
      SELECT
        COUNT(*) AS total_matches,
        SUM(CASE WHEN radiant_team_id = $1 AND radiant_win THEN 1 WHEN dire_team_id = $1 AND NOT radiant_win THEN 1 ELSE 0 END) AS wins
      FROM matches
      ${this.getWhereFilter()}
    `;

    const res = await this.query(query, this.values);
    const { total_matches, wins } = res[0];
    return (wins / total_matches) * 100;
  }
}

export default Team;
