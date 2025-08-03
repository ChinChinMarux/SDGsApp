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
import { UserButton } from '@clerk/clerk-react';
import GraphContent from '../components/GraphContent';



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
  { icon: TargetIcon, label: 'Visualisasi Graph', content: GraphContent },

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
              <UserButton
                afterSignOutUrl="/sign-in"
                appearance={{
                  baseTheme: isDarkMode ? "dark" : "light",
                  elements: {
                    // Avatar styling - smaller and rounded with !important
                    userButtonAvatarBox: {
                      width: '34px !important',
                      height: '34px !important',
                      minWidth: '34px !important',
                      minHeight: '34px !important',
                      borderRadius: '50% !important', // Fully rounded
                      aspectRatio: '1 !important',
                      border: isDarkMode 
                        ? '2px solid rgba(102, 126, 234, 0.4) !important' 
                        : '2px solid rgba(102, 126, 234, 0.3) !important',
                      boxShadow: isDarkMode
                        ? '0 2px 12px rgba(255, 255, 255, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.1) !important'
                        : '0 2px 12px rgba(230, 230, 230, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.7) !important',
                      transition: 'all 0.2s ease-in-out !important',
                      overflow: 'hidden !important',
                      '&:hover': {
                        transform: 'scale(1.08) !important',
                        borderColor: isDarkMode 
                          ? 'rgba(102, 126, 234, 0.6) !important' 
                          : 'rgba(102, 126, 234, 0.5) !important',
                        boxShadow: isDarkMode
                          ? '0 4px 20px rgba(102, 126, 234, 0.4), 0 0 0 4px rgba(102, 126, 234, 0.1) !important'
                          : '0 4px 20px rgba(102, 126, 234, 0.25), 0 0 0 4px rgba(102, 126, 234, 0.08) !important',
                      }
                    },
                    
                    // Avatar image inside the box
                    userButtonAvatarImage: {
                      width: '100% !important',
                      height: '100% !important',
                      borderRadius: '50% !important',
                      objectFit: 'cover !important',
                    },
                    
                    // Main popover container
                    userButtonPopoverCard: {
                      borderRadius: '16px',
                      backdropFilter: 'blur(20px)',
                      backgroundColor: isDarkMode 
                        ? 'rgba(15, 23, 42, 0.95)' 
                        : 'rgba(248, 250, 252, 0.95)',
                      border: `1px solid ${isDarkMode ? 'rgba(102, 126, 234, 0.2)' : 'rgba(102, 126, 234, 0.15)'}`,
                      boxShadow: isDarkMode
                        ? '0 20px 40px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(102, 126, 234, 0.1)'
                        : '0 20px 40px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(102, 126, 234, 0.05)',
                      padding: '20px',
                      minWidth: '280px',
                      animation: 'fadeInUp 0.3s ease-out',
                    },
                    
                    // Profile page styling
                    profilePage: {
                      backgroundColor: isDarkMode ? '#0f172a' : '#f8fafc',
                      color: isDarkMode ? '#f1f5f9' : '#0f172a',
                    },
                    
                    // Profile page header
                    profilePageHeader: {
                      backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
                      borderBottom: `1px solid ${isDarkMode ? '#334155' : '#e2e8f0'}`,
                      color: isDarkMode ? '#f1f5f9' : '#0f172a',
                    },
                    
                    // Profile page content
                    profilePageContent: {
                      backgroundColor: isDarkMode ? '#0f172a' : '#f8fafc',
                      color: isDarkMode ? '#f1f5f9' : '#0f172a',
                    },
                    
                    // Form fields in profile page
                    formFieldInput: {
                      backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
                      borderColor: isDarkMode ? '#475569' : '#d1d5db',
                      color: isDarkMode ? '#f1f5f9' : '#0f172a',
                      '&:focus': {
                        borderColor: isDarkMode ? '#6366f1' : '#6366f1',
                        boxShadow: isDarkMode 
                          ? '0 0 0 3px rgba(99, 102, 241, 0.1)' 
                          : '0 0 0 3px rgba(99, 102, 241, 0.1)',
                      }
                    },
                    
                    // Form labels
                    formFieldLabel: {
                      color: isDarkMode ? '#cbd5e1' : '#374151',
                      fontWeight: 500,
                    },
                    
                    // Buttons in profile page
                    profilePageButton: {
                      backgroundColor: isDarkMode ? '#6366f1' : '#6366f1',
                      color: '#ffffff',
                      '&:hover': {
                        backgroundColor: isDarkMode ? '#4f46e5' : '#4f46e5',
                      }
                    },
                    
                    // Card containers in profile page
                    card: {
                      backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
                      borderColor: isDarkMode ? '#334155' : '#e2e8f0',
                      color: isDarkMode ? '#f1f5f9' : '#0f172a',
                    },
                    
                    // Navigation sidebar
                    navbarContainer: {
                      backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
                      borderRight: `1px solid ${isDarkMode ? '#334155' : '#e2e8f0'}`,
                    },
                    
                    navbarButton: {
                      color: isDarkMode ? '#cbd5e1' : '#6b7280',
                      '&:hover': {
                        backgroundColor: isDarkMode ? '#334155' : '#f3f4f6',
                        color: isDarkMode ? '#f1f5f9' : '#0f172a',
                      },
                      '&[data-active="true"]': {
                        backgroundColor: isDarkMode ? '#6366f1' : '#6366f1',
                        color: '#ffffff',
                      }
                    },
                    
                    // User info section
                    userButtonPopoverMain: {
                      padding: '0 0 16px 0',
                      borderBottom: `1px solid ${isDarkMode ? 'rgba(102, 126, 234, 0.1)' : 'rgba(102, 126, 234, 0.08)'}`,
                    },
                    
                    // Action buttons container
                    userButtonPopoverActions: {
                      padding: '16px 0 0 0',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px',
                    },
                    
                    // Individual action buttons
                    userButtonPopoverActionButton: {
                      color: isDarkMode ? '#f1f5f9' : '#0f172a',
                      backgroundColor: 'transparent',
                      fontWeight: 500,
                      fontSize: '0.875rem',
                      textTransform: 'none',
                      padding: '10px 16px',
                      borderRadius: '8px',
                      border: 'none',
                      transition: 'all 0.2s ease-in-out',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'flex-start',
                      width: '100%',
                      '&:hover': {
                        backgroundColor: isDarkMode 
                          ? 'rgba(102, 126, 234, 0.1)' 
                          : 'rgba(102, 126, 234, 0.05)',
                        transform: 'translateX(4px)',
                        color: isDarkMode ? '#a5b4fc' : '#6366f1',
                      },
                      '&:active': {
                        transform: 'translateX(2px) scale(0.98)',
                      }
                    },
                    
                    // Sign out button specific styling
                    userButtonPopoverActionButtonIcon: {
                      marginRight: '12px',
                      width: '16px',
                      height: '16px',
                      opacity: 0.7,
                    },
                    
                    // Footer section
                    userButtonPopoverFooter: {
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      paddingTop: '16px',
                      marginTop: '16px',
                      borderTop: `1px solid ${isDarkMode ? 'rgba(102, 126, 234, 0.1)' : 'rgba(102, 126, 234, 0.08)'}`,
                    },
                    
                    // User preview section
                    userPreview: {
                      padding: '0',
                      margin: '0',
                    },
                    
                    userPreviewMainIdentifier: {
                      color: isDarkMode ? '#f1f5f9' : '#0f172a',
                      fontWeight: 600,
                      fontSize: '1rem',
                      marginBottom: '4px',
                    },
                    
                    userPreviewSecondaryIdentifier: {
                      color: isDarkMode ? '#94a3b8' : '#64748b',
                      fontSize: '0.875rem',
                      opacity: 0.8,
                    },
                    
                    // Avatar in preview with !important
                    avatarBox: {
                      width: '44px !important',
                      height: '44px !important',
                      minWidth: '44px !important',
                      minHeight: '44px !important',
                      borderRadius: '50% !important', // Fully rounded
                      aspectRatio: '1 !important',
                      border: isDarkMode 
                        ? '2px solid rgba(102, 126, 234, 0.3) !important' 
                        : '2px solid rgba(102, 126, 234, 0.2) !important',
                      marginRight: '12px',
                      overflow: 'hidden !important',
                    },
                    
                    // Avatar image in preview
                    avatarImage: {
                      width: '100% !important',
                      height: '100% !important',
                      borderRadius: '50% !important',
                      objectFit: 'cover !important',
                    },
                  },
                  variables: {
                    colorPrimary: isDarkMode ? '#6366f1' : '#6366f1',
                    colorText: isDarkMode ? '#f1f5f9' : '#0f172a',
                    colorTextSecondary: isDarkMode ? '#94a3b8' : '#64748b',
                    colorBackground: isDarkMode ? '#0f172a' : '#f8fafc',
                    colorInputBackground: isDarkMode ? '#1e293b' : '#ffffff',
                    colorInputText: isDarkMode ? '#f1f5f9' : '#0f172a',
                    colorNeutral: isDarkMode ? '#334155' : '#e2e8f0',
                    colorShimmer: isDarkMode ? '#1e293b' : '#f1f5f9',
                    borderRadius: '12px',
                    fontFamily: '"Segoe UI", sans-serif',
                    // Profile page specific variables
                    colorAlphaShade: isDarkMode ? 'rgba(15, 23, 42, 0.8)' : 'rgba(248, 250, 252, 0.8)',
                    colorTextOnPrimaryBackground: '#ffffff',
                    colorInputBorder: isDarkMode ? '#475569' : '#d1d5db',
                  }
                }}
              />
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