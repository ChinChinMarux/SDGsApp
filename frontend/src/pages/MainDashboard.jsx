import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useSwipeable } from 'react-swipeable';
import {
  AppBar, Toolbar, Tabs, Tab, IconButton, Menu, MenuItem, Box, Typography,
  Container, useMediaQuery, Switch, Fade, Drawer, List, ListItem, ListItemIcon, 
  ListItemText, ListItemButton
} from '@mui/material';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import {
  DashboardCustomizeOutlined, ArticleOutlined, TrendingUp,
  FileUploadOutlined, AccountCircle, LightMode, DarkMode, MenuOutlined
} from '@mui/icons-material';

import TargetIcon from '@mui/icons-material/TrackChanges';

import DashboardContent from '../components/DashboardContent';
import DocumentContent from '../components/DocumentContent';
import AnalisisContent from '../components/AnalisisContent';
import UploadContent from '../components/UploadContent';
import ProfileContent from '../components/ProfileContent';
import { UserButton } from '@clerk/clerk-react';
import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';

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

// Smaller switch for mobile
const MobileEnhancedSwitch = styled(Switch)(({ theme }) => ({
  width: 42,
  height: 22,
  padding: 0,
  '& .MuiSwitch-switchBase': {
    padding: 1,
    '&.Mui-checked': {
      transform: 'translateX(20px)',
      color: '#fff',
      '& + .MuiSwitch-track': {
        background: 'linear-gradient(135deg, #667eea, #764ba2)',
        opacity: 1,
      },
    },
  },
  '& .MuiSwitch-thumb': {
    width: 20,
    height: 20,
  },
  '& .MuiSwitch-track': {
    borderRadius: 22,
    backgroundColor: theme.palette.mode === 'dark' ? '#555' : '#ccc',
    opacity: 1,
  },
}));

const StyledDrawer = styled(Drawer)(({ theme, isDarkMode }) => ({
  '& .MuiDrawer-paper': {
    width: 260,
    backgroundColor: isDarkMode ? '#1e1e2e' : '#ffffff',
    borderRight: `1px solid ${isDarkMode ? 'rgba(102, 126, 234, 0.2)' : 'rgba(102, 126, 234, 0.15)'}`,
    backdropFilter: 'blur(20px)',
    boxShadow: isDarkMode 
      ? '4px 0 20px rgba(0, 0, 0, 0.5)' 
      : '4px 0 20px rgba(0, 0, 0, 0.1)',
    transition: 'transform 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
    willChange: 'transform',
  },
  // Custom transition for opening
  '&.MuiModal-root': {
    '&.MuiDrawer-root': {
      '&.MuiDrawer-modal': {
        '&.MuiDrawer-docked': {
          '&.MuiDrawer-paper': {
            transition: 'transform 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
          }
        }
      }
    }
  }
}));

const StyledListItemButton = styled(ListItemButton)(({ theme, isActive, isDarkMode }) => ({
  margin: '3px 10px', // Reduced margins
  borderRadius: '10px', // Slightly smaller radius
  padding: '10px 14px', // Reduced padding
  transition: 'all 0.3s ease',
  backgroundColor: isActive 
    ? isDarkMode 
      ? 'rgba(102, 126, 234, 0.15)' 
      : 'rgba(102, 126, 234, 0.1)'
    : 'transparent',
  border: isActive 
    ? `1px solid ${isDarkMode ? 'rgba(102, 126, 234, 0.3)' : 'rgba(102, 126, 234, 0.2)'}` 
    : '1px solid transparent',
  '&:hover': {
    backgroundColor: isDarkMode 
      ? 'rgba(102, 126, 234, 0.1)' 
      : 'rgba(102, 126, 234, 0.05)',
    transform: 'translateX(3px)', // Reduced movement
    boxShadow: isDarkMode 
      ? '0 3px 10px rgba(102, 126, 234, 0.2)' 
      : '0 3px 10px rgba(102, 126, 234, 0.1)',
  },
  '&:active': {
    transform: 'translateX(2px) scale(0.98)',
  }
}));

