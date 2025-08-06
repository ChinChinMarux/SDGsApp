import React, { useState, useEffect } from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend
} from 'recharts';
import { 
  Article as ArticleIcon,
  TrendingUp as TrendingUpIcon,
  UploadFile as UploadFileIcon,
  TrackChanges as TargetIcon,
  Assessment as AssessmentIcon,
  Visibility as VisibilityIcon,
  MoreVert as MoreVertIcon,
  KeyboardArrowDown as ArrowDownIcon,
  Science as ScienceIcon,
  School as SchoolIcon,
  Business as BusinessIcon
} from '@mui/icons-material';

import { EnergySavingsLeafOutlined } from '@mui/icons-material';

// Knowledge Graph Component
const KnowledgeGraph = ({ isDarkMode, isMobile, data = [] }) => {
  const svgRef = React.useRef();
  const containerRef = React.useRef();
  const [dimensions, setDimensions] = useState({ width: 0, height: isMobile ? 200 : 280 });
  const [hoveredNode, setHoveredNode] = useState(null);

  const nodes = [
    { id: 'education', label: 'Education', x: 0, y: -80, size: 25, color: '#FF6B6B' },
    { id: 'health', label: 'Health', x: 80, y: -60, size: 22, color: '#4ECDC4' },
    { id: 'environment', label: 'Environment', x: 100, y: 50, size: 20, color: '#45B7D1' },
    { id: 'economy', label: 'Economy', x: 0, y: 120, size: 18, color: '#96CEB4' },
    { id: 'poverty', label: 'Poverty', x: -100, y: 100, size: 15, color: '#FFEAA7' }
  ];

  const links = data.length > 0 ? data : [
    { source: 'education', target: 'health', strength: 0.8 },
    { source: 'education', target: 'poverty', strength: 0.9 },
    { source: 'health', target: 'environment', strength: 0.7 }
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

    svg.innerHTML = '';
    const centerX = dimensions.width / 2;
    const centerY = dimensions.height / 2;
    const scale = Math.min(dimensions.width, dimensions.height) / (isMobile ? 250 : 300);

    // Create links
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

  }, [dimensions, isDarkMode, hoveredNode, isMobile, data]);

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
    </div>
  );
};

