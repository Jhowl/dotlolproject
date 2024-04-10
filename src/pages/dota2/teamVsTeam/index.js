import React, { useState, useEffect } from 'react';
import axios from 'axios';

import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';

import Layout from '@/app/components/layout';
import Percent from '@/app/components/blocks/percent';
import Table from '@/app/components/blocks/tableHeroAverage';
import TableStandarDeviation from '@/app/components/blocks/tableStandarDeviation';
import DataTableMatches from '@/app/components/blocks/tableMatches';
import Select from '@/app/components/blocks/Select';
import Statiscs from '@/app/components/blocks/statiscs';
import DuoChart from '@/app/components/blocks/DuoChart';

import Team from '@/controllers/teams/team'
import request from '@/app/helper/request';
import { Duo } from '@mui/icons-material';

const revalidate = 60 * 60


export const getStaticProps = (async () => {
  const team = new Team();
  const data = await team.getTeamsOrderedByNames();

  return {
    props: {
      teams: JSON.parse(JSON.stringify(data)),
    },
    revalidate: revalidate
  }
})

export default function TeamVsTeamPage({ teams }) {
  const [selectedTeamA, setSelectedTeamA] = useState('');
  const [selectedTeamB, setSelectedTeamB] = useState('');
  const [teamAStats, setTeamAStats] = useState({});
  const [teamBStats, setTeamBStats] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchTeamStats = async () => {
      // setIsLoading1(true);
      try {
        if (selectedTeamA !== '') {
          const response = await axios.get(`/api/dota2/teams/${selectedTeamA}`);
          console.log('response', response.data)
          setTeamAStats(response.data);
        } else {
          setTeamAStats(null);
        }
      } catch (error) {
        console.error('Error fetching team 1 stats:', error);
      } finally {
        // setIsLoading1(false);
      }
    };

    fetchTeamStats();
  }, [selectedTeamA]);

  useEffect(() => {
    const fetchTeamStats = async () => {
      // setIsLoading1(true);
      try {
        if (selectedTeamB !== '') {
          const response = await axios.get(`/api/dota2/teams/${selectedTeamB}`);
          console.log('response', response.data)
          setTeamBStats(response.data);
        } else {
          setTeamBStats(null);
        }
      } catch (error) {
        console.error('Error fetching team 1 stats:', error);
      } finally {
        // setIsLoading1(false);
      }
    };

    fetchTeamStats();
  }, [selectedTeamB]);

  const handleTeamAOnChange = (event) => {
    const {
      target: { value },
    } = event;

    setSelectedTeamA(value);
  }

  const handleTeambOnChange = (event) => {
    const {
      target: { value },
    } = event;

    setSelectedTeamB(value);
  }

  return (
    <Layout title={"Team Vs Team"}>

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'row' }}>
            <Select items={teams} title="Team A" onChange={handleTeamAOnChange} selected={selectedTeamA} />
            VS
            <Select items={teams} title="Team B" onChange={handleTeambOnChange} selected={selectedTeamB} keyb='b' />
          </Paper>
        </Grid>

        <Grid item xs={20} style={{ width: '100%', height: 700, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              width: '100%',

            }}
          >
            <DuoChart data1={{name: teamAStats?.info?.name, ...teamAStats?.chartData}} data2={{name: teamBStats?.info?.name, ...teamBStats?.chartData}} />
          </Paper>
        </Grid>

        <Grid item xs={12} md={4} lg={3}>
          Winning Percentage:
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', elevation: 12 }}>
            {/* <Percent amount={heroData.winrate}/> */}
          </Paper>
        </Grid>

        {/* <Statiscs data={heroData.statistics} /> */}

        <Grid item xs={12}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'row'}}>
            {/* <Table data={heroData.heroesScoreAverage} /> */}
            {/* <TableStandarDeviation data={heroData.standartDeviations} /> */}
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            {/* <DataTableMatches matches={heroData.matches} /> */}
          </Paper>
        </Grid>
      </Grid>
    </Layout>
  );
}
