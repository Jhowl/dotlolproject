import * as React from 'react';

import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';

import Layout from '@/app/components/layout';
import Percent from '@/app/components/blocks/percent';
import Table from '@/app/components/blocks/tableHeroAverage';
import TableStandarDeviation from '@/app/components/blocks/tableStandarDeviation';
import DataTableMatches from '@/app/components/blocks/tableMatches';
import MultipleSelect from '@/app/components/blocks/multiselect';
import Statiscs from '@/app/components/blocks/statiscs';

import Hero from '@/controllers/heroes/hero'
import request from '@/app/helper/request';

export async function getServerSideProps({ params }) {
  const { slug } = params;

  const hero = new Hero(slug);

  return {
    props: {
      hero: JSON.parse(JSON.stringify(await hero.data())),
    },
  };
}

export default function HeroPage({hero}) {
  const [selectedTeams, setSelectedTeams] = React.useState([]);
  const [selectedLeagues, setSelectedLeagues] = React.useState([]);
  const [heroData, setTeamData] = React.useState(hero);

  const leagues = hero?.leagues
  const teams = hero?.teams

  React.useEffect(() => {
    const fetchData = async () => {
      const params = {
        heroes: selectedTeams.map(hero => hero.id),
        leagues: selectedLeagues.map(league => league.id),
      };

      try {
        const res = await request(`/api/dota2/heroes/${heroData.info.slug}`, params);
        setTeamData(res.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    // Execute fetchData if either selectedTeams or selectedLeagues change
    if (selectedTeams.length > 0 || selectedLeagues.length > 0) {
      fetchData();
    } else {
      // Reset heroData to the original team if no filters are applied
      setTeamData(hero);
    }
  }, [selectedTeams, selectedLeagues]);


  const handleTeamsOnChange = (event) => {
    const {
      target: { value },
    } = event;

    setSelectedTeams(value);
  }

  const handleLeaguesOnChange = (event) => {
    const {
      target: { value },
    } = event;

    setSelectedLeagues(value);
  }

  return (
    <Layout title={heroData.info.localized_name}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'row' }}>
            <MultipleSelect items={teams} title="Teams" onChange={handleTeamsOnChange} selected={selectedTeams} />
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
        <Grid item xs={12} md={4} lg={3}>
          Winning Percentage:
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', elevation: 12 }}>
            <Percent amount={heroData.winrate}/>
          </Paper>
        </Grid>

        <Statiscs data={heroData.statistics} />

        <Grid item xs={12}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'row'}}>
            <Table data={heroData.heroesScoreAverage} />
            <TableStandarDeviation data={heroData.standartDeviations} />
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <DataTableMatches matches={heroData.matches} />
          </Paper>
        </Grid>
      </Grid>
    </Layout>
  );
}
