import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  TextField,
  InputAdornment,
  Button,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  LinearProgress,
  IconButton,
  CircularProgress,
  Menu,
  MenuItem,
  Checkbox,
  FormControlLabel
} from '@mui/material';
import {
  Search,
  FilterList,
  GetApp,
  Delete,
  Description,
  ArrowDropDown
} from '@mui/icons-material';

const DocumentContent = ({ isDarkMode }) => {
  const [searchText, setSearchText] = useState('');
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [statusFilters, setStatusFilters] = useState({
    completed: true,
    processing: true,
    failed: true
  });

  // Warna tema
  const bgColor = isDarkMode ? '#1e1e2f' : '#fff';
  const textColor = isDarkMode ? '#e0e0e0' : '#2c3e50';
  const borderColor = isDarkMode ? '#333' : '#e9ecef';
  const tableHeadBg = isDarkMode ? '#2a2a3b' : '#f8f9fa';
  const hoverRowBg = isDarkMode ? '#2c2c3c' : '#f8f9fa';

  // Fetch dokumen yang sudah diproses dari backend
  useEffect(() => {
    const fetchProcessedDocuments = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:8000/api/processed-documents');
        
        if (!response.ok) {
          throw new Error('Gagal mengambil dokumen');
        }
        
        const data = await response.json();
        setDocuments(data.documents.map(doc => ({
          ...doc,
          size: formatFileSize(doc.size),
          uploadDate: formatDate(doc.uploadDate),
          status: doc.status === 'completed' ? 'Selesai' : 
                 doc.status === 'processing' ? 'Diproses' : 'Gagal',
          statusColor: doc.status === 'completed' ? 'success' : 
                     doc.status === 'processing' ? 'warning' : 'error',
          hasMapping: doc.sdgMapping !== 'Not mapped',
          progress: doc.progress || 0
        })));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProcessedDocuments();
  }, []);

  // Helper functions
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  const getFileIcon = () => (
    <Description sx={{ color: '#6366f1', fontSize: 24 }} />
  );

  // Handler untuk filter menu
  const handleFilterClick = (event) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setFilterAnchorEl(null);
  };

  const handleStatusFilterChange = (event) => {
    setStatusFilters({
      ...statusFilters,
      [event.target.name]: event.target.checked
    });
  };

  // Handler untuk download dokumen
  const handleDownload = async (documentId, filename) => {
    try {
      const response = await fetch(`http://localhost:8000/api/download/${documentId}`);
      
      if (!response.ok) {
        throw new Error('Gagal mengunduh dokumen');
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(err.message);
    }
  };

  // Handler untuk hapus dokumen
  const handleDelete = async (documentId) => {
    try {
      const response = await fetch(`http://localhost:8000/api/documents/${documentId}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        throw new Error('Gagal menghapus dokumen');
      }
      
      setDocuments(documents.filter(doc => doc.id !== documentId));
    } catch (err) {
      setError(err.message);
    }
  };

  // Fungsi filter dokumen
  const filteredDocuments = documents.filter(doc => {
    // Filter berdasarkan pencarian
    const matchesSearch = doc.name.toLowerCase().includes(searchText.toLowerCase());
    
    // Filter berdasarkan status
    const matchesStatus = 
      (doc.status === 'Selesai' && statusFilters.completed) ||
      (doc.status === 'Diproses' && statusFilters.processing) ||
      (doc.status === 'Gagal' && statusFilters.failed);
    
    return matchesSearch && matchesStatus;
  });

  return (
    <Container maxWidth="xl" sx={{ mt: 3 }}>
      <Paper
        sx={{
          p: 3,
          borderRadius: 2,
          backgroundColor: bgColor,
          color: textColor,
          border: `1px solid ${borderColor}`,
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
        }}
      >
        <Typography variant="h6" sx={{ mb: 3, fontWeight: 700 }}>
          Document Management
        </Typography>

        {/* Error Alert */}
        {error && (
          <Box sx={{ mb: 3 }}>
            <Typography color="error">{error}</Typography>
          </Box>
        )}

        {/* Search and Filter */}
        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <TextField
            placeholder="Cari dokumen..."
            variant="outlined"
            size="small"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            sx={{ minWidth: 300 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ color: isDarkMode ? '#bbb' : '#999' }} />
                </InputAdornment>
              ),
              style: {
                color: textColor,
                backgroundColor: isDarkMode ? '#2b2b3c' : '#fff'
              }
            }}
          />
          
          <Button
            variant="outlined"
            startIcon={<FilterList />}
            endIcon={<ArrowDropDown />}
            onClick={handleFilterClick}
            sx={{
              color: isDarkMode ? '#bbb' : '#6c757d',
              borderColor: isDarkMode ? '#444' : '#dee2e6',
              textTransform: 'none'
            }}
          >
            Filter
          </Button>
          
          <Menu
            anchorEl={filterAnchorEl}
            open={Boolean(filterAnchorEl)}
            onClose={handleFilterClose}
            PaperProps={{
              sx: {
                backgroundColor: bgColor,
                border: `1px solid ${borderColor}`,
                p: 2,
                minWidth: 200
              }
            }}
          >
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
              Filter Status
            </Typography>
            <FormControlLabel
              control={
                <Checkbox
                  checked={statusFilters.completed}
                  onChange={handleStatusFilterChange}
                  name="completed"
                  color="primary"
                />
              }
              label="Selesai"
              sx={{ color: textColor }}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={statusFilters.processing}
                  onChange={handleStatusFilterChange}
                  name="processing"
                  color="primary"
                />
              }
              label="Diproses"
              sx={{ color: textColor }}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={statusFilters.failed}
                  onChange={handleStatusFilterChange}
                  name="failed"
                  color="primary"
                />
              }
              label="Gagal"
              sx={{ color: textColor }}
            />
          </Menu>
        </Box>

        {/* Table */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: tableHeadBg }}>
                  {['DOKUMEN', 'SIZE', 'WAKTU UPLOAD', 'STATUS', 'SDGS MAPPING', 'TINDAKAN'].map((text, i) => (
                    <TableCell
                      key={i}
                      sx={{
                        fontWeight: 600,
                        color: isDarkMode ? '#ccc' : '#6c757d',
                        fontSize: '0.875rem',
                        textAlign: i === 0 ? 'left' : 'center',
                        padding: '12px 16px'
                      }}
                    >
                      {text}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredDocuments.length > 0 ? (
                  filteredDocuments.map((doc) => (
                    <TableRow
                      key={doc.id}
                      sx={{
                        '&:hover': { backgroundColor: hoverRowBg },
                        color: textColor
                      }}
                    >
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          {getFileIcon()}
                          <Typography sx={{ fontWeight: 500, color: textColor }}>
                            {doc.name}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell sx={{ 
                        textAlign: 'center',
                        color: isDarkMode ? '#aaa' : '#6c757d'
                      }}>
                        {doc.size}
                      </TableCell>
                      <TableCell sx={{ 
                        textAlign: 'center',
                        color: isDarkMode ? '#aaa' : '#6c757d'
                      }}>
                        {doc.uploadDate}
                      </TableCell>
                      <TableCell sx={{ textAlign: 'center' }}>
                        <Chip
                          label={doc.status}
                          color={doc.statusColor}
                          size="small"
                          sx={{ minWidth: 80 }}
                        />
                      </TableCell>
                      <TableCell sx={{ textAlign: 'center' }}>
                        {doc.hasMapping ? (
                          <Box>
                            <Typography sx={{ fontSize: '0.875rem', mb: 1, color: textColor }}>
                              {doc.sdgMapping}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <LinearProgress
                                variant="determinate"
                                value={doc.progress}
                                sx={{
                                  width: 80,
                                  height: 6,
                                  borderRadius: 3,
                                  backgroundColor: isDarkMode ? '#444' : '#e0e0e0',
                                  '& .MuiLinearProgress-bar': {
                                    backgroundColor: '#6366f1'
                                  }
                                }}
                              />
                              <Typography sx={{ fontSize: '0.75rem', color: '#6c757d' }}>
                                {doc.progress}%
                              </Typography>
                            </Box>
                          </Box>
                        ) : (
                          <Typography sx={{ color: '#6c757d', fontSize: '0.875rem' }}>
                            Not mapped
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell sx={{ textAlign: 'center' }}>
                        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                          <IconButton 
                            size="small"
                            onClick={() => handleDownload(doc.id, doc.name)}
                          >
                            <GetApp sx={{ fontSize: 18, color: '#6366f1' }} />
                          </IconButton>
                          <IconButton 
                            size="small"
                            onClick={() => handleDelete(doc.id)}
                          >
                            <Delete sx={{ fontSize: 18, color: '#ef4444' }} />
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} sx={{ textAlign: 'center', py: 4 }}>
                      <Typography sx={{ color: isDarkMode ? '#aaa' : '#6c757d' }}>
                        {searchText ? 'Tidak ada dokumen yang sesuai' : 'Belum ada dokumen yang diproses'}
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </Container>
  );
};

export default DocumentContent;