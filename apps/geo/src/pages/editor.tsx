import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Save, Send, Eye, Settings, Info, AlertCircle } from 'lucide-react';
import ContentEditor from '@/components/ContentEditor';
import { Content, ContentType, SEOAnalysis, AIOAnalysis } from '@/types/geo';
import { seoAnalyzer } from '@/services/seo';
import { aioOptimizer } from '@/services/aio';

export default function EditorPage() {
  const router = useRouter();
  const { id } = router.query;
  
  const [content, setContent] = useState<Partial<Content>>({
    title: '',
    slug: '',
    type: 'guide',
    content: '',
    metaTitle: '',
    metaDescription: '',
    keywords: [],
    status: 'draft'
  });
  
  const [seoAnalysis, setSeoAnalysis] = useState<SEOAnalysis | null>(null);
  const [aioAnalysis, setAioAnalysis] = useState<AIOAnalysis | null>(null);
  const [activeTab, setActiveTab] = useState<'editor' | 'seo' | 'aio'>('editor');
  const [saving, setSaving] = useState(false);

  // Auto-analyze content when it changes
  useEffect(() => {
    const timer = setTimeout(() => {
      if (content.content) {
        const seo = seoAnalyzer.analyzeContent(
          content.content,
          content.metaTitle,
          content.metaDescription
        );
        setSeoAnalysis(seo);
        
        const aio = aioOptimizer.analyzeForAI(content.content, content.title || '');
        setAioAnalysis(aio);
      }
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [content.content, content.metaTitle, content.metaDescription, content.title]);

  const handleSave = async () => {
    setSaving(true);
    // TODO: Implement save to API
    setTimeout(() => setSaving(false), 1000);
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Content Editor</h1>
          <p className="mt-1 text-sm text-gray-500">
            Create and optimize content for SEO and AI search
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-eufy-blue text-white rounded-lg hover:bg-blue-600 transition disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save Draft'}
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
            <Send className="w-4 h-4" />
            Publish
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
            <Eye className="w-4 h-4" />
            Preview
          </button>
        </div>
      </div>

      {/* Content Type and Metadata */}
      <div className="bg-white p-6 rounded-lg shadow space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Content Type
            </label>
            <select
              value={content.type}
              onChange={(e) => setContent({ ...content, type: e.target.value as ContentType })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-eufy-blue focus:border-transparent"
            >
              <option value="review">Review</option>
              <option value="guide">Guide</option>
              <option value="faq">FAQ</option>
              <option value="comparison">Comparison</option>
              <option value="story">Story</option>
              <option value="announcement">Announcement</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              value={content.title}
              onChange={(e) => {
                setContent({ 
                  ...content, 
                  title: e.target.value,
                  slug: generateSlug(e.target.value)
                });
              }}
              placeholder="Enter content title..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-eufy-blue focus:border-transparent"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            URL Slug
          </label>
          <div className="flex">
            <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
              eufy.com/blog/
            </span>
            <input
              type="text"
              value={content.slug}
              onChange={(e) => setContent({ ...content, slug: e.target.value })}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-eufy-blue focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('editor')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'editor'
                ? 'border-eufy-blue text-eufy-blue'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Content Editor
          </button>
          <button
            onClick={() => setActiveTab('seo')}
            className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
              activeTab === 'seo'
                ? 'border-eufy-blue text-eufy-blue'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            SEO Optimization
            {seoAnalysis && (
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                seoAnalysis.score >= 80 ? 'bg-green-100 text-green-800' :
                seoAnalysis.score >= 60 ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {seoAnalysis.score}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('aio')}
            className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
              activeTab === 'aio'
                ? 'border-eufy-blue text-eufy-blue'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            AI Optimization
            {aioAnalysis && (
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                aioAnalysis.score >= 80 ? 'bg-green-100 text-green-800' :
                aioAnalysis.score >= 60 ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {aioAnalysis.score}
              </span>
            )}
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'editor' && (
        <div className="bg-white rounded-lg shadow">
          <ContentEditor
            content={content.content || ''}
            onChange={(newContent) => setContent({ ...content, content: newContent })}
            placeholder="Start writing your content..."
          />
        </div>
      )}

      {activeTab === 'seo' && (
        <div className="space-y-6">
          {/* SEO Metadata */}
          <div className="bg-white p-6 rounded-lg shadow space-y-4">
            <h3 className="text-lg font-medium text-gray-900">SEO Metadata</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Meta Title ({content.metaTitle?.length || 0}/60)
              </label>
              <input
                type="text"
                value={content.metaTitle}
                onChange={(e) => setContent({ ...content, metaTitle: e.target.value })}
                placeholder="Enter meta title..."
                maxLength={60}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-eufy-blue focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Meta Description ({content.metaDescription?.length || 0}/160)
              </label>
              <textarea
                value={content.metaDescription}
                onChange={(e) => setContent({ ...content, metaDescription: e.target.value })}
                placeholder="Enter meta description..."
                maxLength={160}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-eufy-blue focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Focus Keywords
              </label>
              <input
                type="text"
                value={content.keywords?.join(', ')}
                onChange={(e) => setContent({ 
                  ...content, 
                  keywords: e.target.value.split(',').map(k => k.trim()).filter(Boolean)
                })}
                placeholder="Enter keywords separated by commas..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-eufy-blue focus:border-transparent"
              />
            </div>
          </div>

          {/* SEO Analysis */}
          {seoAnalysis && (
            <>
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">SEO Analysis</h3>
                  <div className={`text-2xl font-semibold ${
                    seoAnalysis.score >= 80 ? 'text-green-600' :
                    seoAnalysis.score >= 60 ? 'text-yellow-600' :
                    'text-red-600'
                  }`}>
                    {seoAnalysis.score}/100
                  </div>
                </div>
                
                {/* Issues */}
                {seoAnalysis.issues.length > 0 && (
                  <div className="space-y-2 mb-6">
                    {seoAnalysis.issues.map((issue, index) => (
                      <div key={index} className={`p-3 rounded-lg flex items-start gap-2 ${
                        issue.type === 'error' ? 'bg-red-50' :
                        issue.type === 'warning' ? 'bg-yellow-50' :
                        'bg-blue-50'
                      }`}>
                        <AlertCircle className={`w-5 h-5 flex-shrink-0 ${
                          issue.type === 'error' ? 'text-red-600' :
                          issue.type === 'warning' ? 'text-yellow-600' :
                          'text-blue-600'
                        }`} />
                        <div>
                          <div className="font-medium text-sm">{issue.category}</div>
                          <div className="text-sm text-gray-600">{issue.message}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Suggestions */}
                {seoAnalysis.suggestions.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Suggestions</h4>
                    <div className="space-y-2">
                      {seoAnalysis.suggestions.map((suggestion, index) => (
                        <div key={index} className="p-3 bg-green-50 rounded-lg">
                          <div className="font-medium text-sm text-green-900">{suggestion.category}</div>
                          <div className="text-sm text-green-700">{suggestion.suggestion}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Technical SEO */}
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Technical SEO</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <div className="text-sm text-gray-500">Title Length</div>
                    <div className="text-lg font-medium">{seoAnalysis.technicalSEO.titleLength}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Description Length</div>
                    <div className="text-lg font-medium">{seoAnalysis.technicalSEO.descriptionLength}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">H1 Tags</div>
                    <div className="text-lg font-medium">{seoAnalysis.technicalSEO.h1Count}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Images with Alt</div>
                    <div className="text-lg font-medium">{seoAnalysis.technicalSEO.imageAltTags}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Internal Links</div>
                    <div className="text-lg font-medium">{seoAnalysis.technicalSEO.internalLinks}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">External Links</div>
                    <div className="text-lg font-medium">{seoAnalysis.technicalSEO.externalLinks}</div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {activeTab === 'aio' && aioAnalysis && (
        <div className="space-y-6">
          {/* AIO Score Overview */}
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium text-gray-900">AI Optimization Score</h3>
              <div className={`text-2xl font-semibold ${
                aioAnalysis.score >= 80 ? 'text-green-600' :
                aioAnalysis.score >= 60 ? 'text-yellow-600' :
                'text-red-600'
              }`}>
                {aioAnalysis.score}/100
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <div className="text-sm text-gray-500">Featured Snippet</div>
                <div className="text-lg font-medium">{aioAnalysis.featuredSnippetPotential}%</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Summary Quality</div>
                <div className="text-lg font-medium">{aioAnalysis.summaryQuality}%</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Structure Score</div>
                <div className="text-lg font-medium">{aioAnalysis.structureScore}%</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Entities Found</div>
                <div className="text-lg font-medium">{aioAnalysis.entityRecognition.length}</div>
              </div>
            </div>
          </div>

          {/* Entities */}
          {aioAnalysis.entityRecognition.length > 0 && (
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Recognized Entities</h3>
              <div className="flex flex-wrap gap-2">
                {aioAnalysis.entityRecognition.map((entity, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                  >
                    {entity.name} ({entity.type})
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Data Table Suggestions */}
          {aioAnalysis.dataTableSuggestions.length > 0 && (
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Suggested Data Tables</h3>
              <div className="space-y-4">
                {aioAnalysis.dataTableSuggestions.map((table, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2">{table.title}</h4>
                    <p className="text-sm text-gray-500 mb-2">Relevance: {table.relevance * 100}%</p>
                    <button className="text-sm text-eufy-blue hover:text-blue-700">
                      Insert this table →
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}