import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Team from '@/controllers/teams/team'
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { experimentalStyled as styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Unstable_Grid2';

import Layout from '@/app/components/layout';

const revalidate = 60 * 60

export const getStaticProps = (async () => {

  const team = new Team();
  const data = await team.getLastsTeamsPlayed();

  return {
    props: {
      teams: JSON.parse(JSON.stringify(data)) ,
    },
    revalidate: revalidate
  }
})

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode !== 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function Teams ({ teams }) {
  const [searchTeam, setSearchTeam] = useState('')

  const [filteredTeams, setFilteredTeams] = useState(teams)

  useEffect(() => {
    setFilteredTeams(
      teams.filter(team =>
        team.name.toLowerCase().includes(searchTeam.toLowerCase())
      )
    )
  }, [searchTeam, teams])

  const onChange = e => {
    setSearchTeam(e.target.value)
  }

  return (
    <Layout>
      <div>
        <h1>Teams</h1>

        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div style={{ width: '50%' }}>
            <h4>Name</h4>
            <div>
              <Box
                component="form"
                sx={{
                  '& > :not(style)': { m: 1, width: '25ch' },
                }}
                noValidate
                autoComplete="off"
              >
              <TextField
                id="outlined-basic"
                label="Team"
                variant="outlined"
                onChange={onChange}
                />
              </Box>
              </div>
            </div>
           </div>

          <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={{ xs: 2, md: 2 }} columns={{ xs: 4, sm: 8, md: 10 }}>
              {filteredTeams?.map(team => (
                <Grid key={team.id} xs={2}>
                  <Item style={{ backgroundColor: '#1A2027', color: '#fff' }} >
                    <Link href={`teams/${team.slug}`}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: '#1A2027'}}>
                        {/* {!team.logo_url?.includes('ugc') ? (<Image src={team.logo_url} alt={team.name} width={100} height={100} />) : ''} */}
                        <img src={team.logo_url} alt={team.name} style={{ width: '100px', height: '100px', objectFit: 'contain' }}/>
                        <h3>{team.name}</h3>
                      </div>
                  </Link>
                  <p style={{ color: '#fff', fontSize: '12px' }}>Last match: {new Date(team.start_time).toLocaleDateString()}</p>
                </Item>
              </Grid>
            ))}
          </Grid>
        </Box>
      </div>
    </Layout>
  )
}

