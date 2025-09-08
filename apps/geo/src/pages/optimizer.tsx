import { useState } from 'react';
import { 
  BarChart3, TrendingUp, Target, AlertCircle, 
  CheckCircle, XCircle, Info, RefreshCw, Download
} from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { SEOAnalysis, AIOAnalysis } from '@/types/geo';
import { seoAnalyzer } from '@/services/seo';
import { aioOptimizer } from '@/services/aio';

// Mock data for optimization overview
const seoTrendData = [
  { week: 'W1', score: 65 },
  { week: 'W2', score: 68 },
  { week: 'W3', score: 72 },
  { week: 'W4', score: 75 },
  { week: 'W5', score: 78 },
  { week: 'W6', score: 82 },
];

const performanceRadarData = [
  { aspect: 'Content Quality', value: 85 },
  { aspect: 'Technical SEO', value: 78 },
  { aspect: 'User Experience', value: 82 },
  { aspect: 'Mobile Optimization', value: 90 },
  { aspect: 'Page Speed', value: 75 },
  { aspect: 'Accessibility', value: 88 },
];

export default function OptimizerPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'audit' | 'recommendations'>('overview');
  const [auditRunning, setAuditRunning] = useState(false);
  const [auditResults, setAuditResults] = useState<any>(null);

  const runFullAudit = async () => {
    setAuditRunning(true);
    
    // Simulate audit process
    setTimeout(() => {
      setAuditResults({
        totalPages: 156,
        analyzedPages: 156,
        averageSeoScore: 82,
        averageAioScore: 76,
        issues: {
          critical: 5,
          warnings: 23,
          info: 45
        },
        opportunities: [
          {
            title: 'Improve Meta Descriptions',
            impact: 'high',
            effort: 'low',
            pages: 34,
            description: '34 pages have meta descriptions that are too short or missing'
          },
          {
            title: 'Add Schema Markup',
            impact: 'high',
            effort: 'medium',
            pages: 67,
            description: 'Add structured data to improve search appearance'
          },
          {
            title: 'Optimize Images',
            impact: 'medium',
            effort: 'low',
            pages: 23,
            description: '23 pages have images without alt text'
          },
          {
            title: 'Improve Internal Linking',
            impact: 'medium',
            effort: 'medium',
            pages: 45,
            description: 'Enhance internal link structure for better crawlability'
          }
        ]
      });
      setAuditRunning(false);
      setActiveTab('audit');
    }, 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">SEO & AI Optimizer</h1>
          <p className="mt-1 text-sm text-gray-500">
            Analyze and optimize your content for search engines and AI
          </p>
        </div>
        <button
          onClick={runFullAudit}
          disabled={auditRunning}
          className="flex items-center gap-2 px-4 py-2 bg-eufy-blue text-white rounded-lg hover:bg-blue-600 transition disabled:opacity-50"
        >
          {auditRunning ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              Running Audit...
            </>
          ) : (
            <>
              <BarChart3 className="w-4 h-4" />
              Run Full Audit
            </>
          )}
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'overview'
                ? 'border-eufy-blue text-eufy-blue'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'audit'
                ? 'border-eufy-blue text-eufy-blue'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Audit Results
            {auditResults && (
              <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-800">
                {auditResults.issues.critical}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('recommendations')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'recommendations'
                ? 'border-eufy-blue text-eufy-blue'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Recommendations
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Score Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Average SEO Score</h3>
                <Target className="w-6 h-6 text-gray-400" />
              </div>
              <div className="flex items-baseline">
                <span className="text-3xl font-bold text-gray-900">82</span>
                <span className="text-sm text-gray-500 ml-1">/100</span>
              </div>
              <div className="mt-2 flex items-center text-sm">
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-green-600">+5 from last month</span>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">AI Optimization Score</h3>
                <BarChart3 className="w-6 h-6 text-gray-400" />
              </div>
              <div className="flex items-baseline">
                <span className="text-3xl font-bold text-gray-900">76</span>
                <span className="text-sm text-gray-500 ml-1">/100</span>
              </div>
              <div className="mt-2 flex items-center text-sm">
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-green-600">+8 from last month</span>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Content Health</h3>
                <CheckCircle className="w-6 h-6 text-gray-400" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Healthy</span>
                  <span className="font-medium text-green-600">124</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Needs Improvement</span>
                  <span className="font-medium text-yellow-600">28</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Critical</span>
                  <span className="font-medium text-red-600">4</span>
                </div>
              </div>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* SEO Score Trend */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900 mb-4">SEO Score Trend</h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={seoTrendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="score" 
                    stroke="#2563eb" 
                    strokeWidth={2}
                    dot={{ fill: '#2563eb' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Performance Radar */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Performance Overview</h3>
              <ResponsiveContainer width="100%" height={250}>
                <RadarChart data={performanceRadarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="aspect" />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} />
                  <Radar 
                    name="Score" 
                    dataKey="value" 
                    stroke="#2563eb" 
                    fill="#2563eb" 
                    fillOpacity={0.6} 
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition text-left">
                <AlertCircle className="w-8 h-8 text-yellow-500 mb-2" />
                <div className="font-medium">Fix Critical Issues</div>
                <div className="text-sm text-gray-500">5 pages affected</div>
              </button>
              <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition text-left">
                <Target className="w-8 h-8 text-blue-500 mb-2" />
                <div className="font-medium">Optimize Meta Tags</div>
                <div className="text-sm text-gray-500">34 pages need work</div>
              </button>
              <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition text-left">
                <BarChart3 className="w-8 h-8 text-green-500 mb-2" />
                <div className="font-medium">Add Schema Markup</div>
                <div className="text-sm text-gray-500">67 opportunities</div>
              </button>
              <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition text-left">
                <Download className="w-8 h-8 text-purple-500 mb-2" />
                <div className="font-medium">Export Report</div>
                <div className="text-sm text-gray-500">Full SEO audit</div>
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'audit' && auditResults && (
        <div className="space-y-6">
          {/* Audit Summary */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Audit Summary</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <div className="text-sm text-gray-500">Pages Analyzed</div>
                <div className="text-2xl font-semibold">{auditResults.analyzedPages}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Critical Issues</div>
                <div className="text-2xl font-semibold text-red-600">{auditResults.issues.critical}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Warnings</div>
                <div className="text-2xl font-semibold text-yellow-600">{auditResults.issues.warnings}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Info</div>
                <div className="text-2xl font-semibold text-blue-600">{auditResults.issues.info}</div>
              </div>
            </div>
          </div>

          {/* Opportunities */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Optimization Opportunities</h3>
            </div>
            <div className="divide-y divide-gray-200">
              {auditResults.opportunities.map((opportunity: any, index: number) => (
                <div key={index} className="p-6 hover:bg-gray-50 transition">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{opportunity.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">{opportunity.description}</p>
                      <div className="flex gap-4 mt-3">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          opportunity.impact === 'high' ? 'bg-red-100 text-red-800' :
                          opportunity.impact === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {opportunity.impact} impact
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          opportunity.effort === 'low' ? 'bg-green-100 text-green-800' :
                          opportunity.effort === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {opportunity.effort} effort
                        </span>
                        <span className="text-xs text-gray-500">
                          {opportunity.pages} pages affected
                        </span>
                      </div>
                    </div>
                    <button className="ml-4 text-sm text-eufy-blue hover:text-blue-700">
                      Fix Now →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'recommendations' && (
        <div className="space-y-6">
          {/* SEO Recommendations */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-4">SEO Recommendations</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-gray-900">Optimize Title Tags</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Include primary keywords in the first 60 characters. Make titles compelling and unique for each page.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-gray-900">Improve Meta Descriptions</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Write unique descriptions between 150-160 characters that include calls-to-action and target keywords.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-gray-900">Enhance Internal Linking</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Add 3-5 contextual internal links per page to improve site structure and user navigation.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* AI Optimization Recommendations */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-4">AI Optimization Recommendations</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-gray-900">Add Structured Data</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Implement Schema.org markup for products, reviews, FAQs, and how-to content to improve AI understanding.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-gray-900">Create Data Tables</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Convert comparison content into structured tables for better featured snippet opportunities.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-gray-900">Optimize for Voice Search</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Include natural language questions and conversational answers in your content.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Content Structure Recommendations */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Content Structure Recommendations</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-gray-900">Use Clear Heading Hierarchy</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Ensure proper H1-H6 structure with descriptive, keyword-rich headings.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-gray-900">Add Summary Sections</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Include TL;DR or key takeaways sections for better AI summarization.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-gray-900">Implement FAQ Sections</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Add FAQ sections with schema markup to target "People Also Ask" features.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}