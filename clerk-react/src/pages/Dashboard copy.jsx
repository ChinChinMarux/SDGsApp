import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Tabs,
  Tab,
  AppBar,
  Toolbar,
  IconButton,
  Avatar,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress,
  Chip,
  TextField,
  InputAdornment,
  Button,
  Menu,
  MenuItem,
  Divider,
  useTheme
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Description as DocumentIcon,
  Analytics as AnalyticsIcon,
  CloudUpload as UploadIcon,
  AccountCircle,
  TrendingUp,
  CloudUpload,
  Speed,
  Search,
  FilterList,
  GetApp,
  Delete,
  Visibility
} from '@mui/icons-material';
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { createTheme, ThemeProvider } from '@mui/material/styles';

// Custom theme with consistent colors
const theme = createTheme({
  shape: {
    borderRadius: 12,
    },
  palette: {
    primary: {
      main: '#7B68EE',
      contrastText: '#fff',
    },
    secondary: {
      main: '#6c757d',
    },
    success: {
      main: '#4CAF50',
    },
    warning: {
      main: '#FFC107',
    },
    error: {
      main: '#F44336',
    },
    background: {
      default: '#f8f9fa',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
    subtitle1: {
      fontWeight: 500,
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
          transition: 'box-shadow 0.3s ease',
          '&:hover': {
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          },
        },
      },
    },
    MuiTable: {
      styleOverrides: {
        root: {
          '& .MuiTableCell-root': {
            padding: '12px 16px',
          },
        },
      },
    },
  },
});

// Data models
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

const stats = [
  { label: 'Total Dokumen', value: '2,200', icon: <DocumentIcon />, color: 'primary' },
  { label: 'Hasil Analisis', value: '52', icon: <TrendingUp />, color: 'success' },
  { label: 'Dataset Uploaded', value: '15', icon: <CloudUpload />, color: 'secondary' },
  { label: 'Rata-rata Akurasi', value: '90.5%', icon: <Speed />, color: 'warning' }
];

const sdgsData = [
  { name: 'SDG 1', value: 15, color: '#e74c3c' },
  { name: 'SDG 2', value: 20, color: '#3498db' },
  { name: 'SDG 3', value: 25, color: '#2ecc71' },
  { name: 'SDG 4', value: 18, color: '#f39c12' },
  { name: 'SDG 5', value: 22, color: '#9b59b6' }
];

const weeklyData = [
  { month: 'Jan', Documents: 20, Analyses: 45 },
  { month: 'Feb', Documents: 25, Analyses: 55 },
  { month: 'Mar', Documents: 30, Analyses: 70 },
  { month: 'Apr', Documents: 35, Analyses: 85 },
  { month: 'May', Documents: 28, Analyses: 80 },
  { month: 'Jun', Documents: 40, Analyses: 95 }
];

const recentAnalyses = [
  {
    title: 'Climate Action Analysis',
    topics: 10,
    documents: 20,
    date: '2025-07-15',
    accuracy: 96
  },
  {
    title: 'Health System Review',
    topics: 8,
    documents: 50,
    date: '2025-07-12',
    accuracy: 92
  }
];

// Reusable components
const StatCard = ({ stat }) => {
  const theme = useTheme();
  
  return (
    <Card>
      <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="overline" color="textSecondary" sx={{ fontSize: '0.75rem' }}>
            {stat.label}
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 700, color: theme.palette[stat.color].main }}>
            {stat.value}
          </Typography>
        </Box>
        <Box sx={{
          backgroundColor: theme.palette[stat.color].light,
          color: theme.palette[stat.color].main,
          borderRadius: '50%',
          width: 48,
          height: 48,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {React.cloneElement(stat.icon, { fontSize: 'medium' })}
        </Box>
      </CardContent>
    </Card>
  );
};

const FileIcon = ({ name }) => {
  const extension = name.split('.').pop().toLowerCase();
  const iconColor = '#7B68EE';
  
  const iconMap = {
    pdf: <DocumentIcon sx={{ color: iconColor, fontSize: 24 }} />,
    xlsx: <DocumentIcon sx={{ color: iconColor, fontSize: 24 }} />,
    csv: <DocumentIcon sx={{ color: iconColor, fontSize: 24 }} />,
    docx: <DocumentIcon sx={{ color: iconColor, fontSize: 24 }} />,
    default: <DocumentIcon sx={{ color: iconColor, fontSize: 24 }} />
  };
  
  return iconMap[extension] || iconMap.default;
};

const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text 
      x={x} 
      y={y} 
      fill="white" 
      textAnchor={x > cx ? 'start' : 'end'} 
      dominantBaseline="central"
      fontSize="12"
      fontWeight="bold"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