// Custom Icon Dropdown Component
const IconDropdown = ({ selectedCorpus, analyses, onCorpusChange, isDarkMode, isMobile }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const getCorpusIcon = (corpusId) => {
    const iconMap = {
      climate: <EnergySavingsLeafOutlined fontSize={isMobile ? "small" : "medium"} />,
      education: <SchoolIcon fontSize={isMobile ? "small" : "medium"} />,
      health: <ScienceIcon fontSize={isMobile ? "small" : "medium"} />,
      economy: <BusinessIcon fontSize={isMobile ? "small" : "medium"} />
    };
    return iconMap[corpusId] || <AssessmentIcon fontSize={isMobile ? "small" : "medium"} />;
  };

  const bgColor = isDarkMode ? '#2c2c3c' : '#ffffff';
  const borderColor = isDarkMode ? '#404040' : '#e0e0e0';
  const textColor = isDarkMode ? '#e0e0e0' : '#2c3e50';
  const hoverColor = isDarkMode ? '#3c3c4c' : '#f5f5f5';

  return (
    <div style={{ position: 'relative' }}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: isMobile ? '4px' : '8px',
          padding: isMobile ? '8px 12px' : '12px 16px',
          backgroundColor: bgColor,
          border: `1px solid ${borderColor}`,
          borderRadius: '8px',
          color: textColor,
          cursor: 'pointer',
          fontSize: isMobile ? '14px' : '16px',
          fontWeight: '500',
          transition: 'all 0.2s ease',
          minWidth: isMobile ? '50px' : '150px',
          justifyContent: isMobile ? 'center' : 'space-between'
        }}
        // onMouseEnter={(e) => {
        //   e.target.style.backgroundColor = bgColor;
        //   e.target.style.borderColor = isDarkMode ? '#6366f1' : '#4f46e5';
        // }}
        // onMouseLeave={(e) => {
        //   e.target.style.backgroundColor = bgColor;
        //   e.target.style.borderColor = borderColor;
        // }}
      >
        {getCorpusIcon(selectedCorpus)}
        {!isMobile && (
          <>
            <span style={{ flex: 1, textAlign: 'left' }}>
              {analyses.find(a => a.id === selectedCorpus)?.name || 'Select Analysis'}
            </span>
            <ArrowDownIcon 
              fontSize="small" 
              style={{ 
                transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s ease'
              }} 
            />
          </>
        )}
        {isMobile && (
          <ArrowDownIcon 
            fontSize="small" 
            style={{ 
              transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.2s ease',
              marginLeft: '4px'
            }} 
          />
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            right: 0,
            marginTop: '4px',
            backgroundColor: isDarkMode ? '#2c2c3c' : '#ffffff',
            border: `1px solid ${borderColor}`,
            borderRadius: '8px',
            boxShadow: isDarkMode ? '0 4px 12px rgba(0, 0, 0, 0.3)' : '0 4px 12px rgba(0, 0, 0, 0.15)',
            zIndex: 1000,
            minWidth: isMobile ? '200px' : '250px',
            maxHeight: '300px',
            overflowY: 'auto'
          }}
        >
          {analyses.map((analysis) => (
            <button
              key={analysis.id}
              onClick={() => {
                onCorpusChange(analysis.id);
                setIsOpen(false);
              }}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: isMobile ? '12px 16px' : '14px 18px',
                backgroundColor: 'transparent',
                border: 'none',
                color: textColor,
                cursor: 'pointer',
                fontSize: isMobile ? '14px' : '15px',
                fontWeight: selectedCorpus === analysis.id ? '600' : '500',
                textAlign: 'left',
                transition: 'background-color 0.2s ease',
                borderBottom: `1px solid ${isDarkMode ? '#333' : '#f0f0f0'}`,
                opacity: selectedCorpus === analysis.id ? 1 : 0.8
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = hoverColor;
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
              }}
            >
              <div style={{ 
                display: 'flex', 
                alignItems: 'center',
                color: selectedCorpus === analysis.id ? (isDarkMode ? '#818cf8' : '#6366f1') : textColor
              }}>
                {getCorpusIcon(analysis.id)}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ marginBottom: '2px' }}>
                  {analysis.name}
                </div>
                <div style={{ 
                  fontSize: isMobile ? '12px' : '13px', 
                  color: isDarkMode ? '#aaa' : '#666',
                  fontWeight: '400'
                }}>
                  {analysis.count} analisis
                </div>
              </div>
              {selectedCorpus === analysis.id && (
                <div style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: isDarkMode ? '#818cf8' : '#6366f1'
                }} />
              )}
            </button>
          ))}
        </div>
      )}

      {/* Overlay to close dropdown */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 999
          }}
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

