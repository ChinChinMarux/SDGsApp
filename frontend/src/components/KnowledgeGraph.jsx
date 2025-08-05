import React, { useEffect, useRef, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { useMediaQuery } from '@mui/material';

const KnowledgeGraph = ({ isDarkMode, isMobile, data = [] }) => {
  const svgRef = useRef();
  const containerRef = useRef();
  const [dimensions, setDimensions] = useState({ width: 0, height: isMobile ? 200 : 280 });
  const [hoveredNode, setHoveredNode] = useState(null);

  // Default nodes and links if no data provided
  const defaultNodes = [
    { id: 'education', label: 'Education', x: 0, y: -80, size: 25, color: '#FF6B6B' },
    { id: 'health', label: 'Health', x: 80, y: -60, size: 22, color: '#4ECDC4' },
    { id: 'environment', label: 'Environment', x: 100, y: 50, size: 20, color: '#45B7D1' },
    { id: 'economy', label: 'Economy', x: 0, y: 120, size: 18, color: '#96CEB4' },
    { id: 'poverty', label: 'Poverty', x: -100, y: 100, size: 15, color: '#FFEAA7' },
    { id: 'innovation', label: 'Innovation', x: 150, y: 100, size: 16, color: '#DDA0DD' },
    { id: 'governance', label: 'Governance', x: 200, y: 20, size: 14, color: '#FFB6C1' },
    { id: 'climate', label: 'Climate', x: 50, y: -40, size: 19, color: '#98FB98' }
  ];

  const defaultLinks = [
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

  const nodes = data.nodes || defaultNodes;
  const links = data.links || defaultLinks;

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

  }, [dimensions, isDarkMode, hoveredNode, isMobile, nodes, links]);

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

export default KnowledgeGraph;