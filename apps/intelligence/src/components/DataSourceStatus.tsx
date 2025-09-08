import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  Alert
} from '@mui/material';
import {
  CheckCircle as CheckIcon,
  Error as ErrorIcon,
  Pause as PauseIcon,
  Refresh as RefreshIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';
import { DataSource } from '@/types/intelligence';
import { format, formatDistanceToNow } from 'date-fns';

interface DataSourceStatusItem {
  source: DataSource;
  status: 'active' | 'inactive' | 'error';
  lastSync?: Date;
  itemsProcessed?: number;
  error?: string;
}

interface DataSourceStatusProps {
  sources: DataSourceStatusItem[];
  onRefresh?: (source: DataSource) => void;
  onConfigure?: (source: DataSource) => void;
}

const sourceDisplayNames: Record<DataSource, string> = {
  [DataSource.AMAZON]: 'Amazon',
  [DataSource.GOOGLE]: 'Google',
  [DataSource.FACEBOOK]: 'Facebook',
  [DataSource.INSTAGRAM]: 'Instagram',
  [DataSource.TWITTER]: 'Twitter',
  [DataSource.REDDIT]: 'Reddit',
  [DataSource.YOUTUBE]: 'YouTube',
  [DataSource.TIKTOK]: 'TikTok'
};

export const DataSourceStatus: React.FC<DataSourceStatusProps> = ({ 
  sources, 
  onRefresh,
  onConfigure 
}) => {
  const getStatusIcon = (status: DataSourceStatusItem['status']) => {
    switch (status) {
      case 'active':
        return <CheckIcon color="success" />;
      case 'inactive':
        return <PauseIcon color="disabled" />;
      case 'error':
        return <ErrorIcon color="error" />;
    }
  };

  const getStatusColor = (status: DataSourceStatusItem['status']) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'default';
      case 'error':
        return 'error';
    }
  };

  const activeSources = sources.filter(s => s.status === 'active').length;
  const totalProcessed = sources.reduce((sum, s) => sum + (s.itemsProcessed || 0), 0);

  return (
    <Box>
      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Active Sources
              </Typography>
              <Typography variant="h4">
                {activeSources}/{sources.length}
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={(activeSources / sources.length) * 100}
                sx={{ mt: 2 }}
              />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Total Items Processed
              </Typography>
              <Typography variant="h4">
                {totalProcessed.toLocaleString()}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Last 24 hours
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Error Rate
              </Typography>
              <Typography variant="h4">
                {Math.round((sources.filter(s => s.status === 'error').length / sources.length) * 100)}%
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {sources.filter(s => s.status === 'error').length} sources with errors
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Configuration Alerts */}
      {sources.some(s => s.status === 'inactive' && s.error?.includes('authentication')) && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          Some data sources require authentication. Click the settings icon to configure API access.
        </Alert>
      )}

      {/* Data Sources Table */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Data Source Details
          </Typography>
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Source</TableCell>
                  <TableCell align="center">Status</TableCell>
                  <TableCell>Last Sync</TableCell>
                  <TableCell align="right">Items Processed</TableCell>
                  <TableCell>Error</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sources.map((source) => (
                  <TableRow key={source.source}>
                    <TableCell>
                      <Typography variant="body2" fontWeight="medium">
                        {sourceDisplayNames[source.source]}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Box display="flex" alignItems="center" justifyContent="center" gap={1}>
                        {getStatusIcon(source.status)}
                        <Chip 
                          label={source.status}
                          size="small"
                          color={getStatusColor(source.status)}
                          variant="outlined"
                        />
                      </Box>
                    </TableCell>
                    <TableCell>
                      {source.lastSync ? (
                        <Box>
                          <Typography variant="body2">
                            {format(new Date(source.lastSync), 'PPp')}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {formatDistanceToNow(new Date(source.lastSync), { addSuffix: true })}
                          </Typography>
                        </Box>
                      ) : '-'}
                    </TableCell>
                    <TableCell align="right">
                      {source.itemsProcessed?.toLocaleString() || '-'}
                    </TableCell>
                    <TableCell>
                      {source.error && (
                        <Typography variant="caption" color="error">
                          {source.error}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell align="center">
                      <Box display="flex" gap={0.5} justifyContent="center">
                        {onRefresh && source.status === 'active' && (
                          <Tooltip title="Refresh Now">
                            <IconButton 
                              size="small" 
                              onClick={() => onRefresh(source.source)}
                            >
                              <RefreshIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                        {onConfigure && (
                          <Tooltip title="Configure">
                            <IconButton 
                              size="small" 
                              onClick={() => onConfigure(source.source)}
                            >
                              <SettingsIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Crawler Schedule Info */}
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Crawler Schedule
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" gutterBottom>
                High Priority Sources (Every 5 minutes)
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Amazon, Google - Real-time price and availability monitoring
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" gutterBottom>
                Social Media Sources (Every 30 minutes)
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Twitter, Reddit, YouTube - Sentiment and engagement tracking
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default DataSourceStatus;