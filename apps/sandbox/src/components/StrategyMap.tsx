'use client';

import { useRef, useEffect } from 'react';
import * as d3 from 'd3';

interface StrategyNode {
  id: string;
  name: string;
  type: 'objective' | 'strategy' | 'tactic' | 'metric';
  x?: number;
  y?: number;
  value: number;
  status: 'active' | 'planned' | 'completed';
}

interface StrategyLink {
  source: string;
  target: string;
  strength: number;
}

interface StrategyMapProps {
  width?: number;
  height?: number;
  nodes: StrategyNode[];
  links: StrategyLink[];
  onNodeClick?: (node: StrategyNode) => void;
}

export default function StrategyMap({
  width = 800,
  height = 600,
  nodes,
  links,
  onNodeClick,
}: StrategyMapProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || nodes.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    // Create main container
    const container = svg
      .attr('width', width)
      .attr('height', height)
      .append('g');

    // Define color schemes for different node types
    const colorScale = d3.scaleOrdinal<string>()
      .domain(['objective', 'strategy', 'tactic', 'metric'])
      .range(['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6']);

    const statusScale = d3.scaleOrdinal<string>()
      .domain(['active', 'planned', 'completed'])
      .range(['#ef4444', '#6b7280', '#10b981']);

    // Create force simulation
    const simulation = d3.forceSimulation(nodes as any)
      .force('link', d3.forceLink(links)
        .id((d: any) => d.id)
        .distance(d => 100 + (d as any).strength * 50)
      )
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(30));

    // Create gradient definitions
    const defs = svg.append('defs');
    
    // Create arrow markers
    defs.append('marker')
      .attr('id', 'arrowhead')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 8)
      .attr('refY', 0)
      .attr('markerWidth', 4)
      .attr('markerHeight', 4)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M0,-5L10,0L0,5')
      .attr('fill', '#666');

    // Create links
    const link = container.append('g')
      .selectAll('line')
      .data(links)
      .enter().append('line')
      .attr('stroke', '#999')
      .attr('stroke-opacity', 0.6)
      .attr('stroke-width', d => Math.sqrt(d.strength) * 2)
      .attr('marker-end', 'url(#arrowhead)');

    // Create nodes
    const nodeGroup = container.append('g')
      .selectAll('g')
      .data(nodes)
      .enter().append('g')
      .attr('class', 'node')
      .style('cursor', 'pointer')
      .call(d3.drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended) as any);

    // Node circles
    const nodeCircles = nodeGroup.append('circle')
      .attr('r', d => Math.sqrt(d.value) * 5 + 10)
      .attr('fill', d => colorScale(d.type))
      .attr('stroke', d => statusScale(d.status))
      .attr('stroke-width', 3)
      .style('filter', 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))')
      .on('click', (event, d) => {
        onNodeClick?.(d);
      });

    // Node labels
    const nodeLabels = nodeGroup.append('text')
      .text(d => d.name)
      .attr('font-family', 'sans-serif')
      .attr('font-size', '12px')
      .attr('font-weight', 'bold')
      .attr('text-anchor', 'middle')
      .attr('dy', '.35em')
      .attr('fill', '#fff')
      .style('pointer-events', 'none');

    // Node descriptions (below the circle)
    const nodeDescriptions = nodeGroup.append('text')
      .text(d => d.type)
      .attr('font-family', 'sans-serif')
      .attr('font-size', '10px')
      .attr('text-anchor', 'middle')
      .attr('dy', d => Math.sqrt(d.value) * 5 + 25)
      .attr('fill', '#666')
      .style('pointer-events', 'none');

    // Add hover effects
    nodeGroup
      .on('mouseover', function(event, d) {
        d3.select(this)
          .select('circle')
          .transition()
          .duration(200)
          .attr('r', Math.sqrt(d.value) * 5 + 15);
        
        // Highlight connected links
        link
          .style('stroke-opacity', l => 
            (l.source as any).id === d.id || (l.target as any).id === d.id ? 1 : 0.2
          )
          .style('stroke-width', l => 
            ((l.source as any).id === d.id || (l.target as any).id === d.id) 
              ? Math.sqrt(l.strength) * 3 : Math.sqrt(l.strength) * 2
          );
      })
      .on('mouseout', function(event, d) {
        d3.select(this)
          .select('circle')
          .transition()
          .duration(200)
          .attr('r', Math.sqrt(d.value) * 5 + 10);
        
        // Reset link styles
        link
          .style('stroke-opacity', 0.6)
          .style('stroke-width', l => Math.sqrt(l.strength) * 2);
      });

    // Update positions on simulation tick
    simulation.on('tick', () => {
      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);

      nodeGroup
        .attr('transform', (d: any) => `translate(${d.x},${d.y})`);
    });

    function dragstarted(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event: any, d: any) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

    return () => {
      simulation.stop();
    };
  }, [width, height, nodes, links, onNodeClick]);

  return (
    <div className="strategy-map">
      <svg ref={svgRef} className="w-full h-full" />
      
      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white p-4 rounded-lg shadow-lg border">
        <h4 className="font-semibold text-sm mb-2">图例</h4>
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-xs">
            <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
            <span>目标</span>
          </div>
          <div className="flex items-center space-x-2 text-xs">
            <div className="w-4 h-4 bg-green-500 rounded-full"></div>
            <span>策略</span>
          </div>
          <div className="flex items-center space-x-2 text-xs">
            <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
            <span>战术</span>
          </div>
          <div className="flex items-center space-x-2 text-xs">
            <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
            <span>指标</span>
          </div>
        </div>
        
        <div className="mt-3 pt-3 border-t border-gray-200">
          <h5 className="font-medium text-xs mb-1">状态</h5>
          <div className="space-y-1">
            <div className="flex items-center space-x-2 text-xs">
              <div className="w-3 h-3 border-2 border-red-500 rounded-full"></div>
              <span>执行中</span>
            </div>
            <div className="flex items-center space-x-2 text-xs">
              <div className="w-3 h-3 border-2 border-gray-500 rounded-full"></div>
              <span>计划中</span>
            </div>
            <div className="flex items-center space-x-2 text-xs">
              <div className="w-3 h-3 border-2 border-green-500 rounded-full"></div>
              <span>已完成</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}