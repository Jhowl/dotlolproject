import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';

import Select from '@mui/material/Select';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: '50%'
    },
  },
};

export default function blockSelect({items, title, onChange, selected}) {

  return (
    <div>
      <FormControl sx={{ m: 1, width: 300 }}>
        <InputLabel id="select-label">{title}</InputLabel>
        <Select
          labelId="select-chip-label"
          id="select-chip"
          value={selected}
          onChange={onChange}
          MenuProps={MenuProps}
        >
          {items?.map((item) => (
            <MenuItem
              key={item.id}
              value={item.value}
            >
              {item.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );

}
