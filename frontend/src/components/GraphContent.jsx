<<<<<<< HEAD
// import React, { useEffect, useState, useRef } from 'react';
// import ForceGraph2D from 'react-force-graph-2d';
// import AccountTreeIcon from '@mui/icons-material/AccountTree';
// import { useTheme } from '@mui/material/styles';

// const GraphContent = () => {
//   const [graphData, setGraphData] = useState({ nodes: [], links: [] });
//   const fgRef = useRef();
//   const theme = useTheme();

//   useEffect(() => {
//     const fetchGraphData = async () => {
//       try {
//         const response = await fetch('http://127.0.0.1:8000/api/graph-data');
//         const data = await response.json();
//         console.log('✅ Data berhasil diambil:', data);
//         setGraphData(data);
//       } catch (error) {
//         console.error('❌ Gagal mengambil graph data:', error);
//       }
//     };

//     fetchGraphData();
//   }, []);

//   useEffect(() => {
//     if (graphData.nodes.length > 0 && fgRef.current) {
//       setTimeout(() => {
//         fgRef.current.zoomToFit(500);
//       }, 500);
//     }
//   }, [graphData]);

//   const getNodeColor = (node) => {
//     switch (node.type) {
//       case 'Publication': return '#FFD700';
//       case 'Author': return '#00BFFF';
//       case 'Institution': return '#32CD32';
//       case 'Topic': return '#FF69B4';
//       case 'SDG': return '#FF4500';
//       default: return '#999';
//     }
//   };

//   const getNodeLabel = (node) => {
//     return node.title || node.full_name || node.name || (node.keywords ? node.keywords.join(', ') : 'Node');
//   };

//   const getNodeTooltip = (node) => {
//     if (node.type === 'SDG') {
//       const incomingLinks = graphData.links.filter(link =>
//         link.target === node.id && link.type === 'MAPS_TO_SDG'
//       );

//       const topicDetails = incomingLinks.map(link => {
//         const topicNode = graphData.nodes.find(n => n.id === link.source);
//         const topicLabel = topicNode?.keywords?.join(', ') || 'Unknown Topic';
//         const topicWeight = link.mapping_weight;

//         const pubLinks = graphData.links.filter(l =>
//           l.target === topicNode.id && l.type === 'HAS_TOPIC'
//         );

//         const authorInstitutions = pubLinks.flatMap(plink => {
//           const pubId = plink.source;
//           const authorLinks = graphData.links.filter(a => a.source === pubId && a.type === 'AUTHORED_BY');

//           return authorLinks.map(a => {
//             const authorNode = graphData.nodes.find(n => n.id === a.target);
//             const instLink = graphData.links.find(i => i.source === authorNode?.id && i.type === 'AFFILIATED_WITH');
//             const inst = instLink ? graphData.nodes.find(n => n.id === instLink.target) : null;

//             return {
//               author: authorNode?.full_name || 'Unknown Author',
//               institution: inst?.name || 'Unknown Institution'
//             };
//           });
//         });

//         const uniqueAuthors = Array.from(
//           new Set(authorInstitutions.map(ai => `${ai.author}|${ai.institution}`))
//         ).map(item => {
//           const [author, institution] = item.split('|');
//           return `  Author: ${author}\n  Institution: ${institution}`;
//         });

//         return `- ${topicLabel} (weight: ${topicWeight})\n${uniqueAuthors.join('\n')}`;
//       });

//       return `${node.name}\nMapped from topic:\n${topicDetails.join('\n')}`;
//     }

//     return getNodeLabel(node);
//   };

//   const isDark = theme.palette.mode === 'dark';
//   const canvasBgColor = isDark ? '#0f172a' : '#ffffff';
//   const labelColor = isDark ? '#e2e8f0' : '#333';

//   const nodeTypes = [
//     { label: 'Publication', color: '#FFD700' },
//     { label: 'Author', color: '#00BFFF' },
//     { label: 'Institution', color: '#32CD32' },
//     { label: 'Topic', color: '#FF69B4' },
//     { label: 'SDG', color: '#FF4500' }
//   ];

