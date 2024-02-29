import React from 'react';
import Link from 'next/link';
import { Box, Drawer, List, ListItem, ListItemIcon, ListItemText, Toolbar, Typography } from '@mui/material';
import { Home, SportsEsports, AccountTree, Group, EmojiEvents, Search } from '@mui/icons-material';

const drawerWidth = 240;

const MenuComponent = () => {
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          backgroundColor: '#121212',
          color: '#fff',
        },
      }}
    >
      <Toolbar />
      <Box sx={{ overflow: 'auto', paddingTop: 2 }}>
        <List>
          {/* Home */}
          <ListItem button key="Home" component="a" href="/">
            <ListItemIcon>
              <Home sx={{ color: '#fff' }} />
            </ListItemIcon>
            <ListItemText primary="Home" />
          </ListItem>

          {/* Games */}
          <ListItem>
            <ListItemText primary={<Typography variant="h6">Games</Typography>} sx={{ color: '#fff', paddingBottom: 1 }} />
          </ListItem>

          {/* Dota 2 */}
          <ListItem button key="Dota 2">
            <ListItemIcon>
              <SportsEsports sx={{ color: '#fff' }} />
            </ListItemIcon>
            <ListItemText primary="Dota 2" />
          </ListItem>
          <List component="div" disablePadding>
            <Link href="/dota2/teams" passHref>
              <ListItem button sx={{ pl: 4 }}>
                <ListItemIcon>
                  <Group sx={{ color: '#fff' }} />
                </ListItemIcon>
                <ListItemText primary="Teams" />
              </ListItem>
            </Link>
            <Link href="/dota2/leagues" passHref>
              <ListItem button sx={{ pl: 4 }}>
                <ListItemIcon>
                  <EmojiEvents sx={{ color: '#fff' }} />
                </ListItemIcon>
                <ListItemText primary="Leagues" />
              </ListItem>
            </Link>
            <Link href="/dota2/heroes" passHref>
              <ListItem button sx={{ pl: 4 }}>
                <ListItemIcon>
                  <AccountTree sx={{ color: '#fff' }} />
                </ListItemIcon>
                <ListItemText primary="Heroes" />
              </ListItem>
            </Link>
            <Link href="/dota2/explorer" passHref>
              <ListItem button sx={{ pl: 4 }}>
                <ListItemIcon>
                  <Search sx={{ color: '#fff' }} />
                </ListItemIcon>
                <ListItemText primary="Explorer" />
              </ListItem>
            </Link>
          </List>

          {/* League of Legends */}
          <ListItem button key="League of Legends">
            <ListItemIcon>
              <SportsEsports sx={{ color: '#fff' }} />
            </ListItemIcon>
            <ListItemText primary="League of Legends" />
          </ListItem>
          <List component="div" disablePadding>
            <Link href="/lol/teams" passHref>
              <ListItem button sx={{ pl: 4 }}>
                <ListItemIcon>
                  <Group sx={{ color: '#fff' }} />
                </ListItemIcon>
                <ListItemText primary="Teams" />
              </ListItem>
            </Link>
            <Link href="/lol/leagues" passHref>
              <ListItem button sx={{ pl: 4 }}>
                <ListItemIcon>
                  <EmojiEvents sx={{ color: '#fff' }} />
                </ListItemIcon>
                <ListItemText primary="Leagues" />
              </ListItem>
            </Link>
            <Link href="/lol/champions" passHref>
              <ListItem button sx={{ pl: 4 }}>
                <ListItemIcon>
                  <AccountTree sx={{ color: '#fff' }} />
                </ListItemIcon>
                <ListItemText primary="Champions" />
              </ListItem>
            </Link>
            <Link href="/lol/explorer" passHref>
              <ListItem button sx={{ pl: 4 }}>
                <ListItemIcon>
                  <Search sx={{ color: '#fff' }} />
                </ListItemIcon>
                <ListItemText primary="Explorer" />
              </ListItem>
            </Link>
          </List>
        </List>
      </Box>
    </Drawer>
  );
};

export default MenuComponent;
