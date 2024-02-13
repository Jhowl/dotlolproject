import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';

import { convertSecondsToTime } from '@/app/helper/utils';


const columns = [
  { field: 'id', headerName: 'ID', width: 70 },
  { field: 'radiant_score', headerName: 'Radiant Score', width: 160 },
  { field: 'dire_score', headerName: 'Dire Score', width: 160 },
  { field: 'duration', headerName: 'Duration', width: 160 },
  { field: 'first_tower', headerName: 'First Tower', width: 160 },
  { field: 'first_tower_time', headerName: 'First Tower Time', width: 160 },
  { field: 'get_first_tower_team', headerName: 'First Tower Team', width: 160 },
  { field: 'league_id', headerName: 'League ID', width: 160 },
  { patch: 'patch', headerName: 'Patch', width: 160 },

];

export default function DataTableMatches({matches}) {
  const rows = matches?.map((match) => {
    return {
      id: match.match_id,
      radiant_score: match.radiant_score,
      dire_score: match.dire_score,
      duration: convertSecondsToTime(match.duration),
      first_tower: match.get_first_tower_time,
      first_tower_time: match.get_first_tower_time,
      get_first_tower_team: match.get_first_tower_team,
      league_id: match.league_id,
      patch: match.patch
    }
  }) || [];

  return (
    <div style={{ height: 600, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={5}
      />
    </div>
  );
}