//   const handleNodeClick = (node) => {
//     if (node.type === 'SDG') {
//       const relatedTopics = graphData.links.filter(link => link.target === node.id && link.type === 'MAPS_TO_SDG');
//       const topicIds = relatedTopics.map(link => link.source);
//       const relatedPublications = graphData.links.filter(link => topicIds.includes(link.target) && link.type === 'HAS_TOPIC');

//       const topicKeywords = topicIds.map(tid => {
//         const t = graphData.nodes.find(n => n.id === tid);
//         return t?.keywords?.join(', ');
//       });

//       const pubTitles = relatedPublications.map(link => {
//         const p = graphData.nodes.find(n => n.id === link.source);
//         return p?.title;
//       });

//       console.log(`🟧 Klik pada SDG: ${node.name}`);
//       console.log('Topik terkait:', topicKeywords);
//       console.log('Publikasi terkait:', pubTitles);
//     }
//   };

//   return (
//     <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px' }}>
//       <div style={{
//         backgroundColor: isDark ? '#1e293b' : '#ffffff',
//         border: '1px solid #e9ecef',
//         borderRadius: '12px',
//         padding: '24px',
//         boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
//       }}>
//         <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
//           <AccountTreeIcon style={{ color: '#6366f1' }} />
//           <h3 style={{ margin: 0, color: isDark ? '#f1f5f9' : '#111827' }}>
//             Knowledge Graph Visualization
//           </h3>
//         </div>

//         <div style={{
//           border: '1px solid #ccc',
//           borderRadius: '10px',
//           overflow: 'hidden'
//         }}>
//           <ForceGraph2D
//             ref={fgRef}
//             graphData={graphData}
//             backgroundColor={canvasBgColor}
//             forceEngine="d3"
//             cooldownTicks={100}
//             nodeRelSize={6}
//             width={window.innerWidth * 0.9}
//             height={600}
//             nodeLabel={getNodeTooltip}
//             linkLabel={(link) => link.topic_probability ? `Probabilitas topik: ${link.topic_probability}` : link.type}
//             nodeCanvasObject={(node, ctx, globalScale) => {
//               const label = getNodeLabel(node);
//               const fontSize = 12 / globalScale;
//               ctx.font = `${fontSize}px Segoe UI, Sans-Serif`;
//               ctx.fillStyle = getNodeColor(node);
//               ctx.beginPath();
//               ctx.arc(node.x, node.y, 5, 0, 2 * Math.PI, false);
//               ctx.fill();
//               ctx.fillStyle = labelColor;
//               ctx.fillText(label, node.x + 8, node.y + 3);
//             }}
//             linkColor={() => '#aaa'}
//             linkDirectionalArrowLength={4}
//             linkDirectionalArrowRelPos={1}
//             onNodeClick={handleNodeClick}
//           />
//         </div>

//         <div style={{
//           marginTop: '24px',
//           padding: '8px 16px',
//           borderRadius: '8px',
//           backgroundColor: isDark ? '#0f172a' : '#f9fafb',
//           border: '1px solid #ccc',
//           display: 'flex',
//           gap: '16px',
//           flexWrap: 'wrap',
//           justifyContent: 'center'
//         }}>
//           {nodeTypes.map((type) => (
//             <div key={type.label} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
//               <div style={{
//                 width: '16px',
//                 height: '16px',
//                 borderRadius: '50%',
//                 backgroundColor: type.color
//               }} />
//               <span style={{ color: isDark ? '#e2e8f0' : '#333' }}>{type.label}</span>
//             </div>
//           ))}
//         </div>

//         <div style={{
//           marginTop: '16px',
//           fontSize: '14px',
//           color: isDark ? '#cbd5e1' : '#666',
//           textAlign: 'center'
//         }}>
//           Interaktif graph antara publikasi, penulis, institusi, topik, dan SDG
//         </div>
//       </div>
//     </div>
//   );
// };

