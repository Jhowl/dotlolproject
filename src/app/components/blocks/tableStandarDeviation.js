import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import dotaconstants from 'dotaconstants';
import Typography from '@mui/material/Typography';

const columns = [
  { field: 'id', headerName: 'ID', width: 70 },
  { field: 'heroName', headerName: 'Hero', width: 160 },
  { field: '44', headerName: '44.5', width: 90 },
  { field: '48', headerName: '48.5', width: 90 },
  { field: '52', headerName: '52.5', width: 90 },

];


export default function DataTable({data}) {
  const rows = data?.map((hero) => {
    return {
      id: hero.hero_id,
      heroName: dotaconstants.heroes[hero.hero_id].localized_name + `(${hero.total_matches})`,
      44: hero.threshold_44_5_percent,
      48: hero.threshold_48_5_percent,
      52: hero.threshold_52_5_percent,
    }
  }) || [];


  return (
    <div style={{ height: 600, width: '100%', padding: 'inherit' }}>
      <Typography variant="h6" gutterBottom component="div" style={{textAlign: 'center'}}>
        Hero Standard Deviation
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
      />
    </div>
  );
}
