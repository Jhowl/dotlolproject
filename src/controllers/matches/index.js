import Controller from "../controller.js";
/*

  const matches = `
    CREATE TABLE IF NOT EXISTS matches (
      id BIGSERIAL PRIMARY KEY,
      start_time TIMESTAMP,
      dire_score BIGINT,
      radiant_score BIGINT,
      radiant_win BOOLEAN,
      league_id BIGINT,
      radiant_team_id BIGINT,
      dire_team_id BIGINT,
      patch TEXT,
      created_at TIMESTAMP DEFAULT NOW(),
      duration BIGINT,
      get_first_tower_time BIGINT,
      get_first_tower_team BIGINT,
      match_id BIGINT NOT NULL,
      CONSTRAINT matches_match_id_key UNIQUE (match_id),
      CONSTRAINT matches_dire_team_id_fkey FOREIGN KEY (dire_team_id) REFERENCES teams (team_id),
      CONSTRAINT matches_get_first_tower_team_fkey FOREIGN KEY (get_first_tower_team) REFERENCES teams (team_id),
      CONSTRAINT matches_league_id_fkey FOREIGN KEY (league_id) REFERENCES leagues (league_id),
      CONSTRAINT matches_radiant_team_id_fkey FOREIGN KEY (radiant_team_id) REFERENCES teams (team_id)
    )
  `;

  const players = `
    CREATE TABLE IF NOT EXISTS players (
      id BIGSERIAL PRIMARY KEY,
      match_id BIGINT,
      player_slot BIGINT,
      hero_id BIGINT,
      kills BIGINT,
      deaths BIGINT,
      assists BIGINT,
      team_id BIGINT,
      account_id BIGINT,
      CONSTRAINT players_match_id_fkey FOREIGN KEY (match_id) REFERENCES matches (match_id),
      CONSTRAINT players_team_id_fkey FOREIGN KEY (team_id) REFERENCES teams (team_id)
    )
  `;
*/
class Matches extends Controller {
  constructor() {
    super({ tableName: "matches" });
  }

  getByTeamID = async (teamID) => {
    const query = `SELECT * FROM matches WHERE radiant_team_id = $1 OR dire_team_id = $1`;
    const res = await this.query(query, [teamID]);
    return res;
  }

  getWinratePercentage = async (teamID) => {
    const query = `
      SELECT
        COUNT(*) AS total_matches,
        SUM(CASE WHEN radiant_team_id = $1 AND radiant_win THEN 1 WHEN dire_team_id = $1 AND NOT radiant_win THEN 1 ELSE 0 END) AS wins
      FROM matches
      WHERE radiant_team_id = $1 OR dire_team_id = $1
    `;
    const res = await this.query(query, [teamID]);
    const { total_matches, wins } = res[0];
    return (wins / total_matches) * 100;
  }

  getDurationAverage = async (teamID) => {
    const query = `
      SELECT
        AVG(duration) AS average_duration
      FROM matches
      WHERE radiant_team_id = $1 OR dire_team_id = $1
    `;
    const res = await this.query(query, [teamID]);
    return res[0];
  }

  //Function to get average score in matches by hero and total matches hero was played,
  //use the tables players and matches

  getAverageDireRadiantScoreByHero = async (where = '', values = []) => {
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
          ${where}
    )
    , HeroAggregates AS (
        SELECT
            hero_id,
            COUNT(match_id) AS heroMatches,
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
        matchesScore / heroMatches as score,
        total_duration / heroMatches as duration
    FROM
        HeroAggregates
    ORDER BY
        heroMatches DESC;
      `;

    const res = await this.query(query, values);
    return res;
  }

  getDurationsAndScore = async (where = '', values = []) => {

    const query = `
      SELECT
        duration,
        radiant_score,
        dire_score
      FROM
        matches
      ${where}
    `;

    const res = await this.query(query, values);

    return res;
  }

  getStandarDeviations = async (where = '', values = []) => {
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
        ${where}
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

    const res = await this.query(query, values);
    return res;
  }


  getFirstTowerAverage = async (where = '', values = []) => {
    const query = `
      SELECT
        AVG(get_first_tower_time) as average_tower_time
      FROM
        matches
      ${where}
    `;

    const res = await this.query(query, values);
    return res[0];
  }

}

export default new Matches();
