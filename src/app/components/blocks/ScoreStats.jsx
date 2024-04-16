import React, { useEffect, useState } from 'react';
import { Typography } from '@mui/material';

const ScoreStats = ({ scoreStats }) => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    if (scoreStats) {
      setStats(scoreStats);
    }
  }, [scoreStats]);

  return (
    <div>
      {stats && (
        <div>
          <Typography variant="h6">Score Statistics</Typography>
          <ul>
            <li>Less than 30.5: {parseFloat(stats.less_than_30_5).toFixed(2)}%</li>
            <li>Less than 32.5: {parseFloat(stats.less_than_32_5).toFixed(2)}%</li>
            <li>Less than 34.5: {parseFloat(stats.less_than_34_5).toFixed(2)}%</li>
            <li>Less than 36.5: {parseFloat(stats.less_than_36_5).toFixed(2)}%</li>
            <li>Less than 38.5: {parseFloat(stats.less_than_38_5).toFixed(2)}%</li>
            <li>Less than 40.5: {parseFloat(stats.less_than_40_5).toFixed(2)}%</li>
            <li>Less than 42.5: {parseFloat(stats.less_than_42_5).toFixed(2)}%</li>
            <li>Less than 44.5: {parseFloat(stats.less_than_44_5).toFixed(2)}%</li>
            <li>Less than 46.5: {parseFloat(stats.less_than_46_5).toFixed(2)}%</li>
            <li>Less than 48.5: {parseFloat(stats.less_than_48_5).toFixed(2)}%</li>
            <li>Less than 50.5: {parseFloat(stats.less_than_50_5).toFixed(2)}%</li>
            <li>Less than 52.5: {parseFloat(stats.less_than_52_5).toFixed(2)}%</li>
            <li>Less than 54.5: {parseFloat(stats.less_than_54_5).toFixed(2)}%</li>
            <li>Less than 56.5: {parseFloat(stats.less_than_56_5).toFixed(2)}%</li>
            <li>Less than 58.5: {parseFloat(stats.less_than_58_5).toFixed(2)}%</li>
            <li>Less than 60.5: {parseFloat(stats.less_than_60_5).toFixed(2)}%</li>
            <li>Less than 62.5: {parseFloat(stats.less_than_62_5).toFixed(2)}%</li>
            <li>Less than 64.5: {parseFloat(stats.less_than_64_5).toFixed(2)}%</li>
            <li>Less than 66.5: {parseFloat(stats.less_than_66_5).toFixed(2)}%</li>
            <li>Less than 68.5: {parseFloat(stats.less_than_68_5).toFixed(2)}%</li>
            <li>Less than 70.5: {parseFloat(stats.less_than_70_5).toFixed(2)}%</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default ScoreStats;
