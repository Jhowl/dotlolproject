import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import slugify from 'slugify'
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { experimentalStyled as styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Unstable_Grid2';
import { heroes } from 'dotaconstants'


import Layout from '@/app/components/layout';

export const revalidate = 60 * 60 * 24 * 5

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode !== 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function Heroes () {
  const [searchHero, setSearchHero] = useState('')

  const [filteredHeroes, setFilteredHeroes] = useState(Object.values(heroes).map((hero) => ({ value: hero.id, name: hero.localized_name })))

  useEffect(() => {
    setFilteredHeroes(
      Object.values(heroes).map((hero) => ({ value: hero.id, name: hero.localized_name })).filter(hero =>
        hero.name.toLowerCase().includes(searchHero.toLowerCase())
      )
    )
  }, [searchHero, heroes])

  const onChange = e => {
    setSearchHero(e.target.value)
  }

  return (
    <Layout>
      <div>
        <h1>Heroes</h1>

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
                label="Hero"
                variant="outlined"
                onChange={onChange}
                />
              </Box>
              </div>
            </div>
           </div>

          <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={{ xs: 2, md: 2 }} columns={{ xs: 4, sm: 8, md: 10 }}>
              {filteredHeroes?.map(hero => (
                <Grid key={hero.id} xs={2}>
                  <Item style={{ backgroundColor: '#1A2027', color: '#fff' }} >
                    <Link href={`heroes/${slugify(hero.name, { lower: true })}`}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: '#1A2027'}}>
                        <h3>{hero.name}</h3>
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
