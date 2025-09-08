import { useState, useEffect, useCallback } from 'react';
import useSWR from 'swr';
import axios from 'axios';
import { Alert, MarketOpportunity, CompetitorData, DataSource } from '@/types/intelligence';

interface DataSourceStatus {
  source: DataSource;
  status: 'active' | 'inactive' | 'error';
  lastSync?: Date;
  itemsProcessed?: number;
  error?: string;
}

const fetcher = (url: string) => axios.get(url).then(res => res.data);

export function useIntelligenceData() {
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fetch alerts
  const { 
    data: alertsData, 
    error: alertsError, 
    mutate: mutateAlerts 
  } = useSWR('/api/intelligence/alerts', fetcher, {
    refreshInterval: 60000 // Refresh every minute
  });

  // Fetch opportunities
  const { 
    data: opportunitiesData, 
    error: opportunitiesError,
    mutate: mutateOpportunities
  } = useSWR('/api/intelligence/opportunities', fetcher, {
    refreshInterval: 300000 // Refresh every 5 minutes
  });

  // Fetch competitors
  const { 
    data: competitorsData, 
    error: competitorsError,
    mutate: mutateCompetitors
  } = useSWR('/api/intelligence/competitors', fetcher, {
    refreshInterval: 300000 // Refresh every 5 minutes
  });

  // Mock data source status (would come from crawler service in production)
  const [dataSourceStatus, setDataSourceStatus] = useState<DataSourceStatus[]>([
    {
      source: DataSource.AMAZON,
      status: 'active',
      lastSync: new Date(),
      itemsProcessed: 1250
    },
    {
      source: DataSource.GOOGLE,
      status: 'active',
      lastSync: new Date(),
      itemsProcessed: 3400
    },
    {
      source: DataSource.FACEBOOK,
      status: 'inactive',
      error: 'API authentication required'
    },
    {
      source: DataSource.INSTAGRAM,
      status: 'inactive',
      error: 'API authentication required'
    },
    {
      source: DataSource.TWITTER,
      status: 'active',
      lastSync: new Date(),
      itemsProcessed: 890
    },
    {
      source: DataSource.REDDIT,
      status: 'active',
      lastSync: new Date(),
      itemsProcessed: 456
    },
    {
      source: DataSource.YOUTUBE,
      status: 'error',
      error: 'Rate limit exceeded'
    },
    {
      source: DataSource.TIKTOK,
      status: 'inactive'
    }
  ]);

  // Refresh all data
  const refresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([
        mutateAlerts(),
        mutateOpportunities(),
        mutateCompetitors()
      ]);
      
      // Simulate data source refresh
      setDataSourceStatus(prev => prev.map(ds => ({
        ...ds,
        lastSync: ds.status === 'active' ? new Date() : ds.lastSync,
        itemsProcessed: ds.status === 'active' 
          ? (ds.itemsProcessed || 0) + Math.floor(Math.random() * 100)
          : ds.itemsProcessed
      })));
    } finally {
      setIsRefreshing(false);
    }
  }, [mutateAlerts, mutateOpportunities, mutateCompetitors]);

  // Generate report
  const generateReport = useCallback(async () => {
    try {
      const response = await axios.post('/api/intelligence/report', {
        includeAlerts: true,
        includeOpportunities: true,
        includeCompetitors: true,
        dateRange: {
          start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
          end: new Date()
        }
      });
      return response.data;
    } catch (error) {
      console.error('Failed to generate report:', error);
      throw error;
    }
  }, []);

  // Dismiss alert
  const dismissAlert = useCallback(async (alertId: string) => {
    try {
      await axios.delete(`/api/intelligence/alerts?id=${alertId}`);
      await mutateAlerts();
    } catch (error) {
      console.error('Failed to dismiss alert:', error);
      throw error;
    }
  }, [mutateAlerts]);

  // Mark opportunity as acted
  const markOpportunityActed = useCallback(async (
    opportunityId: string, 
    action: string
  ) => {
    try {
      await axios.post('/api/intelligence/opportunities', {
        opportunityId,
        action
      });
      await mutateOpportunities();
    } catch (error) {
      console.error('Failed to mark opportunity:', error);
      throw error;
    }
  }, [mutateOpportunities]);

  const isLoading = !alertsData || !opportunitiesData || !competitorsData;
  const error = alertsError || opportunitiesError || competitorsError;

  return {
    alerts: alertsData?.alerts || [],
    opportunities: opportunitiesData?.opportunities || [],
    competitors: competitorsData?.competitors || [],
    dataSourceStatus,
    isLoading,
    isRefreshing,
    error,
    refresh,
    generateReport,
    dismissAlert,
    markOpportunityActed
  };
}