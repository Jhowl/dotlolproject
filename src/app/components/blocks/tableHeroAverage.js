import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import dotaconstants from 'dotaconstants';
import Typography from '@mui/material/Typography';

import { convertSecondsToTime } from '@/app/helper/utils';

const columns = [
  { field: 'id', headerName: 'ID', width: 70 },
  { field: 'heroName', headerName: 'Hero', width: 130 },
  { field: 'heroMatches', headerName: 'Matches', width: 90 },
  { field: 'score', headerName: 'Score Average', width: 120 },
  { field: 'duration', headerName: 'Duration Average', width: 160 },
];

export default function DataTable({data}) {
  const rows = data?.map((hero) => {
    return {
      id: hero.hero_id,
      heroName: dotaconstants.heroes[hero.hero_id].localized_name,
      heroMatches: hero.total_matches,
      score: parseFloat(hero.average_score).toFixed(2),
      duration: convertSecondsToTime(hero.average_duration),
    }
  }) || [];

  return (
    <div style={{ height: 600, width: '50%', padding: 'inherit' }}>
      <Typography variant="h6" gutterBottom component="div" style={{textAlign: 'center'}}>
        Hero Average
      </Typography>
      <DataGrid
        rows={rows}
        columns={columns}
        // initialState={{
        //   pagination: {
        //     paginationModel: { page: 0, pageSize: 100 },
        //   },
        // }}
        pageSizeOptions={[5, 10]}
        // checkboxSelection
      />
    </div>
  );
}