// export default GraphContent;

import React, { useEffect, useState, useRef } from "react";
import ForceGraph2D from "react-force-graph-2d";
import {
  AccountTree as AccountTreeIcon,
  ZoomIn as ZoomInIcon,
  ZoomOut as ZoomOutIcon,
  CenterFocusStrong as CenterIcon,
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
  Settings as SettingsIcon,
  KeyboardArrowDown as ArrowDownIcon,
} from "@mui/icons-material";
import {
  useTheme,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Paper,
} from "@mui/material";

const GraphContent = ({ toggleDarkMode, isdarkmode }) => {
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [anchorEl, setAnchorEl] = useState(null);
  const fgRef = useRef();
  const theme = useTheme();

  const isMobile = windowSize.width < 768;
  const open = Boolean(anchorEl);

  // Fetch graph data from backend API
  useEffect(() => {
    const fetchGraphData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("http://127.0.0.1:8000/api/graph-data");
        const data = await response.json();

        // Process the data to match expected format
        const processedNodes = data.nodes.map((node) => {
          const baseNode = {
            id: node.id,
            type: node.type,
            name:
              node.name ||
              node.title ||
              node.full_name ||
              node.keywords?.join(", ") ||
              "Node",
          };

          // Add additional properties based on type
          if (node.type === "Publication") {
            baseNode.title = node.title;
          } else if (node.type === "Author") {
            baseNode.full_name = node.full_name;
          } else if (node.type === "Institution") {
            baseNode.name = node.name;
            baseNode.country = node.country;
          } else if (node.type === "Topic") {
            baseNode.keywords = node.keywords;
          } else if (node.type === "SDG") {
            baseNode.name = node.name;
            baseNode.tooltip = node.tooltip;
          }

          return baseNode;
        });

        const processedLinks = data.links.map((link) => ({
          source: link.source,
          target: link.target,
          type: link.type,
          topic_probability: link.topic_probability,
          mapping_weight: link.mapping_weight,
          tooltip: link.tooltip || `${link.type}`,
        }));

        setGraphData({
          nodes: processedNodes,
          links: processedLinks,
        });
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to fetch graph data:", error);
        setIsLoading(false);
      }
    };
=======
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

  useEffect(() => {
    const fetchGraphData = async () => {
      try {
        const token = await getToken();
        if (!token) {
          console.error("Token autentikasi tidak ditemukan.");
          return;
        }
>>>>>>> 7f1b227 (Deskripsi perubahan keseluruhan project)

        const response = await fetch('http://127.0.0.1:8000/api/graph-data', {
          headers: {
            'Authorization': `Bearer ${token}` 
          }
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

<<<<<<< HEAD
  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Auto-zoom when data loads
  useEffect(() => {
    if (graphData.nodes.length > 0 && fgRef.current) {
      setTimeout(() => {
        fgRef.current.zoomToFit(400, 100);
      }, 500);
    }
  }, [graphData]);

  // Graph control functions
  const handleZoomIn = () => {
    fgRef.current.zoom(1.2, 200);
    handleClose();
  };

  const handleZoomOut = () => {
    fgRef.current.zoom(0.8, 200);
    handleClose();
  };

  const handleCenter = () => {
    // Calculate center of all nodes
    let minX = Infinity,
      maxX = -Infinity,
      minY = Infinity,
      maxY = -Infinity;

    graphData.nodes.forEach((node) => {
      minX = Math.min(minX, node.x || 0);
      maxX = Math.max(maxX, node.x || 0);
      minY = Math.min(minY, node.y || 0);
      maxY = Math.max(maxY, node.y || 0);
    });

    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;
    const width = maxX - minX;
    const height = maxY - minY;

    // Zoom to fit with some padding
    fgRef.current.centerAt(centerX, centerY, 1000);
    fgRef.current.zoomToFit(width * 1.2, height * 1.2, 1000);
    handleClose();
  };

  // Settings menu handlers
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // Node styling functions
  const getNodeColor = (node) => {
    const colors = {
      Publication: "#FFD700",
      Author: "#00BFFF",
      Institution: "#32CD32",
      Topic: "#FF69B4",
      SDG: "#FF4500",
    };
    return colors[node.type] || "#999";
  };

  const getNodeLabel = (node) => {
    return node.name || "Node";
  };

  // Theme colors
  const cardBg = isdarkmode ? "#1e293b" : "#ffffff";
  const borderColor = isdarkmode ? "#374151" : "#e5e7eb";
  const textColor = isdarkmode ? "#f1f5f9" : "#111827";
  const dropdownBg = isdarkmode ? "#1e293b" : "#ffffff";
  const hoverBg = isdarkmode ? "#334155" : "#f8fafc";
  const activeBg = isdarkmode ? "#475569" : "#e2e8f0";

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "500px",
          backgroundColor: cardBg,
          borderRadius: "12px",
          border: `1px solid ${borderColor}`,
          color: textColor,
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: "40px",
              height: "40px",
              border: `3px solid ${borderColor}`,
              borderTop: `3px solid ${isdarkmode ? "#6366f1" : "#4f46e5"}`,
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
              margin: "0 auto 16px",
            }}
          />
          <div>Loading Knowledge Graph...</div>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        maxWidth: "1400px",
        margin: "0 auto",
        padding: isMobile ? "16px" : "24px",
      }}
    >
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          .dropdown-button {
            position: relative;
            display: inline-flex;
            align-items: center;
            padding: 8px 16px;
            border-radius: 10px;
            border: 1px solid ${borderColor};
            background: ${
              isdarkmode
                ? "linear-gradient(145deg, #1e293b 0%, #334155 100%)"
                : "linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)"
            };
            color: ${textColor};
            cursor: pointer;
            transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
            box-shadow: ${
              isdarkmode
                ? "0 2px 8px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)"
                : "0 2px 8px rgba(0, 0, 0, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.8)"
            };
            gap: 8px;
            font-weight: 500;
            font-size: 14px;
            min-width: ${isMobile ? "44px" : "120px"};
            justify-content: center;
          }
          
          .dropdown-button:hover {
            transform: translateY(-1px);
            box-shadow: ${
              isdarkmode
                ? "0 4px 16px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.15)"
                : "0 4px 16px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.9)"
            };
            border-color: ${isdarkmode ? "#475569" : "#cbd5e1"};
            background: ${
              isdarkmode
                ? "linear-gradient(145deg, #334155 0%, #475569 100%)"
                : "linear-gradient(145deg, #f8fafc 0%, #f1f5f9 100%)"
            };
          }
          
          .dropdown-button:active {
            transform: translateY(0px);
            box-shadow: ${
              isdarkmode
                ? "0 1px 4px rgba(0, 0, 0, 0.4), inset 0 2px 4px rgba(0, 0, 0, 0.2)"
                : "0 1px 4px rgba(0, 0, 0, 0.1), inset 0 2px 4px rgba(0, 0, 0, 0.05)"
            };
          }
          
          .dropdown-arrow {
            transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
            ${open ? "transform: rotate(180deg);" : ""}
          }
          
          .menu-item {
            display: flex;
            align-items: center;
            padding: 12px 16px;
            margin: 4px 8px;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
            border: 1px solid transparent;
            position: relative;
            gap: 12px;
            font-weight: 500;
          }
          
          .menu-item:hover {
            background: ${hoverBg};
            border-color: ${isdarkmode ? "#475569" : "#e2e8f0"};
            transform: translateX(2px);
          }
          
          .menu-item:active {
            background: ${activeBg};
            transform: translateX(1px);
          }
          
          .menu-icon {
            width: 20px;
            height: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 6px;
            background: ${
              isdarkmode
                ? "linear-gradient(145deg, #374151 0%, #4b5563 100%)"
                : "linear-gradient(145deg, #f1f5f9 0%, #e2e8f0 100%)"
            };
            color: ${isdarkmode ? "#a5b4fc" : "#6366f1"};
            transition: all 0.15s ease;
          }
          
          .menu-item:hover .menu-icon {
            background: ${
              isdarkmode
                ? "linear-gradient(145deg, #6366f1 0%, #8b5cf6 100%)"
                : "linear-gradient(145deg, #6366f1 0%, #8b5cf6 100%)"
            };
            color: white;
            transform: scale(1.1);
          }
        `}
      </style>

      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: isMobile ? "16px" : "24px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <AccountTreeIcon
            style={{
              color: isdarkmode ? "#818cf8" : "#6366f1",
              fontSize: isMobile ? "24px" : "28px",
            }}
          />
          <h2
            style={{
              margin: 0,
              fontSize: isMobile ? "20px" : "24px",
              fontWeight: "700",
              color: textColor,
            }}
          >
            Knowledge Graph
          </h2>
        </div>

        {/* Enhanced Controls */}
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <div>
            <div
              className="dropdown-button"
              onClick={handleClick}
              aria-controls={open ? "graph-controls-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
            >
              <SettingsIcon style={{ fontSize: "18px" }} />
              {!isMobile && <span>Controls</span>}
              <ArrowDownIcon
                className="dropdown-arrow"
                style={{ fontSize: "16px" }}
              />
            </div>

            <Menu
              id="graph-controls-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                "aria-labelledby": "graph-controls-button",
                style: { padding: "8px 0" },
              }}
              PaperProps={{
                style: {
                  backgroundColor: dropdownBg,
                  border: `1px solid ${borderColor}`,
                  borderRadius: "12px",
                  minWidth: "200px",
                  boxShadow: isdarkmode
                    ? "0 10px 38px rgba(0, 0, 0, 0.35), 0 10px 20px rgba(0, 0, 0, 0.2)"
                    : "0 10px 38px rgba(22, 23, 24, 0.1), 0 10px 20px rgba(22, 23, 24, 0.05)",
                  backdropFilter: "blur(8px)",
                  overflow: "visible",
                },
              }}
              transformOrigin={{ horizontal: "right", vertical: "top" }}
              anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
              slotProps={{
                paper: {
                  style: {
                    marginTop: "8px",
                  },
                },
              }}
            >
              <div className="menu-item" onClick={handleZoomIn}>
                <div className="menu-icon">
                  <ZoomInIcon style={{ fontSize: "16px" }} />
                </div>
                <span style={{ color: textColor, fontSize: "14px" }}>
                  Zoom In
                </span>
              </div>

              <div className="menu-item" onClick={handleZoomOut}>
                <div className="menu-icon">
                  <ZoomOutIcon style={{ fontSize: "16px" }} />
                </div>
                <span style={{ color: textColor, fontSize: "14px" }}>
                  Zoom Out
                </span>
              </div>

              <div className="menu-item" onClick={handleCenter}>
                <div className="menu-icon">
                  <CenterIcon style={{ fontSize: "16px" }} />
                </div>
                <span style={{ color: textColor, fontSize: "14px" }}>
                  Center View
                </span>
              </div>
            </Menu>
          </div>
        </div>
      </div>

      {/* Graph Container */}
      <div
        style={{
          backgroundColor: cardBg,
          borderRadius: "12px",
          border: `1px solid ${borderColor}`,
          overflow: "hidden",
          boxShadow: isdarkmode
            ? "0 4px 6px rgba(0,0,0,0.3)"
            : "0 4px 6px rgba(0,0,0,0.07)",
        }}
      >
        <div
          style={{
            borderBottom: `1px solid ${borderColor}`,
            height: isMobile ? "400px" : "600px",
            minHeight: "400px",
          }}
        >
          <ForceGraph2D
            ref={fgRef}
            graphData={graphData}
            backgroundColor={isdarkmode ? "#0f172a" : "#ffffff"}
            width={
              isMobile
                ? Math.min(windowSize.width - 32, 600)
                : windowSize.width * 0.9
            }
            height={isMobile ? Math.min(windowSize.height * 0.6, 600) : 600}
            nodeLabel={(node) => {
              if (node.type === "SDG" && node.tooltip) {
                return node.tooltip;
              }
              return `${node.type}: ${getNodeLabel(node)}`;
            }}
            nodeColor={(node) => getNodeColor(node)}
            nodeAutoColorBy="type"
            linkColor={() => (isdarkmode ? "#4b5563" : "#d1d5db")}
            linkDirectionalArrowLength={4}
            linkDirectionalArrowRelPos={1}
            linkWidth={(link) =>
              link.topic_probability
                ? link.topic_probability * 3
                : link.mapping_weight
                ? link.mapping_weight * 3
                : 1
            }
            linkLabel={(link) => link.tooltip || link.type}
            cooldownTicks={100}
            onNodeClick={(node) => {
              // Center on clicked node
              fgRef.current.centerAt(node.x, node.y, 1000);
              fgRef.current.zoom(1.5, 1000);
            }}
            nodeCanvasObject={(node, ctx, globalScale) => {
              const label = getNodeLabel(node);
              const fontSize = 12 / globalScale;
              ctx.font = `${fontSize}px Segoe UI, Sans-Serif`;
              ctx.fillStyle = getNodeColor(node);
              ctx.beginPath();
              ctx.arc(node.x, node.y, 6, 0, 2 * Math.PI, false);
              ctx.fill();

              // Draw text label
              ctx.fillStyle = isdarkmode ? "#f1f5f9" : "#111827";
              ctx.fillText(label, node.x + 8, node.y + 3);
            }}
          />
        </div>

        {/* Legend */}
        <div
          style={{
            padding: isMobile ? "16px" : "20px",
            backgroundColor: isdarkmode ? "#0f172a" : "#f9fafb",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile
                ? "repeat(2, 1fr)"
                : "repeat(auto-fit, minmax(150px, 1fr))",
              gap: isMobile ? "12px" : "16px",
            }}
          >
            {[
              { label: "Publication", color: "#FFD700" },
              { label: "Author", color: "#00BFFF" },
              { label: "Institution", color: "#32CD32" },
              { label: "Topic", color: "#FF69B4" },
              { label: "SDG", color: "#FF4500" },
            ].map((type) => (
              <div
                key={type.label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "8px",
                  borderRadius: "6px",
                  backgroundColor: cardBg,
                  border: `1px solid ${borderColor}`,
                }}
              >
                <div
                  style={{
                    width: "12px",
                    height: "12px",
                    borderRadius: "50%",
                    backgroundColor: type.color,
                    flexShrink: 0,
                  }}
                />
                <div
                  style={{
                    fontSize: isMobile ? "12px" : "14px",
                    fontWeight: "500",
                    color: textColor,
                  }}
                >
                  {type.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Info Footer */}
      <div
        style={{
          marginTop: "16px",
          padding: "12px",
          backgroundColor: isdarkmode ? "#1f2937" : "#f3f4f6",
          borderRadius: "8px",
          fontSize: isMobile ? "12px" : "14px",
          color: isdarkmode ? "#9ca3af" : "#6b7280",
          textAlign: "center",
        }}
      >
        Interactive visualization of publications, authors, institutions,
        topics, and SDGs
        {!isMobile && " • Click nodes to explore • Scroll/drag to navigate"}
=======
        const data = await response.json();
        console.log('Data berhasil diambil:', data);
        setGraphData(data);
      } catch (error) {
        console.error('Gagal mengambil graph data:', error);
      }
    };

    fetchGraphData();
  }, [getToken]); 

  useEffect(() => {
    if (graphData.nodes.length > 0 && fgRef.current) {
      setTimeout(() => {
        fgRef.current.zoomToFit(500);
      }, 500);
    }
  }, [graphData]);

  const getNodeColor = (node) => {
    switch (node.type) {
      case 'Publication': return '#FFD700';
      case 'Author': return '#00BFFF';
      case 'Institution': return '#32CD32';
      case 'Topic': return '#FF69B4';
      case 'SDG': return '#FF4500';
      default: return '#999';
    }
  };

  const getNodeLabel = (node) => {
    if (node.type === 'SDG') {
      return `${node.name}`;
    }
    return node.title || node.full_name || node.name || (node.keywords ? node.keywords.join(', ') : 'Node');
  };

  const isDark = theme.palette.mode === 'dark';
  const canvasBgColor = isDark ? '#0f172a' : '#ffffff';
  const labelColor = isDark ? '#e2e8f0' : '#333';

  const nodeTypes = [
    { label: 'Publication', color: '#FFD700' },
    { label: 'Author', color: '#00BFFF' },
    { label: 'Institution', color: '#32CD32' },
    { label: 'Topic', color: '#FF69B4' },
    { label: 'SDG', color: '#FF4500' }
  ];

  const handleNodeClick = (node) => {
    if (node.type === 'SDG') {
      const relatedTopics = graphData.links.filter(link => link.target === node.id && link.type === 'MAPS_TO_SDG');
      const topicIds = relatedTopics.map(link => link.source);
      const relatedPublications = graphData.links.filter(link => topicIds.includes(link.target) && link.type === 'HAS_TOPIC');

      const topicKeywords = topicIds.map(tid => {
        const t = graphData.nodes.find(n => n.id === tid);
        return t?.keywords?.join(', ');
      });

      const pubTitles = relatedPublications.map(link => {
        const p = graphData.nodes.find(n => n.id === link.source);
        return p?.title;
      });

      console.log(`🟧 Klik pada SDG: ${node.name}`);
      console.log('Topik terkait:', topicKeywords);
      console.log('Publikasi terkait:', pubTitles);
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px', position: 'relative' }}>
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
            linkLabel={(link) => link.topic_probability ? `Probabilitas topik: ${link.topic_probability}` : link.type}
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

        {/* Tooltip Interaktif */}
        {hoveredNode && hoveredNode.type === 'SDG' && (
          <div style={{
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
            zIndex: 10
          }}>
            {/* Menampilkan properti `tooltip` yang sudah di-format dari backend */}
            <div style={{ marginTop: '8px', fontSize: '13px' }}>
              {hoveredNode.tooltip}
            </div>
          </div>
        )}

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
{/* Container untuk visualisasi tambahan (Bar Chart dan Pie Chart) */}
      <div style={{ display: 'flex', gap: '24px', marginTop: '24px', flexWrap: 'wrap' }}>
        <div style={{ 
          flex: '1 1 45%', 
          backgroundColor: isDark ? '#1e293b' : '#ffffff',
          border: '1px solid #ccc', 
          borderRadius: '8px', 
          padding: '16px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
        }}>
          <h4 style={{ textAlign: 'center', margin: '0 0 16px', color: isDark ? '#f1f5f9' : '#111827' }}>
            Jumlah Publikasi per SDG
          </h4>
          <SDGBarChart />
        </div>
        
        <div style={{ 
          flex: '1 1 45%',
          backgroundColor: isDark ? '#1e293b' : '#ffffff',
          border: '1px solid #ccc', 
          borderRadius: '8px', 
          padding: '16px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
        }}>
          <h4 style={{ textAlign: 'center', margin: '0 0 16px', color: isDark ? '#f1f5f9' : '#111827' }}>
            Distribusi Publikasi per Institusi
          </h4>
          <InstitutionPieChart />
        </div>
>>>>>>> 7f1b227 (Deskripsi perubahan keseluruhan project)
      </div>
    </div>
  );
};

export default GraphContent;
