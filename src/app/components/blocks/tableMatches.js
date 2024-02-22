import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Box from '@mui/material/Box';

import { convertSecondsToTime, formatDateTime } from '@/app/helper/utils';


const columns = [
  { field: 'id', headerName: 'ID', width: 110 },
  { field: 'start_time', headerName: 'Start Time (en-US/PT)', width: 200 },
  { field: 'duration', headerName: 'Duration', width: 90 },
  { field: 'radiant_score', headerName: 'Radiant Score', width: 100 },
  { field: 'dire_score', headerName: 'Dire Score', width: 100 },
  { field: 'radiant_name', headerName: 'Radiant Name', width: 140 },
  { field: 'dire_name', headerName: 'Dire Name', width: 140 },
  { field: 'first_tower_time', headerName: 'First Tower Time', width: 120 },
  { field: 'first_tower_team_name', headerName: 'First Tower Team', width: 150 },
  { field: 'league_name', headerName: 'League Name', width: 180 },
  { field: 'winner', headerName: 'Winner', width: 160, cellClassName: (params) => ('green')}
];

export default function DataTableMatches({matches}) {
  const rows = matches?.map((match) => {
    console.log('match', match.start_time, new Date(match.start_time * 1000).toLocaleString());
    return {
      id: match.match_id,
      start_time: formatDateTime(match.start_time.toLocaleString()),
      radiant_score: match.radiant_score,
      dire_score: match.dire_score,
      radiant_name: match.radiant_name,
      dire_name: match.dire_name,
      duration: convertSecondsToTime(match.duration),
      first_tower_time: convertSecondsToTime(match.first_tower_time),
      first_tower_team_name: match.first_tower_team_name,
      league_name: match.league_name,
      winner: match.winner
    }
  }) || [];

  return (

      <Box sx={{ height: 600, width: '100%',
      '& .green': {
        color: '#00FF00'
      }
      }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={5}
          // autoHeight={true}
          density='compact'
        />
      </Box>
    // </div>
    //   <TableContainer component={Paper}>
    //   <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
    //     <TableHead>
    //       <TableRow>
    //         <TableCell>Match ID</TableCell>
    //         <TableCell align="center">Duration</TableCell>
    //         <TableCell align="center">Radiant Score</TableCell>
    //         <TableCell align="center">Dire Score</TableCell>
    //         <TableCell align="center">Radiant Name</TableCell>
    //         <TableCell align="center">Dire Name</TableCell>
    //         <TableCell align="center">First Tower Time</TableCell>
    //         <TableCell align="center">First Tower Team</TableCell>
    //         <TableCell align="center">League Name</TableCell>
    //         <TableCell align="center">Winner</TableCell>
    //       </TableRow>
    //     </TableHead>
    //     <TableBody>
    //       {rows.map((row) => (
    //         <TableRow
    //           key={row.id}
    //           sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
    //         >
    //           <TableCell component="th" scope="row">
    //             {row.id}
    //           </TableCell>
    //           <TableCell align="center">{row.duration}</TableCell>
    //           <TableCell align="center">{row.radiant_score}</TableCell>
    //           <TableCell align="center">{row.dire_score}</TableCell>
    //           <TableCell align="center">{row.radiant_name}</TableCell>
    //           <TableCell align="center">{row.dire_name}</TableCell>
    //           <TableCell align="center">{row.first_tower_time}</TableCell>
    //           <TableCell align="center">{row.first_tower_team_name}</TableCell>
    //           <TableCell align="center">{row.league_name}</TableCell>
    //           <TableCell align="center" style={{color: 'green'}}>{row.winner}</TableCell>
    //         </TableRow>
    //       ))}
    //     </TableBody>
    //   </Table>
    // </TableContainer>
  );
}
