import React, { useEffect, useState, useRef } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import { useTheme } from '@mui/material/styles';

const GraphContent = () => {
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });
  const fgRef = useRef();
  const theme = useTheme();

  useEffect(() => {
    const fetchGraphData = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/graph-data');
        const data = await response.json();
        console.log('✅ Data berhasil diambil:', data);
        setGraphData(data);
      } catch (error) {
        console.error('❌ Gagal mengambil graph data:', error);
      }
    };

    fetchGraphData();
  }, []);

  useEffect(() => {
    if (graphData.nodes.length > 0 && fgRef.current) {
      setTimeout(() => {
        fgRef.current.zoomToFit(500);
      }, 500);
    }
  }, [graphData]);

  const getNodeColor = (node) => {
    switch (node.type) {
      case 'Publication': return '#FFD700';     // Kuning Emas
      case 'Author': return '#00BFFF';          // Biru Muda
      case 'Institution': return '#32CD32';     // Hijau Cerah
      case 'Topic': return '#FF69B4';           // Pink
      case 'SDG': return '#FF4500';             // Oranye Merah
      default: return '#999';
    }
  };

  const getNodeLabel = (node) => {
    return node.title || node.full_name || node.name || (node.keywords ? node.keywords.join(', ') : 'Node');
  };

  const isDark = theme.palette.mode === 'dark';
  const canvasBgColor = isDark ? '#0f172a' : '#ffffff';
  const labelColor = isDark ? '#e2e8f0' : '#333';

  // Legend node type dan warna
  const nodeTypes = [
    { label: 'Publication', color: '#FFD700' },
    { label: 'Author', color: '#00BFFF' },
    { label: 'Institution', color: '#32CD32' },
    { label: 'Topic', color: '#FF69B4' },
    { label: 'SDG', color: '#FF4500' }
  ];

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px' }}>
      <div style={{
        backgroundColor: isDark ? '#1e293b' : '#ffffff',
        border: '1px solid #e9ecef',
        borderRadius: '12px',
        padding: '24px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <AccountTreeIcon style={{ color: '#6366f1' }} />
          <h3 style={{ margin: 0, color: isDark ? '#f1f5f9' : '#111827' }}>
            Knowledge Graph Visualization
          </h3>
        </div>

        <div style={{
          border: '1px solid #ccc',
          borderRadius: '10px',
          overflow: 'hidden'
        }}>
          <ForceGraph2D
            ref={fgRef}
            graphData={graphData}
            backgroundColor={canvasBgColor}
            forceEngine="d3"
            cooldownTicks={100}
            nodeRelSize={6}
            width={window.innerWidth * 0.9}
            height={600}
            nodeLabel={getNodeLabel}
            nodeCanvasObject={(node, ctx, globalScale) => {
              const label = getNodeLabel(node);
              const fontSize = 12 / globalScale;
              ctx.font = `${fontSize}px Segoe UI, Sans-Serif`;
              ctx.fillStyle = getNodeColor(node);
              ctx.beginPath();
              ctx.arc(node.x, node.y, 5, 0, 2 * Math.PI, false);
              ctx.fill();
              ctx.fillStyle = labelColor;
              ctx.fillText(label, node.x + 8, node.y + 3);
            }}
            linkColor={() => '#aaa'}
            linkDirectionalArrowLength={4}
            linkDirectionalArrowRelPos={1}
          />
        </div>

        {/* Legend Warna Node */}
        <div style={{
          marginTop: '24px',
          padding: '8px 16px',
          borderRadius: '8px',
          backgroundColor: isDark ? '#0f172a' : '#f9fafb',
          border: '1px solid #ccc',
          display: 'flex',
          gap: '16px',
          flexWrap: 'wrap',
          justifyContent: 'center'
        }}>
          {nodeTypes.map((type) => (
            <div key={type.label} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                width: '16px',
                height: '16px',
                borderRadius: '50%',
                backgroundColor: type.color
              }} />
              <span style={{ color: isDark ? '#e2e8f0' : '#333' }}>{type.label}</span>
            </div>
          ))}
        </div>

        <div style={{
          marginTop: '16px',
          fontSize: '14px',
          color: isDark ? '#cbd5e1' : '#666',
          textAlign: 'center'
        }}>
          Interaktif graph antara publikasi, penulis, institusi, topik, dan SDG
        </div>
      </div>
    </div>
  );
};

export default GraphContent;