// Main App Component
function SDGsApp() {
  const [searchText, setSearchText] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const theme = useTheme();

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleProfileClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileClose = () => {
    setAnchorEl(null);
  };

  const filteredDocuments = documents.filter(doc =>
    doc.name.toLowerCase().includes(searchText.toLowerCase())
  );

  import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  LinearProgress,
  Chip
} from '@mui/material';
import {
  TrendingUp,
  Visibility,
  Description,
  Assessment,
  CloudUpload,
  Target
} from '@mui/icons-material';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';

// Sample data
const stats = [
  {
    label: 'Total Dokumen',
    value: '2200',
    icon: <Description />,
    color: 'primary'
  },
  {
    label: 'Hasil Analisis',
    value: '52',
    icon: <TrendingUp />,
    color: 'success'
  },
  {
    label: 'Dataset Uploaded',
    value: '15',
    icon: <CloudUpload />,
    color: 'secondary'
  },
  {
    label: 'Rata-rata Akurasi',
    value: '90.5%',
    icon: <Target />,
    color: 'warning'
  }
];

const sdgsData = [
  { name: 'Education', value: 30, color: '#FF6B6B' },
  { name: 'Health', value: 25, color: '#4ECDC4' },
  { name: 'Environment', value: 20, color: '#45B7D1' },
  { name: 'Economy', value: 15, color: '#96CEB4' },
  { name: 'Other', value: 10, color: '#FFEAA7' }
];

const weeklyData = [
  { month: 'Jan', Analyses: 10, Documents: 45 },
  { month: 'Feb', Analyses: 15, Documents: 52 },
  { month: 'Mar', Analyses: 20, Documents: 48 },
  { month: 'Apr', Analyses: 25, Documents: 61 },
  { month: 'May', Analyses: 22, Documents: 55 },
  { month: 'Jun', Analyses: 28, Documents: 67 }
];

const recentAnalyses = [
  {
    title: 'Climate Action Analysis',
    topics: '10',
    documents: '30',
    date: '2025-07-15',
    accuracy: 95
  },
  {
    title: 'Health System Review',
    topics: '8',
    documents: '25',
    date: '2025-07-12',
    accuracy: 88
  }
];

