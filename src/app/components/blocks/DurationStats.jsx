import React, { useEffect, useState } from 'react';
import { Typography } from '@mui/material';

const DurationStats = ({ durationStats }) => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    if (durationStats) {
      setStats(durationStats);
    }
  }, [durationStats]);

  return (
    <div>
      {stats && (
        <div>
          <Typography variant="h6">Duration Statistics</Typography>
          <ul>
            <li>Less than 30m: {parseFloat(stats.less_than_1800).toFixed(2)}%</li>
            <li>Less than 32m: {parseFloat(stats.less_than_1920).toFixed(2)}%</li>
            <li>Less than 34m: {parseFloat(stats.less_than_2040).toFixed(2)}%</li>
            <li>Less than 36m: {parseFloat(stats.less_than_2160).toFixed(2)}%</li>
            <li>Less than 38m: {parseFloat(stats.less_than_2280).toFixed(2)}%</li>
            <li>Less than 40m: {parseFloat(stats.less_than_2400).toFixed(2)}%</li>
            <li>Less than 42m: {parseFloat(stats.less_than_2520).toFixed(2)}%</li>
            <li>Less than 44m: {parseFloat(stats.less_than_2640).toFixed(2)}%</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default DurationStats;
