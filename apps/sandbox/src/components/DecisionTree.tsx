'use client';

import { useRef, useEffect } from 'react';
import * as d3 from 'd3';

interface DecisionNode {
  id: string;
  name: string;
  type: 'decision' | 'chance' | 'outcome';
  probability?: number;
  value?: number;
  children?: DecisionNode[];
  x?: number;
  y?: number;
}

interface DecisionTreeProps {
  data: DecisionNode;
  width?: number;
  height?: number;
  onNodeClick?: (node: DecisionNode) => void;
}

export default function DecisionTree({
  data,
  width = 800,
  height = 600,
  onNodeClick,
}: DecisionTreeProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !data) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const margin = { top: 20, right: 120, bottom: 20, left: 120 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const container = svg
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Create tree layout
    const treeLayout = d3.tree<DecisionNode>()
      .size([innerHeight, innerWidth]);

    const root = d3.hierarchy(data);
    treeLayout(root);

    // Define node colors
    const nodeColors = {
      decision: '#3b82f6',
      chance: '#f59e0b',
      outcome: '#10b981',
    };

    // Create links
    const links = container.selectAll('.link')
      .data(root.links())
      .enter().append('path')
      .attr('class', 'link')
      .attr('d', d3.linkHorizontal<any, any>()
        .x(d => d.y)
        .y(d => d.x)
      )
      .attr('fill', 'none')
      .attr('stroke', '#999')
      .attr('stroke-width', 2)
      .attr('stroke-opacity', 0.6);

    // Create node groups
    const nodeGroups = container.selectAll('.node')
      .data(root.descendants())
      .enter().append('g')
      .attr('class', 'node')
      .attr('transform', d => `translate(${d.y},${d.x})`)
      .style('cursor', 'pointer')
      .on('click', (event, d) => {
        onNodeClick?.(d.data);
      });

    // Add node shapes based on type
    nodeGroups.each(function(d) {
      const group = d3.select(this);
      const nodeData = d.data;

      switch (nodeData.type) {
        case 'decision':
          // Square for decisions
          group.append('rect')
            .attr('width', 30)
            .attr('height', 30)
            .attr('x', -15)
            .attr('y', -15)
            .attr('fill', nodeColors.decision)
            .attr('stroke', '#fff')
            .attr('stroke-width', 2)
            .style('filter', 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))');
          break;

        case 'chance':
          // Circle for chance nodes
          group.append('circle')
            .attr('r', 15)
            .attr('fill', nodeColors.chance)
            .attr('stroke', '#fff')
            .attr('stroke-width', 2)
            .style('filter', 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))');
          break;

        case 'outcome':
          // Triangle for outcomes
          group.append('polygon')
            .attr('points', '0,-15 13,10 -13,10')
            .attr('fill', nodeColors.outcome)
            .attr('stroke', '#fff')
            .attr('stroke-width', 2)
            .style('filter', 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))');
          break;
      }
    });

    // Add node labels
    nodeGroups.append('text')
      .attr('dy', '.35em')
      .attr('x', d => d.children ? -20 : 20)
      .style('text-anchor', d => d.children ? 'end' : 'start')
      .attr('font-size', '12px')
      .attr('font-weight', 'bold')
      .attr('fill', '#333')
      .text(d => d.data.name);

    // Add probability labels for chance nodes
    nodeGroups
      .filter(d => d.data.type === 'chance' && d.data.probability)
      .append('text')
      .attr('dy', '25')
      .attr('x', 0)
      .style('text-anchor', 'middle')
      .attr('font-size', '10px')
      .attr('fill', '#666')
      .text(d => `${(d.data.probability! * 100).toFixed(0)}%`);

    // Add value labels for outcome nodes
    nodeGroups
      .filter(d => d.data.type === 'outcome' && d.data.value !== undefined)
      .append('text')
      .attr('dy', '25')
      .attr('x', 0)
      .style('text-anchor', 'middle')
      .attr('font-size', '10px')
      .attr('font-weight', 'bold')
      .attr('fill', d => d.data.value! > 0 ? '#10b981' : '#ef4444')
      .text(d => {
        const value = d.data.value!;
        return value > 0 ? `+${value}` : `${value}`;
      });

    // Add hover effects
    nodeGroups
      .on('mouseover', function(event, d) {
        // Highlight node
        d3.select(this)
          .select('rect, circle, polygon')
          .transition()
          .duration(200)
          .attr('transform', 'scale(1.2)');

        // Show tooltip
        const tooltip = container.append('g')
          .attr('class', 'tooltip')
          .attr('transform', `translate(${d.y + 30},${d.x})`);

        const rect = tooltip.append('rect')
          .attr('fill', 'rgba(0,0,0,0.8)')
          .attr('rx', 4)
          .attr('ry', 4);

        const text = tooltip.append('text')
          .attr('fill', 'white')
          .attr('font-size', '12px')
          .attr('dy', '1.2em')
          .attr('x', 8);

        text.append('tspan')
          .attr('x', 8)
          .attr('dy', 0)
          .text(d.data.name);

        if (d.data.type === 'chance' && d.data.probability) {
          text.append('tspan')
            .attr('x', 8)
            .attr('dy', '1.2em')
            .text(`概率: ${(d.data.probability * 100).toFixed(0)}%`);
        }

        if (d.data.type === 'outcome' && d.data.value !== undefined) {
          text.append('tspan')
            .attr('x', 8)
            .attr('dy', '1.2em')
            .text(`价值: ${d.data.value}`);
        }

        const bbox = text.node()!.getBBox();
        rect
          .attr('width', bbox.width + 16)
          .attr('height', bbox.height + 8);
      })
      .on('mouseout', function(event, d) {
        // Reset node
        d3.select(this)
          .select('rect, circle, polygon')
          .transition()
          .duration(200)
          .attr('transform', 'scale(1)');

        // Remove tooltip
        container.select('.tooltip').remove();
      });

    // Add path probabilities and values along links
    container.selectAll('.link-label')
      .data(root.links())
      .enter().append('text')
      .attr('class', 'link-label')
      .attr('font-size', '10px')
      .attr('fill', '#666')
      .attr('text-anchor', 'middle')
      .attr('x', d => (d.source.y + d.target.y) / 2)
      .attr('y', d => (d.source.x + d.target.x) / 2 - 5)
      .text(d => {
        if (d.target.data.probability) {
          return `${(d.target.data.probability * 100).toFixed(0)}%`;
        }
        return '';
      });

  }, [data, width, height, onNodeClick]);

  return (
    <div className="decision-tree relative">
      <svg ref={svgRef} className="w-full h-full" />
      
      {/* Legend */}
      <div className="absolute top-4 right-4 bg-white p-4 rounded-lg shadow-lg border">
        <h4 className="font-semibold text-sm mb-3">决策树图例</h4>
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-xs">
            <div className="w-4 h-4 bg-blue-500"></div>
            <span>决策节点</span>
          </div>
          <div className="flex items-center space-x-2 text-xs">
            <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
            <span>机会节点</span>
          </div>
          <div className="flex items-center space-x-2 text-xs">
            <div className="w-0 h-0 border-l-2 border-r-2 border-b-4 border-l-transparent border-r-transparent border-b-green-500"></div>
            <span>结果节点</span>
          </div>
        </div>
        
        <div className="mt-3 pt-3 border-t border-gray-200">
          <p className="text-xs text-gray-600">
            点击节点查看详细信息<br/>
            悬停查看节点属性
          </p>
        </div>
      </div>
    </div>
  );
}