const Dashboard = () => {
  return (
    <Box sx={{
      p: 3,
      backgroundColor: '#f8f9fa',
      minHeight: '100vh'
    }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ 
          fontWeight: 700,
          color: '#2c3e50',
          mb: 1
        }}>
          SDGs Mapping Tools
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Dashboard overview of your SDGs analysis and documents
        </Typography>
      </Box>

      {/* Stat Cards - Single Row */}
      <Box sx={{
        display: 'grid',
        gridTemplateColumns: { 
          xs: '1fr', 
          sm: 'repeat(2, 1fr)', 
          lg: 'repeat(4, 1fr)' 
        },
        gap: 3,
        mb: 4
      }}>
        {stats.map((stat, index) => (
          <Card key={index} sx={{
            borderRadius: 2,
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            border: '1px solid #e9ecef',
            transition: 'transform 0.2s ease-in-out',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 4px 16px rgba(0,0,0,0.15)'
            }
          }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                mb: 2
              }}>
                <Typography variant="body2" color="textSecondary" sx={{
                  fontSize: '0.875rem',
                  fontWeight: 500
                }}>
                  {stat.label}
                </Typography>
                <Box sx={{
                  color: getStatColor(stat.color),
                  opacity: 0.7
                }}>
                  {stat.icon}
                </Box>
              </Box>
              <Typography variant="h3" sx={{ 
                fontWeight: 700,
                color: '#2c3e50',
                lineHeight: 1
              }}>
                {stat.value}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Charts Section */}
      <Box sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' },
        gap: 3,
        mb: 4
      }}>
        {/* SDGs Distribution */}
        <Card sx={{ 
          borderRadius: 2,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          border: '1px solid #e9ecef'
        }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ 
              fontWeight: 600,
              color: '#2c3e50',
              mb: 3
            }}>
              SDGs Distribution
            </Typography>
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sdgsData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {sdgsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </CardContent>
        </Card>

        {/* Weekly Activity */}
        <Card sx={{ 
          borderRadius: 2,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          border: '1px solid #e9ecef'
        }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ 
              fontWeight: 600,
              color: '#2c3e50',
              mb: 3
            }}>
              Weekly Activity
            </Typography>
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e9ecef" />
                  <XAxis 
                    dataKey="month" 
                    stroke="#6c757d"
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="#6c757d"
                    fontSize={12}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e9ecef',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="Documents" 
                    stroke="#4ECDC4" 
                    strokeWidth={3}
                    dot={{ r: 4, fill: '#4ECDC4' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="Analyses" 
                    stroke="#45B7D1" 
                    strokeWidth={3}
                    dot={{ r: 4, fill: '#45B7D1' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Recent Analyses */}
      <Card sx={{ 
        borderRadius: 2,
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        border: '1px solid #e9ecef'
      }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ 
            fontWeight: 600,
            color: '#2c3e50',
            mb: 3
          }}>
            Recent Analyses
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ 
                    fontWeight: 600,
                    color: '#495057',
                    borderBottom: '2px solid #e9ecef'
                  }}>
                    Analysis Title
                  </TableCell>
                  <TableCell align="center" sx={{ 
                    fontWeight: 600,
                    color: '#495057',
                    borderBottom: '2px solid #e9ecef'
                  }}>
                    Topics
                  </TableCell>
                  <TableCell align="center" sx={{ 
                    fontWeight: 600,
                    color: '#495057',
                    borderBottom: '2px solid #e9ecef'
                  }}>
                    Documents
                  </TableCell>
                  <TableCell align="center" sx={{ 
                    fontWeight: 600,
                    color: '#495057',
                    borderBottom: '2px solid #e9ecef'
                  }}>
                    Date
                  </TableCell>
                  <TableCell align="center" sx={{ 
                    fontWeight: 600,
                    color: '#495057',
                    borderBottom: '2px solid #e9ecef'
                  }}>
                    Accuracy
                  </TableCell>
                  <TableCell align="center" sx={{ 
                    fontWeight: 600,
                    color: '#495057',
                    borderBottom: '2px solid #e9ecef'
                  }}>
                    Action
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {recentAnalyses.map((analysis, index) => (
                  <TableRow 
                    key={index} 
                    hover 
                    sx={{
                      '&:hover': {
                        backgroundColor: '#f8f9fa'
                      }
                    }}
                  >
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <TrendingUp sx={{ 
                          mr: 2, 
                          color: '#28a745',
                          fontSize: '1.2rem'
                        }} />
                        <Box>
                          <Typography variant="subtitle2" sx={{ 
                            fontWeight: 600,
                            color: '#2c3e50'
                          }}>
                            {analysis.title}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            {analysis.topics} Topics | {analysis.documents} Documents
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <Chip 
                        label={analysis.topics} 
                        size="small" 
                        sx={{
                          backgroundColor: '#e3f2fd',
                          color: '#1976d2',
                          fontWeight: 500
                        }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Chip 
                        label={analysis.documents} 
                        size="small" 
                        sx={{
                          backgroundColor: '#f3e5f5',
                          color: '#7b1fa2',
                          fontWeight: 500
                        }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="body2" color="textSecondary">
                        {analysis.date}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <Box sx={{ width: 80, mr: 1 }}>
                          <LinearProgress 
                            variant="determinate" 
                            value={analysis.accuracy} 
                            sx={{ 
                              height: 6,
                              borderRadius: 3,
                              backgroundColor: '#e9ecef',
                              '& .MuiLinearProgress-bar': {
                                backgroundColor: analysis.accuracy > 90 ? '#28a745' : '#ffc107',
                                borderRadius: 3
                              }
                            }} 
                          />
                        </Box>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {analysis.accuracy}%
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <IconButton 
                        size="small" 
                        sx={{
                          color: '#6c757d',
                          '&:hover': {
                            color: '#495057',
                            backgroundColor: '#f8f9fa'
                          }
                        }}
                      >
                        <Visibility fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
};

// Helper function for stat colors
const getStatColor = (color) => {
  const colors = {
    primary: '#1976d2',
    success: '#28a745',
    secondary: '#7b1fa2',
    warning: '#ff9800'
  };
  return colors[color] || '#6c757d';
};

  const renderDocuments = () => (
    <Box sx={{ p: 3 }}>
      <Card>
        <CardContent>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
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
              sx={{ 
                minWidth: 300,
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                }
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search sx={{ color: 'action.active' }} />
                  </InputAdornment>
                ),
              }}
            />
            <Button
              variant="outlined"
              startIcon={<FilterList />}
              sx={{ 
                borderRadius: '8px',
                textTransform: 'none',
                borderColor: 'divider',
                color: 'text.secondary',
                '&:hover': {
                  borderColor: 'primary.main',
                  color: 'primary.main'
                }
              }}
            >
              Filter
            </Button>
          </Box>

          {/* Document Table */}
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: 'action.hover' }}>
                  <TableCell sx={{ fontWeight: 600 }}>DOKUMEN</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>SIZE</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>WAKTU UPLOAD</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>STATUS</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>SDGs MAPPING</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>TINDAKAN</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredDocuments.map((doc) => (
                  <TableRow key={doc.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <FileIcon name={doc.name} />
                        <Typography sx={{ fontWeight: 500 }}>
                          {doc.name}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ color: 'text.secondary' }}>
                      {doc.size}
                    </TableCell>
                    <TableCell sx={{ color: 'text.secondary' }}>
                      {doc.uploadDate}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={doc.status}
                        color={doc.statusColor}
                        size="small"
                        sx={{ 
                          fontWeight: 500,
                          minWidth: 80
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      {doc.hasMapping ? (
                        <Box>
                          <Typography sx={{ fontSize: '0.875rem', mb: 1 }}>
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
                                bgcolor: 'background.default',
                                '& .MuiLinearProgress-bar': {
                                  bgcolor: 'primary.main'
                                }
                              }}
                            />
                            <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
                              {doc.progress}%
                            </Typography>
                          </Box>
                        </Box>
                      ) : (
                        <Typography sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>
                          Not mapped
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton size="small" color="primary">
                          <GetApp fontSize="small" />
                        </IconButton>
                        <IconButton size="small" color="error">
                          <Delete fontSize="small" />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        minHeight: '100vh',
        backgroundColor: 'background.default'
      }}>
        {/* Header */}
        <AppBar position="static" sx={{ 
          bgcolor: 'background.paper', 
          color: 'text.primary',
          boxShadow: 'none',
          borderBottom: '1px solid',
          borderColor: 'divider'
        }}>
          <Toolbar sx={{ px: { xs: 2, sm: 3 } }}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              flexGrow: 1,
              gap: 2
            }}>
              <Avatar sx={{ 
                bgcolor: 'primary.main', 
                width: 36, 
                height: 36,
                fontSize: '1rem'
              }}>
                S
              </Avatar>
              <Typography variant="h6" sx={{ 
                fontWeight: 600,
                color: 'primary.main'
              }}>
                SDGs Mapping Tools
              </Typography>
            </Box>
            <IconButton 
              onClick={handleProfileClick} 
              sx={{ color: 'text.primary' }}
            >
              <AccountCircle />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleProfileClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
            >
              <MenuItem onClick={handleProfileClose}>Profile</MenuItem>
              <MenuItem onClick={handleProfileClose}>Settings</MenuItem>
              <Divider />
              <MenuItem onClick={handleProfileClose}>Logout</MenuItem>
            </Menu>
          </Toolbar>
        </AppBar>

        {/* Navigation Tabs */}
        <AppBar position="static" sx={{ 
          bgcolor: 'background.paper', 
          color: 'text.primary',
          boxShadow: 'none'
        }}>
          <Tabs 
            value={activeTab} 
            onChange={handleTabChange}
            sx={{ 
              px: { xs: 2, sm: 3 },
              '& .MuiTab-root': { 
                textTransform: 'none',
                minHeight: 56,
                color: 'text.secondary',
                fontSize: '0.875rem',
                fontWeight: 500,
                '&.Mui-selected': {
                  color: 'primary.main',
                  fontWeight: 600
                }
              },
              '& .MuiTabs-indicator': {
                backgroundColor: 'primary.main',
                height: 3
              }
            }}
          >
            <Tab 
              icon={<DashboardIcon />} 
              label="Dashboard" 
              iconPosition="start"
              sx={{ minWidth: 'auto' }}
            />
            <Tab 
              icon={<DocumentIcon />} 
              label="Dokumen" 
              iconPosition="start"
              sx={{ minWidth: 'auto' }}
            />
            <Tab 
              icon={<AnalyticsIcon />} 
              label="Hasil Analisis" 
              iconPosition="start"
              sx={{ minWidth: 'auto' }}
            />
            <Tab 
              icon={<UploadIcon />} 
              label="Upload" 
              iconPosition="start"
              sx={{ minWidth: 'auto' }}
            />
          </Tabs>
        </AppBar>

        {/* Main Content */}
        <Box component="main" sx={{ flexGrow: 1 }}>
          {activeTab === 0 && renderDashboard()}
          {activeTab === 1 && renderDocuments()}
          {activeTab === 2 && (
            <Box sx={{ p: 3 }}>
              <Card>
                <CardContent>
                  <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
                    Hasil Analisis
                  </Typography>
                  <Typography color="textSecondary">
                    Fitur analisis akan segera hadir...
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          )}
          {activeTab === 3 && (
            <Box sx={{ p: 3 }}>
              <Card>
                <CardContent>
                  <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
                    Upload
                  </Typography>
                  <Typography color="textSecondary">
                    Fitur upload akan segera hadir...
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          )}
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default SDGsApp;