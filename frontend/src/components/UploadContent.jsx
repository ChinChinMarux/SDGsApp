import React, { useState, useRef } from 'react';
import { useTheme, useMediaQuery } from '@mui/material';
import {
  Box,
  Typography,
  Button,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  LinearProgress,
  Alert,
  Snackbar
} from '@mui/material';
import {
  InsertDriveFile as FileIcon,
  Visibility as ViewIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Description as PdfIcon,
  TableChart as CsvIcon,
  Article as DocIcon,
  FileUploadOutlined
} from '@mui/icons-material';

const SDGUploadPage = ({ isDarkMode = false }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // State management
  const [state, setState] = useState({
    documentFiles: [],
    korpusFiles: [],
    dragOverDocument: false,
    dragOverKorpus: false,
    uploadProgress: {},
    previewDialog: { open: false, file: null },
    deleteDialog: { open: false, file: null, type: null },
    snackbar: { open: false, message: '', severity: 'success' }
  });

  const refs = {
    documentInput: useRef(null),
    korpusInput: useRef(null)
  };

  // Theme colors
  const colors = {
    bg: isDarkMode ? '#1e1e2e' : '#ffffff',
    text: isDarkMode ? '#e0e0e0' : '#2c3e50',
    border: isDarkMode ? '#333' : '#e9ecef',
    primary: '#6366f1',
    secondary: '#764ba2',
    error: '#e53e3e',
    success: '#38a169'
  };

  // File type configurations
  const fileTypes = {
    document: {
      'application/pdf': '.pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
      'text/plain': '.txt'
    },
    korpus: {
      'text/csv': '.csv',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': '.xlsx',
      'application/json': '.json'
    }
  };

  const maxFileSizeMB = 100;
  const maxFileSize = maxFileSizeMB * 1024 * 1024; // 50MB

  // Utility functions
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2) + ' ' + sizes[i]);
  };

  const getFileIcon = (file) => {
    const extension = file.name.split('.').pop().toLowerCase();
    const iconProps = { sx: { fontSize: isMobile ? 20 : 24 } };
    
    switch (extension) {
      case 'pdf': return <PdfIcon sx={{ color: colors.error }} {...iconProps} />;
      case 'csv': case 'xlsx': return <CsvIcon sx={{ color: colors.success }} {...iconProps} />;
      case 'docx': case 'txt': return <DocIcon sx={{ color: '#3182ce' }} {...iconProps} />;
      case 'json': return <FileIcon sx={{ color: '#f56500' }} {...iconProps} />;
      default: return <FileIcon sx={{ color: '#718096' }} {...iconProps} />;
    }
  };

  const validateFile = (file, type) => {
    if (!fileTypes[type][file.type]) {
      return { valid: false, error: `File type not supported` };
    }
    if (file.size > maxFileSize) {
      return { valid: false, error: `File exceeds ${formatFileSize(maxFileSize)} limit` };
    }
    return { valid: true };
  };

  // File handling functions
  const handleFileUpload = async (files, type) => {
    const validFiles = Array.from(files)
      .filter(file => {
        const validation = validateFile(file, type);
        if (!validation.valid) {
          showSnackbar(`${file.name}: ${validation.error}`, 'error');
          return false;
        }
        return true;
      })
      .map(file => ({
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        file,
        name: file.name,
        size: file.size,
        type: file.type,
        uploadDate: new Date().toLocaleDateString(),
        status: 'uploading'
      }));

    if (validFiles.length === 0) return;

    setState(prev => ({
      ...prev,
      [`${type}Files`]: [...prev[`${type}Files`], ...validFiles]
    }));

    // Simulate upload progress
    for (const file of validFiles) {
      await simulateUpload(file.id, type);
    }
  };

  const simulateUpload = async (fileId, type) => {
    const duration = 1500 + Math.random() * 2000; // 1.5-3.5 seconds
    const steps = 20;
    
    for (let i = 0; i <= steps; i++) {
      await new Promise(resolve => setTimeout(resolve, duration / steps));
      const progress = Math.min(100, (i / steps) * 100);
      
      setState(prev => ({
        ...prev,
        uploadProgress: { ...prev.uploadProgress, [fileId]: progress }
      }));

      if (i === steps) {
        // Mark upload as complete
        setState(prev => ({
          ...prev,
          [`${type}Files`]: prev[`${type}Files`].map(f => 
            f.id === fileId ? { ...f, status: 'completed' } : f
          ),
          uploadProgress: Object.fromEntries(
            Object.entries(prev.uploadProgress).filter(([id]) => id !== fileId)
          )
        }));
        
        showSnackbar('File uploaded successfully!', 'success');
      }
    }
  };

  // UI Components
  const FileListItem = ({ file, type }) => (
    <ListItem
      sx={{
        border: `1px solid ${colors.border}`,
        borderRadius: '12px',
        mb: 1,
        p: isMobile ? 1 : 2,
        bgcolor: colors.bg,
        transition: 'all 0.2s ease',
        '&:hover': { transform: 'translateX(2px)' }
      }}
    >
      <ListItemIcon sx={{ minWidth: isMobile ? 44 : 56 }}>
        <Box sx={{
          width: isMobile ? 36 : 44,
          height: isMobile ? 36 : 44,
          borderRadius: '10px',
          bgcolor: isDarkMode ? '#2b2b3a' : '#f5f7fa',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {getFileIcon(file)}
        </Box>
      </ListItemIcon>
      
      <ListItemText
        primary={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography sx={{
              fontWeight: 600,
              fontSize: isMobile ? '0.875rem' : '1rem',
              color: colors.text,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              maxWidth: isMobile ? '150px' : '300px'
            }}>
              {file.name}
            </Typography>
            {file.status === 'completed' && (
              <CheckCircleIcon sx={{ color: colors.success, fontSize: isMobile ? 16 : 20 }} />
            )}
          </Box>
        }
        secondary={
          <Box>
            <Typography sx={{
              fontSize: isMobile ? '0.75rem' : '0.875rem',
              color: isDarkMode ? '#aaa' : '#666'
            }}>
              {formatFileSize(file.size)} • {file.uploadDate}
            </Typography>
            {state.uploadProgress[file.id] !== undefined && (
              <Box sx={{ mt: 0.5 }}>
                <LinearProgress 
                  variant="determinate" 
                  value={state.uploadProgress[file.id]} 
                  sx={{ height: 6, borderRadius: '4px' }}
                />
                <Typography sx={{ 
                  fontSize: '0.75rem',
                  color: isDarkMode ? '#aaa' : '#666'
                }}>
                  {Math.round(state.uploadProgress[file.id])}% uploaded
                </Typography>
              </Box>
            )}
          </Box>
        }
        sx={{ my: 0 }}
      />
      
      <ListItemSecondaryAction>
        <Box sx={{ display: 'flex', gap: isMobile ? 0.5 : 1 }}>
          <IconButton 
            size="small"
            onClick={() => setState(prev => ({ 
              ...prev, 
              previewDialog: { open: true, file } 
            }))}
            sx={{ 
              color: colors.primary,
              p: isMobile ? 0.5 : 1
            }}
          >
            <ViewIcon fontSize={isMobile ? 'small' : 'medium'} />
          </IconButton>
          <IconButton 
            size="small"
            onClick={() => setState(prev => ({ 
              ...prev, 
              deleteDialog: { open: true, file, type } 
            }))}
            sx={{ 
              color: colors.error,
              p: isMobile ? 0.5 : 1
            }}
          >
            <DeleteIcon fontSize={isMobile ? 'small' : 'medium'} />
          </IconButton>
        </Box>
      </ListItemSecondaryAction>
    </ListItem>
  );

  const UploadZone = ({ type }) => {
    const isDragOver = state[`dragOver${type.charAt(0).toUpperCase() + type.slice(1)}`];
    const zoneColor = type === 'document' ? colors.primary : colors.secondary;
    
    return (
      <Box
        onDragOver={(e) => {
          e.preventDefault();
          setState(prev => ({ ...prev, [`dragOver${type.charAt(0).toUpperCase() + type.slice(1)}`]: true }));
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          setState(prev => ({ ...prev, [`dragOver${type.charAt(0).toUpperCase() + type.slice(1)}`]: false }));
        }}
        onDrop={(e) => {
          e.preventDefault();
          setState(prev => ({ ...prev, [`dragOver${type.charAt(0).toUpperCase() + type.slice(1)}`]: false }));
          handleFileUpload(e.dataTransfer.files, type);
        }}
        onClick={() => refs[`${type}Input`].current?.click()}
        sx={{
          border: `2px dashed ${isDragOver ? zoneColor : colors.border}`,
          borderRadius: '12px',
          p: isMobile ? 3 : 4,
          textAlign: 'center',
          bgcolor: isDragOver ? `${zoneColor}08` : 'transparent',
          transition: 'all 0.3s ease',
          cursor: 'pointer',
          '&:hover': {
            borderColor: zoneColor,
            bgcolor: `${zoneColor}04`
          }
        }}
      >
        <FileUploadOutlined sx={{ 
          fontSize: isMobile ? 36 : 48, 
          color: isDragOver ? zoneColor : '#9ca3af',
          mb: isMobile ? 1 : 2
        }} />
        <Typography sx={{ 
          fontWeight: 600, 
          fontSize: isMobile ? '1rem' : '1.125rem',
          color: colors.text,
          mb: isMobile ? 0.5 : 1
        }}>
          Drop {type === 'document' ? 'documents' : 'corpus'} here
        </Typography>
        <Typography sx={{ 
          fontSize: isMobile ? '0.75rem' : '0.875rem',
          color: isDarkMode ? '#aaa' : '#666',
          mb: isMobile ? 2 : 3
        }}>
          Supported: {Object.values(fileTypes[type]).join(', ')} (max {maxFileSizeMB}MB)
        </Typography>
        <Button
          variant="contained"
          sx={{
            bgcolor: zoneColor,
            color: 'white',
            textTransform: 'none',
            fontWeight: 600,
            px: isMobile ? 3 : 4,
            py: isMobile ? 0.75 : 1,
            borderRadius: '8px',
            fontSize: isMobile ? '0.875rem' : '1rem',
            '&:hover': {
              bgcolor: zoneColor
            }
          }}
        >
          Select Files
        </Button>
        <input
          ref={refs[`${type}Input`]}
          type="file"
          multiple
          accept={Object.values(fileTypes[type]).join(',')}
          onChange={(e) => handleFileUpload(e.target.files, type)}
          style={{ display: 'none' }}
        />
      </Box>
    );
  };

  // Helper functions
  const showSnackbar = (message, severity) => {
    setState(prev => ({ ...prev, snackbar: { open: true, message, severity } }));
  };

  return (
    <Box sx={{ 
      minHeight: '100vh',
      bgcolor: isDarkMode ? 'background.default' : 'grey.50',
      pb: isMobile ? 2 : 0
    }}>
      <Box sx={{ 
        maxWidth: 'lg',
        mx: 'auto',
        px: isMobile ? 1.5 : 3,
        py: isMobile ? 1 : 2
      }}>
        {/* Page Header */}
        <Typography variant="h5" sx={{ 
          fontWeight: 700,
          color: colors.text,
          mt: isMobile ? 1 : 3,
          mb: isMobile ? 2 : 4,
          fontSize: isMobile ? '1.5rem' : '2rem'
        }}>
          Upload Documents/Corpus
        </Typography>

        {/* Corpus Upload Section */}
        <Paper sx={{ 
          p: isMobile ? 2 : 3,
          mb: isMobile ? 2 : 3,
          borderRadius: '12px',
          bgcolor: colors.bg,
          border: `1px solid ${colors.border}`,
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
        }}>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            mb: isMobile ? 2 : 3
          }}>
            <Typography sx={{ 
              fontWeight: 600,
              fontSize: isMobile ? '1.125rem' : '1.25rem',
              color: colors.text
            }}>
              Upload Corpus
            </Typography>
            <Chip 
              label={`${state.korpusFiles.length} file${state.korpusFiles.length !== 1 ? 's' : ''}`}
              size="small"
              sx={{ 
                bgcolor: colors.secondary,
                color: 'white',
                fontSize: isMobile ? '0.75rem' : '0.875rem'
              }}
            />
          </Box>
          
          <UploadZone type="korpus" />
          
          <Box sx={{ mt: isMobile ? 2 : 3 }}>
            <Typography sx={{ 
              fontWeight: 600,
              fontSize: isMobile ? '1rem' : '1.125rem',
              color: colors.text,
              mb: isMobile ? 1 : 2
            }}>
              Uploaded Corpus
            </Typography>
            {state.korpusFiles.length === 0 ? (
              <Typography sx={{ 
                textAlign: 'center',
                color: isDarkMode ? '#aaa' : '#666',
                fontSize: isMobile ? '0.875rem' : '1rem',
                py: 2
              }}>
                No files uploaded yet
              </Typography>
            ) : (
              <List sx={{ p: 0 }}>
                {state.korpusFiles.map(file => (
                  <FileListItem key={file.id} file={file} type="korpus" />
                ))}
              </List>
            )}
          </Box>
        </Paper>

        {/* Preview Dialog */}
        <Dialog
          open={state.previewDialog.open}
          onClose={() => setState(prev => ({ ...prev, previewDialog: { ...prev.previewDialog, open: false } }))}
          maxWidth="sm"
          fullWidth
          fullScreen={isMobile}
        >
          <DialogTitle sx={{ 
            fontSize: isMobile ? '1.125rem' : '1.25rem',
            bgcolor: isDarkMode ? '#2b2b3a' : '#f8fafc'
          }}>
            File Preview
          </DialogTitle>
          <DialogContent sx={{ p: isMobile ? 2 : 3 }}>
            {state.previewDialog.file && (
              <Box>
                <Typography variant="h6" sx={{ 
                  fontSize: isMobile ? '1rem' : '1.125rem',
                  mb: 1
                }}>
                  {state.previewDialog.file.name}
                </Typography>
                <Typography variant="body2" sx={{ 
                  color: 'text.secondary',
                  fontSize: isMobile ? '0.8125rem' : '0.875rem',
                  mb: 2
                }}>
                  {formatFileSize(state.previewDialog.file.size)} • {state.previewDialog.file.type}
                </Typography>
                <Box sx={{ 
                  p: 3,
                  borderRadius: '8px',
                  bgcolor: isDarkMode ? '#2b2b3a' : '#f5f7fa',
                  textAlign: 'center'
                }}>
                  {getFileIcon(state.previewDialog.file)}
                  <Typography sx={{ mt: 2, color: 'text.secondary' }}>
                    File preview functionality will be implemented with actual content
                  </Typography>
                </Box>
              </Box>
            )}
          </DialogContent>
          <DialogActions sx={{ 
            p: isMobile ? 2 : 3,
            bgcolor: isDarkMode ? '#2b2b3a' : '#f8fafc'
          }}>
            <Button 
              onClick={() => setState(prev => ({ ...prev, previewDialog: { ...prev.previewDialog, open: false } }))}
              sx={{ 
                textTransform: 'none',
                fontSize: isMobile ? '0.875rem' : '1rem'
              }}
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={state.deleteDialog.open}
          onClose={() => setState(prev => ({ ...prev, deleteDialog: { ...prev.deleteDialog, open: false } }))}
          maxWidth="xs"
          fullWidth
        >
          <DialogTitle sx={{ fontSize: isMobile ? '1.125rem' : '1.25rem' }}>
            Confirm Delete
          </DialogTitle>
          <DialogContent sx={{ p: isMobile ? 2 : 3 }}>
            <Typography sx={{ fontSize: isMobile ? '0.875rem' : '1rem' }}>
              Are you sure you want to delete "{state.deleteDialog.file?.name}"?
            </Typography>
          </DialogContent>
          <DialogActions sx={{ p: isMobile ? 2 : 3 }}>
            <Button 
              onClick={() => setState(prev => ({ ...prev, deleteDialog: { ...prev.deleteDialog, open: false } }))}
              sx={{ 
                textTransform: 'none',
                fontSize: isMobile ? '0.875rem' : '1rem'
              }}
            >
              Cancel
            </Button>
            <Button 
              onClick={() => {
                const { file, type } = state.deleteDialog;
                setState(prev => ({
                  ...prev,
                  [`${type}Files`]: prev[`${type}Files`].filter(f => f.id !== file.id),
                  deleteDialog: { ...prev.deleteDialog, open: false }
                }));
                showSnackbar('File deleted successfully', 'success');
              }}
              color="error"
              variant="contained"
              sx={{ 
                textTransform: 'none',
                fontSize: isMobile ? '0.875rem' : '1rem'
              }}
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar Notification */}
        <Snackbar
          open={state.snackbar.open}
          autoHideDuration={6000}
          onClose={() => setState(prev => ({ ...prev, snackbar: { ...prev.snackbar, open: false } }))}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert
            onClose={() => setState(prev => ({ ...prev, snackbar: { ...prev.snackbar, open: false } }))}
            severity={state.snackbar.severity}
            sx={{ 
              width: '100%',
              fontSize: isMobile ? '0.875rem' : '1rem'
            }}
          >
            {state.snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
};

export default SDGUploadPage;