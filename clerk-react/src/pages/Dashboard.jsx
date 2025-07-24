// src/pages/MainDashboard.jsx
import React, { useState } from 'react';
import {
  Box, Container, Tabs, Tab, AppBar, Toolbar, Typography,
  IconButton, Avatar, Menu, MenuItem, Switch
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  Dashboard, Article, AccountCircle
} from '@mui/icons-material';
import DashboardContent from '../components/DashboardContent';
import DocumentContent from '../components/DocumentContent';
import TargetIcon from '@mui/icons-material/TrackChanges';
import { ThemeProvider, createTheme } from '@mui/material/styles';

// Enhanced iOS Switch Component
const EnhancedIOSSwitch = styled((props) => (
  <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
  width: 57,
  height: 26,
  padding: 0,
  display: 'flex',
  alignItems: 'center',
  '& .MuiSwitch-switchBase': {
    padding: 1,
    margin: 1,
    transitionDuration: '300ms',
    '&.Mui-checked': {
      transform: 'translateX(30px)',
      color: '#fff',
      '& + .MuiSwitch-track': {
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        opacity: 1,
        border: 0,
      },
    },
  },
  '& .MuiSwitch-thumb': {
    width: 24,
    height: 24,
    borderRadius: '50%',
    backgroundColor: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
    '& svg': {
      fontSize: 16,
    },
  },
  '& .MuiSwitch-track': {
    borderRadius: 26,
    backgroundColor: theme.palette.mode === 'dark' ? '#404040' : '#e2e8f0',
    opacity: 1,
    transition: theme.transitions.create(['background-color'], {
      duration: 300,
    }),
  },
}));

function MainDashboard() {
  const [tabValue, setTabValue] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const handleTabChange = (event, newValue) => setTabValue(newValue);
  const handleProfileClick = (event) => setAnchorEl(event.currentTarget);
  const handleProfileClose = () => setAnchorEl(null);
  const toggleDarkMode = () => setIsDarkMode(prev => !prev);

  const theme = createTheme({
    palette: {
      mode: isDarkMode ? 'dark' : 'light',
      primary: {
        main: '#6366f1',
      },
      background: {
        default: isDarkMode ? '#1e1e2f' : '#f8f9fa',
        paper: isDarkMode ? '#2b2b3a' : '#ffffff',
      },
      text: {
        primary: isDarkMode ? '#f1f5f9' : '#1f2937',
        secondary: isDarkMode ? '#cbd5e1' : '#6c757d',
      }
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
        <AppBar position="static" sx={{ bgcolor: 'background.paper', boxShadow: 1 }}>
          <Toolbar>
            <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
              <TargetIcon style={{ color: theme.palette.primary.main, fontSize: 28, marginRight: 8 }} />
              <Typography variant="h6" sx={{ color: 'text.primary', fontWeight: 600 }}>
                SDGs Mapping Tools
              </Typography>
            </Box>

            {/* Dark Mode Switch with Icons */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mr: 2 }}>
              <Typography sx={{ fontSize: '16px' }}>☀️</Typography>
              <EnhancedIOSSwitch
                checked={isDarkMode}
                onChange={toggleDarkMode}
                inputProps={{ 'aria-label': 'toggle dark mode' }}
              />
              <Typography sx={{ fontSize: '16px' }}>🌙</Typography>
            </Box>

            <IconButton onClick={handleProfileClick} sx={{ color: 'primary.main' }}>
              <AccountCircle />
            </IconButton>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleProfileClose}>
              <MenuItem onClick={handleProfileClose}>Profile</MenuItem>
              <MenuItem onClick={handleProfileClose}>Settings</MenuItem>
              <MenuItem onClick={handleProfileClose}>Logout</MenuItem>
            </Menu>
          </Toolbar>
        </AppBar>

        <Container maxWidth="xl" sx={{ mt: 2 }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            sx={{
              borderBottom: 1,
              borderColor: 'divider',
              '& .MuiTab-root': {
                textTransform: 'none',
                minHeight: 48,
                color: 'text.secondary'
              },
              '& .Mui-selected': {
                color: 'primary.main !important'
              }
            }}
          >
            <Tab icon={<Dashboard />} label="Dashboard" iconPosition="start" />
            <Tab icon={<Article />} label="Dokumen" iconPosition="start" />
          </Tabs>
        </Container>

        <Container maxWidth="xl" sx={{ mt: 3 }}>
          {tabValue === 0 && <DashboardContent isDarkMode={isDarkMode} />}
          {tabValue === 1 && <DocumentContent isDarkMode={isDarkMode} />}
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default MainDashboard;