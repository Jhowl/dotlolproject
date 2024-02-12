import Controller from "../controller.js";
import matches from "../matches/index.js";

class Team extends Controller {
  constructor(slug) {
    super({ tableName: "teams" });
    this.slug = slug;
    this.team = { team_id: null }; // Initialize team with team_id property
    this.matches = [];
    this.where = 'WHERE radiant_team_id = $1 OR dire_team_id = $1';
  }

  async setTeam() {
    const team = await this.getBySlug();
    this.team = team;
  }

  async get() {
    const team = await this.getBySlug();
    const winrate = await matches.getWinratePercentage(this.team.team_id);
    const heroesScoreAverage = await matches.getAverageDireRadiantScoreByHero(this.where, [this.team.team_id]);
    const statistics = await this.teamStatistics();

    return {
      team,
      matches: await this.getMatches(),
      winrate,
      heroesScoreAverage,
      statistics
    };
  }

  async getBySlug() {
    const query = `SELECT * FROM teams WHERE slug = $1`;
    const value = [this.slug];

    const res = await this.query(query, value);
    return res[0];
  }

  async getMatches() {
    if (this.matches.length) {
      return this.matches;
    }

    const teamMatches = await matches.getWhere(this.where, [this.team.team_id]);
    this.matches = teamMatches;

    return this.matches;
  }

  async teamStatistics() {
    const columns =`
      MIN(radiant_score + dire_score) AS min_score,
      MAX(radiant_score + dire_score) AS max_score,
      AVG(radiant_score + dire_score) AS avg_score,
      MIN(duration) AS min_duration,
      MAX(duration) AS max_duration,
      AVG(duration) AS avg_duration
    `;

    const statistics = await matches.getWhere(this.where, [this.team.team_id], columns);

    return statistics[0];
  }

  async getStandarDeviations() {
    const standartDeviations = await matches.getStandarDeviations(this.where, [this.team.team_id]);

    return standartDeviations;
  }

  async getWinrate() {
    const winrate = await matches.getWinratePercentage(this.team.team_id);
    return winrate;
  }

  async getAverageDireRadiantScoreByHero() {
    const heroesScoreAverage = await matches.getAverageDireRadiantScoreByHero(this.where, [this.team.team_id]);

    return heroesScoreAverage;
  }

  getFirstTowerPercentage = async () => {
    const query = `
      SELECT
        COUNT(*) AS total_matches,
        SUM(CASE WHEN get_first_tower_team = $1 THEN 1 ELSE 0 END) AS first_tower
      FROM matches
      WHERE radiant_team_id = $1 OR dire_team_id = $1
    `;
    const res = await this.query(query, [this.team.team_id]);

    const { total_matches, first_tower } = res[0];
    return (first_tower / total_matches) * 100;
  }

  getFirstTowerAverage = async () => {
    const average = await matches.getFirstTowerAverage(this.where, [this.team.team_id]);

    return average;
  }

  async dataTeam() {
    await this.setTeam();

    const [
      team,
      matches,
      winrate,
      heroesScoreAverage,
      statistics,
      standartDeviations,
      firstTowerPercentage,
      firstTowerAverage
    ] = await Promise.all([
      this.getBySlug(),
      this.getMatches(),
      this.getWinrate(),
      this.getAverageDireRadiantScoreByHero(),
      this.teamStatistics(),
      this.getStandarDeviations(),
      this.getFirstTowerPercentage(),
      this.getFirstTowerAverage()
    ]);

    return {
      team,
      matches,
      winrate,
      heroesScoreAverage,
      statistics,
      standartDeviations,
      firstTowerPercentage,
      firstTowerAverage
    };
  }
}

export default Team;
