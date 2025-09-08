import { useState, useEffect } from 'react';
import { 
  FileText, TrendingUp, Target, Calendar,
  BarChart3, Users, Eye, MousePointer
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Mock data for dashboard
const performanceData = [
  { month: 'Jan', traffic: 45000, engagement: 3.2 },
  { month: 'Feb', traffic: 52000, engagement: 3.5 },
  { month: 'Mar', traffic: 48000, engagement: 3.3 },
  { month: 'Apr', traffic: 61000, engagement: 3.8 },
  { month: 'May', traffic: 58000, engagement: 3.6 },
  { month: 'Jun', traffic: 67000, engagement: 4.1 },
];

const topContent = [
  { title: 'Eufy Security Camera S40 Review', views: 12500, engagement: '4.2%' },
  { title: 'How to Set Up Eufy HomeBase 3', views: 8900, engagement: '3.8%' },
  { title: 'Eufy vs Ring: Comparison Guide', views: 7600, engagement: '4.5%' },
  { title: 'Best Eufy Products for Smart Home', views: 6200, engagement: '3.2%' },
];

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalContent: 156,
    publishedThisMonth: 12,
    avgSeoScore: 82,
    totalViews: '245K',
  });

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Overview of your content performance and optimization metrics
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Content</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalContent}</p>
            </div>
            <FileText className="w-8 h-8 text-eufy-blue opacity-75" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Published This Month</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.publishedThisMonth}</p>
            </div>
            <Calendar className="w-8 h-8 text-green-500 opacity-75" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg SEO Score</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.avgSeoScore}/100</p>
            </div>
            <Target className="w-8 h-8 text-yellow-500 opacity-75" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Views</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalViews}</p>
            </div>
            <Eye className="w-8 h-8 text-purple-500 opacity-75" />
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Traffic Chart */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Traffic Trend</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="traffic" 
                stroke="#2563eb" 
                strokeWidth={2}
                dot={{ fill: '#2563eb' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Engagement Chart */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Engagement Rate</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="engagement" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Content Table */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Top Performing Content</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Views
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Engagement
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {topContent.map((content, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{content.title}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{content.views.toLocaleString()}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{content.engagement}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <a href="#" className="text-eufy-blue hover:text-blue-700">
                      View Analytics
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center justify-center gap-2 px-4 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition">
            <FileText className="w-5 h-5 text-gray-600" />
            <span className="text-sm font-medium">Create New Content</span>
          </button>
          <button className="flex items-center justify-center gap-2 px-4 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition">
            <BarChart3 className="w-5 h-5 text-gray-600" />
            <span className="text-sm font-medium">Analyze Keywords</span>
          </button>
          <button className="flex items-center justify-center gap-2 px-4 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition">
            <Calendar className="w-5 h-5 text-gray-600" />
            <span className="text-sm font-medium">View Calendar</span>
          </button>
        </div>
      </div>
    </div>
  );
}