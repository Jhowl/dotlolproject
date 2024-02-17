import Matches from './index.js';

class League extends Matches {
  constructor(id, filters = {}) {
    super({
      where: 'WHERE league_id = $1',
      values: [id],
      filters
    });
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

    const statistics = await this.getWhere(this.getWhereFilter(), this.values, columns);

    return statistics[0];
  }
}

export default League;
