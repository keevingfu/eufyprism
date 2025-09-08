import { useState, useEffect } from 'react';
import KeywordPlanner from '@/components/KeywordPlanner';
import { Keyword } from '@/types/geo';
import axios from 'axios';

export default function KeywordsPage() {
  const [keywords, setKeywords] = useState<Keyword[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchKeywords();
  }, []);

  const fetchKeywords = async () => {
    try {
      const response = await axios.get('/api/keywords');
      setKeywords(response.data.keywords);
    } catch (error) {
      console.error('Error fetching keywords:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddKeyword = async (keyword: string) => {
    try {
      const response = await axios.post('/api/keywords', { keyword });
      setKeywords([...keywords, response.data]);
    } catch (error) {
      console.error('Error adding keyword:', error);
    }
  };

  const handleRemoveKeyword = async (id: string) => {
    try {
      await axios.delete('/api/keywords', { data: { id } });
      setKeywords(keywords.filter(k => k.id !== id));
    } catch (error) {
      console.error('Error removing keyword:', error);
    }
  };

  const handleUpdatePriority = async (id: string, priority: 'high' | 'medium' | 'low') => {
    try {
      await axios.patch('/api/keywords', { keywordId: id, priority });
      setKeywords(keywords.map(k => 
        k.id === id ? { ...k, priority } : k
      ));
    } catch (error) {
      console.error('Error updating priority:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Loading keywords...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Keyword Research & Planning</h1>
        <p className="mt-1 text-sm text-gray-500">
          Research keywords, analyze competition, and plan your content strategy
        </p>
      </div>

      <KeywordPlanner
        keywords={keywords}
        onAddKeyword={handleAddKeyword}
        onRemoveKeyword={handleRemoveKeyword}
        onUpdatePriority={handleUpdatePriority}
      />
    </div>
  );
}