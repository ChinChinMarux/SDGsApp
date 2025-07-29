import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  MenuItem,
  Select,
  FormControl,
  LinearProgress,
  IconButton,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  Description as DocumentIcon,
  Analytics as AnalyticsIcon,
  Upload as UploadIcon,
  AccountCircle as AccountIcon,
  Clear as ClearIcon,
  KeyboardArrowDown as ArrowDownIcon,
  Description
} from '@mui/icons-material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip
} from 'recharts';

const AnalisisContent = ({ isDarkMode = false }) => {
  // State untuk konfigurasi analisis
  const [jumlahTopik, setJumlahTopik] = useState('');
  const [maxIterations, setMaxIterations] = useState('');
  const [selectedDokumen, setSelectedDokumen] = useState('');
  
  // State untuk data
  const [korpusOptions, setKorpusOptions] = useState([]);
  const [topicData, setTopicData] = useState([]);
  const [sdgResults, setSdgResults] = useState([]);
  
  // State untuk loading dan error
  const [loading, setLoading] = useState({
    documents: false,
    analysis: false
  });
  const [error, setError] = useState(null);
  const [analysisId, setAnalysisId] = useState(null);

  // Warna tema
  const bgColor = isDarkMode ? '#2b2b3a' : '#ffffff';
  const textColor = isDarkMode ? '#e0e0e0' : '#2c3e50';
  const borderColor = isDarkMode ? '#333' : '#e9ecef';

  // Fetch dokumen dari MongoDB
  useEffect(() => {
    const fetchDocuments = async () => {
      setLoading(prev => ({ ...prev, documents: true }));
      setError(null);
      
      try {
        const response = await fetch('http://localhost:8000/api/documents', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });
        
        if (!response.ok) {
          throw new Error('Gagal mengambil dokumen');
        }
        
        const data = await response.json();
        setKorpusOptions(data.documents);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(prev => ({ ...prev, documents: false }));
      }
    };

    fetchDocuments();
  }, []);

  // Polling untuk hasil analisis
  useEffect(() => {
    if (!analysisId) return;

    const interval = setInterval(async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/analysis/status/${analysisId}`);
        const data = await response.json();
        
        if (data.status === 'completed') {
          clearInterval(interval);
          setTopicData(data.results.topic_distribution);
          setSdgResults(data.results.sdg_mapping);
          setLoading(prev => ({ ...prev, analysis: false }));
        } else if (data.status === 'failed') {
          clearInterval(interval);
          setError('Analisis gagal: ' + data.message);
          setLoading(prev => ({ ...prev, analysis: false }));
        }
      } catch (err) {
        clearInterval(interval);
        setError('Gagal memeriksa status analisis');
        setLoading(prev => ({ ...prev, analysis: false }));
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [analysisId]);

  // Handler untuk memulai analisis
  const handleStartAnalysis = async () => {
    setLoading(prev => ({ ...prev, analysis: true }));
    setError(null);
    
    try {
      const response = await fetch('http://localhost:8000/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          document_id: selectedDokumen,
          num_topics: jumlahTopik,
          iterations: maxIterations
        })
      });
      
      if (!response.ok) {
        throw new Error('Gagal memulai analisis');
      }
      
      const data = await response.json();
      setAnalysisId(data.analysis_id);
    } catch (err) {
      setError(err.message);
      setLoading(prev => ({ ...prev, analysis: false }));
    }
  };

  // Handler untuk reset form dan hasil
  const handleResetAnalysis = () => {
    setJumlahTopik('');
    setMaxIterations('');
    setSelectedDokumen('');
    setTopicData([]);
    setSdgResults([]);
    setAnalysisId(null);
    setError(null);
  };

  // Handler untuk perubahan input
  const handleJumlahTopikChange = (event) => {
    setJumlahTopik(event.target.value);
  };

  const handleDokumenChange = (event) => {
    setSelectedDokumen(event.target.value);
  };

  const clearJumlahTopik = () => {
    setJumlahTopik('');
  };

  const clearDokumen = () => {
    setSelectedDokumen('');
  };

  // Opsi jumlah topik
  const topikOptions = Array.from({ length: 25 }, (_, i) => i + 1);

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: isDarkMode ? 'rgba(26, 26, 46, 0)' : 'rgba(245, 245, 245, 0)' }}>
      <Box sx={{ maxWidth: '1440px', margin: '0 auto', p: 2 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, mt: 2 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, color: textColor }}>
            Topic Modelling & Analysis SDG
          </Typography>
          <Button
            variant="contained"
            startIcon={<AnalyticsIcon />}
            onClick={handleResetAnalysis}
            sx={{
              backgroundColor: '#764ba2',
              color: 'white',
              textTransform: 'none',
              fontWeight: 600,
              px: 3,
              py: 1.5,
              borderRadius: 2,
              '&:hover': {
                backgroundColor: '#764ba2'
              }
            }}
          >
            Analisis Baru
          </Button>
        </Box>

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Configuration Section */}
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
            Konfigurasi Analisis
          </Typography>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Jumlah Topik Dropdown */}
            <Box>
              <Typography variant="body2" sx={{ color: textColor, mb: 1.5, fontWeight: 600 }}>
                Jumlah Topik
              </Typography>
              <FormControl fullWidth>
                <Select
                  value={jumlahTopik}
                  onChange={handleJumlahTopikChange}
                  displayEmpty
                  IconComponent={ArrowDownIcon}
                  sx={{
                    backgroundColor: bgColor,
                    borderRadius: 2,
                    height: 56,
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: borderColor,
                      borderWidth: 2
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#8b5cf6',
                      borderWidth: 2
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#8b5cf6',
                      borderWidth: 2,
                      boxShadow: '0 0 0 3px rgba(139, 92, 246, 0.1)'
                    },
                    '& .MuiSelect-select': {
                      color: jumlahTopik ? textColor : (isDarkMode ? '#aaa' : '#999'),
                      fontWeight: jumlahTopik ? 600 : 400,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1
                    },
                    '& .MuiSvgIcon-root': {
                      color: '#8b5cf6',
                      fontSize: 24,
                      transition: 'transform 0.2s ease'
                    },
                    '&.Mui-focused .MuiSvgIcon-root': {
                      transform: 'rotate(180deg)'
                    }
                  }}
                  endAdornment={
                    jumlahTopik && (
                      <IconButton 
                        size="small" 
                        onClick={clearJumlahTopik}
                        sx={{ 
                          position: 'absolute', 
                          right: 35, 
                          color: isDarkMode ? '#aaa' : '#666',
                          backgroundColor: isDarkMode ? '#444' : '#f3f4f6',
                          width: 20,
                          height: 20,
                          '&:hover': {
                            backgroundColor: '#ef4444',
                            color: 'white'
                          }
                        }}
                      >
                        <ClearIcon sx={{ fontSize: 14 }} />
                      </IconButton>
                    )
                  }
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        backgroundColor: bgColor,
                        border: `2px solid ${isDarkMode ? '#444' : '#e5e7eb'}`,
                        borderRadius: 2,
                        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
                        maxHeight: 280,
                        mt: 1,
                        '& .MuiList-root': {
                          padding: '8px'
                        }
                      }
                    }
                  }}
                >
                  <MenuItem 
                    value="" 
                    disabled 
                    sx={{ 
                      color: isDarkMode ? '#666' : '#9ca3af',
                      fontStyle: 'italic',
                      py: 1.5,
                      borderRadius: 1,
                      mb: 1
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ 
                        width: 8, 
                        height: 8, 
                        borderRadius: '50%', 
                        backgroundColor: '#d1d5db' 
                      }} />
                      Pilih jumlah topik...
                    </Box>
                  </MenuItem>
                  {topikOptions.map((num) => (
                    <MenuItem 
                      key={num} 
                      value={num}
                      sx={{ 
                        color: textColor,
                        fontWeight: 500,
                        py: 1.5,
                        borderRadius: 1,
                        mb: 0.5,
                        '&:hover': {
                          backgroundColor: '#764ba2',
                          color: 'white',
                          transform: 'translateX(4px)',
                          transition: 'all 0.2s ease'
                        },
                        '&.Mui-selected': {
                          backgroundColor: 'rgba(139, 92, 246, 0.1)',
                          color: '#764ba2',
                          fontWeight: 600
                        }
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Box sx={{ 
                          width: 24, 
                          height: 24, 
                          borderRadius: '50%', 
                          backgroundColor: num <= 10 ? '#10b981' : num <= 20 ? '#f59e0b' : '#ef4444',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontSize: 12,
                          fontWeight: 'bold'
                        }}>
                          {num}
                        </Box>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 'inherit' }}>
                            {num} Topik
                          </Typography>
                          <Typography variant="caption" sx={{ 
                            color: 'inherit', 
                            opacity: 0.7,
                            fontSize: 11
                          }}>
                            {num <= 5 ? 'Sederhana' : num <= 15 ? 'Menengah' : 'Kompleks'}
                          </Typography>
                        </Box>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            {/* Max Iterations */}
            <Box>
              <Typography variant="body2" sx={{ color: textColor, mb: 1, fontWeight: 500 }}>
                Max Iterations
              </Typography>
              <TextField
                fullWidth
                placeholder="Masukkan jumlah iterasi (max 1000)"
                value={maxIterations}
                onChange={(e) => setMaxIterations(e.target.value)}
                type="number"
                inputProps={{ min: 1, max: 1000 }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: bgColor,
                    '& fieldset': {
                      borderColor: borderColor
                    },
                    '&:hover fieldset': {
                      borderColor: '#8b5cf6'
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#8b5cf6'
                    }
                  },
                  '& .MuiInputBase-input': {
                    color: textColor
                  }
                }}
              />
            </Box>

            {/* Dokumen/Korpus Dropdown */}
            <Box>
              <Typography variant="body2" sx={{ color: textColor, mb: 1.5, fontWeight: 600 }}>
                File
              </Typography>
              <FormControl fullWidth>
                <Select
                  value={selectedDokumen}
                  onChange={handleDokumenChange}
                  displayEmpty
                  IconComponent={ArrowDownIcon}
                  disabled={loading.documents}
                  sx={{
                    backgroundColor: bgColor,
                    borderRadius: 2,
                    height: 56,
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: borderColor,
                      borderWidth: 2
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#8b5cf6',
                      borderWidth: 2
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#8b5cf6',
                      borderWidth: 2,
                      boxShadow: '0 0 0 3px rgba(139, 92, 246, 0.1)'
                    },
                    '& .MuiSelect-select': {
                      color: selectedDokumen ? textColor : (isDarkMode ? '#aaa' : '#999'),
                      fontWeight: selectedDokumen ? 600 : 400,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1
                    },
                    '& .MuiSvgIcon-root': {
                      color: '#667eea',
                      fontSize: 24,
                      transition: 'transform 0.2s ease'
                    },
                  }}
                  renderValue={(selected) => {
                    if (!selected) return 'Pilih korpus...';
                    const korpus = korpusOptions.find(k => k._id === selected);
                    return (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Box sx={{ 
                          width: 32, 
                          height: 32, 
                          borderRadius: 2, 
                          backgroundColor: 'transparent',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontSize: 12,
                          fontWeight: 'bold'
                        }}>
                          <Description sx={{ fontSize: 16 }} />
                        </Box>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 600, lineHeight: 1.2 }}>
                            {korpus?.filename}
                          </Typography>
                          <Typography variant="caption" sx={{ 
                            color: isDarkMode ? '#aaa' : '#666',
                            fontSize: 10
                          }}>
                            {korpus?._id}
                          </Typography>
                        </Box>
                      </Box>
                    );
                  }}
                  endAdornment={
                    selectedDokumen && (
                      <IconButton 
                        size="small" 
                        onClick={clearDokumen}
                        sx={{ 
                          position: 'absolute', 
                          right: 35, 
                          color: isDarkMode ? '#aaa' : '#666',
                          backgroundColor: isDarkMode ? '#444' : '#f3f4f6',
                          width: 20,
                          height: 20,
                          '&:hover': {
                            backgroundColor: '#ef4444',
                            color: 'white'
                          }
                        }}
                      >
                        <ClearIcon sx={{ fontSize: 14 }} />
                      </IconButton>
                    )
                  }
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        backgroundColor: bgColor,
                        border: `2px solid ${isDarkMode ? '#444' : '#e5e7eb'}`,
                        borderRadius: 2,
                        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
                        maxHeight: 320,
                        mt: 1,
                        '& .MuiList-root': {
                          padding: '8px'
                        }
                      }
                    }
                  }}
                >
                  <MenuItem 
                    value="" 
                    disabled 
                    sx={{ 
                      color: isDarkMode ? '#666' : '#9ca3af',
                      fontStyle: 'italic',
                      py: 1.5,
                      borderRadius: 1,
                      mb: 1
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Box sx={{ 
                        width: 32, 
                        height: 32, 
                        borderRadius: 2, 
                        backgroundColor: '#d1d5db',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <DocumentIcon sx={{ fontSize: 16, color: 'white' }} />
                      </Box>
                      Pilih korpus...
                    </Box>
                  </MenuItem>
                  {korpusOptions.map((korpus, index) => (
                    <MenuItem 
                      key={korpus._id} 
                      value={korpus._id}
                      sx={{ 
                        color: textColor,
                        py: 1.5,
                        borderRadius: 1,
                        mb: 0.5,
                        '&:hover': {
                          backgroundColor: '#764ba2',
                          color: 'white',
                          transform: 'translateX(4px)',
                          transition: 'all 0.2s ease',
                          '& .korpus-icon': {
                            backgroundColor: 'white',
                            color: '#764ba2'
                          }
                        },
                        '&.Mui-selected': {
                          backgroundColor: 'rgba(139, 92, 246, 0.1)',
                          color: '#8b5cf6',
                          fontWeight: 600
                        }
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, width: '100%' }}>
                        <Box className="korpus-icon" sx={{ 
                          width: 40, 
                          height: 40, 
                          borderRadius: 2, 
                          backgroundColor: `hsl(${(index * 45) % 360}, 70%, 60%)`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontSize: 12,
                          fontWeight: 'bold',
                          transition: 'all 0.2s ease'
                        }}>
                          <DocumentIcon sx={{ fontSize: 18 }} />
                        </Box>
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography variant="body2" sx={{ 
                            fontWeight: 600, 
                            lineHeight: 1.3,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}>
                            {korpus.filename}
                          </Typography>
                          <Typography variant="caption" sx={{ 
                            color: 'inherit', 
                            opacity: 0.7,
                            fontSize: 11,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.5,
                            mt: 0.5
                          }}>
                            <Box sx={{ 
                              width: 4, 
                              height: 4, 
                              borderRadius: '50%', 
                              backgroundColor: 'currentColor' 
                            }} />
                            {new Date(korpus.uploadDate).toLocaleDateString()}
                          </Typography>
                        </Box>
                        <Box sx={{ 
                          width: 8, 
                          height: 8, 
                          borderRadius: '50%', 
                          backgroundColor: 'currentColor',
                          opacity: 0.3
                        }} />
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              {loading.documents && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
                  <CircularProgress size={20} />
                </Box>
              )}
            </Box>

            {/* Start Analysis Button */}
            <Button
              variant="contained"
              fullWidth
              onClick={handleStartAnalysis}
              disabled={!selectedDokumen || !jumlahTopik || !maxIterations || loading.analysis}
              startIcon={loading.analysis ? <CircularProgress size={20} color="inherit" /> : <AnalyticsIcon />}
              sx={{
                backgroundColor: '#6366f1',
                color: 'white',
                textTransform: 'none',
                fontWeight: 600,
                py: 2,
                borderRadius: 2,
                fontSize: 16,
                '&:hover': {
                  backgroundColor: '#5856eb'
                },
                '&:disabled': {
                  backgroundColor: isDarkMode ? '#333' : '#ccc',
                  color: isDarkMode ? '#666' : '#999'
                }
              }}
            >
              {loading.analysis ? 'Memproses...' : 'Mulai Analisis'}
            </Button>
          </Box>
        </Paper>

        {/* Topic Distribution Chart */}
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
            Topic Distribution
          </Typography>
          
          <Box sx={{ height: 350 }}>
            {loading.analysis ? (
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                height: '100%'
              }}>
                <CircularProgress />
                <Typography variant="body1" sx={{ ml: 2 }}>
                  Sedang menganalisis dokumen...
                </Typography>
              </Box>
            ) : topicData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topicData} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={borderColor} />
                  <XAxis 
                    dataKey="topic" 
                    stroke={textColor}
                    fontSize={12}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis stroke={textColor} fontSize={12} />
                  <Tooltip />
                  <Bar dataKey="weight" fill="#6366f1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                height: '100%',
                color: isDarkMode ? '#666' : '#999',
                fontStyle: 'italic'
              }}>
                Tidak ada data distribusi topik. Silakan lakukan analisis terlebih dahulu.
              </Box>
            )}
          </Box>
        </Paper>

        {/* SDG Mapping Results */}
        <Paper 
          sx={{ 
            backgroundColor: bgColor,
            borderRadius: 3,
            p: 3,
            border: `1px solid ${borderColor}`,
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600, color: textColor, mb: 3 }}>
            SDG Mapping Results
          </Typography>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            {loading.analysis ? (
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                py: 2
              }}>
                <CircularProgress size={20} />
                <Typography variant="body2" sx={{ ml: 2 }}>
                  Memproses hasil SDG mapping...
                </Typography>
              </Box>
            ) : sdgResults.length > 0 ? (
              sdgResults.map((item, index) => (
                <Box key={index}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: textColor }}>
                      {item.sdg}: {item.description}
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: textColor }}>
                      {item.score.toFixed(1)}%
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={item.score}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: isDarkMode ? '#333' : '#e9ecef',
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: item.color,
                        borderRadius: 4
                      }
                    }}
                  />
                </Box>
              ))
            ) : (
              <Box sx={{ 
                textAlign: 'center',
                color: isDarkMode ? '#666' : '#999',
                fontStyle: 'italic',
                py: 2
              }}>
                Tidak ada hasil SDG mapping. Silakan lakukan analisis terlebih dahulu.
              </Box>
            )}
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default AnalisisContent;