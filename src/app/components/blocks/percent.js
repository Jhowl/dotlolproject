import * as React from 'react';
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

function LinearProgressWithLabel(props) {
  const percent = props?.value || 0;
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ width: '100%', mr: 1 }}>
        <LinearProgress variant="determinate" {...props} />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography variant="body2" color="text.secondary">{`${percent.toFixed(2)}%`}</Typography>
      </Box>
    </Box>
  );
}

export default function Percent({ amount }) {

  return (
    <Box sx={{ width: '100%' }}>
      <LinearProgressWithLabel value={amount || 0} />
    </Box>
  );
}
