import React from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Legend,
  Line
} from 'recharts';

import ArticleIcon from '@mui/icons-material/Article';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import TargetIcon from '@mui/icons-material/TrackChanges';
import AssessmentIcon from '@mui/icons-material/Assessment';
import VisibilityIcon from '@mui/icons-material/Visibility';

const DashboardContent = ({ isDarkMode }) => {
  const stats = [
    {
      label: 'Total Dokumen',
      value: '2200',
      icon: <ArticleIcon style={{ color: '#6366f1' }} />
    },
    {
      label: 'Hasil Analisis',
      value: '52',
      icon: <TrendingUpIcon style={{ color: '#10b981' }} />
    },
    {
      label: 'Dataset Uploaded',
      value: '15',
      icon: <UploadFileIcon style={{ color: '#f59e0b' }} />
    },
    {
      label: 'Rata-rata Akurasi',
      value: '90.5%',
      icon: <TargetIcon style={{ color: '#ef4444' }} />
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

  const CustomTooltip = ({ active, payload, isDarkMode }) => {
    if (active && payload && payload.length) {
      const { name, value, color } = payload[0].payload;

      return (
        <div
          style={{
            backgroundColor: isDarkMode ? '#2c2c3c' : '#fff',
            border: `1px solid ${color}`,
            borderRadius: '8px',
            padding: '8px 12px',
            color: color,
            fontSize: '14px',
            fontWeight: 500,
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
          }}
        >
          {name}: {value}
        </div>
      );
    }
    return null;
  };

  const bgColor = isDarkMode ? '#1e1e2e' : '#ffffff';
  const textColor = isDarkMode ? '#e0e0e0' : '#2c3e50';
  const borderColor = isDarkMode ? '#333' : '#e9ecef';
  const tableHeaderBg = isDarkMode ? '#1e1e2e' : '#f8f9fa';

  return (
    <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '0 16px' }}>
      {/* Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '20px',
        marginBottom: '30px'
      }}>
        {stats.map((stat, index) => (
          <div key={index} style={{
            backgroundColor: bgColor,
            color: textColor,
            borderRadius: '12px',
            padding: '24px',
            border: `1px solid ${borderColor}`,
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
              <div style={{ fontSize: 14, fontWeight: 500 }}>{stat.label}</div>
              {stat.icon}
            </div>
            <div style={{ fontSize: 32, fontWeight: 700 }}>{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginBottom: '30px' }}>
        {/* SDGs Pie Chart */}
        <div style={{
          backgroundColor: bgColor,
          color: textColor,
          borderRadius: '12px',
          padding: '24px',
          border: `1px solid ${borderColor}`
        }}>
          <h3 style={{ marginBottom: 20 }}>SDGs Distribution</h3>
          <div style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={sdgsData} dataKey="value" cx="50%" cy="50%" outerRadius={130} labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  {sdgsData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip isDarkMode={isDarkMode} />}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Weekly Activity */}
        <div style={{
          backgroundColor: bgColor,
          color: textColor,
          borderRadius: '12px',
          padding: '24px',
          border: `1px solid ${borderColor}`
        }}>
          <h3 style={{ marginBottom: 20 }}>Weekly Activity</h3>
          <div style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke={borderColor} />
                <XAxis dataKey="month" stroke={textColor} fontSize={12} />
                <YAxis stroke={textColor} fontSize={12} />
                <Tooltip contentStyle={{
                  backgroundColor: isDarkMode ? '#2c2c3c' : '#fff',
                  border: `1px solid ${borderColor}`,
                  borderRadius: 8
                }} />
                <Legend />
                <Line type="monotone" dataKey="Documents" stroke="#4ECDC4" strokeWidth={3} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="Analyses" stroke="#45B7D1" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Analyses Table */}
      <div style={{
        backgroundColor: bgColor,
        color: textColor,
        borderRadius: '12px',
        padding: '24px',
        border: `1px solid ${borderColor}`
      }}>
        <h3 style={{ marginBottom: 20 }}>Recent Analyses</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ 
            width: '100%', 
            borderCollapse: 'collapse',
            tableLayout: 'fixed'
          }}>
            <thead>
              <tr style={{ backgroundColor: tableHeaderBg }}>
                <th style={{
                  textAlign: 'left',
                  padding: '16px',
                  fontWeight: '600',
                  borderBottom: `2px solid ${borderColor}`,
                  width: '35%'
                }}>Title</th>
                <th style={{
                  textAlign: 'center',
                  padding: '16px',
                  fontWeight: '600',
                  borderBottom: `2px solid ${borderColor}`,
                  width: '10%'
                }}>Topics</th>
                <th style={{
                  textAlign: 'center',
                  padding: '16px',
                  fontWeight: '600',
                  borderBottom: `2px solid ${borderColor}`,
                  width: '12%'
                }}>Documents</th>
                <th style={{
                  textAlign: 'center',
                  padding: '16px',
                  fontWeight: '600',
                  borderBottom: `2px solid ${borderColor}`,
                  width: '15%'
                }}>Date</th>
                <th style={{
                  textAlign: 'center',
                  padding: '16px',
                  fontWeight: '600',
                  borderBottom: `2px solid ${borderColor}`,
                  width: '18%'
                }}>Accuracy</th>
                <th style={{
                  textAlign: 'center',
                  padding: '16px',
                  fontWeight: '600',
                  borderBottom: `2px solid ${borderColor}`,
                  width: '10%'
                }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {recentAnalyses.map((row, index) => (
                <tr key={index} style={{
                  borderBottom: `1px solid ${borderColor}`
                }}>
                  <td style={{ 
                    padding: '16px',
                    verticalAlign: 'middle'
                  }}>
                    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                      <AssessmentIcon fontSize="small" style={{ flexShrink: 0 }} />
                      <div>
                        <div style={{ fontWeight: 600, marginBottom: 4 }}>{row.title}</div>
                        <div style={{ 
                          fontSize: 12, 
                          color: isDarkMode ? '#aaa' : '#6c757d',
                          lineHeight: 1.4
                        }}>
                          {row.topics} Topics • {row.documents} Documents
                        </div>
                      </div>
                    </div>
                  </td>
                  <td style={{ 
                    padding: '16px', 
                    textAlign: 'center',
                    verticalAlign: 'middle',
                    fontWeight: '500'
                  }}>
                    {row.topics}
                  </td>
                  <td style={{ 
                    padding: '16px', 
                    textAlign: 'center',
                    verticalAlign: 'middle',
                    fontWeight: '500'
                  }}>
                    {row.documents}
                  </td>
                  <td style={{ 
                    padding: '16px', 
                    textAlign: 'center',
                    verticalAlign: 'middle',
                    fontSize: '14px'
                  }}>
                    {row.date}
                  </td>
                  <td style={{ 
                    padding: '16px', 
                    textAlign: 'center',
                    verticalAlign: 'middle'
                  }}>
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      gap: 8 
                    }}>
                      <div style={{
                        width: 60,
                        height: 6,
                        borderRadius: 3,
                        overflow: 'hidden',
                        backgroundColor: isDarkMode ? '#444' : '#e9ecef'
                      }}>
                        <div style={{
                          width: `${row.accuracy}%`,
                          height: '100%',
                          backgroundColor: row.accuracy > 90 ? '#28a745' : '#ffc107',
                          transition: 'width 0.3s ease'
                        }} />
                      </div>
                      <span style={{ 
                        fontSize: 13, 
                        fontWeight: '500',
                        minWidth: '35px'
                      }}>
                        {row.accuracy}%
                      </span>
                    </div>
                  </td>
                  <td style={{ 
                    padding: '16px', 
                    textAlign: 'center',
                    verticalAlign: 'middle'
                  }}>
                    <button style={{
                      background: 'none',
                      border: 'none',
                      color: isDarkMode ? '#aaa' : '#6c757d',
                      cursor: 'pointer',
                      padding: '8px',
                      borderRadius: '4px',
                      transition: 'all 0.2s ease',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = isDarkMode ? '#444' : '#f8f9fa';
                      e.target.style.color = textColor;
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = 'transparent';
                      e.target.style.color = isDarkMode ? '#aaa' : '#6c757d';
                    }}
                    >
                      <VisibilityIcon fontSize="small" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardContent;