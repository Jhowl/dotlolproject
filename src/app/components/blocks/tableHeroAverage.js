import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import dotaconstants from 'dotaconstants';

const columns = [
  { field: 'id', headerName: 'ID', width: 70 },
  { field: 'heroName', headerName: 'Hero', width: 130 },
  { field: 'heroMatches', headerName: 'Matches', width: 90 },
  { field: 'score', headerName: 'Score Average', width: 120 },
];


export default function DataTable({data}) {
  const rows = data?.map((hero) => {
    return {
      id: hero.hero_id,
      heroName: dotaconstants.heroes[hero.hero_id].localized_name,
      heroMatches: hero.total_matches,
      score: parseFloat(hero.score).toFixed(2),
    }
  }) || [];


  return (
    <div style={{ height: 600, width: '50%' }}>
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
