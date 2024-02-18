import * as React from 'react';

import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';

import Layout from '@/app/components/layout';
import Table from '@/app/components/blocks/tableHeroAverage';
import TableStandarDeviation from '@/app/components/blocks/tableStandarDeviation';
import DataTableMatches from '@/app/components/blocks/tableMatches';
import MultipleSelect from '@/app/components/blocks/multiselect';
import Statiscs from '@/app/components/blocks/statiscs';

import Explorer from '@/controllers/explorer'
import request from '@/app/helper/request';

export async function getServerSideProps() {

  const matches = new Explorer();

  return {
    props: {
      matches: JSON.parse(JSON.stringify(await matches.data())),
    },
  };
}

export default function TeamPage({matches}) {
  const [selectedHeroes, setSelectedHeroes] = React.useState([]);
  const [selectedLeagues, setSelectedLeagues] = React.useState([]);
  const [matchesData, setTeamData] = React.useState(matches);

  const leagues = matches.leagues
  const heroes = matches.heroes

  // React.useEffect(() => {
  //   const fetchData = async () => {
  //     const params = {
  //       heroes: selectedHeroes.map(hero => hero.id),
  //       leagues: selectedLeagues.map(league => league.id),
  //     };

  //     try {
  //       const res = await request(`/api/dota2/teams/${matchesData.info.slug}`, params);
  //       setTeamData(res.data);
  //     } catch (error) {
  //       console.error('Error fetching data:', error);
  //     }
  //   };

  //   if (selectedHeroes.length > 0 || selectedLeagues.length > 0) {
  //     fetchData();
  //   } else {
  //     setTeamData(matches);
  //   }
  // }, [selectedHeroes, selectedLeagues]);


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

  return (
    <Layout title="Explorer">
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'row' }}>
            <MultipleSelect items={heroes} title="Heroes" onChange={handleHeroesOnChange} selected={selectedHeroes} />
            <MultipleSelect items={leagues} title="Leagues" onChange={handleLeaguesOnChange} selected={selectedLeagues} />
          </Paper>

        </Grid>

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

        <Statiscs data={matchesData.statistics} />

        <Grid item xs={12}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'row'}}>
            <Table data={matchesData.heroesScoreAverage} />
            <TableStandarDeviation data={matchesData.standartDeviations} />
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <DataTableMatches matches={matchesData.matches} />
          </Paper>
        </Grid>
      </Grid>
    </Layout>
  );
}
