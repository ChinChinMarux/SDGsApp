import React, { useEffect, useRef, useState } from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip
} from 'recharts';
import { useTheme } from '@mui/material/styles';
import ArticleIcon from '@mui/icons-material/Article';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import TargetIcon from '@mui/icons-material/TrackChanges';
import AssessmentIcon from '@mui/icons-material/Assessment';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AccountTreeIcon from '@mui/icons-material/AccountTree';

const KnowledgeGraph = ({ isDarkMode }) => {
  const theme = useTheme();
  const svgRef = useRef();
  const containerRef = useRef();
  const [dimensions, setDimensions] = useState({ width: 0, height: 300 });
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
        setDimensions({ width, height: 300 });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);

    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg || dimensions.width === 0) return;

    // Clear previous content
    svg.innerHTML = '';

    const centerX = dimensions.width / 2;
    const centerY = dimensions.height / 2;
    const scale = Math.min(dimensions.width, dimensions.height) / 300;

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
        line.setAttribute('stroke-width', link.strength * 3);
        line.setAttribute('opacity', '0.7');
        svg.appendChild(line);
      }
    });

    // Create nodes
    nodes.forEach(node => {
      const nodeX = node.x * scale + centerX;
      const nodeY = node.y * scale + centerY;
      const nodeSize = node.size * scale;
      
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

      // Node label
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('x', nodeX);
      text.setAttribute('y', nodeY + nodeSize + 15);
      text.setAttribute('text-anchor', 'middle');
      text.setAttribute('fill', isDarkMode ? '#e0e0e0' : '#2c3e50');
      text.setAttribute('font-size', '12');
      text.setAttribute('font-weight', '500');
      text.textContent = node.label;
      svg.appendChild(text);
    });

  }, [dimensions, isDarkMode, hoveredNode]);

  return (
    <div ref={containerRef} style={{ height: 300, position: 'relative' }}>
      <svg
        ref={svgRef}
        width="100%"
        height="100%"
        style={{ overflow: 'visible' }}
      />
      <div style={{
        position: 'absolute',
        top: 10,
        right: 10,
        fontSize: '12px',
        color: isDarkMode ? '#aaa' : '#666',
        background: isDarkMode ? 'rgba(30, 30, 46, 0.8)' : 'rgba(255, 255, 255, 0.8)',
        padding: '4px 8px',
        borderRadius: '4px',
        border: `1px solid ${isDarkMode ? '#333' : '#e9ecef'}`
      }}>
        Interactive SDG Knowledge Map
      </div>
    </div>
  );
};

const DashboardContent = ({ isDarkMode = false }) => {
  const theme = useTheme();
  
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
                <Pie 
                  data={sdgsData} 
                  dataKey="value" 
                  cx="50%" 
                  cy="50%" 
                  outerRadius={130} 
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {sdgsData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip isDarkMode={isDarkMode} />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Knowledge Graph */}
        <div style={{
          backgroundColor: bgColor,
          color: textColor,
          borderRadius: '12px',
          padding: '24px',
          border: `1px solid ${borderColor}`
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <AccountTreeIcon style={{ color: '#6366f1' }} />
            <h3>Knowledge Graph - SDG Interconnections</h3>
          </div>
          <KnowledgeGraph isDarkMode={isDarkMode} />
          <div style={{ 
            marginTop: '16px', 
            fontSize: '14px', 
            color: isDarkMode ? '#aaa' : '#666',
            textAlign: 'center'
          }}>
            Visual representation of relationships between Sustainable Development Goals
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