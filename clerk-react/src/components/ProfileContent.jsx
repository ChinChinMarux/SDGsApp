import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  AppBar,
  Toolbar,
  IconButton,
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Grid,
  Switch,
  Menu,
  MenuItem
} from '@mui/material';
import {
  Person as PersonIcon,
  Security as SecurityIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  PhotoCamera as CameraIcon,
  AccountCircle as AccountIcon,
  TrackChanges as TargetIcon,
  LightMode,
  DarkMode
} from '@mui/icons-material';

const SDGSettingsPage = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeSection, setActiveSection] = useState('info-personal');
  const [anchorEl, setAnchorEl] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '',
    organization: '',
    position: '',
    location: ''
  });

  // Color scheme
  const bgColor = isDarkMode ? '#1e1e2e' : '#ffffff';
  const textColor = isDarkMode ? '#cdd6f4' : '#2c3e50';
  const borderColor = isDarkMode ? '#313244' : '#e9ecef';
  const sidebarBg = isDarkMode ? '#181825' : '#ffffff';
  const inputBg = isDarkMode ? '#1e1e2e' : '#ffffff';

  // Enhanced Switch Component
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
          boxSizing: 'border-box',
          width: 22,
          height: 22,
          backgroundColor: '#fff',
        },
        '& .MuiSwitch-track': {
          borderRadius: 26 / 2,
          backgroundColor: isDarkMode ? '#45475a' : '#E9E9EA',
          opacity: 1,
          transition: 'background-color 300ms',
        },
      }}
    />
  );

  // Handlers
  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveChanges = () => {
    console.log('Saving changes:', formData);
  };

  const handleCancel = () => {
    setFormData({
      username: '',
      email: '',
      phone: '',
      organization: '',
      position: '',
      location: ''
    });
  };

  const handleProfileClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    console.log('Logging out...');
    handleProfileClose();
  };

  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      backgroundColor: isDarkMode ? '#11111b' : '#f5f5f5',
      color: textColor
    }}>
      {/* App Bar */}
      <AppBar 
        position="sticky" 
        elevation={0} 
        sx={{ 
          backgroundColor: isDarkMode ? '#181825' : '#ffffff',
          borderBottom: `1px solid ${borderColor}`
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
              WebkitTextFillColor: 'transparent',
            }}>
              SDGs Mapping Tools
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <LightMode sx={{ fontSize: 20, color: isDarkMode ? '#6c7086' : '#f9e2af' }} />
            <EnhancedSwitch checked={isDarkMode} onChange={toggleDarkMode} />
            <DarkMode sx={{ fontSize: 20, color: isDarkMode ? '#89b4fa' : '#6c7086' }} />
            <IconButton onClick={handleProfileClick} sx={{ color: textColor }}>
              <AccountIcon />
            </IconButton>
            <Menu 
              anchorEl={anchorEl} 
              open={Boolean(anchorEl)} 
              onClose={handleProfileClose}
              PaperProps={{
                sx: {
                  backgroundColor: isDarkMode ? '#1e1e2e' : '#ffffff',
                  color: textColor,
                  border: `1px solid ${borderColor}`,
                  boxShadow: isDarkMode 
                    ? '0 4px 20px rgba(0,0,0,0.5)' 
                    : '0 4px 20px rgba(0,0,0,0.1)'
                }
              }}
            >
              <MenuItem onClick={handleProfileClose} sx={{ color: textColor }}>Profile</MenuItem>
              <MenuItem onClick={handleProfileClose} sx={{ color: textColor }}>Settings</MenuItem>
              <MenuItem onClick={handleLogout} sx={{ color: '#f38ba8' }}>Logout</MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Box sx={{ maxWidth: '1400px', margin: '0 auto', p: 3 }}>
        <Grid container spacing={3} sx={{ mt: 1 }}>
          {/* Sidebar */}
          <Grid item xs={12} md={3} lg={3}>
            <Paper 
              sx={{ 
                backgroundColor: sidebarBg,
                borderRadius: 3,
                border: `1px solid ${borderColor}`,
                boxShadow: isDarkMode 
                  ? '0 2px 8px rgba(0,0,0,0.3)' 
                  : '0 2px 8px rgba(0,0,0,0.08)',
                overflow: 'hidden'
              }}
            >
              {/* Settings Header */}
              <Box sx={{ 
                p: 3, 
                borderBottom: `1px solid ${borderColor}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '1347px',
              }}>
                <Typography variant="h5" sx={{ fontWeight: 700, color: textColor }}>
                  Settings
                </Typography>
                <SettingsIcon sx={{ color: textColor }} />
              </Box>

              {/* Navigation Menu */}
              <List sx={{ p: 2 }}>
                <ListItem
                  button
                  onClick={() => setActiveSection('info-personal')}
                  sx={{
                    borderRadius: 2,
                    mb: 1,
                    backgroundColor: activeSection === 'info-personal' 
                      ? isDarkMode ? 'rgba(102, 126, 234, 0.2)' : 'rgba(102, 126, 234, 0.1)'
                      : 'transparent',
                    border: activeSection === 'info-personal' 
                      ? `1px solid ${isDarkMode ? 'rgba(102, 126, 234, 0.4)' : 'rgba(102, 126, 234, 0.3)'}` 
                      : '1px solid transparent',
                    color: activeSection === 'info-personal' 
                      ? '#667eea' 
                      : textColor,
                    '&:hover': {
                      backgroundColor: isDarkMode ? '#313244' : '#f5f5f5'
                    }
                  }}
                >
                  <ListItemIcon>
                    <PersonIcon sx={{ 
                      color: activeSection === 'info-personal' ? '#667eea' : textColor 
                    }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Info Personal" 
                    sx={{ 
                      '& .MuiListItemText-primary': { 
                        fontWeight: activeSection === 'info-personal' ? 600 : 500,
                        color: activeSection === 'info-personal' ? '#667eea' : textColor
                      } 
                    }} 
                  />
                </ListItem>

                <ListItem
                  button
                  onClick={() => setActiveSection('security')}
                  sx={{
                    borderRadius: 2,
                    mb: 1,
                    backgroundColor: activeSection === 'security' 
                      ? isDarkMode ? 'rgba(102, 126, 234, 0.2)' : 'rgba(102, 126, 234, 0.1)'
                      : 'transparent',
                    border: activeSection === 'security' 
                      ? `1px solid ${isDarkMode ? 'rgba(102, 126, 234, 0.4)' : 'rgba(102, 126, 234, 0.3)'}` 
                      : '1px solid transparent',
                    color: activeSection === 'security' 
                      ? '#667eea' 
                      : textColor,
                    '&:hover': {
                      backgroundColor: isDarkMode ? '#313244' : '#f5f5f5'
                    }
                  }}
                >
                  <ListItemIcon>
                    <SecurityIcon sx={{ 
                      color: activeSection === 'security' ? '#667eea' : textColor 
                    }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Keamanan" 
                    sx={{ 
                      '& .MuiListItemText-primary': { 
                        fontWeight: activeSection === 'security' ? 600 : 500,
                        color: activeSection === 'security' ? '#667eea' : textColor
                      } 
                    }} 
                  />
                </ListItem>

                <Divider sx={{ my: 2, backgroundColor: borderColor }} />

                <ListItem
                  button
                  sx={{
                    borderRadius: 2,
                    color: '#f38ba8',
                    '&:hover': {
                      backgroundColor: isDarkMode ? 'rgba(243, 139, 168, 0.1)' : 'rgba(229, 62, 62, 0.1)'
                    }
                  }}
                >
                  <ListItemIcon>
                    <LogoutIcon sx={{ color: '#f38ba8' }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Logout" 
                    sx={{ 
                      '& .MuiListItemText-primary': { 
                        fontWeight: 500,
                        color: '#f38ba8'
                      } 
                    }} 
                  />
                </ListItem>
              </List>
            </Paper>
          </Grid>

          {/* Main Content Area - Improved Width */}
          <Grid item xs={12} md={9} lg={9}>
            {activeSection === 'info-personal' && (
              <Paper 
                sx={{ 
                  backgroundColor: bgColor,
                  borderRadius: 3,
                  p: 4,
                  border: `1px solid ${borderColor}`,
                  boxShadow: isDarkMode 
                    ? '0 2px 8px rgba(0,0,0,0.3)' 
                    : '0 2px 8px rgba(0,0,0,0.08)',
                  width: '100%'
                }}
              >
                {/* Section Header */}
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 2, 
                  mb: 4
                }}>
                  <PersonIcon sx={{ color: textColor, fontSize: 28 }} />
                  <Typography variant="h4" sx={{ fontWeight: 700, color: textColor }}>
                    Info Personal
                  </Typography>
                </Box>

                {/* Profile Picture Section */}
                <Box sx={{ mb: 4 }}>
                  <Typography variant="body2" sx={{ 
                    color: textColor, 
                    fontWeight: 600, 
                    mb: 2 
                  }}>
                    Profile Picture
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                    <Box sx={{ position: 'relative' }}>
                      <Avatar sx={{ 
                        width: 80, 
                        height: 80,
                        background: 'linear-gradient(135deg, #a855f7 0%, #764ba2 100%)'
                      }}>
                        <PersonIcon sx={{ fontSize: 32 }} />
                      </Avatar>
                      <IconButton 
                        size="small"
                        sx={{ 
                          position: 'absolute',
                          bottom: -4,
                          right: -4,
                          backgroundColor: '#6366f1',
                          color: 'white',
                          width: 28,
                          height: 28,
                          '&:hover': {
                            backgroundColor: '#5856eb'
                          }
                        }}
                      >
                        <CameraIcon sx={{ fontSize: 14 }} />
                      </IconButton>
                    </Box>
                    <Box>
                      <Typography variant="body2" sx={{ 
                        fontWeight: 600, 
                        color: textColor, 
                        mb: 0.5 
                      }}>
                        Upload a new profile picture
                      </Typography>
                      <Typography variant="caption" sx={{ 
                        color: isDarkMode ? '#9399b2' : '#666' 
                      }}>
                        JPG, PNG, JPEG (max 5MB)
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                {/* Form Fields - Improved Layout */}
                <Box sx={{ 
                  display: 'flex',
                  flexDirection: 'column',
                  width: '1280px',
                  height: 'auto',
                  gap: 3,
                  mb: 4
                }}>
                  {/* Username */}
                  <Box>
                    <Typography variant="body2" sx={{ 
                      color: textColor, 
                      mb: 1, 
                      fontWeight: 600 
                    }}>
                      Username <span style={{ color: '#f38ba8' }}>*</span>
                    </Typography>
                    <TextField
                      fullWidth
                      placeholder="Masukkan username"
                      value={formData.username}
                      onChange={(e) => handleInputChange('username', e.target.value)}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          backgroundColor: inputBg,
                          borderRadius: 2,
                          '& fieldset': {
                            borderColor: borderColor,
                            borderWidth: 2
                          },
                          '&:hover fieldset': {
                            borderColor: '#8b5cf6',
                            borderWidth: 2
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#8b5cf6',
                            borderWidth: 2,
                            boxShadow: isDarkMode 
                              ? '0 0 0 3px rgba(139, 92, 246, 0.2)' 
                              : '0 0 0 3px rgba(139, 92, 246, 0.1)'
                          }
                        },
                        '& .MuiInputBase-input': {
                          color: textColor,
                          py: 1.5,
                          '&::placeholder': {
                            color: isDarkMode ? '#6c7086' : '#9ca3af',
                            opacity: 1
                          }
                        }
                      }}
                    />
                  </Box>

                  {/* Email Address */}
                  <Box>
                    <Typography variant="body2" sx={{ 
                      color: textColor, 
                      mb: 1, 
                      fontWeight: 600 
                    }}>
                      Email Address <span style={{ color: '#f38ba8' }}>*</span>
                    </Typography>
                    <TextField
                      fullWidth
                      type="email"
                      placeholder="Masukkan email address"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          backgroundColor: inputBg,
                          borderRadius: 2,
                          '& fieldset': {
                            borderColor: borderColor,
                            borderWidth: 2
                          },
                          '&:hover fieldset': {
                            borderColor: '#8b5cf6',
                            borderWidth: 2
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#8b5cf6',
                            borderWidth: 2,
                            boxShadow: isDarkMode 
                              ? '0 0 0 3px rgba(139, 92, 246, 0.2)' 
                              : '0 0 0 3px rgba(139, 92, 246, 0.1)'
                          }
                        },
                        '& .MuiInputBase-input': {
                          color: textColor,
                          py: 1.5,
                          '&::placeholder': {
                            color: isDarkMode ? '#6c7086' : '#9ca3af',
                            opacity: 1
                          }
                        }
                      }}
                    />
                  </Box>

                  {/* Nomor HP */}
                  <Box>
                    <Typography variant="body2" sx={{ 
                      color: textColor, 
                      mb: 1, 
                      fontWeight: 600 
                    }}>
                      Nomor HP
                    </Typography>
                    <TextField
                      fullWidth
                      type="tel"
                      placeholder="Masukkan nomor HP"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          backgroundColor: inputBg,
                          borderRadius: 2,
                          '& fieldset': {
                            borderColor: borderColor,
                            borderWidth: 2
                          },
                          '&:hover fieldset': {
                            borderColor: '#8b5cf6',
                            borderWidth: 2
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#8b5cf6',
                            borderWidth: 2,
                            boxShadow: isDarkMode 
                              ? '0 0 0 3px rgba(139, 92, 246, 0.2)' 
                              : '0 0 0 3px rgba(139, 92, 246, 0.1)'
                          }
                        },
                        '& .MuiInputBase-input': {
                          color: textColor,
                          py: 1.5,
                          '&::placeholder': {
                            color: isDarkMode ? '#6c7086' : '#9ca3af',
                            opacity: 1
                          }
                        }
                      }}
                    />
                  </Box>

                  {/* Instansi/Organisasi */}
                  <Box>
                    <Typography variant="body2" sx={{ 
                      color: textColor, 
                      mb: 1, 
                      fontWeight: 600 
                    }}>
                      Instansi/Organisasi
                    </Typography>
                    <TextField
                      fullWidth
                      placeholder="Masukkan instansi/organisasi"
                      value={formData.organization}
                      onChange={(e) => handleInputChange('organization', e.target.value)}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          backgroundColor: inputBg,
                          borderRadius: 2,
                          '& fieldset': {
                            borderColor: borderColor,
                            borderWidth: 2
                          },
                          '&:hover fieldset': {
                            borderColor: '#8b5cf6',
                            borderWidth: 2
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#8b5cf6',
                            borderWidth: 2,
                            boxShadow: isDarkMode 
                              ? '0 0 0 3px rgba(139, 92, 246, 0.2)' 
                              : '0 0 0 3px rgba(139, 92, 246, 0.1)'
                          }
                        },
                        '& .MuiInputBase-input': {
                          color: textColor,
                          py: 1.5,
                          '&::placeholder': {
                            color: isDarkMode ? '#6c7086' : '#9ca3af',
                            opacity: 1
                          }
                        }
                      }}
                    />
                  </Box>

                  {/* Posisi/Jabatan */}
                  <Box>
                    <Typography variant="body2" sx={{ 
                      color: textColor, 
                      mb: 1, 
                      fontWeight: 600 
                    }}>
                      Posisi/Jabatan
                    </Typography>
                    <TextField
                      fullWidth
                      placeholder="Masukkan posisi/jabatan"
                      value={formData.position}
                      onChange={(e) => handleInputChange('position', e.target.value)}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          backgroundColor: inputBg,
                          borderRadius: 2,
                          '& fieldset': {
                            borderColor: borderColor,
                            borderWidth: 2
                          },
                          '&:hover fieldset': {
                            borderColor: '#8b5cf6',
                            borderWidth: 2
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#8b5cf6',
                            borderWidth: 2,
                            boxShadow: isDarkMode 
                              ? '0 0 0 3px rgba(139, 92, 246, 0.2)' 
                              : '0 0 0 3px rgba(139, 92, 246, 0.1)'
                          }
                        },
                        '& .MuiInputBase-input': {
                          color: textColor,
                          py: 1.5,
                          '&::placeholder': {
                            color: isDarkMode ? '#6c7086' : '#9ca3af',
                            opacity: 1
                          }
                        }
                      }}
                    />
                  </Box>

                  {/* Lokasi/Kota */}
                  <Box>
                    <Typography variant="body2" sx={{ 
                      color: textColor, 
                      mb: 1, 
                      fontWeight: 600 
                    }}>
                      Lokasi/Kota
                    </Typography>
                    <TextField
                      fullWidth
                      placeholder="Masukkan lokasi/kota"
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          backgroundColor: inputBg,
                          borderRadius: 2,
                          '& fieldset': {
                            borderColor: borderColor,
                            borderWidth: 2
                          },
                          '&:hover fieldset': {
                            borderColor: '#8b5cf6',
                            borderWidth: 2
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#8b5cf6',
                            borderWidth: 2,
                            boxShadow: isDarkMode 
                              ? '0 0 0 3px rgba(139, 92, 246, 0.2)' 
                              : '0 0 0 3px rgba(139, 92, 246, 0.1)'
                          }
                        },
                        '& .MuiInputBase-input': {
                          color: textColor,
                          py: 1.5,
                          '&::placeholder': {
                            color: isDarkMode ? '#6c7086' : '#9ca3af',
                            opacity: 1
                          }
                        }
                      }}
                    />
                  </Box>
                </Box>

                {/* Action Buttons */}
                <Box sx={{ 
                  display: 'flex', 
                  gap: 2, 
                  pt: 3,
                  borderTop: `1px solid ${borderColor}`,
                  justifyContent: 'flex-end'
                }}>
                  <Button
                    variant="outlined"
                    onClick={handleCancel}
                    sx={{
                      color: textColor,
                      borderColor: borderColor,
                      textTransform: 'none',
                      fontWeight: 600,
                      px: 3,
                      py: 1.5,
                      borderRadius: 2,
                      '&:hover': {
                        borderColor: textColor,
                        backgroundColor: isDarkMode ? '#313244' : '#f5f5f5'
                      }
                    }}
                  >
                    Batalkan
                  </Button>
                  <Button
                    variant="contained"
                    onClick={handleSaveChanges}
                    sx={{
                      backgroundColor: '#764ba2',
                      color: 'white',
                      textTransform: 'none',
                      fontWeight: 600,
                      px: 3,
                      py: 1.5,
                      borderRadius: 2,
                      '&:hover': {
                        backgroundColor: '#6b46c1'
                      }
                    }}
                  >
                    Simpan Perubahan
                  </Button>
                </Box>
              </Paper>
            )}

            {activeSection === 'security' && (
              <Paper 
                sx={{ 
                  backgroundColor: bgColor,
                  borderRadius: 3,
                  p: 4,
                  border: `1px solid ${borderColor}`,
                  boxShadow: isDarkMode 
                    ? '0 2px 8px rgba(0,0,0,0.3)' 
                    : '0 2px 8px rgba(0,0,0,0.08)',
                  width: '100%'
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
                  <SecurityIcon sx={{ color: textColor, fontSize: 28 }} />
                  <Typography variant="h4" sx={{ fontWeight: 700, color: textColor }}>
                    Keamanan
                  </Typography>
                </Box>
                <Box sx={{ 
                  textAlign: 'center', 
                  py: 8,
                  color: isDarkMode ? '#9399b2' : '#666'
                }}>
                  <SecurityIcon sx={{ fontSize: 64, mb: 2, opacity: 0.5 }} />
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    Security settings will be available here
                  </Typography>
                  <Typography variant="body2">
                    Change password, two-factor authentication, etc.
                  </Typography>
                </Box>
              </Paper>
            )}
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default SDGSettingsPage;