// Data dummy untuk simulasi
const allAnalysesData = {
  "climate": {
    id: "climate",
    name: "Climate Action Analysis",
    document_count: 2200,
    dataset_count: 15,
    analysis_count: 8,
    average_accuracy: 90.5,
    last_analyzed: "2025-07-15",
    sdg_distribution: [
      { name: 'Education', count: 30, color: '#FF6B6B' },
      { name: 'Health', count: 25, color: '#4ECDC4' },
      { name: 'Environment', count: 45, color: '#45B7D1' }
    ],
    sdg_connections: [
      { source: 'education', target: 'health', strength: 0.8 },
      { source: 'education', target: 'environment', strength: 0.9 }
    ]
  },
  "education": {
    id: "education",
    name: "Education Quality Study",
    document_count: 1800,
    dataset_count: 12,
    analysis_count: 5,
    average_accuracy: 87.2,
    last_analyzed: "2025-06-28",
    sdg_distribution: [
      { name: 'Education', count: 60, color: '#FF6B6B' },
      { name: 'Gender Equality', count: 25, color: '#DDA0DD' },
      { name: 'Health', count: 15, color: '#4ECDC4' }
    ],
    sdg_connections: [
      { source: 'education', target: 'health', strength: 0.85 }
    ]
  },
  "health": {
    id: "health",
    name: "Health System Analysis",
    document_count: 1500,
    dataset_count: 10,
    analysis_count: 6,
    average_accuracy: 92.3,
    last_analyzed: "2025-07-20",
    sdg_distribution: [
      { name: 'Health', count: 55, color: '#4ECDC4' },
      { name: 'Education', count: 25, color: '#FF6B6B' },
      { name: 'Poverty', count: 20, color: '#FFEAA7' }
    ],
    sdg_connections: [
      { source: 'health', target: 'education', strength: 0.7 },
      { source: 'health', target: 'poverty', strength: 0.8 }
    ]
  },
  "economy": {
    id: "economy",
    name: "Economic Development Study",
    document_count: 1200,
    dataset_count: 8,
    analysis_count: 4,
    average_accuracy: 88.7,
    last_analyzed: "2025-07-10",
    sdg_distribution: [
      { name: 'Economy', count: 50, color: '#96CEB4' },
      { name: 'Education', count: 30, color: '#FF6B6B' },
      { name: 'Environment', count: 20, color: '#45B7D1' }
    ],
    sdg_connections: [
      { source: 'economy', target: 'education', strength: 0.75 },
      { source: 'economy', target: 'environment', strength: 0.65 }
    ]
  }
};

