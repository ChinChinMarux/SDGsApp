import React, { useState, useMemo } from 'react';
import {
  AppBar, Toolbar, Tabs, Tab, IconButton, Menu, MenuItem, Box, Typography,
  Container, useMediaQuery, Switch, Fade
} from '@mui/material';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import {
  DashboardCustomizeOutlined, ArticleOutlined, TrendingUp,
  FileUploadOutlined, AccountCircle, LightMode, DarkMode
} from '@mui/icons-material';

import TargetIcon from '@mui/icons-material/TrackChanges';

import DashboardContent from '../components/DashboardContent';
import DocumentContent from '../components/DocumentContent';
import AnalisisContent from '../components/AnalisisContent';
import UploadContent from '../components/UploadContent';
import ProfileContent from '../components/ProfileContent';

const EnhancedSwitch = styled(Switch)(({ theme }) => ({
  width: 50,
  height: 26,
  padding: 0,
  '& .MuiSwitch-switchBase': {
    padding: 1,
    '&.Mui-checked': {
      transform: 'translateX(24px)',
      color: '#fff',
      '& + .MuiSwitch-track': {
        background: 'linear-gradient(135deg, #667eea, #764ba2)',
        opacity: 1,
      },
    },
  },
  '& .MuiSwitch-thumb': {
    width: 24,
    height: 24,
  },
  '& .MuiSwitch-track': {
    borderRadius: 26,
    backgroundColor: theme.palette.mode === 'dark' ? '#555' : '#ccc',
    opacity: 1,
  },
}));

const tabsData = [
  { icon: DashboardCustomizeOutlined, label: 'Dashboard', content: DashboardContent },
  { icon: ArticleOutlined, label: 'Dokumen', content: DocumentContent },
  { icon: TrendingUp, label: 'Analisis', content: AnalisisContent },
  { icon: FileUploadOutlined, label: 'Upload', content: UploadContent },
];

function MainDashboard() {
  const isMobile = useMediaQuery('(max-width: 900px)');
  const [tabIndex, setTabIndex] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved !== null ? JSON.parse(saved) : window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const theme = useMemo(() => createTheme({
    palette: {
      mode: isDarkMode ? 'dark' : 'light',
      primary: { main: '#6366f1' },
      background: {
        default: isDarkMode ? '#0f172a' : '#f8fafc',
        paper: isDarkMode ? '#1e1e2e' : '#ffffff',
      },
      text: {
        primary: isDarkMode ? '#f1f5f9' : '#0f172a',
      },
    },
    typography: {
      fontFamily: '"Segoe UI", sans-serif',
    },
  }), [isDarkMode]);

  const handleTabChange = (_, newValue) => setTabIndex(newValue);
  const toggleDarkMode = () => {
    setIsDarkMode(prev => {
      const next = !prev;
      localStorage.setItem('darkMode', JSON.stringify(next));
      return next;
    });
  };
  const handleProfileClick = (e) => setAnchorEl(e.currentTarget);
  const handleProfileClose = () => setAnchorEl(null);
  const handleLogout = () => {
    localStorage.clear();
    handleProfileClose();
    window.location.href = '/login';
  };

  const CurrentTabComponent = tabsData[tabIndex].content;

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'background.default' }}>
        <AppBar position="sticky" elevation={0} sx={{ bgcolor: 'background.paper', borderBottom: 1, borderColor: 'divider' }}>
          <Toolbar sx={{ minHeight: 56, px: 2, justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <TargetIcon sx={{ fontSize: 26, color: '#a24b8bff', mr: 1 }} />
              <Typography sx={{
                fontWeight: 600,
                fontSize: 18,
                background: 'linear-gradient(135deg, #667eea, #a24b8bff)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                SDGs Mapping Tools
              </Typography>
            </Box>

            {!isMobile && (
              <Tabs value={tabIndex} onChange={handleTabChange} sx={{
                minHeight: 48,
                '& .MuiTabs-indicator': {
                  height: 2,
                  background: 'linear-gradient(135deg, #667eea, #a24b8bff)',
                },
              }}>
                {tabsData.map((tab, i) => (
                  <Tab
                    key={i}
                    icon={<tab.icon
                      fontSize="small"
                      sx={tabIndex === i ? {
                        background: 'linear-gradient(135deg, #667eea, #a24b8bff)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        mr: 1
                      } : { mr: 1 }}
                    />}
                    iconPosition="start"
                    label={<Typography sx={{
                      fontSize: 14,
                      fontWeight: 500,
                      textTransform: 'none',
                      ...(tabIndex === i && {
                        background: 'linear-gradient(135deg, #667eea, #a24b8bff)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                      })
                    }}>{tab.label}</Typography>}
                    sx={{ minHeight: 48 }}
                  />
                ))}
              </Tabs>
            )}

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <LightMode sx={{ fontSize: 20, color: isDarkMode ? 'text.secondary' : 'warning.main' }} />
              <EnhancedSwitch checked={isDarkMode} onChange={toggleDarkMode} />
              <DarkMode sx={{ fontSize: 20, color: isDarkMode ? 'info.main' : 'text.secondary' }} />
              <IconButton onClick={handleProfileClick}>
                <AccountCircle />
              </IconButton>
              <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleProfileClose}>
                <MenuItem onClick={handleProfileClose}>Profile</MenuItem>
                <MenuItem onClick={handleProfileClose}>Settings</MenuItem>
                <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>Logout</MenuItem>
              </Menu>
            </Box>
          </Toolbar>
        </AppBar>

        <Container component="main" maxWidth="xl" sx={{ flex: 1, mt: 2, px: 2, pb: 4 }}>
          <Fade in timeout={400}>
            <Box>
              <CurrentTabComponent isDarkMode={isDarkMode} currentTab={tabIndex} onTabChange={setTabIndex} />
            </Box>
          </Fade>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default MainDashboard;