const tabsData = [
  { icon: DashboardCustomizeOutlined, label: 'Dashboard', content: DashboardContent },
  { icon: ArticleOutlined, label: 'Dokumen', content: DocumentContent },
  { icon: TrendingUp, label: 'Analisis', content: AnalisisContent },
  { icon: FileUploadOutlined, label: 'Upload', content: UploadContent },
];

function MainDashboard() {
  const isMobile = useMediaQuery('(max-width: 900px)');
  const isSmallMobile = useMediaQuery('(max-width: 480px)');
  const [tabIndex, setTabIndex] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Remove localStorage usage as per guidelines
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
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
    // Add responsive breakpoints
    breakpoints: {
      values: {
        xs: 0,
        sm: 600,
        md: 900,
        lg: 1200,
        xl: 1536,
      },
    },
  }), [isDarkMode]);

  const handleTabChange = (_, newValue) => setTabIndex(newValue);
  
  const handleMobileTabChange = (newValue) => {
    setTabIndex(newValue);
    setMobileDrawerOpen(false);
  };
  
  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };

  const toggleMobileDrawer = () => {
    setMobileDrawerOpen(prev => !prev);
  };

  const CurrentTabComponent = tabsData[tabIndex].content;

  // Mobile Drawer Component with swipe gestures
  const MobileDrawer = () => {
      const drawerRef = useRef(null);
      const x = useMotionValue(0);
      const [isDragging, setIsDragging] = useState(false);

      const handleDragStart = () => {
        setIsDragging(true);
      };

      const handleDragEnd = (_, info) => {
        setIsDragging(false);
        const shouldClose = info.velocity.x < -500 || info.point.x < -50;
        
        if (shouldClose) {
          setMobileDrawerOpen(false);
        } else {
          // Return to open position with spring animation
          x.set(0);
        }
      };

      // Close drawer when clicking outside
      useEffect(() => {
        const handleClickOutside = (e) => {
          if (drawerRef.current && !drawerRef.current.contains(e.target)) {
            setMobileDrawerOpen(false);
          }
        };
        
        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('touchstart', handleClickOutside);
        return () => {
          document.removeEventListener('mousedown', handleClickOutside);
          document.removeEventListener('touchstart', handleClickOutside);
        };
      }, []);

      return (
        <>
          {/* Overlay with fade animation */}
          <AnimatePresence>
            {mobileDrawerOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                style={{
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  zIndex: theme.zIndex.drawer - 1,
                  backgroundColor: 'rgba(0,0,0,0.5)',
                  touchAction: 'none'
                }}
                onClick={() => setMobileDrawerOpen(false)}
              />
            )}
          </AnimatePresence>

          {/* Drawer with smooth sliding */}
          <motion.div
            ref={drawerRef}
            drag="x"
            dragConstraints={{ right: 0 }}
            dragElastic={0.1}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            style={{
              x,
              position: 'fixed',
              top: 0,
              left: 0,
              bottom: 0,
              width: 260,
              zIndex: theme.zIndex.drawer,
              backgroundColor: isDarkMode ? '#1e1e2e' : '#ffffff',
              borderRight: `1px solid ${isDarkMode ? 'rgba(102, 126, 234, 0.2)' : 'rgba(102, 126, 234, 0.15)'}`,
              boxShadow: isDarkMode 
                ? '4px 0 20px rgba(0, 0, 0, 0.5)' 
                : '4px 0 20px rgba(0, 0, 0, 0.1)',
              willChange: 'transform',
            }}
            initial={{ x: -260 }}
            animate={{ x: mobileDrawerOpen ? 0 : -260 }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 30,
            }}
          >
            <Box 
              sx={{ 
                pt: 1.5, 
                pb: 1,
                height: '100%',
                overflowY: 'auto',
                touchAction: 'pan-y',
                '&::-webkit-scrollbar': {
                  width: '6px',
                },
                '&::-webkit-scrollbar-thumb': {
                  backgroundColor: isDarkMode ? 'rgba(102, 126, 234, 0.5)' : 'rgba(102, 126, 234, 0.3)',
                  borderRadius: '3px',
                },
              }}
            >
              {/* Drawer content remains the same */}
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center',
                justifyContent: isSmallMobile ? 'center' : 'flex-start',
                flex: 1,
                maxWidth: isSmallMobile ? 'auto' : 'none'
              }}>
                <TargetIcon sx={{ 
                  fontSize: isMobile ? 22 : 26, 
                  color: '#a24b8bff', 
                  mr: isSmallMobile ? 0 : (isMobile ? 0.8 : 1) 
                }} />
                {!isSmallMobile && (
                  <Typography sx={{
                    fontWeight: 600,
                    fontSize: isMobile ? (isSmallMobile ? 14 : 16) : 18,
                    background: 'linear-gradient(135deg, #667eea, #a24b8bff)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}>
                    SDGs Mapping Tools
                  </Typography>
                )}
              </Box>
              
              <List sx={{ px: 0.5 }}>
                {tabsData.map((tab, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ 
                      delay: isDragging ? 0 : index * 0.05,
                      duration: 0.3,
                      ease: "easeOut"
                    }}
                  >
                    <StyledListItemButton
                      isActive={tabIndex === index}
                      isDarkMode={isDarkMode}
                      onClick={() => handleMobileTabChange(index)}
                    >
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <tab.icon
                          sx={{
                            fontSize: 20,
                            color: tabIndex === index 
                              ? isDarkMode ? '#a5b4fc' : '#6366f1'
                              : isDarkMode ? '#94a3b8' : '#64748b',
                            transition: 'color 0.3s ease',
                          }}
                        />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Typography sx={{
                            fontSize: 14,
                            fontWeight: tabIndex === index ? 600 : 500,
                            color: tabIndex === index 
                              ? isDarkMode ? '#f1f5f9' : '#0f172a'
                              : isDarkMode ? '#cbd5e1' : '#64748b',
                            transition: 'all 0.3s ease',
                          }}>
                            {tab.label}
                          </Typography>
                        }
                      />
                    </StyledListItemButton>
                  </motion.div>
                ))}
              </List>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  delay: isDragging ? 0 : tabsData.length * 0.05,
                  duration: 0.3,
                  ease: "easeOut"
                }}
              >
                <Box sx={{ 
                  px: 2.5, 
                  py: 1.5, 
                  mt: 1.5,
                  borderTop: `1px solid ${isDarkMode ? 'rgba(102, 126, 234, 0.2)' : 'rgba(102, 126, 234, 0.15)'}`,
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between' 
                }}>
                  <Typography sx={{ 
                    fontSize: 13,
                    fontWeight: 500,
                    color: isDarkMode ? '#cbd5e1' : '#64748b' 
                  }}>
                    Dark Mode
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                    <LightMode sx={{ fontSize: 16, color: isDarkMode ? 'text.secondary' : 'warning.main' }} />
                    <MobileEnhancedSwitch checked={isDarkMode} onChange={toggleDarkMode} />
                    <DarkMode sx={{ fontSize: 16, color: isDarkMode ? 'info.main' : 'text.secondary' }} />
                  </Box>
                </Box>
              </motion.div>
            </Box>
          </motion.div>
          </>
        );
      };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'background.default' }}>
        {/* Optimized AppBar for mobile */}
        <AppBar 
          position="sticky" 
          elevation={0} 
          sx={{ 
            bgcolor: 'background.paper', 
            borderBottom: 1, 
            borderColor: 'divider'
          }}
        >
          <Toolbar sx={{ 
            minHeight: isMobile ? 52 : 56, // Smaller height on mobile
            px: isMobile ? 1.5 : 2, 
            justifyContent: 'space-between' 
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {/* Mobile Menu Button */}
              {isMobile && (
                <IconButton
                  edge="start"
                  onClick={toggleMobileDrawer}
                  sx={{ 
                    mr: isMobile ? 1.5 : 2,
                    color: 'text.primary',
                    p: 1, // Smaller padding
                    '&:hover': {
                      backgroundColor: isDarkMode ? 'rgba(102, 126, 234, 0.1)' : 'rgba(102, 126, 234, 0.05)',
                    }
                  }}
                >
                  <MenuOutlined sx={{ 
                    fontSize: isMobile ? 22 : 24, 
                    color: '#667eea',
                    padding: 0.25 }} />
                </IconButton>
              )}
              
              <TargetIcon sx={{ 
                fontSize: isMobile ? 22 : 26, 
                color: '#a24b8bff', 
                marginLeft: isMobile ? 5 : 1,
                mr: isMobile ? 0.8 : 1 
              }} />
              <Typography sx={{
                fontWeight: 600,
                fontSize: isMobile ? (isSmallMobile ? 14 : 16) : 18,
                background: 'linear-gradient(135deg, #667eea, #a24b8bff)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                {isSmallMobile ? 'SDGs Mapping Tools' : 'SDGs Mapping Tools'}
              </Typography>
            </Box>

            {/* Desktop Tabs */}
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

            <Box sx={{ display: 'flex', alignItems: 'center', gap: isMobile ? 1 : 1.5 }}>
              {/* Desktop Theme Toggle */}
              {!isMobile && (
                <>
                  <LightMode sx={{ fontSize: 20, color: isDarkMode ? 'text.secondary' : 'warning.main' }} />
                  <EnhancedSwitch checked={isDarkMode} onChange={toggleDarkMode} />
                  <DarkMode sx={{ fontSize: 20, color: isDarkMode ? 'info.main' : 'text.secondary' }} />
                </>
              )}
              
              <UserButton
                afterSignOutUrl="/sign-in"
                appearance={{
                  baseTheme: isDarkMode ? "dark" : "light",
                  elements: {
                    // Smaller avatar for mobile
                    userButtonAvatarBox: {
                      width: isMobile ? '30px !important' : '34px !important',
                      height: isMobile ? '30px !important' : '34px !important',
                      minWidth: isMobile ? '30px !important' : '34px !important',
                      minHeight: isMobile ? '30px !important' : '34px !important',
                      borderRadius: '50% !important',
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
                    
                    userButtonAvatarImage: {
                      width: '100% !important',
                      height: '100% !important',
                      borderRadius: '50% !important',
                      objectFit: 'cover !important',
                    },
                    
                    // Responsive popover
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
                      padding: isMobile ? '16px' : '20px',
                      minWidth: isMobile ? '250px' : '280px',
                      animation: 'fadeInUp 0.3s ease-out',
                    },
                    
                    profilePage: {
                      backgroundColor: isDarkMode ? '#0f172a' : '#f8fafc',
                      color: isDarkMode ? '#f1f5f9' : '#0f172a',
                    },
                    
                    profilePageHeader: {
                      backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
                      borderBottom: `1px solid ${isDarkMode ? '#334155' : '#e2e8f0'}`,
                      color: isDarkMode ? '#f1f5f9' : '#0f172a',
                    },
                    
                    profilePageContent: {
                      backgroundColor: isDarkMode ? '#0f172a' : '#f8fafc',
                      color: isDarkMode ? '#f1f5f9' : '#0f172a',
                    },
                    
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
                    
                    formFieldLabel: {
                      color: isDarkMode ? '#cbd5e1' : '#374151',
                      fontWeight: 500,
                    },
                    
                    profilePageButton: {
                      backgroundColor: isDarkMode ? '#6366f1' : '#6366f1',
                      color: '#ffffff',
                      '&:hover': {
                        backgroundColor: isDarkMode ? '#4f46e5' : '#4f46e5',
                      }
                    },
                    
                    card: {
                      backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
                      borderColor: isDarkMode ? '#334155' : '#e2e8f0',
                      color: isDarkMode ? '#f1f5f9' : '#0f172a',
                    },
                    
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
                    
                    userButtonPopoverMain: {
                      padding: '0 0 12px 0',
                      borderBottom: `1px solid ${isDarkMode ? 'rgba(102, 126, 234, 0.1)' : 'rgba(102, 126, 234, 0.08)'}`,
                    },
                    
                    userButtonPopoverActions: {
                      padding: '12px 0 0 0',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '6px',
                    },
                    
                    userButtonPopoverActionButton: {
                      color: isDarkMode ? '#f1f5f9' : '#0f172a',
                      backgroundColor: 'transparent',
                      fontWeight: 500,
                      fontSize: isMobile ? '0.8125rem' : '0.875rem',
                      textTransform: 'none',
                      padding: isMobile ? '8px 12px' : '10px 16px',
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
                    
                    userButtonPopoverActionButtonIcon: {
                      marginRight: isMobile ? '10px' : '12px',
                      width: isMobile ? '14px' : '16px',
                      height: isMobile ? '14px' : '16px',
                      opacity: 0.7,
                    },
                    
                    userButtonPopoverFooter: {
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      paddingTop: '12px',
                      marginTop: '12px',
                      borderTop: `1px solid ${isDarkMode ? 'rgba(102, 126, 234, 0.1)' : 'rgba(102, 126, 234, 0.08)'}`,
                    },
                    
                    userPreview: {
                      padding: '0',
                      margin: '0',
                    },
                    
                    userPreviewMainIdentifier: {
                      color: isDarkMode ? '#f1f5f9' : '#0f172a',
                      fontWeight: 600,
                      fontSize: isMobile ? '0.875rem' : '1rem',
                      marginBottom: '4px',
                    },
                    
                    userPreviewSecondaryIdentifier: {
                      color: isDarkMode ? '#94a3b8' : '#64748b',
                      fontSize: isMobile ? '0.8125rem' : '0.875rem',
                      opacity: 0.8,
                    },
                    
                    avatarBox: {
                      width: isMobile ? '36px !important' : '44px !important',
                      height: isMobile ? '36px !important' : '44px !important',
                      minWidth: isMobile ? '36px !important' : '44px !important',
                      minHeight: isMobile ? '36px !important' : '44px !important',
                      borderRadius: '50% !important',
                      aspectRatio: '1 !important',
                      border: isDarkMode 
                        ? '2px solid rgba(102, 126, 234, 0.3) !important' 
                        : '2px solid rgba(102, 126, 234, 0.2) !important',
                      marginRight: isMobile ? '10px' : '12px',
                      overflow: 'hidden !important',
                    },
                    
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
                    colorAlphaShade: isDarkMode ? 'rgba(15, 23, 42, 0.8)' : 'rgba(248, 250, 252, 0.8)',
                    colorTextOnPrimaryBackground: '#ffffff',
                    colorInputBorder: isDarkMode ? '#475569' : '#d1d5db',
                  }
                }}
              />
            </Box>
          </Toolbar>
        </AppBar>

        {/* Mobile Drawer */}
        <MobileDrawer />

        {/* Responsive Container */}
        <Container 
          component="main" 
          maxWidth="xl" 
          sx={{ 
            flex: 1, 
            mt: isMobile ? 1.5 : 2, 
            px: isMobile ? 1.5 : 2, 
            pb: isMobile ? 3 : 4 
          }}
        >
          <Fade in timeout={400}>
            <Box>
              <CurrentTabComponent 
                isDarkMode={isDarkMode} 
                currentTab={tabIndex} 
                onTabChange={setTabIndex}
                isMobile={isMobile}
                isSmallMobile={isSmallMobile}
              />
            </Box>
          </Fade>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default MainDashboard;