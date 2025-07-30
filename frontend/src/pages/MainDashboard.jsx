import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useSwipeable } from 'react-swipeable';
import {
  AppBar, Toolbar, Tabs, Tab, IconButton, Menu, MenuItem, Box, Typography,
  Container, useMediaQuery, Switch, Fade, Drawer, List, ListItem, ListItemIcon, 
  ListItemText, ListItemButton, Chip
} from '@mui/material';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import {
  DashboardCustomizeOutlined, ArticleOutlined, TrendingUp,
  FileUploadOutlined, AccountCircle, LightMode, DarkMode, MenuOutlined,
  SwipeRounded, KeyboardArrowLeft, KeyboardArrowRight
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
}));

const StyledListItemButton = styled(ListItemButton)(({ theme, isActive, isDarkMode }) => ({
  margin: '3px 10px',
  borderRadius: '10px',
  padding: '10px 14px',
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
    transform: 'translateX(3px)',
    boxShadow: isDarkMode 
      ? '0 3px 10px rgba(102, 126, 234, 0.2)' 
      : '0 3px 10px rgba(102, 126, 234, 0.1)',
  },
  '&:active': {
    transform: 'translateX(2px) scale(0.98)',
  }
}));

// Mobile Tab Indicator Component with Tab Names
const MobileTabIndicator = ({ tabIndex, totalTabs, isDarkMode, tabsData, isSmallMobile }) => (
  <Box sx={{ 
    display: 'flex', 
    flexDirection: 'column',
    alignItems: 'center',
    gap: 1,
    py: 1.5,
    px: 2,
    position: 'sticky',
    top: 0,
    zIndex: 10,
    backgroundColor: isDarkMode ? 'rgba(15, 23, 42, 0.95)' : 'rgba(248, 250, 252, 0.95)',
    backdropFilter: 'blur(10px)',
    borderBottom: `1px solid ${isDarkMode ? 'rgba(102, 126, 234, 0.1)' : 'rgba(102, 126, 234, 0.08)'}`,
    mb: 1
  }}>
    {/* Current Tab Name with Icon */}
    <Box sx={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: 1,
      mb: 0.5
    }}>
      {React.createElement(tabsData[tabIndex].icon, {
        sx: { 
          fontSize: isSmallMobile ? 18 : 20, 
          color: isDarkMode ? '#a5b4fc' : '#6366f1',
        }
      })}
      <Typography sx={{
        fontSize: isSmallMobile ? 14 : 16,
        fontWeight: 600,
        color: isDarkMode ? '#f1f5f9' : '#0f172a',
        background: 'linear-gradient(135deg, #667eea, #a24b8bff)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
      }}>
        {tabsData[tabIndex].label}
      </Typography>
    </Box>

    {/* Navigation Indicators */}
    <Box sx={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center',
      gap: 1,
      width: '100%'
    }}>
      {/* Previous Tab Name */}
      <Box sx={{ 
        flex: 1, 
        display: 'flex', 
        justifyContent: 'flex-start',
        alignItems: 'center',
        gap: 0.5,
        opacity: tabIndex > 0 ? 1 : 0,
        transition: 'all 0.3s ease'
      }}>
        {tabIndex > 0 && (
          <>
            <KeyboardArrowLeft sx={{ 
              fontSize: 16, 
              color: isDarkMode ? '#94a3b8' : '#64748b',
            }} />
            <Typography sx={{
              fontSize: isSmallMobile ? 11 : 12,
              fontWeight: 500,
              color: isDarkMode ? '#94a3b8' : '#64748b',
              maxWidth: isSmallMobile ? '60px' : '80px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}>
              {tabsData[tabIndex - 1].label}
            </Typography>
          </>
        )}
      </Box>

      {/* Dot Indicators */}
      <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
        {Array.from({ length: totalTabs }).map((_, index) => (
          <Box
            key={index}
            sx={{
              width: index === tabIndex ? 20 : 6,
              height: 6,
              borderRadius: '3px',
              backgroundColor: index === tabIndex 
                ? (isDarkMode ? '#a5b4fc' : '#6366f1')
                : (isDarkMode ? 'rgba(148, 163, 184, 0.3)' : 'rgba(100, 116, 139, 0.3)'),
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          />
        ))}
      </Box>

      {/* Next Tab Name */}
      <Box sx={{ 
        flex: 1, 
        display: 'flex', 
        justifyContent: 'flex-end',
        alignItems: 'center',
        gap: 0.5,
        opacity: tabIndex < totalTabs - 1 ? 1 : 0,
        transition: 'all 0.3s ease'
      }}>
        {tabIndex < totalTabs - 1 && (
          <>
            <Typography sx={{
              fontSize: isSmallMobile ? 11 : 12,
              fontWeight: 500,
              color: isDarkMode ? '#94a3b8' : '#64748b',
              maxWidth: isSmallMobile ? '60px' : '80px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}>
              {tabsData[tabIndex + 1].label}
            </Typography>
            <KeyboardArrowRight sx={{ 
              fontSize: 16, 
              color: isDarkMode ? '#94a3b8' : '#64748b',
            }} />
          </>
        )}
      </Box>
    </Box>
  </Box>
);

// Swipe Hint Component
const SwipeHint = ({ isDarkMode, show }) => (
  <AnimatePresence>
    {show && (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
      >
        <Box sx={{
          position: 'fixed',
          bottom: 80,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 1000,
          pointerEvents: 'none'
        }}>
          <Chip
            icon={<SwipeRounded sx={{ fontSize: 16 }} />}
            label="Swipe untuk navigasi"
            size="small"
            sx={{
              backgroundColor: isDarkMode ? 'rgba(102, 126, 234, 0.15)' : 'rgba(102, 126, 234, 0.1)',
              color: isDarkMode ? '#a5b4fc' : '#6366f1',
              border: `1px solid ${isDarkMode ? 'rgba(102, 126, 234, 0.3)' : 'rgba(102, 126, 234, 0.2)'}`,
              backdropFilter: 'blur(10px)',
              fontSize: '0.75rem',
              '& .MuiChip-icon': {
                color: isDarkMode ? '#a5b4fc' : '#6366f1',
              }
            }}
          />
        </Box>
      </motion.div>
    )}
  </AnimatePresence>
);

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
  const [showSwipeHint, setShowSwipeHint] = useState(false);
  const [hasSwipedBefore, setHasSwipedBefore] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Show swipe hint on first mobile visit
  useEffect(() => {
    if (isMobile && !hasSwipedBefore) {
      const timer = setTimeout(() => {
        setShowSwipeHint(true);
        const hideTimer = setTimeout(() => {
          setShowSwipeHint(false);
        }, 3000);
        return () => clearTimeout(hideTimer);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isMobile, hasSwipedBefore]);

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

  // Enhanced swipe handlers for mobile tab navigation
  const handleSwipeLeft = () => {
    if (isMobile && tabIndex < tabsData.length - 1) {
      setTabIndex(prev => prev + 1);
      setHasSwipedBefore(true);
      setShowSwipeHint(false);
    }
  };

  const handleSwipeRight = () => {
    if (isMobile && tabIndex > 0) {
      setTabIndex(prev => prev - 1);
      setHasSwipedBefore(true);
      setShowSwipeHint(false);
    }
  };

  // Configure swipe handlers with enhanced settings
  const swipeHandlers = useSwipeable({
    onSwipedLeft: handleSwipeLeft,
    onSwipedRight: handleSwipeRight,
    preventDefaultTouchmoveEvent: true,
    trackMouse: false, // Only track touch events on mobile
    trackTouch: isMobile,
    delta: 50, // Minimum distance for swipe
    swipeDuration: 500, // Maximum duration for swipe
    touchEventOptions: { passive: false }
  });
  
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
          x.set(0);
        }
      };

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
            minHeight: isMobile ? 52 : 56,
            px: isMobile ? 1.5 : 2, 
            justifyContent: 'space-between' 
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {isMobile && (
                <IconButton
                  edge="start"
                  onClick={toggleMobileDrawer}
                  sx={{ 
                    mr: isMobile ? 1.5 : 2,
                    color: 'text.primary',
                    p: 1,
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
                marginLeft: isMobile ? 6 : 1,
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

        <MobileDrawer />

        {/* Enhanced Mobile Content Container with Swipe */}
        <Container 
          component="main" 
          maxWidth="xl" 
          sx={{ 
            flex: 1, 
            mt: isMobile ? 0 : 2, 
            px: 0, 
            pb: isMobile ? 3 : 4,
            overflow: 'hidden'
          }}
          {...(isMobile ? swipeHandlers : {})}
        >
          {/* Mobile Tab Indicator */}
          {isMobile && (
            <MobileTabIndicator 
              tabIndex={tabIndex} 
              totalTabs={tabsData.length} 
              isDarkMode={isDarkMode} 
              tabsData={tabsData}
              isSmallMobile={isSmallMobile}
            />
          )}
          
          {/* Swipe Hint */}
          <SwipeHint isDarkMode={isDarkMode} show={showSwipeHint} />
          
          {/* Content with slide animation on mobile */}
          <Box sx={{ px: isMobile ? 1.5 : 2 }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={tabIndex}
                initial={isMobile ? { opacity: 0, x: 20 } : { opacity: 0 }}
                animate={{ opacity: 1, x: 0 }}
                exit={isMobile ? { opacity: 0, x: -20 } : { opacity: 0 }}
                transition={{
                  duration: isMobile ? 0.3 : 0.4,
                  ease: isMobile ? "easeOut" : "easeInOut"
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
              </motion.div>
            </AnimatePresence>
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default MainDashboard;