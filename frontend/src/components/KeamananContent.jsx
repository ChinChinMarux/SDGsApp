import React, { useState } from 'react';
import {
  Box, Typography, TextField, Button, Paper, Grid, Alert
} from '@mui/material';
import {
  Security as SecurityIcon,
  Info as InfoIcon
} from '@mui/icons-material';

const KeamananContent = ({ isDarkMode }) => {
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const textColor = isDarkMode ? '#cdd6f4' : '#2c3e50';
  const borderColor = isDarkMode ? '#313244' : '#e9ecef';
  const inputBg = isDarkMode ? '#1e1e2e' : '#ffffff';
  const bgColor = isDarkMode ? '#1e1e2e' : '#ffffff';

  const handleInputChange = (field, value) => {
    setPasswordData(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveChanges = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('Password baru dan konfirmasi password tidak cocok!');
      return;
    }
    console.log('Saving password changes:', passwordData);
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  const handleCancel = () => {
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Paper 
        sx={{ 
          backgroundColor: bgColor,
          borderRadius: 3,
          p: 4,
          border: `1px solid ${borderColor}`,
          width: '100%',
          boxShadow: isDarkMode ? '0 4px 20px rgba(0,0,0,0.5)' : '0 4px 20px rgba(0,0,0,0.1)'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
          <SecurityIcon sx={{ color: textColor, fontSize: 28 }} />
          <Typography variant="h4" sx={{ fontWeight: 700, color: textColor }}>
            Keamanan
          </Typography>
        </Box>

        <Alert 
          icon={<InfoIcon />} 
          severity="warning"
          sx={{ 
            mb: 4,
            backgroundColor: isDarkMode ? 'rgba(249, 226, 175, 0.1)' : 'rgba(255, 243, 205, 0.44)',
            color: isDarkMode ? '#f9e2af' : '#92400e',
            border: `1px solid ${isDarkMode ? 'rgba(249, 226, 175, 0.2)' : 'rgba(217, 119, 6, 0.2)'}`,
            '& .MuiAlert-icon': {
              color: isDarkMode ? '#f9e2af' : '#92400e'
            }
          }}
        >
          <Typography variant="body1" sx={{ fontWeight: 600, mb: 0.5 }}>
            Password Security
          </Typography>
          <Typography variant="body2">
            Use a strong password with at least 8 characters, including numbers and special characters.
          </Typography>
        </Alert>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mb: 4 }}>
          {['currentPassword', 'newPassword', 'confirmPassword'].map((field, index) => (
            <Box key={field}>
              <Typography variant="body2" sx={{ color: textColor, mb: 1, fontWeight: 600 }}>
                {field === 'currentPassword' ? 'Current Password' : field === 'newPassword' ? 'New Password' : 'Confirm New Password'}
              </Typography>
              <TextField
                fullWidth
                type="password"
                placeholder={
                  field === 'currentPassword'
                    ? 'Masukkan password saat ini'
                    : field === 'newPassword'
                    ? 'Masukkan password baru'
                    : 'Konfirmasi password baru'
                }
                value={passwordData[field]}
                onChange={(e) => handleInputChange(field, e.target.value)}
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
          ))}

          <Box sx={{ backgroundColor: isDarkMode ? '#313244' : '#f8f9fa', borderRadius: 2, p: 3, border: `1px solid ${borderColor}` }}>
            <Typography variant="body2" sx={{ color: textColor, mb: 2, fontWeight: 600 }}>
              Password Requirements:
            </Typography>
            <Box component="ul" sx={{ margin: 0, paddingLeft: 2, color: isDarkMode ? '#9399b2' : '#666' }}>
              <Typography component="li" variant="body2" sx={{ mb: 0.5 }}>
                At least 8 characters long
              </Typography>
              <Typography component="li" variant="body2" sx={{ mb: 0.5 }}>
                Contains uppercase and lowercase letters
              </Typography>
              <Typography component="li" variant="body2" sx={{ mb: 0.5 }}>
                Contains at least one number
              </Typography>
              <Typography component="li" variant="body2">
                Contains at least one special character
              </Typography>
            </Box>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: 2, pt: 3, borderTop: `1px solid ${borderColor}`, justifyContent: 'flex-end' }}>
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
    </Box>
  );
};

export default KeamananContent;