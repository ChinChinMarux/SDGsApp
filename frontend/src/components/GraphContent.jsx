import React, { useEffect, useState, useRef } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import { useTheme } from '@mui/material/styles';
import { useAuth } from '@clerk/clerk-react';

import SDGBarChart from './SDGBarChart.jsx';
import InstitutionPieChart from './InstitutionPieChart.jsx';

const GraphContent = () => {
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });
  const [hoveredNode, setHoveredNode] = useState(null);
  const fgRef = useRef();
  const theme = useTheme();
  const { getToken } = useAuth();
  const isDark = theme.palette.mode === 'dark';
  const canvasBgColor = isDark ? '#0f172a' : '#ffffff';
  const labelColor = isDark ? '#e2e8f0' : '#333';

  // Define node types and their colors
  const nodeTypes = [
    { label: 'Publication', color: '#FFD700' },
    { label: 'Author', color: '#00BFFF' },
    { label: 'Institution', color: '#32CD32' },
    { label: 'Topic', color: '#FF69B4' },
    { label: 'SDG', color: '#FF4500' },
  ];

  // Fetch graph data from the API
  useEffect(() => {
    const fetchGraphData = async () => {
      try {
        const token = await getToken();
        if (!token) {
          console.error('Token autentikasi tidak ditemukan.');
          return;
        }

        const response = await fetch('http://127.0.0.1:8000/api/graph-data', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Data berhasil diambil:', data);
        setGraphData(data);
      } catch (error) {
        console.error('Gagal mengambil graph data:', error);
      }
    };

    fetchGraphData();
  }, [getToken]);

  // Zoom to fit the graph after data is loaded
  useEffect(() => {
    if (graphData.nodes.length > 0 && fgRef.current) {
      setTimeout(() => {
        fgRef.current.zoomToFit(500);
      }, 500);
    }
  }, [graphData]);

  // Get color for each node based on its type
  const getNodeColor = (node) => {
    const type = nodeTypes.find((t) => t.label === node.type);
    return type ? type.color : '#999';
  };

  // Get label for each node
  const getNodeLabel = (node) => {
    if (node.type === 'SDG') {
      return `${node.name}`;
    }
    return (
      node.title ||
      node.full_name ||
      node.name ||
      (node.keywords ? node.keywords.join(', ') : 'Node')
    );
  };

  // Handle node click events
  const handleNodeClick = (node) => {
    if (node.type === 'SDG') {
      const relatedLinks = graphData.links.filter(
        (link) => link.target === node.id && link.type === 'MAPS_TO_SDG'
      );
      const topicIds = relatedLinks.map((link) => link.source);

      const relatedTopics = graphData.nodes
        .filter((n) => topicIds.includes(n.id))
        .map((t) => t.keywords.join(', '));

      const relatedPublications = graphData.links
        .filter(
          (link) =>
            topicIds.includes(link.target) && link.type === 'HAS_TOPIC'
        )
        .map((link) => {
          const pub = graphData.nodes.find((n) => n.id === link.source);
          return pub?.title;
        });

      console.log(`🟧 Klik pada SDG: ${node.name}`);
      console.log('Topik terkait:', relatedTopics);
      console.log('Publikasi terkait:', relatedPublications);
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px', position: 'relative' }}>
      {/* Knowledge Graph Visualization */}
      <div
        style={{
          backgroundColor: isDark ? '#1e293b' : '#ffffff',
          border: '1px solid #e9ecef',
          borderRadius: '12px',
          padding: '24px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <AccountTreeIcon style={{ color: '#6366f1' }} />
          <h3 style={{ margin: 0, color: isDark ? '#f1f5f9' : '#111827' }}>
            Knowledge Graph Visualization
          </h3>
        </div>

        <div
          style={{
            border: '1px solid #ccc',
            borderRadius: '10px',
            overflow: 'hidden',
          }}
        >
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
            linkLabel={(link) =>
              link.topic_probability
                ? `Probabilitas topik: ${link.topic_probability}`
                : link.type
            }
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
            onNodeClick={handleNodeClick}
            onNodeHover={setHoveredNode}
          />
        </div>

        {/* Interactive Tooltip */}
        {hoveredNode?.type === 'SDG' && (
          <div
            style={{
              position: 'absolute',
              top: 80,
              right: 40,
              backgroundColor: isDark ? '#1e293b' : '#ffffff',
              color: isDark ? '#f1f5f9' : '#111827',
              padding: '12px 16px',
              border: '1px solid #ccc',
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              whiteSpace: 'pre-wrap',
              maxWidth: '400px',
              zIndex: 10,
            }}
          >
            <div style={{ marginTop: '8px', fontSize: '13px' }}>
              {hoveredNode.tooltip}
            </div>
          </div>
        )}

        {/* Node Legend */}
        <div
          style={{
            marginTop: '24px',
            padding: '8px 16px',
            borderRadius: '8px',
            backgroundColor: isDark ? '#0f172a' : '#f9fafb',
            border: '1px solid #ccc',
            display: 'flex',
            gap: '16px',
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}
        >
          {nodeTypes.map((type) => (
            <div
              key={type.label}
              style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <div
                style={{
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  backgroundColor: type.color,
                }}
              />
              <span style={{ color: isDark ? '#e2e8f0' : '#333' }}>
                {type.label}
              </span>
            </div>
          ))}
        </div>

        <div
          style={{
            marginTop: '16px',
            fontSize: '14px',
            color: isDark ? '#cbd5e1' : '#666',
            textAlign: 'center',
          }}
        >
          Interaktif graph antara publikasi, penulis, institusi, topik, dan SDG
        </div>
      </div>

      {/* Additional Visualizations (Bar Chart and Pie Chart) */}
      <div
        style={{ display: 'flex', gap: '24px', marginTop: '24px', flexWrap: 'wrap' }}
      >
        {/* SDG Bar Chart */}
        <div
          style={{
            flex: '1 1 45%',
            backgroundColor: isDark ? '#1e293b' : '#ffffff',
            border: '1px solid #ccc',
            borderRadius: '8px',
            padding: '16px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          }}
        >
          <h4
            style={{
              textAlign: 'center',
              margin: '0 0 16px',
              color: isDark ? '#f1f5f9' : '#111827',
            }}
          >
            Jumlah Publikasi per SDG
          </h4>
          <SDGBarChart />
        </div>

        {/* Institution Pie Chart */}
        <div
          style={{
            flex: '1 1 45%',
            backgroundColor: isDark ? '#1e293b' : '#ffffff',
            border: '1px solid #ccc',
            borderRadius: '8px',
            padding: '16px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          }}
        >
          <h4
            style={{
              textAlign: 'center',
              margin: '0 0 16px',
              color: isDark ? '#f1f5f9' : '#111827',
            }}
          >
            Distribusi Publikasi per Institusi
          </h4>
          <InstitutionPieChart />
        </div>
      </div>
    </div>
  );
};

export default GraphContent;