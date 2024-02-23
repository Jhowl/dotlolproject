import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import slugify from 'slugify'
import League from '@/controllers/leagues/league'
import { TextField, Grid, Box, Typography } from '@mui/material';

import Layout from '@/app/components/layout';

export const revalidate = 60 * 60 * 24 * 5

export const getStaticProps = (async () => {

  const league = new League();
  const data = await league.getLastsLeagues();

  return {
    props: {
      leagues: JSON.parse(JSON.stringify(data)) ,
    },
  }
})

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
    <div style={{ padding: '20px' }}>
      <Typography variant="h4" gutterBottom>Leagues</Typography>

      {/* Search input */}
      <TextField
        id="outlined-basic"
        label="Search League"
        variant="outlined"
        onChange={onChange}
        fullWidth
        sx={{ mb: 3 }}
      />

      {/* Grid of leagues */}
      <Grid container spacing={3}>
        {filteredLeagues.map((league) => (
          <Grid item xs={12} sm={6} md={4} key={league.id}>
            <Link href={`leagues/${slugify(league.name, { lower: true })}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <Box
                sx={{
                  p: 3,
                  borderRadius: 1,
                  backgroundColor: '#1A2027',
                  color: '#fff',
                  transition: 'background-color 0.3s ease',
                  '&:hover': {
                    backgroundColor: '#0D1117',
                  },
                }}
              >
                <Typography variant="h6">{league.name}</Typography>
              </Box>
            </Link>
          </Grid>
        ))}
      </Grid>
    </div>
    </Layout>
  )
}

