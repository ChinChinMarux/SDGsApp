import React, { useState } from 'react';
import {
  Box, Grid, AppBar, Toolbar, Typography,
  IconButton, Menu, MenuItem, List, ListItem, ListItemIcon,
  ListItemText, Divider, Switch, TextField, Button, Avatar
} from '@mui/material';
import {
  AccountCircle as AccountIcon,
  Logout as LogoutIcon,
  Person as PersonIcon,
  Security as SecurityIcon,
  Settings as SettingsIcon,
  LightMode, DarkMode
} from '@mui/icons-material';
import TargetIcon from '@mui/icons-material/TrackChanges';
import ProfileContent from '../components/ProfileContent';
import KeamananContent from '../components/KeamananContent';

// Custom Switch
const EnhancedSwitch = ({ checked, onChange }) => (
  <Switch
    checked={checked}
    onChange={onChange}
    sx={{
      width: 42,
      height: 26,
      padding: 0,
      '& .MuiSwitch-switchBase': {
        padding: 0,
        margin: '2px',
        transitionDuration: '300ms',
        '&.Mui-checked': {
          transform: 'translateX(16px)',
          color: '#fff',
          '& + .MuiSwitch-track': {
            background: 'linear-gradient(135deg, #667eea, #a24b8bff)',
            opacity: 1,
            border: 0,
          },
        },
      },
      '& .MuiSwitch-thumb': {
        width: 22,
        height: 22,
        backgroundColor: '#fff',
      },
      '& .MuiSwitch-track': {
        borderRadius: 13,
        backgroundColor: '#E9E9EA',
        opacity: 1,
      },
    }}
  />
);

const SidebarMenuItem = ({ active, isDarkMode, icon, text, onClick }) => {
  const activeStyles = {
    backgroundColor: isDarkMode ? 'rgba(102, 126, 234, 0.2)' : 'rgba(102, 126, 234, 0.1)',
    border: `1px solid ${isDarkMode ? 'rgba(102, 126, 234, 0.4)' : 'rgba(102, 126, 234, 0.3)'}`,
    color: '#667eea'
  };

  return (
    <ListItem
      button
      onClick={onClick}
      sx={{
        borderRadius: 2,
        mb: 1,
        ...(active ? activeStyles : {}),
        color: active ? '#667eea' : isDarkMode ? '#cdd6f4' : '#2c3e50',
        '&:hover': {
          backgroundColor: isDarkMode ? '#313244' : '#f5f5f5'
        }
      }}
    >
      <ListItemIcon>
        {React.cloneElement(icon, {
          sx: { color: active ? '#667eea' : isDarkMode ? '#cdd6f4' : '#2c3e50' }
        })}
      </ListItemIcon>
      <ListItemText
        primary={text}
        sx={{
          '& .MuiListItemText-primary': {
            fontWeight: active ? 600 : 500,
            color: active ? '#667eea' : isDarkMode ? '#cdd6f4' : '#2c3e50'
          }
        }}
      />
    </ListItem>
  );
};

// ProfileContent Component - menggunakan import
// KeamananContent Component - menggunakan import

