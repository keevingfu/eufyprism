'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as d3 from 'd3';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Treemap,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';

interface HeatmapData {
  channel: string;
  month: number;
  value: number;
}

interface NetworkNode {
  id: string;
  group: string;
  value: number;
}

interface NetworkLink {
  source: string;
  target: string;
  value: number;
}

export default function VisualizerPage() {
  const [selectedVisualization, setSelectedVisualization] = useState('performance');
  const heatmapRef = useRef<HTMLDivElement>(null);
  const networkRef = useRef<HTMLDivElement>(null);

  // Sample data for various visualizations
  const performanceData = [
    { month: 'Jan', marketShare: 15, revenue: 1200, costs: 800, profit: 400 },
    { month: 'Feb', marketShare: 16.5, revenue: 1320, costs: 850, profit: 470 },
    { month: 'Mar', marketShare: 17.2, revenue: 1450, costs: 900, profit: 550 },
    { month: 'Apr', marketShare: 18.1, revenue: 1580, costs: 950, profit: 630 },
    { month: 'May', marketShare: 19.3, revenue: 1720, costs: 1000, profit: 720 },
    { month: 'Jun', marketShare: 20.8, revenue: 1890, costs: 1050, profit: 840 },
  ];

  const competitorData = [
    { metric: 'Market Share', us: 20.8, competitor1: 25.2, competitor2: 18.5, competitor3: 15.3 },
    { metric: 'Brand Awareness', us: 75, competitor1: 82, competitor2: 68, competitor3: 55 },
    { metric: 'Customer Satisfaction', us: 85, competitor1: 78, competitor2: 80, competitor3: 72 },
    { metric: 'Innovation Index', us: 90, competitor1: 85, competitor2: 75, competitor3: 60 },
    { metric: 'Price Competitiveness', us: 70, competitor1: 65, competitor2: 85, competitor3: 90 },
    { metric: 'Channel Coverage', us: 80, competitor1: 90, competitor2: 75, competitor3: 65 },
  ];

  const channelROI = [
    { name: 'Social Media', size: 3500, roi: 28 },
    { name: 'Search Engine', size: 2800, roi: 25 },
    { name: 'Email', size: 2000, roi: 32 },
    { name: 'Display Ads', size: 1200, roi: 15 },
    { name: 'Offline', size: 500, roi: 10 },
  ];

  const heatmapData: HeatmapData[] = [];
  const channels = ['Social Media', 'Search Engine', 'Email', 'Display Ads', 'Offline'];
  for (let month = 0; month < 12; month++) {
    for (const channel of channels) {
      heatmapData.push({
        channel,
        month: month + 1,
        value: Math.floor(Math.random() * 100) + 20,
      });
    }
  }

  // Create heatmap visualization
  useEffect(() => {
    if (selectedVisualization === 'heatmap' && heatmapRef.current) {
      const container = heatmapRef.current;
      container.innerHTML = '';

      const margin = { top: 50, right: 50, bottom: 50, left: 100 };
      const width = container.clientWidth - margin.left - margin.right;
      const height = 400 - margin.top - margin.bottom;

      const svg = d3.select(container)
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

      const months = Array.from({ length: 12 }, (_, i) => i + 1);
      const x = d3.scaleBand()
        .range([0, width])
        .domain(months.map(String))
        .padding(0.01);

      const y = d3.scaleBand()
        .range([height, 0])
        .domain(channels)
        .padding(0.01);

      const colorScale = d3.scaleSequential()
        .interpolator(d3.interpolateBlues)
        .domain([0, 120]);

      // Add X axis
      svg.append('g')
        .style('font-size', 12)
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(x).tickFormat(d => `M${d}`));

      // Add Y axis
      svg.append('g')
        .style('font-size', 12)
        .call(d3.axisLeft(y));

      // Add heatmap cells
      svg.selectAll()
        .data(heatmapData)
        .enter()
        .append('rect')
        .attr('x', d => x(d.month.toString()) || 0)
        .attr('y', d => y(d.channel) || 0)
        .attr('width', x.bandwidth())
        .attr('height', y.bandwidth())
        .style('fill', d => colorScale(d.value))
        .style('stroke-width', 1)
        .style('stroke', 'white')
        .style('opacity', 0)
        .transition()
        .duration(800)
        .style('opacity', 1);

      // Add tooltip
      const tooltip = d3.select(container)
        .append('div')
        .style('opacity', 0)
        .attr('class', 'absolute bg-gray-900 text-white p-2 rounded text-sm pointer-events-none');

      svg.selectAll('rect')
        .on('mouseover', function(event, d: any) {
          tooltip.transition().duration(200).style('opacity', .9);
          tooltip.html(`${d.channel}<br/>Month: ${d.month}<br/>Effect: ${d.value}%`)
            .style('left', (event.pageX - container.offsetLeft + 10) + 'px')
            .style('top', (event.pageY - container.offsetTop - 28) + 'px');
        })
        .on('mouseout', function() {
          tooltip.transition().duration(500).style('opacity', 0);
        });
    }
  }, [selectedVisualization, heatmapData]);

  // Create network diagram
  useEffect(() => {
    if (selectedVisualization === 'network' && networkRef.current) {
      const container = networkRef.current;
      container.innerHTML = '';

      const width = container.clientWidth;
      const height = 500;

      const nodes: NetworkNode[] = [
        { id: 'Core Product', group: 'core', value: 30 },
        { id: 'Social Media', group: 'channel', value: 20 },
        { id: 'Search Engine', group: 'channel', value: 18 },
        { id: 'Email', group: 'channel', value: 15 },
        { id: 'Target Customer A', group: 'customer', value: 12 },
        { id: 'Target Customer B', group: 'customer', value: 10 },
        { id: 'Target Customer C', group: 'customer', value: 8 },
      ];

      const links: NetworkLink[] = [
        { source: 'Core Product', target: 'Social Media', value: 5 },
        { source: 'Core Product', target: 'Search Engine', value: 4 },
        { source: 'Core Product', target: 'Email', value: 3 },
        { source: 'Social Media', target: 'Target Customer A', value: 4 },
        { source: 'Social Media', target: 'Target Customer B', value: 3 },
        { source: 'Search Engine', target: 'Target Customer B', value: 3 },
        { source: 'Search Engine', target: 'Target Customer C', value: 2 },
        { source: 'Email', target: 'Target Customer A', value: 2 },
        { source: 'Email', target: 'Target Customer C', value: 2 },
      ];

      const svg = d3.select(container)
        .append('svg')
        .attr('width', width)
        .attr('height', height);

      const simulation = d3.forceSimulation(nodes as any)
        .force('link', d3.forceLink(links).id((d: any) => d.id).distance(100))
        .force('charge', d3.forceManyBody().strength(-300))
        .force('center', d3.forceCenter(width / 2, height / 2));

      const colorScale = d3.scaleOrdinal()
        .domain(['core', 'channel', 'customer'])
        .range(['#3b82f6', '#10b981', '#f59e0b']);

      const link = svg.append('g')
        .selectAll('line')
        .data(links)
        .enter().append('line')
        .attr('stroke', '#999')
        .attr('stroke-opacity', 0.6)
        .attr('stroke-width', d => Math.sqrt(d.value));

      const node = svg.append('g')
        .selectAll('circle')
        .data(nodes)
        .enter().append('circle')
        .attr('r', d => Math.sqrt(d.value) * 3)
        .attr('fill', d => colorScale(d.group) as string)
        .call(d3.drag()
          .on('start', dragstarted)
          .on('drag', dragged)
          .on('end', dragended) as any);

      const text = svg.append('g')
        .selectAll('text')
        .data(nodes)
        .enter().append('text')
        .text(d => d.id)
        .attr('font-size', '12px')
        .attr('dx', d => Math.sqrt(d.value) * 3 + 5)
        .attr('dy', '.35em');

      node.append('title')
        .text(d => d.id);

      simulation.on('tick', () => {
        link
          .attr('x1', (d: any) => d.source.x)
          .attr('y1', (d: any) => d.source.y)
          .attr('x2', (d: any) => d.target.x)
          .attr('y2', (d: any) => d.target.y);

        node
          .attr('cx', (d: any) => d.x)
          .attr('cy', (d: any) => d.y);

        text
          .attr('x', (d: any) => d.x)
          .attr('y', (d: any) => d.y);
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
    }
  }, [selectedVisualization]);

  const visualizationTypes = [
    { id: 'performance', name: 'Performance Trends', icon: '📈' },
    { id: 'competitor', name: 'Competitor Analysis', icon: '⚔️' },
    { id: 'roi', name: 'ROI Analysis', icon: '💰' },
    { id: 'heatmap', name: 'Heatmap', icon: '🔥' },
    { id: 'network', name: 'Network Diagram', icon: '🕸️' },
  ];

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Data Visualization</h1>
        <p className="mt-2 text-gray-600">Gain deep insights into marketing data through interactive charts</p>
      </div>

      {/* Visualization Type Selector */}
      <div className="flex space-x-4 overflow-x-auto pb-2">
        {visualizationTypes.map((type) => (
          <button
            key={type.id}
            onClick={() => setSelectedVisualization(type.id)}
            className={`flex items-center px-6 py-3 rounded-lg font-medium transition-all whitespace-nowrap ${
              selectedVisualization === type.id
                ? 'bg-primary-600 text-white shadow-lg transform scale-105'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            <span className="text-2xl mr-2">{type.icon}</span>
            {type.name}
          </button>
        ))}
      </div>

      {/* Visualization Content */}
      <motion.div
        key={selectedVisualization}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
      >
        {/* Performance Trend */}
        {selectedVisualization === 'performance' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">业绩趋势分析</h3>
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={performanceData}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                    </linearGradient>
                    <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      border: '1px solid #e5e5e5',
                      borderRadius: '8px',
                    }}
                  />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#3b82f6"
                    fillOpacity={1}
                    fill="url(#colorRevenue)"
                    name="营收 (万)"
                  />
                  <Area
                    type="monotone"
                    dataKey="profit"
                    stroke="#10b981"
                    fillOpacity={1}
                    fill="url(#colorProfit)"
                    name="利润 (万)"
                  />
                  <Line
                    type="monotone"
                    dataKey="marketShare"
                    stroke="#f59e0b"
                    strokeWidth={3}
                    dot={{ fill: '#f59e0b', strokeWidth: 2, r: 4 }}
                    yAxisId="right"
                    name="市场份额 (%)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="text-sm font-medium text-blue-900">营收增长率</h4>
                <p className="text-2xl font-bold text-blue-700 mt-1">+57.5%</p>
                <p className="text-xs text-blue-600 mt-1">较期初增长</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="text-sm font-medium text-green-900">利润率提升</h4>
                <p className="text-2xl font-bold text-green-700 mt-1">+12.3%</p>
                <p className="text-xs text-green-600 mt-1">利润率改善</p>
              </div>
              <div className="p-4 bg-orange-50 rounded-lg">
                <h4 className="text-sm font-medium text-orange-900">市场份额</h4>
                <p className="text-2xl font-bold text-orange-700 mt-1">20.8%</p>
                <p className="text-xs text-orange-600 mt-1">行业排名第2</p>
              </div>
            </div>
          </div>
        )}

        {/* Competitor Analysis */}
        {selectedVisualization === 'competitor' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">竞争对手对比分析</h3>
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={competitorData}>
                  <PolarGrid stroke="#e5e5e5" />
                  <PolarAngleAxis dataKey="metric" />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} />
                  <Radar name="我们" dataKey="us" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                  <Radar name="竞争者1" dataKey="competitor1" stroke="#ef4444" fill="#ef4444" fillOpacity={0.3} />
                  <Radar name="竞争者2" dataKey="competitor2" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">竞争优势分析</h4>
              <ul className="space-y-2 text-sm text-blue-700">
                <li>• 创新指数领先：比主要竞争对手高 5-30 个点</li>
                <li>• 客户满意度优秀：仅次于市场领导者</li>
                <li>• 价格竞争力有待提升：可考虑优化定价策略</li>
              </ul>
            </div>
          </div>
        )}

        {/* ROI Analysis */}
        {selectedVisualization === 'roi' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">渠道ROI分析</h3>
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <Treemap
                  data={channelROI}
                  dataKey="size"
                  aspectRatio={4/3}
                  stroke="#fff"
                  fill="#3b82f6"
                >
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload[0]) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-white p-3 shadow-lg rounded-lg border border-gray-200">
                            <p className="font-medium">{data.name}</p>
                            <p className="text-sm text-gray-600">投入: ¥{data.size}万</p>
                            <p className="text-sm text-green-600">ROI: {data.roi}%</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                </Treemap>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div className="p-4 border border-gray-200 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-3">最高ROI渠道</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">电子邮件</span>
                    <span className="text-sm font-medium text-green-600">32%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">社交媒体</span>
                    <span className="text-sm font-medium text-green-600">28%</span>
                  </div>
                </div>
              </div>
              <div className="p-4 border border-gray-200 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-3">改进机会</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">线下推广</span>
                    <span className="text-sm font-medium text-red-600">10%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">展示广告</span>
                    <span className="text-sm font-medium text-orange-600">15%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Heatmap */}
        {selectedVisualization === 'heatmap' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">渠道效果热力图</h3>
            <div ref={heatmapRef} className="relative" style={{ height: '400px' }} />
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">
                颜色越深表示该渠道在该月份的效果越好。可以看出社交媒体在夏季月份表现最佳，
                而电子邮件营销在年末假期期间效果显著。
              </p>
            </div>
          </div>
        )}

        {/* Network Diagram */}
        {selectedVisualization === 'network' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">营销关系网络</h3>
            <div ref={networkRef} className="relative" style={{ height: '500px' }} />
            <div className="mt-4 grid grid-cols-3 gap-4">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-gray-600">核心产品</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">营销渠道</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
                <span className="text-sm text-gray-600">目标客户</span>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}