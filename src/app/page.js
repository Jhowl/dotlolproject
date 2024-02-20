import React from 'react';
import Link from 'next/link';
import { Container, Typography, Button, Grid } from '@mui/material';

const Home = () => {
  return (
    <Container>
      <Grid container spacing={3} justifyContent="center" alignItems="center" style={{ minHeight: '100vh' }}>
        <Grid item xs={12}>
          <Typography variant="h2" align="center" gutterBottom>
            Welcome to Dota 2 Explorer
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Link href="/dota2/teams" passHref>
            <Button variant="contained" color="primary" fullWidth>
              Check Teams
            </Button>
          </Link>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Link href="/dota2/heroes" passHref>
            <Button variant="contained" color="primary" fullWidth>
              Check Heroes
            </Button>
          </Link>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Link href="/dota2/leagues" passHref>
            <Button variant="contained" color="primary" fullWidth>
              Check Leagues
            </Button>
          </Link>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Link href="/dota2/explorer" passHref>
            <Button variant="contained" color="primary" fullWidth>
              Go to Explorer
            </Button>
          </Link>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Home;
