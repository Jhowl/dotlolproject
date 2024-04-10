import React, { useState } from 'react';
import axios from 'axios';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
} from '@mui/material';

import "@/app/globals.css";


// Create a custom dark theme instance
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#212121', // Dark background color
    },
    text: {
      primary: '#ffa500', // Orange text color
    },
  },
});

const MatchDetails = () => {
  const [matchId, setMatchId] = useState('');
  const [matchData, setMatchData] = useState(null);

  const fetchMatchData = async () => {
    const query = `
      SELECT
      duration,
      matches.match_id,
      matches.start_time,
      matches.dire_score,
      matches.radiant_score,
      matches.radiant_win AS radiant_win,
      MAX(teams_radiant.name) AS radiant_name,
      teams_dire.name AS dire_name,
      leagues.name AS league_name,
      matches.radiant_team_id,
      matches.dire_team_id,
      match_patch.patch,
      leagues.leagueid AS leagueId,
      objectives,
      json_agg(json_build_object(
        'player_slot', player_matches.player_slot,
        'team', CASE WHEN player_matches.player_slot < 128 THEN 'radiant' ELSE 'dire' END,
        'hero_id', player_matches.hero_id,
        'kills', player_matches.kills,
        'account_id', player_matches.account_id,
        'deaths', player_matches.deaths,
        'assists', player_matches.assists,
        'team_id', teams.team_id
      )) AS players
      FROM
      matches
      JOIN match_patch USING (match_id)
      JOIN leagues USING (leagueid)
      JOIN player_matches ON player_matches.match_id = matches.match_id
      JOIN teams teams_radiant ON teams_radiant.team_id = matches.radiant_team_id
      JOIN teams teams_dire ON teams_dire.team_id = matches.dire_team_id
      JOIN teams ON teams.team_id = CASE WHEN player_matches.player_slot < 128 THEN matches.radiant_team_id ELSE matches.dire_team_id END
      WHERE
        matches.match_id = ${matchId}
      GROUP BY
        matches.match_id,
        matches.start_time,
        matches.dire_score,
        matches.radiant_score,
        matches.radiant_win,
        teams_dire.name,
        leagues.name,
        leagues.leagueid,
        match_patch.patch
    `
    try {
      const response = await axios.get(
        `https://api.opendota.com/api/explorer?sql=${encodeURIComponent(query)}`
      );
      setMatchData(response.data.rows[0]);
    } catch (error) {
      console.error('Error fetching match data:', error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchMatchData();
  };

  const towers = matchData?.objectives?.filter((objective) => objective.type === 'building_kill') || [];
  towers?.sort((a, b) => a.time - b.time);
  const firstTower = towers[0];


  return (
    <ThemeProvider theme={darkTheme}>
      <Container maxWidth="sm">
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}
        >
          <TextField
            variant="outlined"
            label="Enter match ID"
            value={matchId}
            onChange={(e) => setMatchId(e.target.value)}
          />
          <Button type="submit" variant="contained">
            Get Match Details
          </Button>
        </Box>

        {matchData && (
          <Box>
            <Typography variant="h4" gutterBottom>
              Match Details
            </Typography>
            <Typography variant="body1">Match ID: {matchData.match_id}</Typography>
            <Typography variant="body1">
              Start Time: {new Date(matchData.start_time * 1000).toLocaleString()}
            </Typography>
            <Typography variant="body1">Duration: {matchData.duration} seconds</Typography>
            <Typography variant="body1">Radiant Score: {matchData.radiant_score}</Typography>
            <Typography variant="body1">Dire Score: {matchData.dire_score}</Typography>
            <Typography variant="body1">Radiant Win: {matchData.radiant_win ? 'Yes' : 'No'}</Typography>
            <Typography variant="body1">Radiant Team ID: {matchData.radiant_team_id}</Typography>
            <Typography variant="body1">Dire Team ID: {matchData.dire_team_id}</Typography>
            <Typography variant="body1">League ID: {matchData.leagueid}</Typography>
            <Typography variant="body1">League Name: {matchData.league_name}</Typography>
            <Typography variant="body1">Patch: {matchData.patch}</Typography>
            <Typography variant="body1">First Tower info: {JSON.stringify(firstTower)}</Typography>
            <Typography variant="h5" gutterBottom>
              Player Details
            </Typography>
            <List>
              {matchData.players.map(player => (
                <ListItem key={player.account_id}>
                  <Box>
                    <Typography variant="body1">Player Slot: {player.player_slot}</Typography>
                    <Typography variant="body1">Hero ID: {player.hero_id}</Typography>
                    <Typography variant="body1">Kills: {player.kills}</Typography>
                    <Typography variant="body1">Deaths: {player.deaths}</Typography>
                    <Typography variant="body1">Assists: {player.assists}</Typography>
                    <Typography variant="body1">Account ID: {player.account_id}</Typography>
                    <Typography variant="body1">Team ID: {player.team_id}</Typography>
                  </Box>
                </ListItem>
              )
                )}
            </List>
          </Box>
        )}
      </Container>
    </ThemeProvider>
  );
};

export default MatchDetails;
