import * as React from 'react';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';

import { convertSecondsToTime } from '@/app/helper/utils';

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  textAlign: 'center',
  color: theme.palette.text.secondary,
  height: 60,
  lineHeight: '60px',
}));

export default function Statiscs({data}) {
  const show = {
    score: {
      min: {
        value: data?.min_score,
        label: 'Min'
      },
      max: {
        value: data?.max_score,
        label: 'Max'
      },
      avg: {
        value: parseFloat(data?.avg_score).toFixed(2),
        label: 'Avg'
      }
    },
    duration: {
      min: {
        value: convertSecondsToTime(data?.min_duration),
        label: 'Min'
      },
      max: {
        value: convertSecondsToTime(data?.max_duration),
        label: 'Max'
      },
      avg: {
        value: convertSecondsToTime(parseFloat(data?.avg_duration).toFixed(2)),
        label: 'Avg'
      }
    }
  }


  return (
    <Grid container spacing={2}>
      {Object.keys(show).map((key, index) => {
        return (

          <Grid item xs={6} key={index}>
            <Typography key={index} variant="h6" component="h2">
              {key === 'score' ? 'Score' : 'Duration'}
            </Typography>
            <Box
              sx={{
                p: 2,
                borderRadius: 2,
                bgcolor: 'background.default',
                display: 'grid',
                gridTemplateColumns: { md: '1fr 1fr' },
                gap: 2,
              }}
            >
              {Object.keys(show[key]).map((k, i) => {
                return (
                  <Item key={i} elevation={6}>
                    {`${show[key][k].label}: ${show[key][k].value}`}
                  </Item>
                )
              })}
            </Box>
          </Grid>
        )
      }
      )}
    </Grid>
  );
}