const allAnalysesResults = [
  {
    id: "climate_1",
    corpusId: "climate",
    title: "Climate Impact Study 1",
    topics_count: 10,
    documents_count: 30,
    accuracy: 95,
    date: "2025-07-15",
    corpusName: "Climate Action Analysis"
  },
  {
    id: "climate_2", 
    corpusId: "climate",
    title: "Climate Impact Study 2",
    topics_count: 12,
    documents_count: 35,
    accuracy: 92,
    date: "2025-07-10",
    corpusName: "Climate Action Analysis"
  },
  {
    id: "climate_3", 
    corpusId: "climate",
    title: "Global Warming Assessment",
    topics_count: 8,
    documents_count: 28,
    accuracy: 89,
    date: "2025-07-05",
    corpusName: "Climate Action Analysis"
  },
  {
    id: "climate_4", 
    corpusId: "climate",
    title: "Carbon Footprint Analysis",
    topics_count: 15,
    documents_count: 42,
    accuracy: 93,
    date: "2025-06-30",
    corpusName: "Climate Action Analysis"
  },
  {
    id: "climate_5", 
    corpusId: "climate",
    title: "Renewable Energy Study",
    topics_count: 11,
    documents_count: 33,
    accuracy: 91,
    date: "2025-06-25",
    corpusName: "Climate Action Analysis"
  },
  {
    id: "climate_6", 
    corpusId: "climate",
    title: "Ocean Temperature Analysis",
    topics_count: 9,
    documents_count: 26,
    accuracy: 88,
    date: "2025-06-20",
    corpusName: "Climate Action Analysis"
  },
  {
    id: "climate_7", 
    corpusId: "climate",
    title: "Deforestation Impact Report",
    topics_count: 13,
    documents_count: 38,
    accuracy: 94,
    date: "2025-06-15",
    corpusName: "Climate Action Analysis"
  },
  {
    id: "climate_8", 
    corpusId: "climate",
    title: "Climate Policy Evaluation",
    topics_count: 7,
    documents_count: 22,
    accuracy: 87,
    date: "2025-06-10",
    corpusName: "Climate Action Analysis"
  },
  {
    id: "edu_1",
    corpusId: "education",
    title: "Education Quality Assessment",
    topics_count: 12,
    documents_count: 45,
    accuracy: 87,
    date: "2025-06-28",
    corpusName: "Education Quality Study"
  },
  {
    id: "edu_2",
    corpusId: "education",
    title: "Digital Learning Impact",
    topics_count: 9,
    documents_count: 32,
    accuracy: 85,
    date: "2025-06-20",
    corpusName: "Education Quality Study"
  },
  {
    id: "edu_3",
    corpusId: "education",
    title: "Teacher Training Effectiveness",
    topics_count: 11,
    documents_count: 38,
    accuracy: 89,
    date: "2025-06-15",
    corpusName: "Education Quality Study"
  },
  {
    id: "edu_4",
    corpusId: "education",
    title: "Student Performance Analysis",
    topics_count: 8,
    documents_count: 29,
    accuracy: 86,
    date: "2025-06-10",
    corpusName: "Education Quality Study"
  },
  {
    id: "edu_5",
    corpusId: "education",
    title: "Remote Learning Study",
    topics_count: 10,
    documents_count: 35,
    accuracy: 88,
    date: "2025-06-05",
    corpusName: "Education Quality Study"
  },
  {
    id: "health_1",
    corpusId: "health",
    title: "Health System Review",
    topics_count: 8,
    documents_count: 25,
    accuracy: 88,
    date: "2025-07-20",
    corpusName: "Health System Analysis"
  },
  {
    id: "health_2",
    corpusId: "health",
    title: "Mental Health Study",
    topics_count: 10,
    documents_count: 30,
    accuracy: 92,
    date: "2025-07-15",
    corpusName: "Health System Analysis"
  },
  {
    id: "health_3",
    corpusId: "health",
    title: "Healthcare Access Analysis",
    topics_count: 12,
    documents_count: 35,
    accuracy: 90,
    date: "2025-07-10",
    corpusName: "Health System Analysis"
  },
  {
    id: "health_4",
    corpusId: "health",
    title: "Public Health Policy Review",
    topics_count: 9,
    documents_count: 28,
    accuracy: 91,
    date: "2025-07-05",
    corpusName: "Health System Analysis"
  },
  {
    id: "health_5",
    corpusId: "health",
    title: "Disease Prevention Study",
    topics_count: 11,
    documents_count: 33,
    accuracy: 89,
    date: "2025-06-30",
    corpusName: "Health System Analysis"
  },
  {
    id: "health_6",
    corpusId: "health",
    title: "Healthcare Technology Impact",
    topics_count: 7,
    documents_count: 22,
    accuracy: 93,
    date: "2025-06-25",
    corpusName: "Health System Analysis"
  },
  {
    id: "economy_1",
    corpusId: "economy",
    title: "Economic Growth Analysis",
    topics_count: 14,
    documents_count: 40,
    accuracy: 86,
    date: "2025-07-10",
    corpusName: "Economic Development Study"
  },
  {
    id: "economy_2",
    corpusId: "economy",
    title: "Market Trends Study",
    topics_count: 10,
    documents_count: 32,
    accuracy: 89,
    date: "2025-07-05",
    corpusName: "Economic Development Study"
  },
  {
    id: "economy_3",
    corpusId: "economy",
    title: "Employment Rate Analysis",
    topics_count: 12,
    documents_count: 38,
    accuracy: 87,
    date: "2025-06-30",
    corpusName: "Economic Development Study"
  },
  {
    id: "economy_4",
    corpusId: "economy",
    title: "Small Business Impact Study",
    topics_count: 8,
    documents_count: 26,
    accuracy: 91,
    date: "2025-06-25",
    corpusName: "Economic Development Study"
  }
];

