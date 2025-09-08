import React, { useState, useEffect } from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Tab,
  Tabs,
  Card,
  CardContent,
  IconButton,
  Button,
  Chip,
  LinearProgress,
  Alert as MuiAlert
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Analytics as AnalyticsIcon,
  TrendingUp as TrendingUpIcon,
  Warning as WarningIcon,
  Refresh as RefreshIcon,
  Search as SearchIcon,
  Download as DownloadIcon
} from '@mui/icons-material';
import { AlertSystem } from '@/components/AlertSystem';
import { MarketOpportunities } from '@/components/MarketOpportunities';
import { CompetitorAnalysis } from '@/components/CompetitorAnalysis';
import { DataSourceStatus } from '@/components/DataSourceStatus';
import { IntelligenceChart } from '@/components/IntelligenceChart';
import { useIntelligenceData } from '@/hooks/useIntelligenceData';
import { Alert, MarketOpportunity, CompetitorData } from '@/types/intelligence';
import { format } from 'date-fns';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`intelligence-tabpanel-${index}`}
      aria-labelledby={`intelligence-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

const Dashboard: NextPage = () => {
  const [tabValue, setTabValue] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const {
    alerts,
    opportunities,
    competitors,
    dataSourceStatus,
    isLoading,
    error,
    refresh,
    generateReport
  } = useIntelligenceData();

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refresh();
    setIsRefreshing(false);
  };

  const handleGenerateReport = async () => {
    const report = await generateReport();
    // Download report as JSON (in production, this would be a formatted PDF)
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `intelligence-report-${format(new Date(), 'yyyy-MM-dd')}.json`;
    a.click();
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  if (error) {
    return (
      <Container>
        <MuiAlert severity="error" sx={{ mt: 4 }}>
          Error loading intelligence data: {error.message}
        </MuiAlert>
      </Container>
    );
  }

  return (
    <>
      <Head>
        <title>Eufy E28 Intelligence Dashboard</title>
        <meta name="description" content="Real-time market intelligence and competitive analysis" />
      </Head>

      <Box sx={{ flexGrow: 1, bgcolor: 'background.default', minHeight: '100vh' }}>
        {isLoading && <LinearProgress />}
        
        <Container maxWidth="xl" sx={{ py: 4 }}>
          {/* Header */}
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
            <Box>
              <Typography variant="h4" component="h1" gutterBottom>
                Intelligence Dashboard
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Real-time market intelligence and competitive analysis for Eufy E28
              </Typography>
            </Box>
            
            <Box>
              <Button
                variant="outlined"
                startIcon={<DownloadIcon />}
                onClick={handleGenerateReport}
                sx={{ mr: 2 }}
              >
                Generate Report
              </Button>
              <IconButton 
                onClick={handleRefresh}
                disabled={isRefreshing}
                color="primary"
              >
                <RefreshIcon className={isRefreshing ? 'rotating' : ''} />
              </IconButton>
            </Box>
          </Box>

          {/* Summary Cards */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Box>
                      <Typography color="text.secondary" gutterBottom>
                        Active Alerts
                      </Typography>
                      <Typography variant="h4">
                        {alerts.length}
                      </Typography>
                      <Chip
                        label={`${alerts.filter(a => a.level === 'red').length} Critical`}
                        color="error"
                        size="small"
                        sx={{ mt: 1 }}
                      />
                    </Box>
                    <WarningIcon sx={{ fontSize: 40, color: 'warning.main' }} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Box>
                      <Typography color="text.secondary" gutterBottom>
                        Opportunities
                      </Typography>
                      <Typography variant="h4">
                        {opportunities.length}
                      </Typography>
                      <Chip
                        label={`${opportunities.filter(o => o.potentialImpact === 'high').length} High Impact`}
                        color="success"
                        size="small"
                        sx={{ mt: 1 }}
                      />
                    </Box>
                    <TrendingUpIcon sx={{ fontSize: 40, color: 'success.main' }} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Box>
                      <Typography color="text.secondary" gutterBottom>
                        Competitors Tracked
                      </Typography>
                      <Typography variant="h4">
                        {competitors.length}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Real-time monitoring
                      </Typography>
                    </Box>
                    <AnalyticsIcon sx={{ fontSize: 40, color: 'primary.main' }} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Box>
                      <Typography color="text.secondary" gutterBottom>
                        Data Sources
                      </Typography>
                      <Typography variant="h4">
                        {dataSourceStatus.filter(ds => ds.status === 'active').length}/{dataSourceStatus.length}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Active connections
                      </Typography>
                    </Box>
                    <DashboardIcon sx={{ fontSize: 40, color: 'info.main' }} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Main Content Tabs */}
          <Paper sx={{ width: '100%' }}>
            <Tabs value={tabValue} onChange={handleTabChange} aria-label="intelligence dashboard tabs">
              <Tab label="Alerts" />
              <Tab label="Market Opportunities" />
              <Tab label="Competitor Analysis" />
              <Tab label="Analytics" />
              <Tab label="Data Sources" />
            </Tabs>

            <Box sx={{ p: 3 }}>
              <TabPanel value={tabValue} index={0}>
                <AlertSystem 
                  alerts={alerts}
                  onAction={(alert) => console.log('Action for alert:', alert)}
                />
              </TabPanel>

              <TabPanel value={tabValue} index={1}>
                <MarketOpportunities opportunities={opportunities} />
              </TabPanel>

              <TabPanel value={tabValue} index={2}>
                <CompetitorAnalysis competitors={competitors} />
              </TabPanel>

              <TabPanel value={tabValue} index={3}>
                <IntelligenceChart 
                  alerts={alerts}
                  opportunities={opportunities}
                />
              </TabPanel>

              <TabPanel value={tabValue} index={4}>
                <DataSourceStatus sources={dataSourceStatus} />
              </TabPanel>
            </Box>
          </Paper>
        </Container>
      </Box>

      <style jsx global>{`
        @keyframes rotate {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        
        .rotating {
          animation: rotate 1s linear infinite;
        }
      `}</style>
    </>
  );
};

export default Dashboard;