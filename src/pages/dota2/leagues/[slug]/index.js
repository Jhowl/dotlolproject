import * as React from 'react';

import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';

import Layout from '@/app/components/layout';
import Percent from '@/app/components/blocks/percent';
import Table from '@/app/components/blocks/tableHeroAverage';
import TableStandarDeviation from '@/app/components/blocks/tableStandarDeviation';
import DataTableMatches from '@/app/components/blocks/tableMatches';

import League from '@/controllers/leagues/league'
import Statiscs from '@/app/components/blocks/statiscs';


export async function getServerSideProps({ params }) {
  const { slug } = params;

  const league = new League(slug);

  return {
    props: {
      league: JSON.parse(JSON.stringify(await league.data())),
    },
  };
}

export default function Dashboard({league}) {
  return (
    <Layout title={league.info.name}>
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
            <Statiscs data={league.statistics} />
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'row'}}>
            <Table data={league.heroesScoreAverage} />
            <TableStandarDeviation data={league.standartDeviations} />
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <DataTableMatches matches={league.matches} />
          </Paper>
        </Grid>
      </Grid>
    </Layout>
  );
}