const MainProfile = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeSection, setActiveSection] = useState('info-personal');
  const [anchorEl, setAnchorEl] = useState(null);

  const theme = {
    textColor: isDarkMode ? '#cdd6f4' : '#2c3e50',
    borderColor: isDarkMode ? '#313244' : '#e9ecef',
    sidebarBg: isDarkMode ? '#181825' : '#ffffff',
    mainBg: isDarkMode ? '#11111b' : '#f5f5f5',
    appBarBg: isDarkMode ? '#181825' : '#ffffff',
    shadow: isDarkMode ? '0 4px 20px rgba(0,0,0,0.5)' : '0 4px 20px rgba(0,0,0,0.1)'
  };

  const handleProfileClick = (e) => setAnchorEl(e.currentTarget);
  const handleProfileClose = () => setAnchorEl(null);
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };
  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      bgcolor: theme.mainBg,
      width: '100%',
      margin: 0,
      padding: 0
    }}>
      {/* App Bar */}
      <AppBar 
        position="sticky" 
        elevation={0} 
        sx={{ 
          backgroundColor: theme.appBarBg, 
          borderBottom: `1px solid ${theme.borderColor}`,
          width: '100%'
        }}
      >
        <Toolbar sx={{ minHeight: 56, px: 2, justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <TargetIcon sx={{ fontSize: 26, color: '#a24b8bff', mr: 1 }} />
            <Typography sx={{
              fontWeight: 600,
              fontSize: 18,
              background: 'linear-gradient(135deg, #667eea, #a24b8bff)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              SDGs Mapping Tools
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <LightMode sx={{ fontSize: 20, color: isDarkMode ? '#6c7086' : '#f9e2af' }} />
            <EnhancedSwitch checked={isDarkMode} onChange={toggleDarkMode} />
            <DarkMode sx={{ fontSize: 20, color: isDarkMode ? '#89b4fa' : '#6c7086' }} />
            <IconButton onClick={handleProfileClick} sx={{ color: theme.textColor }}>
              <AccountIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleProfileClose}
              PaperProps={{
                sx: {
                  backgroundColor: isDarkMode ? '#1e1e2e' : '#ffffff',
                  color: theme.textColor,
                  border: `1px solid ${theme.borderColor}`,
                  boxShadow: theme.shadow
                }
              }}
            >
              <MenuItem onClick={handleProfileClose}>Profile</MenuItem>
              <MenuItem onClick={handleProfileClose}>Settings</MenuItem>
              <MenuItem onClick={handleLogout} sx={{ color: '#f38ba8' }}>Logout</MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Main Content - Full Width Container */}
      <Box sx={{ 
        width: '100%', 
        maxWidth: '1440px', 
        mx: 'auto', 
        px: 2, 
        pt: 4,
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        gap: 3,
        alignItems: 'flex-start'
      }}>
        {/* Sidebar */}
        <Box
          sx={{
            width: { xs: '100%', md: '300px' },
            flexShrink: 0
          }}
        >
          <Box
            sx={{
              p: 2,
              border: `1px solid ${theme.borderColor}`,
              borderRadius: 3,
              backgroundColor: theme.sidebarBg,
              boxShadow: theme.shadow,
              position: 'sticky',
              top: 80
            }}
          >
            <Box sx={{
              p: 2,
              borderBottom: `1px solid ${theme.borderColor}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: theme.textColor }}>
                Settings
              </Typography>
              <SettingsIcon sx={{ color: theme.textColor }} />
            </Box>

            <List sx={{ p: 2 }}>
              <SidebarMenuItem
                active={activeSection === 'info-personal'}
                isDarkMode={isDarkMode}
                icon={<PersonIcon />}
                text="Info Personal"
                onClick={() => setActiveSection('info-personal')}
              />
              <SidebarMenuItem
                active={activeSection === 'security'}
                isDarkMode={isDarkMode}
                icon={<SecurityIcon />}
                text="Keamanan"
                onClick={() => setActiveSection('security')}
              />
              <Divider sx={{ my: 2, backgroundColor: theme.borderColor }} />
              <ListItem button onClick={handleLogout}
                sx={{
                  borderRadius: 2,
                  color: '#f38ba8',
                  '&:hover': {
                    backgroundColor: isDarkMode ? 'rgba(243, 139, 168, 0.1)' : 'rgba(229, 62, 62, 0.1)'
                  }
                }}>
                <ListItemIcon><LogoutIcon sx={{ color: '#f38ba8' }} /></ListItemIcon>
                <ListItemText primary="Logout" />
              </ListItem>
            </List>
          </Box>
        </Box>

        {/* Main Content */}
        <Box sx={{ flex: 1, width: '100%' }}>
          {activeSection === 'info-personal' && <ProfileContent isDarkMode={isDarkMode} />}
          {activeSection === 'security' && <KeamananContent isDarkMode={isDarkMode} />}
        </Box>
      </Box>
    </Box>
  );
};

export default MainProfile;