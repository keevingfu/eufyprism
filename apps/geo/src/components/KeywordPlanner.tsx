import { useState } from 'react';
import { Search, TrendingUp, TrendingDown, Minus, Filter, Download } from 'lucide-react';
import { Keyword, SearchIntent } from '@/types/geo';

interface KeywordPlannerProps {
  keywords: Keyword[];
  onAddKeyword: (keyword: string) => void;
  onRemoveKeyword: (id: string) => void;
  onUpdatePriority: (id: string, priority: 'high' | 'medium' | 'low') => void;
}

export default function KeywordPlanner({ 
  keywords, 
  onAddKeyword, 
  onRemoveKeyword, 
  onUpdatePriority 
}: KeywordPlannerProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterIntent, setFilterIntent] = useState<SearchIntent | 'all'>('all');
  const [filterPriority, setFilterPriority] = useState<'all' | 'high' | 'medium' | 'low'>('all');

  const handleAddKeyword = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      onAddKeyword(searchTerm.trim());
      setSearchTerm('');
    }
  };

  const filteredKeywords = keywords.filter(keyword => {
    const intentMatch = filterIntent === 'all' || keyword.intent === filterIntent;
    const priorityMatch = filterPriority === 'all' || keyword.priority === filterPriority;
    return intentMatch && priorityMatch;
  });

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-500" />;
      case 'stable':
        return <Minus className="w-4 h-4 text-gray-500" />;
    }
  };

  const getDifficultyColor = (difficulty: number) => {
    if (difficulty < 30) return 'text-green-600';
    if (difficulty < 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getIntentColor = (intent: SearchIntent) => {
    switch (intent) {
      case 'informational':
        return 'bg-blue-100 text-blue-800';
      case 'navigational':
        return 'bg-purple-100 text-purple-800';
      case 'commercial':
        return 'bg-orange-100 text-orange-800';
      case 'transactional':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Search and Add */}
      <form onSubmit={handleAddKeyword} className="flex gap-2">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Enter keyword to research..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-eufy-blue focus:border-transparent"
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-eufy-blue text-white rounded-lg hover:bg-blue-600 transition"
        >
          Research Keyword
        </button>
      </form>

      {/* Filters */}
      <div className="flex gap-4 items-center">
        <Filter className="w-5 h-5 text-gray-500" />
        <select
          value={filterIntent}
          onChange={(e) => setFilterIntent(e.target.value as SearchIntent | 'all')}
          className="px-3 py-1 border border-gray-300 rounded-lg text-sm"
        >
          <option value="all">All Intents</option>
          <option value="informational">Informational</option>
          <option value="navigational">Navigational</option>
          <option value="commercial">Commercial</option>
          <option value="transactional">Transactional</option>
        </select>
        <select
          value={filterPriority}
          onChange={(e) => setFilterPriority(e.target.value as any)}
          className="px-3 py-1 border border-gray-300 rounded-lg text-sm"
        >
          <option value="all">All Priorities</option>
          <option value="high">High Priority</option>
          <option value="medium">Medium Priority</option>
          <option value="low">Low Priority</option>
        </select>
        <button className="ml-auto flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      {/* Keywords Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Keyword
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Volume
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Difficulty
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                CPC
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Trend
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Intent
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Priority
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredKeywords.map((keyword) => (
              <tr key={keyword.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-medium text-gray-900">{keyword.term}</div>
                  {keyword.topicCluster && (
                    <div className="text-xs text-gray-500">Cluster: {keyword.topicCluster}</div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {keyword.searchVolume.toLocaleString()}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className={`text-sm font-medium ${getDifficultyColor(keyword.difficulty)}`}>
                    {keyword.difficulty}/100
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">${keyword.cpc}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getTrendIcon(keyword.trend)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs rounded-full ${getIntentColor(keyword.intent)}`}>
                    {keyword.intent}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <select
                    value={keyword.priority}
                    onChange={(e) => onUpdatePriority(keyword.id, e.target.value as any)}
                    className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(keyword.priority)}`}
                  >
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <button
                    onClick={() => onRemoveKeyword(keyword.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredKeywords.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No keywords found. Add keywords to start planning.
          </div>
        )}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-500">Total Keywords</div>
          <div className="text-2xl font-semibold">{keywords.length}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-500">Avg. Search Volume</div>
          <div className="text-2xl font-semibold">
            {keywords.length > 0
              ? Math.round(
                  keywords.reduce((sum, k) => sum + k.searchVolume, 0) / keywords.length
                ).toLocaleString()
              : 0}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-500">Avg. Difficulty</div>
          <div className="text-2xl font-semibold">
            {keywords.length > 0
              ? Math.round(
                  keywords.reduce((sum, k) => sum + k.difficulty, 0) / keywords.length
                )
              : 0}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-500">High Priority</div>
          <div className="text-2xl font-semibold">
            {keywords.filter(k => k.priority === 'high').length}
          </div>
        </div>
      </div>
    </div>
  );
}