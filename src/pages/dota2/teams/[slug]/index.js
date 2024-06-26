import * as React from 'react';

import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';

import Team from '@/controllers/teams/team'
import request from '@/app/helper/request';

import Layout from '@/app/components/layout';
import Percent from '@/app/components/blocks/percent';
import Table from '@/app/components/blocks/tableHeroAverage';
import TableStandarDeviation from '@/app/components/blocks/tableStandarDeviation';
import DataTableMatches from '@/app/components/blocks/tableMatches';
import MultipleSelect from '@/app/components/blocks/multiselect';
import Select from '@/app/components/blocks/Select';
import Statiscs from '@/app/components/blocks/statiscs';
import DurationStats from '@/app/components/blocks/DurationStats';
import ScoreStats from '@/app/components/blocks/ScoreStats';

import Chart from '@/app/components/blocks/chart';
import { fontSize } from '@mui/system';


export async function getServerSideProps({ params }) {
  const { slug } = params;

  const team = new Team(slug);
  return {
    props: {
      team: JSON.parse(JSON.stringify(await team.data())),
    },
  };
}

export default function TeamPage({team}) {
  const [selectedHeroes, setSelectedHeroes] = React.useState([]);
  const [selectedLeagues, setSelectedLeagues] = React.useState([]);
  const [selectedOutcome, setSelectedOutcome] = React.useState('');
  const [teamData, setTeamData] = React.useState(team);

  const leagues = team.leagues
  const heroes = team.heroes

  React.useEffect(() => {
    const fetchData = async () => {
      const params = {
        heroes: selectedHeroes.map(hero => hero.id),
        leagues: selectedLeagues.map(league => league.id),
        outcome: selectedOutcome
      };

      try {
        const res = await request(`/api/dota2/teams/${teamData.info.slug}`, params);
        setTeamData(res);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    // Execute fetchData if either selectedHeroes or selectedLeagues change
    if (selectedHeroes.length > 0 || selectedLeagues.length > 0 || selectedOutcome !== '') {
      fetchData();
    } else {
      // Reset teamData to the original team if no filters are applied
      setTeamData(team);
    }
  }, [selectedHeroes, selectedLeagues, selectedOutcome]);


  const handleHeroesOnChange = (event) => {
    const {
      target: { value },
    } = event;

    setSelectedHeroes(value);
  }

  const handleLeaguesOnChange = (event) => {
    const {
      target: { value },
    } = event;

    setSelectedLeagues(value);
  }

  const handleOutcomeOnChange = (event) => {
    const {
      target: { value },
    } = event;

    setSelectedOutcome(value);
  }

  return (
    <Layout title={teamData.info.name}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'row' }}>
            <MultipleSelect items={heroes} title="Heroes" onChange={handleHeroesOnChange} selected={selectedHeroes} />
            <MultipleSelect items={leagues} title="Leagues" onChange={handleLeaguesOnChange} selected={selectedLeagues} />
            <Select items={[
              {
                name: 'Win',
                value: 'win'
              },
              {
                name: 'Lose',
                value: 'lose'
              },
              {
                name: 'All',
                value: 'all'
              }
            ]} title="Outcome" onChange={handleOutcomeOnChange} selected={selectedOutcome} />
          </Paper>
        </Grid>

        {/* <Grid item xs={20} style={{ width: '100%', height: 700, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              width: '100%',

            }}
          >
            <Chart data={teamData.chartData} />
          </Paper>
        </Grid> */}

        <Grid item xs={12} md={4} lg={3}>
          Winning Percentage:
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', elevation: 12 }}>
            <Percent amount={teamData.winrate}/>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Statiscs data={teamData.statistics} />

          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', fontSize: 14, backgroundColor: '#1A2027)' }}>
            <DurationStats durationStats={teamData.durationStats} />
            <ScoreStats scoreStats={teamData.scoreStats} />
          </Paper>

          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'row'}}>
            <Table data={teamData.heroesScoreAverage} />
            <TableStandarDeviation data={teamData.standartDeviations} />
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <DataTableMatches matches={teamData.matches} />
          </Paper>
        </Grid>
      </Grid>
    </Layout>
  );
}
