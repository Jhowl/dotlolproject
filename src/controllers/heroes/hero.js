import slugify from 'slugify'
import { heroes } from "dotaconstants";

import MatchesHero from "../matches/hero.js";

class Hero {
  constructor({slug = '', id = null}) {
    this.slug = slug;
    this.hero = { id };
  }

  async setHero() {
    const hero = await this.getBySlug();
    this.hero = hero;
  }

  async getBySlug() {
    const hero = Object.keys(heroes).find(key => slugify(heroes[key].localized_name, { lower: true }) === this.slug);
    return heroes[hero];
  }

  async data() {
    await this.setHero();
    const matchesHero = new MatchesHero(this.hero.id);

    const functions = [
      this.getBySlug(),
      matchesHero.getMatches(),
      matchesHero.getWinratePercentage(),
      matchesHero.getAverageDireRadiantScoreByHero(),
      matchesHero.statistics(),
      matchesHero.getStandartDeviationMatchesDuration(),
      matchesHero.getStandartDeviationMatchesScore(),
      matchesHero.getStandarDeviations(),
      matchesHero.getTeams(this.hero.id),
      matchesHero.getLeagues(this.hero.id),
      matchesHero.getDurationsAndScoreByDay()
    ];

    const results = await Promise.all(functions);

    const [
      info,
      matches,
      winrate,
      heroesScoreAverage,
      statistics,
      durationStats,
      scoreStats,
      standartDeviations,
      teams,
      leagues,
      chartData
    ] = results;

    return {
      info,
      matches,
      winrate,
      heroesScoreAverage,
      statistics,
      durationStats,
      scoreStats,
      standartDeviations,
      leagues,
      teams,
      chartData
    };
  }

  async dataRest(filters) {
    const matchesHero = new MatchesHero(this.hero.id, filters);

    const [
      info,
      matches,
      winrate,
      heroesScoreAverage,
      statistics,
      durationStats,
      scoreStats,
      standartDeviations,
      chartData,
    ] = await Promise.all([
      this.getBySlug(),
      matchesHero.getMatches(),
      matchesHero.getWinratePercentage(),
      matchesHero.getAverageDireRadiantScoreByHero(),
      matchesHero.statistics(),
      matchesHero.getStandartDeviationMatchesDuration(),
      matchesHero.getStandartDeviationMatchesScore(),
      matchesHero.getStandarDeviations(),
      matchesHero.getDurationsAndScoreByDay()
    ]);

    return {
      info,
      matches,
      winrate,
      heroesScoreAverage,
      statistics,
      durationStats,
      scoreStats,
      standartDeviations,
      chartData
    };
  }
}

export default Hero;
