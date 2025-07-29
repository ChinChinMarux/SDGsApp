import React, { useState } from 'react';
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
  IconButton
} from '@mui/material';
import {
  Search,
  FilterList,
  GetApp,
  Delete,
  Description
} from '@mui/icons-material';

const documents = [
  {
    id: 1,
    name: 'Dokumen1.pdf',
    size: '2.8 MB',
    uploadDate: '2025-07-10',
    status: 'Selesai',
    statusColor: 'success',
    sdgMapping: 'SDG 13',
    progress: 96,
    hasMapping: true
  },
  {
    id: 2,
    name: 'Dokumen2.xlsx',
    size: '2.8 MB',
    uploadDate: '2025-07-10',
    status: 'Diproses',
    statusColor: 'warning',
    sdgMapping: 'Not mapped',
    progress: 0,
    hasMapping: false
  },
  {
    id: 3,
    name: 'Dokumen3.csv',
    size: '2.8 MB',
    uploadDate: '2025-07-10',
    status: 'Gagal',
    statusColor: 'error',
    sdgMapping: 'Not mapped',
    progress: 0,
    hasMapping: false
  },
  {
    id: 4,
    name: 'Dokumen4.docx',
    size: '2.8 MB',
    uploadDate: '2025-07-10',
    status: 'Selesai',
    statusColor: 'success',
    sdgMapping: 'SDG 10',
    progress: 78,
    hasMapping: true
  }
];

const DocumentContent = ({ isDarkMode }) => {
  const [searchText, setSearchText] = useState('');

  const getFileIcon = () => (
    <Description sx={{ color: '#6366f1', fontSize: 24 }} />
  );

  const filteredDocuments = documents.filter(doc =>
    doc.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const bgColor = isDarkMode ? '#1e1e2f' : '#fff';
  const textColor = isDarkMode ? '#e0e0e0' : '#2c3e50';
  const borderColor = isDarkMode ? '#333' : '#e9ecef';
  const tableHeadBg = isDarkMode ? '#2a2a3b' : '#f8f9fa';
  const hoverRowBg = isDarkMode ? '#2c2c3c' : '#f8f9fa';

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
            sx={{
              color: isDarkMode ? '#bbb' : '#6c757d',
              borderColor: isDarkMode ? '#444' : '#dee2e6',
              textTransform: 'none'
            }}
          >
            Filter
          </Button>
        </Box>

        {/* Table */}
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: tableHeadBg }}>
                {['Dokumen', 'Size', 'Waktu Upload', 'Status', 'SDGs Mapping', 'Tindakan'].map((text, i) => (
                  <TableCell
                    key={i}
                    sx={{
                      fontWeight: 600,
                      color: isDarkMode ? '#ccc' : '#6c757d',
                      fontSize: '0.875rem'
                    }}
                  >
                    {text.toUpperCase()}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredDocuments.map((doc) => (
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
                  <TableCell sx={{ color: isDarkMode ? '#aaa' : '#6c757d' }}>{doc.size}</TableCell>
                  <TableCell sx={{ color: isDarkMode ? '#aaa' : '#6c757d' }}>{doc.uploadDate}</TableCell>
                  <TableCell>
                    <Chip
                      label={doc.status}
                      color={doc.statusColor}
                      size="small"
                      sx={{ minWidth: 80 }}
                    />
                  </TableCell>
                  <TableCell>
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
                              backgroundColor: '#e0e0e0',
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
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <IconButton size="small">
                        <GetApp sx={{ fontSize: 18, color: '#6366f1' }} />
                      </IconButton>
                      <IconButton size="small">
                        <Delete sx={{ fontSize: 18, color: '#ef4444' }} />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Container>
  );
};

export default DocumentContent;
