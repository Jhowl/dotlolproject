import slugify from 'slugify'
import { heroes } from "dotaconstants";

import MatchesHero from "../matches/hero.js";

class Hero {
  constructor(slug) {
    this.slug = slug;
    this.hero = { id: null };
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

    const [
      info,
      matches,
      winrate,
      heroesScoreAverage,
      statistics,
      standartDeviations,
      leagues,
      teams
    ] = await Promise.all([
      this.getBySlug(),
      matchesHero.getMatches(),
      matchesHero.getWinratePercentage(),
      matchesHero.getAverageDireRadiantScoreByHero(),
      matchesHero.statistics(),
      matchesHero.getStandarDeviations(),
      matchesHero.getTeams(this.hero.id),
      matchesHero.getLeagues(this.hero.id)
    ]);

    return {
      info,
      matches,
      winrate,
      heroesScoreAverage,
      statistics,
      standartDeviations,
      leagues,
      teams
    };
  }

  async dataRest(filters) {
    await this.setHero();

    const matchesHero = new MatchesHero(this.team.hero_id, filters);

    const [
      info,
      matches,
      winrate,
      heroesScoreAverage,
      statistics,
      standartDeviations
    ] = await Promise.all([
      this.getBySlug(),
      matchesHero.getMatches(),
      matchesHero.getWinratePercentage(),
      matchesHero.getAverageDireRadiantScoreByHero(),
      matchesHero.statistics(),
      matchesHero.getStandarDeviations()
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

export default Hero;
