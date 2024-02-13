import * as React from 'react';

import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';

import Layout from '@/app/components/layout';
import Percent from '@/app/components/blocks/percent';
import Table from '@/app/components/blocks/tableHeroAverage';
import TableStandarDeviation from '@/app/components/blocks/tableStandarDeviation';
import DataTableMatches from '@/app/components/blocks/tableMatches';

import Team from '@/controllers/teams/team'
import Statiscs from '@/app/components/blocks/statiscs';


export async function getServerSideProps({ params }) {
  const { slug } = params;

  const team = new Team(slug);

  return {
    props: {
      team: JSON.parse(JSON.stringify(await team.dataTeam())),
    },
  };
}

export default function Dashboard({team}) {
  console.log('team', team)
  return (
    <Layout title={team.info.name}>
      <Grid container spacing={2}>
        {/* Chart
        <Grid item xs={12} md={8} lg={9}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 240,
            }}
          >
            <Chart />
          </Paper>
        </Grid> */}
        <Grid item xs={12} md={4} lg={3}>
          Winning Percentage:
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', elevation: 12 }}>
            <Percent amount={team.winrate}/>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4} lg={3}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 150,
            }}
          >
          </Paper>
        </Grid>
        <Statiscs data={team.statistics} />

        <Grid item xs={12}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'row'}}>
            <Table data={team.heroesScoreAverage} />
            <TableStandarDeviation data={team.standartDeviations} />
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <DataTableMatches matches={team.matches} />
          </Paper>
        </Grid>
      </Grid>
    </Layout>
  );
}
