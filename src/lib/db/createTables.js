/*

create table
  public.leagues (
    id bigint generated by default as identity,
    name text not null default ''::text,
    tier text null,
    year bigint null,
    league_id bigint not null,
    slug text null default ''::text,
    constraint leagues_pkey primary key (id),
    constraint leagues_id_key unique (id),
    constraint leagues_league_id_key unique (league_id)
  ) tablespace pg_default;

  create table
  public.matches (
    id bigint generated by default as identity,
    start_time timestamp without time zone null,
    dire_score bigint null,
    radiant_score bigint null,
    radiant_win boolean null,
    league_id bigint null,
    radiant_team_id bigint null,
    dire_team_id bigint null,
    patch text null,
    created_at timestamp with time zone not null default now(),
    duration bigint null,
    get_first_tower_time bigint null,
    get_first_tower_team bigint null,
    match_id bigint not null,
    constraint matches_pkey primary key (id),
    constraint matches_match_id_key unique (match_id),
    constraint matches_dire_team_id_fkey foreign key (dire_team_id) references teams (team_id),
    constraint matches_get_first_tower_team_fkey foreign key (get_first_tower_team) references teams (team_id),
    constraint matches_league_id_fkey foreign key (league_id) references leagues (league_id),
    constraint matches_radiant_team_id_fkey foreign key (radiant_team_id) references teams (team_id)
  ) tablespace pg_default;


  create table
  public.players (
    id bigint generated by default as identity,
    match_id bigint null,
    player_slot bigint null,
    hero_id bigint null,
    kills bigint null,
    deaths bigint null,
    assists bigint null,
    team_id bigint null,
    account_id bigint null,
    constraint player_pkey primary key (id),
    constraint players_match_id_fkey foreign key (match_id) references matches (match_id),
    constraint players_team_id_fkey foreign key (team_id) references teams (team_id)
  ) tablespace pg_default;


  create table
  public.teams (
    id bigint generated by default as identity,
    name text null,
    created_at timestamp with time zone not null default now(),
    slug text null,
    logo_url text null,
    team_id bigint null,
    constraint teams_pkey primary key (id),
    constraint teams_id_key unique (id),
    constraint teams_team_id_key unique (team_id)
  ) tablespace pg_default;

  */


    // create the tables

import pool from './index.js';

const createTables = async () => {
  const leagues = `
    CREATE TABLE IF NOT EXISTS leagues (
      id BIGSERIAL PRIMARY KEY,
      name TEXT NOT NULL DEFAULT '',
      tier TEXT,
      year BIGINT,
      league_id BIGINT NOT NULL,
      slug TEXT DEFAULT '',
      CONSTRAINT leagues_league_id_key UNIQUE (league_id)
    )
  `;

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

  const teams = `
    CREATE TABLE IF NOT EXISTS teams (
      id BIGSERIAL PRIMARY KEY,
      name TEXT,
      created_at TIMESTAMP DEFAULT NOW(),
      slug TEXT,
      logo_url TEXT,
      team_id BIGINT,
      CONSTRAINT teams_team_id_key UNIQUE (team_id)
    )
  `;

  // await pool.query(teams);
  // await pool.query(leagues);
  // await pool.query(matches);
  // await pool.query(players);

  const teamSelect = await pool.query('SELECT * FROM matches');
  console.log('teamSelect', teamSelect);
}


export default createTables;