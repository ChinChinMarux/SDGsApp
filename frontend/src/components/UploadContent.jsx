import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  AppBar,
  Toolbar,
  Tab,
  Tabs,
  IconButton,
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Description as DocumentIcon,
  Analytics as AnalyticsIcon,
  Upload as UploadIcon,
  AccountCircle as AccountIcon,
  CloudUpload as CloudUploadIcon,
  InsertDriveFile as FileIcon,
  Visibility as ViewIcon
} from '@mui/icons-material';

const SDGUploadPage = ({ isDarkMode = false }) => {
  const [activeTab, setActiveTab] = useState(3); // Upload tab active
  const [dragOverDocument, setDragOverDocument] = useState(false);
  const [dragOverKorpus, setDragOverKorpus] = useState(false);

  const bgColor = isDarkMode ? '#2b2b3a' : '#ffffff';
  const textColor = isDarkMode ? '#e0e0e0' : '#2c3e50';
  const borderColor = isDarkMode ? '#333' : '#e9ecef';
  const appBarColor = isDarkMode ? '#1e1e2e' : '#ffffff';

  // Mock data for recent uploads
  const recentUploads = [
    { 
      name: 'Climate Policy Report 2024.pdf', 
      size: '2.4MB', 
      date: '2025-07-19',
      type: 'pdf'
    },
    { 
      name: 'Climate Policy Report 2024.csv', 
      size: '10.0MB', 
      date: '2025-07-19',
      type: 'csv'
    },
    { 
      name: 'Climate Policy Report 2024.docx', 
      size: '2.0MB', 
      date: '2025-07-19',
      type: 'docx'
    },
    { 
      name: 'Climate Policy Report 2024.xlsx', 
      size: '8.0MB', 
      date: '2025-07-19',
      type: 'xlsx'
    },
    { 
      name: 'Climate Policy Report 2024.csv', 
      size: '22.7MB', 
      date: '2025-07-19',
      type: 'csv'
    }
  ];

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleDocumentDragOver = (e) => {
    e.preventDefault();
    setDragOverDocument(true);
  };

  const handleDocumentDragLeave = (e) => {
    e.preventDefault();
    setDragOverDocument(false);
  };

  const handleDocumentDrop = (e) => {
    e.preventDefault();
    setDragOverDocument(false);
    // Handle file drop logic here
  };

  const handleKorpusDragOver = (e) => {
    e.preventDefault();
    setDragOverKorpus(true);
  };

  const handleKorpusDragLeave = (e) => {
    e.preventDefault();
    setDragOverKorpus(false);
  };

  const handleKorpusDrop = (e) => {
    e.preventDefault();
    setDragOverKorpus(false);
    // Handle file drop logic here
  };

  const getFileIcon = (type) => {
    switch (type) {
      case 'pdf':
        return '#e53e3e';
      case 'csv':
        return '#38a169';
      case 'docx':
        return '#3182ce';
      case 'xlsx':
        return '#38a169';
      default:
        return '#718096';
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: isDarkMode ? 'rgba(26, 26, 46, 0)' : 'rgba(245, 245, 245, 0)' }}>
      {/* Main Content */}
      <Box sx={{ maxWidth: '1440px', margin: '0 auto', p: 2 }}>
        {/* Page Title */}
        <Typography variant="h4" sx={{ 
          fontWeight: 700, 
          color: textColor, 
          mt: 3, 
          mb: 4 
        }}>
          Upload Dokumen/Korpus
        </Typography>

        {/* Upload Dokumen Section */}
        <Paper 
          sx={{ 
            backgroundColor: bgColor,
            borderRadius: 3,
            p: 3,
            mb: 3,
            border: `1px solid ${borderColor}`,
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600, color: textColor, mb: 3 }}>
            Upload Dokumen
          </Typography>
          
          <Box
            onDragOver={handleDocumentDragOver}
            onDragLeave={handleDocumentDragLeave}
            onDrop={handleDocumentDrop}
            sx={{
              border: `2px dashed ${dragOverDocument ? '#6366f1' : borderColor}`,
              borderRadius: 2,
              p: 6,
              textAlign: 'center',
              backgroundColor: dragOverDocument ? 'rgba(99, 102, 241, 0.05)' : 'transparent',
              transition: 'all 0.3s ease',
              cursor: 'pointer',
              '&:hover': {
                borderColor: '#6366f1',
                backgroundColor: 'rgba(99, 102, 241, 0.02)'
              }
            }}
          >
            <CloudUploadIcon sx={{ 
              fontSize: 48, 
              color: dragOverDocument ? '#6366f1' : '#9ca3af',
              mb: 2
            }} />
            <Typography variant="h6" sx={{ 
              color: textColor, 
              fontWeight: 600, 
              mb: 1 
            }}>
              Drop documents here
            </Typography>
            <Typography variant="body2" sx={{ 
              color: isDarkMode ? '#aaa' : '#666',
              mb: 3
            }}>
              Support: DOCX, PDF, TXT (max 50MB)
            </Typography>
            <Button
              variant="contained"
              sx={{
                backgroundColor: '#6366f1',
                color: 'white',
                textTransform: 'none',
                fontWeight: 600,
                px: 4,
                py: 1.5,
                borderRadius: 2,
                '&:hover': {
                  backgroundColor: '#5856eb'
                }
              }}
            >
              Choose File
            </Button>
          </Box>
        </Paper>

        {/* Upload Korpus Section */}
        <Paper 
          sx={{ 
            backgroundColor: bgColor,
            borderRadius: 3,
            p: 3,
            mb: 3,
            border: `1px solid ${borderColor}`,
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600, color: textColor, mb: 3 }}>
            Upload Korpus
          </Typography>
          
          <Box
            onDragOver={handleKorpusDragOver}
            onDragLeave={handleKorpusDragLeave}
            onDrop={handleKorpusDrop}
            sx={{
              border: `2px dashed ${dragOverKorpus ? '#764ba2' : borderColor}`,
              borderRadius: 2,
              p: 6,
              textAlign: 'center',
              backgroundColor: dragOverKorpus ? 'rgba(118, 75, 162, 0.05)' : 'transparent',
              transition: 'all 0.3s ease',
              cursor: 'pointer',
              '&:hover': {
                borderColor: '#764ba2',
                backgroundColor: 'rgba(118, 75, 162, 0.02)'
              }
            }}
          >
            <FileIcon sx={{ 
              fontSize: 48, 
              color: dragOverKorpus ? '#764ba2' : '#9ca3af',
              mb: 2
            }} />
            <Typography variant="h6" sx={{ 
              color: textColor, 
              fontWeight: 600, 
              mb: 1 
            }}>
              Drop corpus here
            </Typography>
            <Typography variant="body2" sx={{ 
              color: isDarkMode ? '#aaa' : '#666',
              mb: 3
            }}>
              Support: CSV, XLSX, JSON (max 50MB)
            </Typography>
            <Button
              variant="contained"
              sx={{
                backgroundColor: '#764ba2',
                color: 'white',
                textTransform: 'none',
                fontWeight: 600,
                px: 4,
                py: 1.5,
                borderRadius: 2,
                '&:hover': {
                  backgroundColor: '#6b46c1'
                }
              }}
            >
              Choose File
            </Button>
          </Box>
        </Paper>

        {/* Recent Uploads Section */}
        <Paper 
          sx={{ 
            backgroundColor: bgColor,
            borderRadius: 3,
            p: 3,
            border: `1px solid ${borderColor}`,
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, color: textColor }}>
              Recent Uploads
            </Typography>
            <Button
              variant="text"
              sx={{
                color: '#6366f1',
                textTransform: 'none',
                fontWeight: 600,
                '&:hover': {
                  backgroundColor: 'rgba(99, 102, 241, 0.1)'
                }
              }}
            >
              View All
            </Button>
          </Box>
          
          <List sx={{ p: 0 }}>
            {recentUploads.map((file, index) => (
              <ListItem
                key={index}
                sx={{
                  border: `1px solid ${borderColor}`,
                  borderRadius: 2,
                  mb: 1,
                  backgroundColor: bgColor,
                  '&:hover': {
                    backgroundColor: isDarkMode ? '#333' : '#f8fafc',
                    transform: 'translateX(4px)',
                    transition: 'all 0.2s ease'
                  }
                }}
              >
                <ListItemIcon>
                  <Box sx={{
                    width: 40,
                    height: 40,
                    borderRadius: 2,
                    backgroundColor: getFileIcon(file.type),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <FileIcon sx={{ color: 'white', fontSize: 20 }} />
                  </Box>
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography variant="body1" sx={{ 
                      fontWeight: 600, 
                      color: textColor 
                    }}>
                      {file.name}
                    </Typography>
                  }
                  secondary={
                    <Typography variant="body2" sx={{ 
                      color: isDarkMode ? '#aaa' : '#666' 
                    }}>
                      {file.size} • {file.date}
                    </Typography>
                  }
                />
                <ListItemSecondaryAction>
                  <IconButton 
                    size="small"
                    sx={{ 
                      color: '#6366f1',
                      '&:hover': {
                        backgroundColor: 'rgba(99, 102, 241, 0.1)'
                      }
                    }}
                  >
                    <ViewIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </Paper>
      </Box>
    </Box>
  );
};

export default SDGUploadPage;