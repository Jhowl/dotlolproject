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
    },
    firstTower: {
      time: {
        value: convertSecondsToTime(data?.average_tower_time),
        label: 'Average'
      },
      percent: {
        value: data?.first_tower ? parseFloat((data?.first_tower / data?.total_matches) * 100).toFixed(2) : 0,
        label: 'Percent',
        signal: '%'
      },
      duration: {
        value: data?.first_tower || 0,
        label: 'Total'
      }
    },
  }

  return (
    <div>
      <Typography variant="h5" component="h1">
        Statistics ({data?.total_matches} matches)
      </Typography>
      <Grid container spacing={2}>
        {Object.keys(show).map((key, index) => {
          return (
            <Grid item xs={6} key={index}>
              <Typography key={index} variant="h6" component="h2">
                {key === 'score' ? 'Score' : key === 'duration' ? 'Duration' : 'First Tower'}
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
                  if (show[key][k].value !== 0) {
                    return (
                      <Item key={i} elevation={6}>
                        {`${show[key][k].label}: ${show[key][k].value} ${show[key][k].signal || ''}`}
                      </Item>
                    )
                  }
                }
                )}

              </Box>
            </Grid>
          )
        }
        )}
      </Grid>
    </div>
  );
}