const DashboardContent = ({ isDarkMode = false }) => {
  // Simulasi responsive detection
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [selectedCorpus, setSelectedCorpus] = useState('climate');
  const [analyses, setAnalyses] = useState([]);
  const [currentAnalysis, setCurrentAnalysis] = useState(null);
  const [allResults, setAllResults] = useState([]);
  const [showAllAnalyses, setShowAllAnalyses] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      const corpusData = allAnalysesData[selectedCorpus];
      setCurrentAnalysis(corpusData);
      
      const formattedAnalyses = Object.values(allAnalysesData).map(corpus => ({
        id: corpus.id,
        name: corpus.name,
        count: corpus.analysis_count
      }));
      
      setAnalyses(formattedAnalyses);
      setAllResults(allAnalysesResults);
    }, 300);

    return () => clearTimeout(timer);
  }, [selectedCorpus]);

  const handleCorpusChange = (corpusId) => {
    setSelectedCorpus(corpusId);
  };

  const stats = currentAnalysis ? [
    {
      label: 'Total Data',
      value: currentAnalysis.document_count.toLocaleString(),
      icon: <ArticleIcon style={{ color: '#6366f1', fontSize: isMobile ? '1.2rem' : '1.5rem' }} />
    },
    {
      label: 'Jumlah Analisis',
      value: currentAnalysis.analysis_count.toString(),
      icon: <TrendingUpIcon style={{ color: '#10b981', fontSize: isMobile ? '1.2rem' : '1.5rem' }} />
    },
    {
      label: 'Korpus Terupload',
      value: currentAnalysis.dataset_count.toString(),
      icon: <UploadFileIcon style={{ color: '#f59e0b', fontSize: isMobile ? '1.2rem' : '1.5rem' }} />
    },
    {
      label: 'Rata-rata Akurasi',
      value: `${currentAnalysis.average_accuracy.toFixed(1)}%`,
      icon: <TargetIcon style={{ color: '#ef4444', fontSize: isMobile ? '1.2rem' : '1.5rem' }} />
    }
  ] : [];

  const sdgsData = currentAnalysis?.sdg_distribution || [];
  
  // Filter dan sort recent analyses berdasarkan showAllAnalyses
  const filteredResults = showAllAnalyses 
    ? allResults.filter(result => result.corpusId === selectedCorpus)
    : [...allResults]
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 4);
  
  const recentAnalyses = filteredResults;

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const { name, count, color } = payload[0].payload;
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
          {name}: {count}
        </div>
      );
    }
    return null;
  };

  const bgColor = isDarkMode ? '#1e1e2e' : '#ffffff';
  const textColor = isDarkMode ? '#e0e0e0' : '#2c3e50';
  const borderColor = isDarkMode ? '#333' : '#e9ecef';
  const tableHeaderBg = isDarkMode ? '#2c2c3c' : '#f8f9fa';

  if (!currentAnalysis) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        color: textColor
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ marginBottom: '16px' }}>Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      maxWidth: '1440px', 
      margin: '0 auto', 
      padding: isMobile ? '0 8px' : '0 16px',
      paddingBottom: isMobile ? '16px' : '0',
      minHeight: '100vh'
    }}>
      {/* Header dengan Dropdown */}
      <div style={{
        marginBottom: isMobile ? '16px' : '24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: isMobile ? '16px' : '24px'
      }}>
        <h2 style={{ 
          margin: 0,
          fontSize: isMobile ? '18px' : '24px',
          color: textColor,
          fontWeight: '700'
        }}>
          Dashboard Analisis
        </h2>
        
        <IconDropdown
          selectedCorpus={selectedCorpus}
          analyses={analyses}
          onCorpusChange={handleCorpusChange}
          isDarkMode={isDarkMode}
          isMobile={isMobile}
        />
      </div>

      {/* Stats Cards */}
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
            boxShadow: isDarkMode ? '0 2px 8px rgba(0,0,0,0.3)' : '0 2px 8px rgba(0,0,0,0.08)',
            transition: 'transform 0.2s ease',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => {
            if (!isMobile) e.target.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            if (!isMobile) e.target.style.transform = 'translateY(0)';
          }}
          >
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

      {/* Charts Section */}
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
          boxShadow: isDarkMode ? '0 2px 8px rgba(0,0,0,0.3)' : '0 2px 8px rgba(0,0,0,0.08)',
          width: '100%',
          overflow: 'hidden'
        }}>
          <h3 style={{ 
            marginBottom: isMobile ? 12 : 16,
            fontSize: isMobile ? '16px' : '18px',
            fontWeight: '600'
          }}>
            Distribusi SDGs
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
                  dataKey="count" 
                  cx="50%" 
                  cy="50%" 
                  outerRadius={isMobile ? '70%' : '80%'}
                  innerRadius={isMobile ? '40%' : '50%'}
                  labelLine={false}
                  label={({ name, percent }) => 
                    isMobile 
                      ? `${(percent * 100).toFixed(0)}%`
                      : `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  style={{
                    fontSize: isMobile ? '10px' : '12px'
                  }}
                >
                  {sdgsData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
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
          boxShadow: isDarkMode ? '0 2px 8px rgba(0,0,0,0.3)' : '0 2px 8px rgba(0,0,0,0.08)',
          width: '100%',
          overflow: 'hidden'
        }}>
          <h3 style={{
            fontSize: isMobile ? '16px' : '18px',
            margin: 0,
            marginBottom: isMobile ? '12px' : '16px',
            fontWeight: '600'
          }}>
            Hubungan Antar SDGs
          </h3>
          <KnowledgeGraph 
            isDarkMode={isDarkMode} 
            isMobile={isMobile} 
            data={currentAnalysis.sdg_connections}
          />
          <div style={{ 
            marginTop: isMobile ? '12px' : '16px', 
            fontSize: isMobile ? '12px' : '14px', 
            color: isDarkMode ? '#aaa' : '#666',
            textAlign: 'center'
          }}>
            Visualisasi hubungan antara SDGs dalam korpus ini
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
        boxShadow: isDarkMode ? '0 2px 8px rgba(0,0,0,0.3)' : '0 2px 8px rgba(0,0,0,0.08)',
        marginBottom: isMobile ? '16px' : '0',
        width: '100%',
        overflow: 'hidden'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: isMobile ? 12 : 16
        }}>
          <h3 style={{ 
            margin: 0,
            fontSize: isMobile ? '16px' : '18px',
            fontWeight: '600'
          }}>
            {showAllAnalyses ? `Semua Analisis - ${currentAnalysis.name}` : 'Analisis Terbaru'}
          </h3>
          
          {/* Toggle button untuk desktop */}
          {!isMobile && (
            <button
              onClick={() => setShowAllAnalyses(!showAllAnalyses)}
              style={{
                padding: '6px 12px',
                backgroundColor: isDarkMode ? '#6366f1' : '#4f46e5',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'background-color 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = isDarkMode ? '#818cf8' : '#6366f1';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = isDarkMode ? '#6366f1' : '#4f46e5';
              }}
            >
              {showAllAnalyses ? 'Tampilkan Terbaru' : 'Lihat Semua'}
            </button>
          )}
        </div>
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
                }}>Data</th>
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
                  borderBottom: `1px solid ${borderColor}`,
                  transition: 'background-color 0.2s ease',
                  cursor: isMobile ? 'default' : 'pointer'
                }}
                onMouseEnter={(e) => {
                  if (!isMobile) {
                    e.currentTarget.style.backgroundColor = isDarkMode ? '#2c2c3c' : '#f8f9fa';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isMobile) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
                >
                  <td style={{ 
                    padding: isMobile ? '12px 8px' : '16px',
                    verticalAlign: 'middle'
                  }}>
                    <div style={{ 
                      display: 'flex', 
                      gap: isMobile ? 8 : 12, 
                      alignItems: 'center' 
                    }}>
                      <AssessmentIcon 
                        fontSize={isMobile ? "small" : "medium"} 
                        style={{ 
                          flexShrink: 0,
                          color: isDarkMode ? '#818cf8' : '#6366f1'
                        }} 
                      />
                      <div>
                        <div style={{ 
                          fontWeight: 600, 
                          marginBottom: 4,
                          fontSize: isMobile ? '14px' : '16px',
                          lineHeight: 1.3
                        }}>
                          {isMobile ? (row.title.length > 20 ? row.title.substring(0, 20) + '...' : row.title) : row.title}
                        </div>
                        <div style={{ 
                          fontSize: isMobile ? '11px' : '12px', 
                          color: isDarkMode ? '#aaa' : '#6c757d',
                          lineHeight: 1.4
                        }}>
                          {row.topics_count} Topics • {row.documents_count} Docs
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
                    {row.topics_count}
                  </td>
                  <td style={{ 
                    padding: isMobile ? '12px 8px' : '16px', 
                    textAlign: 'center',
                    verticalAlign: 'middle',
                    fontWeight: '500',
                    fontSize: isMobile ? '14px' : '16px'
                  }}>
                    {row.documents_count}
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
                          backgroundColor: row.accuracy > 90 ? '#28a745' : row.accuracy > 80 ? '#ffc107' : '#dc3545',
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
                      borderRadius: '6px',
                      transition: 'all 0.2s ease',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = isDarkMode ? '#444' : '#f8f9fa';
                      e.target.style.color = textColor;
                      e.target.style.transform = 'scale(1.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = 'transparent';
                      e.target.style.color = isDarkMode ? '#aaa' : '#6c757d';
                      e.target.style.transform = 'scale(1)';
                    }}
                    onClick={() => {
                      // Handle view action
                      console.log('View analysis:', row.id);
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
        
        {/* Mobile-friendly action buttons */}
        {isMobile && (
          <div style={{
            marginTop: '16px',
            display: 'flex',
            gap: '8px',
            justifyContent: 'center'
          }}>
            <button 
              onClick={() => setShowAllAnalyses(!showAllAnalyses)}
              style={{
                padding: '10px 20px',
                backgroundColor: isDarkMode ? '#6366f1' : '#4f46e5',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = isDarkMode ? '#818cf8' : '#6366f1';
                e.target.style.transform = 'translateY(-1px)';
                e.target.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = isDarkMode ? '#6366f1' : '#4f46e5';
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
              }}
            >
              {showAllAnalyses ? (
                <>
                  <ArrowDownIcon style={{ transform: 'rotate(90deg)' }} fontSize="small" />
                  Tampilkan Terbaru
                </>
              ) : (
                <>
                  <VisibilityIcon fontSize="small" />
                  Lihat Semua ({currentAnalysis?.analysis_count || 0})
                </>
              )}
            </button>
            
            {showAllAnalyses && (
              <button 
                onClick={() => {
                  // Simulasi export atau download functionality
                  alert(`Mengexport ${filteredResults.length} analisis dari ${currentAnalysis.name}`);
                }}
                style={{
                  padding: '10px 16px',
                  backgroundColor: 'transparent',
                  color: isDarkMode ? '#e0e0e0' : '#2c3e50',
                  border: `1px solid ${borderColor}`,
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = isDarkMode ? '#2c2c3c' : '#f8f9fa';
                  e.target.style.borderColor = isDarkMode ? '#6366f1' : '#4f46e5';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.borderColor = borderColor;
                }}
              >
                <UploadFileIcon fontSize="small" />
                Export
              </button>
            )}
          </div>
        )}
        
        {/* Show analysis count info */}
        {showAllAnalyses && (
          <div style={{
            marginTop: isMobile ? '12px' : '16px',
            padding: isMobile ? '8px 12px' : '10px 16px',
            backgroundColor: isDarkMode ? '#2c2c3c' : '#f8f9fa',
            borderRadius: '6px',
            fontSize: isMobile ? '12px' : '13px',
            color: isDarkMode ? '#aaa' : '#666',
            textAlign: 'center',
            border: `1px solid ${borderColor}`
          }}>
            Menampilkan {filteredResults.length} dari {currentAnalysis?.analysis_count || 0} analisis dalam korpus ini
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardContent;