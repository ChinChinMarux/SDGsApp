import React, { useEffect, useRef, useState } from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend
} from 'recharts';
import { useTheme } from '@mui/material/styles';
import ArticleIcon from '@mui/icons-material/Article';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import TargetIcon from '@mui/icons-material/TrackChanges';
import AssessmentIcon from '@mui/icons-material/Assessment';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import { useMediaQuery } from '@mui/material';

const KnowledgeGraph = ({ isDarkMode, isMobile }) => {
  const theme = useTheme();
  const svgRef = useRef();
  const containerRef = useRef();
  const [dimensions, setDimensions] = useState({ width: 0, height: isMobile ? 200 : 280 });
  const [hoveredNode, setHoveredNode] = useState(null);

  // Knowledge graph data - nodes and links representing SDG relationships
  const nodes = [
    { id: 'education', label: 'Education', x: 0, y: -80, size: 25, color: '#FF6B6B' },
    { id: 'health', label: 'Health', x: 80, y: -60, size: 22, color: '#4ECDC4' },
    { id: 'environment', label: 'Environment', x: 100, y: 50, size: 20, color: '#45B7D1' },
    { id: 'economy', label: 'Economy', x: 0, y: 120, size: 18, color: '#96CEB4' },
    { id: 'poverty', label: 'Poverty', x: -100, y: 100, size: 15, color: '#FFEAA7' },
    { id: 'innovation', label: 'Innovation', x: 150, y: 100, size: 16, color: '#DDA0DD' },
    { id: 'governance', label: 'Governance', x: 200, y: 20, size: 14, color: '#FFB6C1' },
    { id: 'climate', label: 'Climate', x: 50, y: -40, size: 19, color: '#98FB98' }
  ];

  const links = [
    { source: 'education', target: 'health', strength: 0.8 },
    { source: 'education', target: 'poverty', strength: 0.9 },
    { source: 'health', target: 'environment', strength: 0.7 },
    { source: 'environment', target: 'climate', strength: 0.95 },
    { source: 'economy', target: 'poverty', strength: 0.85 },
    { source: 'economy', target: 'innovation', strength: 0.75 },
    { source: 'innovation', target: 'governance', strength: 0.6 },
    { source: 'governance', target: 'environment', strength: 0.65 },
    { source: 'climate', target: 'economy', strength: 0.7 }
  ];

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { width } = containerRef.current.getBoundingClientRect();
        setDimensions({ width, height: isMobile ? 200 : 280 });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);

    return () => window.removeEventListener('resize', updateDimensions);
  }, [isMobile]);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg || dimensions.width === 0) return;

    // Clear previous content
    svg.innerHTML = '';

    const centerX = dimensions.width / 2;
    const centerY = dimensions.height / 2;
    const scale = Math.min(dimensions.width, dimensions.height) / (isMobile ? 250 : 300);

    // Create links first (so they appear behind nodes)
    links.forEach(link => {
      const sourceNode = nodes.find(n => n.id === link.source);
      const targetNode = nodes.find(n => n.id === link.target);
      
      if (sourceNode && targetNode) {
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', sourceNode.x * scale + centerX);
        line.setAttribute('y1', sourceNode.y * scale + centerY);
        line.setAttribute('x2', targetNode.x * scale + centerX);
        line.setAttribute('y2', targetNode.y * scale + centerY);
        line.setAttribute('stroke', isDarkMode ? '#555' : '#ddd');
        line.setAttribute('stroke-width', link.strength * (isMobile ? 2 : 3));
        line.setAttribute('opacity', '0.7');
        svg.appendChild(line);
      }
    });

    // Create nodes
    nodes.forEach(node => {
      const nodeX = node.x * scale + centerX;
      const nodeY = node.y * scale + centerY;
      const nodeSize = node.size * scale * (isMobile ? 0.7 : 1);
      
      // Node circle
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', nodeX);
      circle.setAttribute('cy', nodeY);
      circle.setAttribute('r', nodeSize);
      circle.setAttribute('fill', node.color);
      circle.setAttribute('stroke', isDarkMode ? '#333' : '#fff');
      circle.setAttribute('stroke-width', '2');
      circle.setAttribute('opacity', hoveredNode === node.id ? '1' : '0.9');
      circle.style.cursor = 'pointer';
      circle.style.transition = 'opacity 0.2s, r 0.2s';
      
      // Add hover effects
      circle.addEventListener('mouseenter', () => {
        circle.setAttribute('r', nodeSize + 3);
        circle.setAttribute('opacity', '1');
        setHoveredNode(node.id);
      });
      
      circle.addEventListener('mouseleave', () => {
        circle.setAttribute('r', nodeSize);
        circle.setAttribute('opacity', '0.9');
        setHoveredNode(null);
      });
      
      svg.appendChild(circle);

      // Node label - only show on hover for mobile to save space
      if (!isMobile || hoveredNode === node.id) {
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', nodeX);
        text.setAttribute('y', nodeY + nodeSize + (isMobile ? 12 : 15));
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('fill', isDarkMode ? '#e0e0e0' : '#2c3e50');
        text.setAttribute('font-size', isMobile ? '10' : '12');
        text.setAttribute('font-weight', '500');
        text.textContent = node.label;
        svg.appendChild(text);
      }
    });

  }, [dimensions, isDarkMode, hoveredNode, isMobile]);

  return (
    <div ref={containerRef} style={{ 
      height: isMobile ? 200 : 280, 
      position: 'relative',
      width: '100%',
      overflow: 'hidden'
    }}>
      <svg
        ref={svgRef}
        width="100%"
        height="100%"
        viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
        preserveAspectRatio="xMidYMid meet"
      />
      <div style={{
        position: 'absolute',
        top: 8,
        right: 8,
        fontSize: isMobile ? '10px' : '12px',
        color: isDarkMode ? '#aaa' : '#666',
        background: isDarkMode ? 'rgba(30, 30, 46, 0.8)' : 'rgba(255, 255, 255, 0.8)',
        padding: '4px 8px',
        borderRadius: '4px',
        border: `1px solid ${isDarkMode ? '#333' : '#e9ecef'}`,
        zIndex: 1
      }}>
        Interactive SDG Map
      </div>
    </div>
  );
};

const DashboardContent = ({ isDarkMode = false }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const stats = [
    {
      label: 'Total Dokumen',
      value: '2200',
      icon: <ArticleIcon style={{ color: '#6366f1', fontSize: isMobile ? '1.2rem' : '1.5rem' }} />
    },
    {
      label: 'Hasil Analisis',
      value: '52',
      icon: <TrendingUpIcon style={{ color: '#10b981', fontSize: isMobile ? '1.2rem' : '1.5rem' }} />
    },
    {
      label: 'Dataset Uploaded',
      value: '15',
      icon: <UploadFileIcon style={{ color: '#f59e0b', fontSize: isMobile ? '1.2rem' : '1.5rem' }} />
    },
    {
      label: 'Rata-rata Akurasi',
      value: '90.5%',
      icon: <TargetIcon style={{ color: '#ef4444', fontSize: isMobile ? '1.2rem' : '1.5rem' }} />
    }
  ];

  const sdgsData = [
    { name: 'Education', value: 30, color: '#FF6B6B' },
    { name: 'Health', value: 25, color: '#4ECDC4' },
    { name: 'Environment', value: 20, color: '#45B7D1' },
    { name: 'Economy', value: 15, color: '#96CEB4' },
    { name: 'Other', value: 10, color: '#FFEAA7' }
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
    <div style={{ 
      maxWidth: '1440px', 
      margin: '0 auto', 
      padding: isMobile ? '0 8px' : '0 16px',
      paddingBottom: isMobile ? '16px' : '0'
    }}>
      {/* Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: isMobile ? '12px' : '20px',
        marginBottom: isMobile ? '16px' : '24px'
      }}>
        {stats.map((stat, index) => (
          <div key={index} style={{
            backgroundColor: bgColor,
            color: textColor,
            borderRadius: '12px',
            padding: isMobile ? '12px' : '20px',
            border: `1px solid ${borderColor}`,
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
          }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              marginBottom: isMobile ? 8 : 12 
            }}>
              <div style={{ 
                fontSize: isMobile ? '12px' : '14px', 
                fontWeight: 500 
              }}>
                {stat.label}
              </div>
              {stat.icon}
            </div>
            <div style={{ 
              fontSize: isMobile ? '22px' : '28px', 
              fontWeight: 700 
            }}>
              {stat.value}
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: isMobile ? '16px' : '20px', 
        marginBottom: isMobile ? '16px' : '24px' 
      }}>
        {/* SDGs Pie Chart */}
        <div style={{
          backgroundColor: bgColor,
          color: textColor,
          borderRadius: '12px',
          padding: isMobile ? '16px' : '20px',
          border: `1px solid ${borderColor}`,
          width: '100%',
          overflow: 'hidden'
        }}>
          <h3 style={{ 
            marginBottom: isMobile ? 12 : 16,
            fontSize: isMobile ? '16px' : '18px'
          }}>
            SDGs Distribution
          </h3>
          <div style={{ 
            height: isMobile ? 220 : 280,
            width: '100%',
            margin: '0 auto'
          }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie 
                  data={sdgsData} 
                  dataKey="value" 
                  cx="50%" 
                  cy="50%" 
                  outerRadius={isMobile ? '70%' : '80%'}
                  innerRadius={isMobile ? '40%' : '50%'}
                  labelLine={false}
                  label={({ name, percent }) => 
                    isMobile 
                      ? `${(percent * 100).toFixed(0)}%` // Hanya tampilkan persentase di mobile
                      : `${name} ${(percent * 100).toFixed(0)}%` // Tampilkan nama + persentase di desktop
                  }
                  style={{
                    fontSize: isMobile ? '10px' : '12px' // Ukuran font yang lebih kecil
                  }}
                >
                  {sdgsData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip isDarkMode={isDarkMode} />} />
                {!isMobile && (
                  <Legend 
                    layout="horizontal" 
                    verticalAlign="bottom" 
                    align="center"
                    wrapperStyle={{
                      paddingTop: '10px'
                    }}
                  />
                )}
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Knowledge Graph */}
        <div style={{
          backgroundColor: bgColor,
          color: textColor,
          borderRadius: '12px',
          padding: isMobile ? '16px' : '20px',
          border: `1px solid ${borderColor}`,
          width: '100%',
          overflow: 'hidden'
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px', 
            marginBottom: isMobile ? '12px' : '16px' 
          }}>
            <h3 style={{
              fontSize: isMobile ? '16px' : '18px',
              margin: 0
            }}>
              SDG Interconnections
            </h3>
          </div>
          <KnowledgeGraph isDarkMode={isDarkMode} isMobile={isMobile} />
          <div style={{ 
            marginTop: isMobile ? '12px' : '16px', 
            fontSize: isMobile ? '12px' : '14px', 
            color: isDarkMode ? '#aaa' : '#666',
            textAlign: 'center'
          }}>
            Visual representation of relationships between SDGs
          </div>
        </div>
      </div>

      {/* Recent Analyses Table */}
      <div style={{
        backgroundColor: bgColor,
        color: textColor,
        borderRadius: '12px',
        padding: isMobile ? '16px' : '20px',
        border: `1px solid ${borderColor}`,
        marginBottom: isMobile ? '16px' : '0',
        width: '100%',
        overflow: 'hidden'
      }}>
        <h3 style={{ 
          marginBottom: isMobile ? 12 : 16,
          fontSize: isMobile ? '16px' : '18px'
        }}>
          Recent Analyses
        </h3>
        <div style={{ 
          overflowX: 'auto',
          WebkitOverflowScrolling: 'touch'
        }}>
          <table style={{ 
            width: '100%', 
            borderCollapse: 'collapse',
            minWidth: isMobile ? '600px' : 'auto'
          }}>
            <thead>
              <tr style={{ backgroundColor: tableHeaderBg }}>
                <th style={{
                  textAlign: 'left',
                  padding: isMobile ? '12px 8px' : '16px',
                  fontWeight: '600',
                  borderBottom: `2px solid ${borderColor}`,
                  width: isMobile ? '40%' : '35%',
                  fontSize: isMobile ? '14px' : '16px'
                }}>Title</th>
                <th style={{
                  textAlign: 'center',
                  padding: isMobile ? '12px 8px' : '16px',
                  fontWeight: '600',
                  borderBottom: `2px solid ${borderColor}`,
                  width: isMobile ? '12%' : '10%',
                  fontSize: isMobile ? '14px' : '16px'
                }}>Topics</th>
                <th style={{
                  textAlign: 'center',
                  padding: isMobile ? '12px 8px' : '16px',
                  fontWeight: '600',
                  borderBottom: `2px solid ${borderColor}`,
                  width: isMobile ? '14%' : '12%',
                  fontSize: isMobile ? '14px' : '16px'
                }}>Docs</th>
                <th style={{
                  textAlign: 'center',
                  padding: isMobile ? '12px 8px' : '16px',
                  fontWeight: '600',
                  borderBottom: `2px solid ${borderColor}`,
                  width: isMobile ? '18%' : '15%',
                  fontSize: isMobile ? '14px' : '16px'
                }}>Date</th>
                <th style={{
                  textAlign: 'center',
                  padding: isMobile ? '12px 8px' : '16px',
                  fontWeight: '600',
                  borderBottom: `2px solid ${borderColor}`,
                  width: isMobile ? '16%' : '18%',
                  fontSize: isMobile ? '14px' : '16px'
                }}>Accuracy</th>
                <th style={{
                  textAlign: 'center',
                  padding: isMobile ? '12px 8px' : '16px',
                  fontWeight: '600',
                  borderBottom: `2px solid ${borderColor}`,
                  width: '10%',
                  fontSize: isMobile ? '14px' : '16px'
                }}>View</th>
              </tr>
            </thead>
            <tbody>
              {recentAnalyses.map((row, index) => (
                <tr key={index} style={{
                  borderBottom: `1px solid ${borderColor}`
                }}>
                  <td style={{ 
                    padding: isMobile ? '12px 8px' : '16px',
                    verticalAlign: 'middle'
                  }}>
                    <div style={{ 
                      display: 'flex', 
                      gap: isMobile ? 8 : 12, 
                      alignItems: 'center' 
                    }}>
                      <AssessmentIcon fontSize={isMobile ? "small" : "medium"} style={{ flexShrink: 0 }} />
                      <div>
                        <div style={{ 
                          fontWeight: 600, 
                          marginBottom: 4,
                          fontSize: isMobile ? '14px' : '16px',
                          lineHeight: 1.3
                        }}>
                          {isMobile ? row.title.split(' ')[0] + '...' : row.title}
                        </div>
                        <div style={{ 
                          fontSize: isMobile ? '11px' : '12px', 
                          color: isDarkMode ? '#aaa' : '#6c757d',
                          lineHeight: 1.4
                        }}>
                          {row.topics} Topics • {row.documents} Docs
                        </div>
                      </div>
                    </div>
                  </td>
                  <td style={{ 
                    padding: isMobile ? '12px 8px' : '16px', 
                    textAlign: 'center',
                    verticalAlign: 'middle',
                    fontWeight: '500',
                    fontSize: isMobile ? '14px' : '16px'
                  }}>
                    {row.topics}
                  </td>
                  <td style={{ 
                    padding: isMobile ? '12px 8px' : '16px', 
                    textAlign: 'center',
                    verticalAlign: 'middle',
                    fontWeight: '500',
                    fontSize: isMobile ? '14px' : '16px'
                  }}>
                    {row.documents}
                  </td>
                  <td style={{ 
                    padding: isMobile ? '12px 8px' : '16px', 
                    textAlign: 'center',
                    verticalAlign: 'middle',
                    fontSize: isMobile ? '12px' : '14px'
                  }}>
                    {isMobile ? row.date.split('-').slice(1).join('/') : row.date}
                  </td>
                  <td style={{ 
                    padding: isMobile ? '12px 8px' : '16px', 
                    textAlign: 'center',
                    verticalAlign: 'middle'
                  }}>
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      gap: isMobile ? 4 : 8 
                    }}>
                      <div style={{
                        width: isMobile ? 40 : 60,
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
                        fontSize: isMobile ? '12px' : '13px', 
                        fontWeight: '500',
                        minWidth: isMobile ? '30px' : '35px'
                      }}>
                        {row.accuracy}%
                      </span>
                    </div>
                  </td>
                  <td style={{ 
                    padding: isMobile ? '12px 8px' : '16px', 
                    textAlign: 'center',
                    verticalAlign: 'middle'
                  }}>
                    <button style={{
                      background: 'none',
                      border: 'none',
                      color: isDarkMode ? '#aaa' : '#6c757d',
                      cursor: 'pointer',
                      padding: '6px',
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
                      <VisibilityIcon fontSize={isMobile ? "small" : "medium"} />
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