import React, { useState, useRef } from 'react';
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
  const [documentFiles, setDocumentFiles] = useState([]);
  const [korpusFiles, setKorpusFiles] = useState([]);
  const [dragOverDocument, setDragOverDocument] = useState(false);
  const [dragOverKorpus, setDragOverKorpus] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [previewDialog, setPreviewDialog] = useState({ open: false, file: null });
  const [deleteDialog, setDeleteDialog] = useState({ open: false, file: null, type: null });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const documentInputRef = useRef(null);
  const korpusInputRef = useRef(null);

  const bgColor = isDarkMode ? '#2b2b3a' : '#ffffff';
  const textColor = isDarkMode ? '#e0e0e0' : '#2c3e50';
  const borderColor = isDarkMode ? '#333' : '#e9ecef';

  // Allowed file types
  const documentTypes = {
    'application/pdf': '.pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
    'text/plain': '.txt'
  };

  const korpusTypes = {
    'text/csv': '.csv',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': '.xlsx',
    'application/json': '.json'
  };

  const maxFileSize = 50 * 1024 * 1024; // 50MB

  // Utility functions
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (file) => {
    const extension = file.name.split('.').pop().toLowerCase();
    switch (extension) {
      case 'pdf':
        return <PdfIcon sx={{ color: '#e53e3e' }} />;
      case 'csv':
      case 'xlsx':
        return <CsvIcon sx={{ color: '#38a169' }} />;
      case 'docx':
      case 'txt':
        return <DocIcon sx={{ color: '#3182ce' }} />;
      case 'json':
        return <FileIcon sx={{ color: '#f56500' }} />;
      default:
        return <FileIcon sx={{ color: '#718096' }} />;
    }
  };

  const validateFile = (file, allowedTypes) => {
    if (!allowedTypes[file.type]) {
      return { valid: false, error: `File type ${file.type} not supported` };
    }
    if (file.size > maxFileSize) {
      return { valid: false, error: `File size exceeds 50MB limit` };
    }
    return { valid: true };
  };

  const generateFileId = () => {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  };

  // File handling functions
  const handleFileUpload = async (files, type) => {
    const fileList = Array.from(files);
    const allowedTypes = type === 'document' ? documentTypes : korpusTypes;
    const validFiles = [];

    for (const file of fileList) {
      const validation = validateFile(file, allowedTypes);
      if (validation.valid) {
        const fileWithId = {
          id: generateFileId(),
          file: file,
          name: file.name,
          size: file.size,
          type: file.type,
          uploadDate: new Date().toISOString().split('T')[0],
          status: 'uploading'
        };
        validFiles.push(fileWithId);
      } else {
        showSnackbar(validation.error, 'error');
      }
    }

    if (validFiles.length > 0) {
      const setFiles = type === 'document' ? setDocumentFiles : setKorpusFiles;
      setFiles(prev => [...prev, ...validFiles]);

      // Simulate upload progress
      for (const fileWithId of validFiles) {
        await simulateUpload(fileWithId.id);
      }
    }
  };

  const simulateUpload = async (fileId) => {
    const duration = 2000 + Math.random() * 3000; // 2-5 seconds
    const steps = 20;
    const stepDuration = duration / steps;

    for (let i = 0; i <= steps; i++) {
      await new Promise(resolve => setTimeout(resolve, stepDuration));
      const progress = (i / steps) * 100;
      
      setUploadProgress(prev => ({
        ...prev,
        [fileId]: progress
      }));

      if (i === steps) {
        // Update file status to completed
        setDocumentFiles(prev => prev.map(f => 
          f.id === fileId ? { ...f, status: 'completed' } : f
        ));
        setKorpusFiles(prev => prev.map(f => 
          f.id === fileId ? { ...f, status: 'completed' } : f
        ));
        
        // Remove progress tracking
        setUploadProgress(prev => {
          const newProgress = { ...prev };
          delete newProgress[fileId];
          return newProgress;
        });
        
        showSnackbar('File uploaded successfully!', 'success');
      }
    }
  };

  // Drag and drop handlers
  const handleDragOver = (e, type) => {
    e.preventDefault();
    if (type === 'document') {
      setDragOverDocument(true);
    } else {
      setDragOverKorpus(true);
    }
  };

  const handleDragLeave = (e, type) => {
    e.preventDefault();
    if (type === 'document') {
      setDragOverDocument(false);
    } else {
      setDragOverKorpus(false);
    }
  };

  const handleDrop = (e, type) => {
    e.preventDefault();
    if (type === 'document') {
      setDragOverDocument(false);
    } else {
      setDragOverKorpus(false);
    }
    
    const files = e.dataTransfer.files;
    handleFileUpload(files, type);
  };

  // File input handlers
  const handleFileInputChange = (e, type) => {
    const files = e.target.files;
    if (files.length > 0) {
      handleFileUpload(files, type);
    }
    // Reset input value
    e.target.value = '';
  };

  // File management functions
  const handleViewFile = (file) => {
    setPreviewDialog({ open: true, file });
  };

  const handleDeleteFile = (file, type) => {
    setDeleteDialog({ open: true, file, type });
  };

  const confirmDelete = () => {
    if (deleteDialog.type === 'document') {
      setDocumentFiles(prev => prev.filter(f => f.id !== deleteDialog.file.id));
    } else {
      setKorpusFiles(prev => prev.filter(f => f.id !== deleteDialog.file.id));
    }
    setDeleteDialog({ open: false, file: null, type: null });
    showSnackbar('File deleted successfully!', 'success');
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const renderFileList = (files, type) => {
    if (files.length === 0) {
      return (
        <Typography variant="body2" sx={{ 
          color: isDarkMode ? '#aaa' : '#666',
          textAlign: 'center',
          py: 2
        }}>
          No files uploaded yet
        </Typography>
      );
    }

    return (
      <List sx={{ p: 0 }}>
        {files.map((file, index) => (
          <ListItem
            key={file.id}
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
                backgroundColor: 'rgba(99, 102, 241, 0.1)',
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
                  <Typography variant="body1" sx={{ 
                    fontWeight: 600, 
                    color: textColor 
                  }}>
                    {file.name}
                  </Typography>
                  {file.status === 'completed' && (
                    <CheckCircleIcon sx={{ color: '#38a169', fontSize: 16 }} />
                  )}
                  {file.status === 'error' && (
                    <ErrorIcon sx={{ color: '#e53e3e', fontSize: 16 }} />
                  )}
                </Box>
              }
              secondary={
                <Box>
                  <Typography variant="body2" sx={{ 
                    color: isDarkMode ? '#aaa' : '#666' 
                  }}>
                    {formatFileSize(file.size)} • {file.uploadDate}
                  </Typography>
                  {uploadProgress[file.id] !== undefined && (
                    <Box sx={{ mt: 1 }}>
                      <LinearProgress 
                        variant="determinate" 
                        value={uploadProgress[file.id]} 
                        sx={{ borderRadius: 1 }}
                      />
                      <Typography variant="caption" sx={{ color: isDarkMode ? '#aaa' : '#666' }}>
                        {Math.round(uploadProgress[file.id])}% uploaded
                      </Typography>
                    </Box>
                  )}
                </Box>
              }
            />
            <ListItemSecondaryAction>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <IconButton 
                  size="small"
                  onClick={() => handleViewFile(file)}
                  sx={{ 
                    color: '#6366f1',
                    '&:hover': {
                      backgroundColor: 'rgba(99, 102, 241, 0.1)'
                    }
                  }}
                >
                  <ViewIcon />
                </IconButton>
                <IconButton 
                  size="small"
                  onClick={() => handleDeleteFile(file, type)}
                  sx={{ 
                    color: '#e53e3e',
                    '&:hover': {
                      backgroundColor: 'rgba(229, 62, 62, 0.1)'
                    }
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    );
  };

  const renderUploadZone = (type, dragOver, allowedTypes) => {
    const isDocument = type === 'document';
    const color = isDocument ? '#6366f1' : '#764ba2';
    const hoverColor = isDocument ? '#5856eb' : '#6b46c1';

    return (
      <Box
        onDragOver={(e) => handleDragOver(e, type)}
        onDragLeave={(e) => handleDragLeave(e, type)}
        onDrop={(e) => handleDrop(e, type)}
        sx={{
          border: `2px dashed ${dragOver ? color : borderColor}`,
          borderRadius: 2,
          p: 6,
          textAlign: 'center',
          backgroundColor: dragOver ? `${color}05` : 'transparent',
          transition: 'all 0.3s ease',
          cursor: 'pointer',
          '&:hover': {
            borderColor: color,
            backgroundColor: `${color}02`
          }
        }}
      >
        <FileUploadOutlined sx={{ 
          fontSize: 48, 
          color: dragOver ? color : '#9ca3af',
          mb: 2
        }} />
        <Typography variant="h6" sx={{ 
          color: textColor, 
          fontWeight: 600, 
          mb: 1 
        }}>
          Drop {isDocument ? 'documents' : 'corpus'} here
        </Typography>
        <Typography variant="body2" sx={{ 
          color: isDarkMode ? '#aaa' : '#666',
          mb: 3
        }}>
          Support: {Object.values(allowedTypes).join(', ')} (max 50MB)
        </Typography>
        <Button
          variant="contained"
          onClick={() => {
            if (isDocument) {
              documentInputRef.current?.click();
            } else {
              korpusInputRef.current?.click();
            }
          }}
          sx={{
            backgroundColor: color,
            color: 'white',
            textTransform: 'none',
            fontWeight: 600,
            px: 4,
            py: 1.5,
            borderRadius: 2,
            '&:hover': {
              backgroundColor: hoverColor
            }
          }}
        >
          Choose File
        </Button>
        <input
          ref={isDocument ? documentInputRef : korpusInputRef}
          type="file"
          multiple
          accept={Object.values(allowedTypes).join(',')}
          onChange={(e) => handleFileInputChange(e, type)}
          style={{ display: 'none' }}
        />
      </Box>
    );
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: isDarkMode ? 'rgba(26, 26, 46, 0)' : 'rgba(245, 245, 245, 0)' }}>
      <Box sx={{ maxWidth: '1440px', margin: '0 auto', p: 2 }}>
        <Typography variant="h4" sx={{ 
          fontWeight: 700, 
          color: textColor, 
          mt: 3, 
          mb: 4 
        }}>
          Upload Dokumen/Korpus
        </Typography>

        {/* Upload Dokumen Section */}
        <Paper sx={{ 
          backgroundColor: bgColor,
          borderRadius: 3,
          p: 3,
          mb: 3,
          border: `1px solid ${borderColor}`,
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
        }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, color: textColor }}>
              Upload Dokumen
            </Typography>
            <Chip 
              label={`${documentFiles.length} files`} 
              size="small" 
              sx={{ backgroundColor: '#6366f1', color: 'white' }}
            />
          </Box>
          
          {renderUploadZone('document', dragOverDocument, documentTypes)}
          
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, color: textColor, mb: 2 }}>
              Uploaded Documents
            </Typography>
            {renderFileList(documentFiles, 'document')}
          </Box>
        </Paper>

        {/* Upload Korpus Section */}
        <Paper sx={{ 
          backgroundColor: bgColor,
          borderRadius: 3,
          p: 3,
          mb: 3,
          border: `1px solid ${borderColor}`,
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
        }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, color: textColor }}>
              Upload Korpus
            </Typography>
            <Chip 
              label={`${korpusFiles.length} files`} 
              size="small" 
              sx={{ backgroundColor: '#764ba2', color: 'white' }}
            />
          </Box>
          
          {renderUploadZone('korpus', dragOverKorpus, korpusTypes)}
          
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, color: textColor, mb: 2 }}>
              Uploaded Corpus
            </Typography>
            {renderFileList(korpusFiles, 'korpus')}
          </Box>
        </Paper>

        {/* Preview Dialog */}
        <Dialog 
          open={previewDialog.open} 
          onClose={() => setPreviewDialog({ open: false, file: null })}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>File Preview</DialogTitle>
          <DialogContent>
            {previewDialog.file && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  {previewDialog.file.name}
                </Typography>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  Size: {formatFileSize(previewDialog.file.size)} • 
                  Type: {previewDialog.file.type} • 
                  Uploaded: {previewDialog.file.uploadDate}
                </Typography>
                <Box sx={{ 
                  mt: 2, 
                  p: 2, 
                  backgroundColor: isDarkMode ? '#2b2b3a' : '#f5f5f5',
                  borderRadius: 1,
                  textAlign: 'center'
                }}>
                  {getFileIcon(previewDialog.file)}
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    File preview will be implemented with actual file content
                  </Typography>
                </Box>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setPreviewDialog({ open: false, file: null })}>
              Close
            </Button>
          </DialogActions>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog 
          open={deleteDialog.open} 
          onClose={() => setDeleteDialog({ open: false, file: null, type: null })}
        >
          <DialogTitle>Delete File</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete "{deleteDialog.file?.name}"? This action cannot be undone.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialog({ open: false, file: null, type: null })}>
              Cancel
            </Button>
            <Button onClick={confirmDelete} color="error" variant="contained">
              Delete
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          <Alert 
            onClose={() => setSnackbar({ ...snackbar, open: false })} 
            severity={snackbar.severity}
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
};

export default SDGUploadPage;