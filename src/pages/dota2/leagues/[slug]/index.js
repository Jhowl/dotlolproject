import * as React from 'react';

import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';

import Layout from '@/app/components/layout';
import Table from '@/app/components/blocks/tableHeroAverage';
import TableStandarDeviation from '@/app/components/blocks/tableStandarDeviation';
import DataTableMatches from '@/app/components/blocks/tableMatches';
import MultipleSelect from '@/app/components/blocks/multiselect';
import Statiscs from '@/app/components/blocks/statiscs';
import Chart from '@/app/components/blocks/chart';

import League from '@/controllers/leagues/league'
import request from '@/app/helper/request';


export async function getServerSideProps({ params }) {
  const { slug } = params;

  const league = new League(slug);

  return {
    props: {
      league: JSON.parse(JSON.stringify(await league.data())),
    },
  };
}

export default function LeaguePage({league}) {

  const [selectedHeroes, setSelectedHeroes] = React.useState([]);
  const [selectedTeams, setSelectedTeams] = React.useState([]);
  const [leagueData, setLeagueData] = React.useState(league);

  const teams = league.teams
  const heroes = league.heroes

  React.useEffect(() => {
    const fetchData = async () => {
      const params = {
        heroes: selectedHeroes.map(hero => hero.id),
        teams: selectedTeams.map(teams => teams.id),
      };

      try {
        const res = await request(`/api/dota2/leagues/${league.info.slug}`, params);
        setLeagueData(res.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    // Execute fetchData if either selectedHeroes or selectedLeagues change
    if (selectedHeroes.length > 0 || selectedTeams.length > 0) {
      fetchData();
    } else {
      // Reset leagueData to the original team if no filters are applied
      setLeagueData(league);
    }
  }, [selectedHeroes, selectedTeams]);

  const handleHeroesOnChange = (event) => {
    const {
      target: { value },
    } = event;

    setSelectedHeroes(value);
  }

  const handleTeamsOnChange = (event) => {
    const {
      target: { value },
    } = event;

    setSelectedTeams(value);
  }

  return (
    <Layout title={league.info.name}>
      <Grid container spacing={2}>
      <Grid item xs={12}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'row' }}>
            <MultipleSelect items={heroes} title="Heroes" onChange={handleHeroesOnChange} selected={selectedHeroes} />
            <MultipleSelect items={teams} title="Teams" onChange={handleTeamsOnChange} selected={selectedTeams} />
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
            <Chart data={leagueData.chartData} />
          </Paper>
        </Grid> */}

        <Grid item xs={12}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
              // height: 150,
            }}
          >
            <Statiscs data={leagueData.statistics} />
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'row'}}>
            <Table data={leagueData.heroesScoreAverage} />
            <TableStandarDeviation data={leagueData.standartDeviations} />
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <DataTableMatches matches={leagueData.matches} />
          </Paper>
        </Grid>
      </Grid>
    </Layout>
  );
}
