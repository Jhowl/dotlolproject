import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import dotaconstants from 'dotaconstants';

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
    <div style={{ height: 600, width: '100%' }}>
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


// SELECT
// p.hero_id,
// m.radiant_score,
// m.dire_score
// FROM
//   players p
// JOIN
//   matches m ON p.match_id = m.match_id
// WHERE
//   m.radiant_team_id = $1 OR m.dire_team_id = $1
// `;
