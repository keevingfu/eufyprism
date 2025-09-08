import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  ToggleButton,
  ToggleButtonGroup,
  Paper
} from '@mui/material';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts';
import { Alert, MarketOpportunity, AlertLevel } from '@/types/intelligence';
import { format, subDays, startOfDay } from 'date-fns';

interface IntelligenceChartProps {
  alerts: Alert[];
  opportunities: MarketOpportunity[];
}

export const IntelligenceChart: React.FC<IntelligenceChartProps> = ({
  alerts,
  opportunities
}) => {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('7d');
  const [chartType, setChartType] = useState<'alerts' | 'opportunities' | 'trends'>('alerts');

  const handleTimeRangeChange = (_: React.MouseEvent<HTMLElement>, newRange: string) => {
    if (newRange) setTimeRange(newRange as '7d' | '30d' | '90d');
  };

  const handleChartTypeChange = (_: React.MouseEvent<HTMLElement>, newType: string) => {
    if (newType) setChartType(newType as 'alerts' | 'opportunities' | 'trends');
  };

  // Generate time series data for alerts
  const getAlertTimeSeriesData = () => {
    const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
    const data = [];

    for (let i = days - 1; i >= 0; i--) {
      const date = startOfDay(subDays(new Date(), i));
      const dateStr = format(date, 'MMM dd');
      
      // Mock data - in production, filter actual alerts by date
      data.push({
        date: dateStr,
        critical: Math.floor(Math.random() * 3),
        medium: Math.floor(Math.random() * 5),
        low: Math.floor(Math.random() * 8),
        total: Math.floor(Math.random() * 15)
      });
    }

    return data;
  };

  // Alert distribution by level
  const alertDistribution = [
    { name: 'Critical', value: alerts.filter(a => a.level === AlertLevel.RED).length, color: '#f44336' },
    { name: 'Medium', value: alerts.filter(a => a.level === AlertLevel.ORANGE).length, color: '#ff9800' },
    { name: 'Low', value: alerts.filter(a => a.level === AlertLevel.YELLOW).length, color: '#ffeb3b' },
    { name: 'Normal', value: alerts.filter(a => a.level === AlertLevel.GREEN).length, color: '#4caf50' }
  ];

  // Opportunity distribution by type
  const opportunityDistribution = [
    { name: 'Content Gap', value: opportunities.filter(o => o.type === 'content_gap').length, color: '#2196f3' },
    { name: 'Seasonal', value: opportunities.filter(o => o.type === 'seasonal_trend').length, color: '#4caf50' },
    { name: 'Keywords', value: opportunities.filter(o => o.type === 'emerging_keyword').length, color: '#ff9800' },
    { name: 'Competitor', value: opportunities.filter(o => o.type === 'competitor_weakness').length, color: '#f44336' },
    { name: 'Demand', value: opportunities.filter(o => o.type === 'demand_spike').length, color: '#9c27b0' }
  ];

  // Mock trend data
  const trendData = [
    { month: 'Jan', eufy: 65, ring: 78, arlo: 45, wyze: 32 },
    { month: 'Feb', eufy: 72, ring: 75, arlo: 48, wyze: 35 },
    { month: 'Mar', eufy: 78, ring: 73, arlo: 52, wyze: 38 },
    { month: 'Apr', eufy: 85, ring: 71, arlo: 55, wyze: 42 },
    { month: 'May', eufy: 92, ring: 69, arlo: 58, wyze: 48 },
    { month: 'Jun', eufy: 98, ring: 68, arlo: 60, wyze: 52 }
  ];

  const renderChart = () => {
    switch (chartType) {
      case 'alerts':
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Alert Trends Over Time
                  </Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={getAlertTimeSeriesData()}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Area 
                        type="monotone" 
                        dataKey="critical" 
                        stackId="1" 
                        stroke="#f44336" 
                        fill="#f44336" 
                      />
                      <Area 
                        type="monotone" 
                        dataKey="medium" 
                        stackId="1" 
                        stroke="#ff9800" 
                        fill="#ff9800" 
                      />
                      <Area 
                        type="monotone" 
                        dataKey="low" 
                        stackId="1" 
                        stroke="#ffeb3b" 
                        fill="#ffeb3b" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Alert Distribution
                  </Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={alertDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name}: ${value}`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {alertDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        );

      case 'opportunities':
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Opportunity Impact vs Confidence
                  </Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart 
                      data={opportunities.map(o => ({
                        title: o.title.substring(0, 20) + '...',
                        confidence: o.confidence,
                        impact: o.potentialImpact === 'high' ? 100 : 
                                o.potentialImpact === 'medium' ? 60 : 30
                      }))}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="title" angle={-45} textAnchor="end" height={100} />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="confidence" fill="#2196f3" name="Confidence %" />
                      <Bar dataKey="impact" fill="#4caf50" name="Impact Score" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Opportunity Types
                  </Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={opportunityDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name}: ${value}`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {opportunityDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        );

      case 'trends':
        return (
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Market Share Trends - Security Camera Brands
              </Typography>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis label={{ value: 'Market Share %', angle: -90, position: 'insideLeft' }} />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="eufy" 
                    stroke="#2196f3" 
                    strokeWidth={3}
                    dot={{ fill: '#2196f3' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="ring" 
                    stroke="#f44336" 
                    strokeWidth={2}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="arlo" 
                    stroke="#ff9800" 
                    strokeWidth={2}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="wyze" 
                    stroke="#4caf50" 
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        );
    }
  };

  return (
    <Box>
      {/* Controls */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <ToggleButtonGroup
          value={chartType}
          exclusive
          onChange={handleChartTypeChange}
          aria-label="chart type"
        >
          <ToggleButton value="alerts" aria-label="alerts">
            Alerts
          </ToggleButton>
          <ToggleButton value="opportunities" aria-label="opportunities">
            Opportunities
          </ToggleButton>
          <ToggleButton value="trends" aria-label="trends">
            Market Trends
          </ToggleButton>
        </ToggleButtonGroup>

        <ToggleButtonGroup
          value={timeRange}
          exclusive
          onChange={handleTimeRangeChange}
          aria-label="time range"
        >
          <ToggleButton value="7d" aria-label="7 days">
            7 Days
          </ToggleButton>
          <ToggleButton value="30d" aria-label="30 days">
            30 Days
          </ToggleButton>
          <ToggleButton value="90d" aria-label="90 days">
            90 Days
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* Charts */}
      {renderChart()}

      {/* Key Metrics */}
      <Grid container spacing={3} sx={{ mt: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h4" color="primary">
              {Math.round((98 / 320) * 100)}%
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Market Share Growth
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h4" color="success.main">
              +24%
            </Typography>
            <Typography variant="body2" color="text.secondary">
              YoY Revenue Growth
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h4" color="warning.main">
              4.5
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Avg. Product Rating
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h4" color="info.main">
              78%
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Customer Retention
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default IntelligenceChart;