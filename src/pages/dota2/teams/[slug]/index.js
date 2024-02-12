import * as React from 'react';

import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';

// import Chart from '@/app/components/dashboard/chart';
import Orders from '@/app/components/dashboard/Orders';

import Layout from '@/app/components/layout';
import Percent from '@/app/components/blocks/percent';
import Table from '@/app/components/blocks/tableHeroAverage';
import TableStandarDeviation from '@/app/components/blocks/tableStandarDeviation';

import Team from '@/controllers/teams/team'
import Statiscs from '@/app/components/blocks/statiscs';


export async function getServerSideProps({ params }) {
  const { slug } = params;

  const team = new Team(slug);

  // console.log('team', await team.dataTeam())

  return {
    props: {
      team: JSON.parse(JSON.stringify(await team.dataTeam())),
    },
  };
}

export default function Dashboard({team}) {
  return (
    <Layout title={team.name}>
      <Grid container spacing={3}>
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
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <Table data={team.heroesScoreAverage} />
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <TableStandarDeviation data={team.standartDeviations} />
          </Paper>
        </Grid>

        Recent Orders
        <Grid item xs={12}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <Orders />
          </Paper>
        </Grid>
      </Grid>
    </Layout>
  );
}
