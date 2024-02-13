import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import slugify from 'slugify'
import League from '@/controllers/leagues/league'
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { experimentalStyled as styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Unstable_Grid2';

import Layout from '@/app/components/layout';

export const revalidate = 60 * 60 * 24 * 5

export const getStaticProps = (async () => {

  const league = new League();
  const data = await league.getAll();

  return {
    props: {
      leagues: JSON.parse(JSON.stringify(data)) ,
    },
  }
})

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode !== 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function Leagues ({ leagues }) {
  const [searchLeague, setSearchLeague] = useState('')

  const [filteredLeagues, setFilteredLeagues] = useState(leagues)

  useEffect(() => {
    setFilteredLeagues(
      leagues.filter(league =>
        league.name.toLowerCase().includes(searchLeague.toLowerCase())
      )
    )
  }, [searchLeague, leagues])

  const onChange = e => {
    setSearchLeague(e.target.value)
  }

  return (
    <Layout>
      <div>
        <h1>Leagues</h1>

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
                label="League"
                variant="outlined"
                onChange={onChange}
                />
              </Box>
              </div>
            </div>
           </div>

          <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={{ xs: 2, md: 2 }} columns={{ xs: 4, sm: 8, md: 10 }}>
              {filteredLeagues?.map(league => (
                <Grid key={league.id} xs={2}>
                  <Item style={{ backgroundColor: '#1A2027', color: '#fff' }} >
                    <Link href={`leagues/${slugify(league.name, { lower: true })}`}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: '#1A2027'}}>
                        <h3>{league.name}</h3>
                      </div>
                  </Link>
                </Item>
              </Grid>
            ))}
          </Grid>
        </Box>
      </div>
    </Layout>
  )
}

