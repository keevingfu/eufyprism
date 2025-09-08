import React, { useState, useEffect } from 'react';
import {
  Alert as MuiAlert,
  AlertTitle,
  Box,
  Card,
  CardContent,
  Chip,
  Grid,
  IconButton,
  Typography,
  Collapse,
  Badge,
  Tooltip,
  Stack
} from '@mui/material';
import {
  Warning as WarningIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  CheckCircle as CheckCircleIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  NotificationsActive as NotificationsIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon
} from '@mui/icons-material';
import { Alert, AlertLevel } from '@/types/intelligence';
import { format } from 'date-fns';

interface AlertSystemProps {
  alerts: Alert[];
  onDismiss?: (alertId: string) => void;
  onAction?: (alert: Alert) => void;
}

const alertConfig = {
  [AlertLevel.GREEN]: {
    icon: <CheckCircleIcon />,
    color: 'success' as const,
    severity: 'success' as const,
    label: 'Normal'
  },
  [AlertLevel.YELLOW]: {
    icon: <InfoIcon />,
    color: 'warning' as const,
    severity: 'warning' as const,
    label: 'Low Priority'
  },
  [AlertLevel.ORANGE]: {
    icon: <WarningIcon />,
    color: 'warning' as const,
    severity: 'warning' as const,
    label: 'Medium Priority'
  },
  [AlertLevel.RED]: {
    icon: <ErrorIcon />,
    color: 'error' as const,
    severity: 'error' as const,
    label: 'High Priority'
  }
};

export const AlertSystem: React.FC<AlertSystemProps> = ({ 
  alerts, 
  onDismiss,
  onAction 
}) => {
  const [expandedAlerts, setExpandedAlerts] = useState<Set<string>>(new Set());
  const [unreadCount, setUnreadCount] = useState(0);

  // Group alerts by level
  const groupedAlerts = alerts.reduce((acc, alert) => {
    if (!acc[alert.level]) {
      acc[alert.level] = [];
    }
    acc[alert.level].push(alert);
    return acc;
  }, {} as Record<AlertLevel, Alert[]>);

  useEffect(() => {
    // Count unread critical alerts
    const criticalUnread = alerts.filter(
      a => a.level === AlertLevel.RED || a.level === AlertLevel.ORANGE
    ).length;
    setUnreadCount(criticalUnread);
  }, [alerts]);

  const toggleExpand = (alertId: string) => {
    setExpandedAlerts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(alertId)) {
        newSet.delete(alertId);
      } else {
        newSet.add(alertId);
      }
      return newSet;
    });
  };

  const renderAlertIcon = (alert: Alert) => {
    const config = alertConfig[alert.level];
    
    if (alert.metadata?.priceDropPercent) {
      return <TrendingDownIcon sx={{ color: 'error.main' }} />;
    }
    if (alert.metadata?.growthPercent) {
      return <TrendingUpIcon sx={{ color: 'success.main' }} />;
    }
    
    return config.icon;
  };

  const renderAlert = (alert: Alert) => {
    const config = alertConfig[alert.level];
    const isExpanded = expandedAlerts.has(alert.id);

    return (
      <Card 
        key={alert.id}
        sx={{ 
          mb: 2, 
          borderLeft: `4px solid`,
          borderLeftColor: `${config.color}.main`,
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: 3
          }
        }}
      >
        <CardContent>
          <Box display="flex" alignItems="flex-start" justifyContent="space-between">
            <Box display="flex" alignItems="flex-start" flex={1}>
              <Box sx={{ mr: 2, mt: 0.5 }}>
                {renderAlertIcon(alert)}
              </Box>
              
              <Box flex={1}>
                <Box display="flex" alignItems="center" mb={1}>
                  <Typography variant="h6" component="div" sx={{ mr: 2 }}>
                    {alert.title}
                  </Typography>
                  <Chip 
                    label={config.label}
                    color={config.color}
                    size="small"
                    sx={{ mr: 1 }}
                  />
                  <Chip 
                    label={alert.source}
                    size="small"
                    variant="outlined"
                  />
                </Box>

                <Typography 
                  variant="body2" 
                  color="text.secondary"
                  paragraph
                  sx={{ mb: 1 }}
                >
                  {alert.description}
                </Typography>

                <Collapse in={isExpanded}>
                  {alert.actionRequired && (
                    <MuiAlert 
                      severity="info" 
                      sx={{ mb: 2 }}
                      action={
                        onAction && (
                          <Tooltip title="Take Action">
                            <IconButton
                              size="small"
                              onClick={() => onAction(alert)}
                            >
                              <NotificationsIcon />
                            </IconButton>
                          </Tooltip>
                        )
                      }
                    >
                      <AlertTitle>Recommended Action</AlertTitle>
                      {alert.actionRequired}
                    </MuiAlert>
                  )}

                  {alert.metadata && (
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        Additional Details:
                      </Typography>
                      <Grid container spacing={1}>
                        {Object.entries(alert.metadata).map(([key, value]) => (
                          <Grid item xs={12} sm={6} md={4} key={key}>
                            <Typography variant="caption" color="text.secondary">
                              {key.replace(/([A-Z])/g, ' $1').trim()}:
                            </Typography>
                            <Typography variant="body2">
                              {typeof value === 'number' ? value.toLocaleString() : String(value)}
                            </Typography>
                          </Grid>
                        ))}
                      </Grid>
                    </Box>
                  )}
                </Collapse>

                <Box display="flex" alignItems="center" justifyContent="space-between" mt={2}>
                  <Typography variant="caption" color="text.secondary">
                    {format(new Date(alert.timestamp), 'PPpp')}
                  </Typography>
                  
                  <Box>
                    {(alert.actionRequired || alert.metadata) && (
                      <IconButton 
                        size="small"
                        onClick={() => toggleExpand(alert.id)}
                      >
                        {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                      </IconButton>
                    )}
                    
                    {onDismiss && (
                      <IconButton 
                        size="small"
                        onClick={() => onDismiss(alert.id)}
                      >
                        ×
                      </IconButton>
                    )}
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>
    );
  };

  return (
    <Box>
      {/* Alert Summary */}
      <Box mb={3}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ bgcolor: 'error.light', color: 'error.contrastText' }}>
              <CardContent>
                <Typography variant="h4">
                  {groupedAlerts[AlertLevel.RED]?.length || 0}
                </Typography>
                <Typography variant="body2">Critical Alerts</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ bgcolor: 'warning.light', color: 'warning.contrastText' }}>
              <CardContent>
                <Typography variant="h4">
                  {groupedAlerts[AlertLevel.ORANGE]?.length || 0}
                </Typography>
                <Typography variant="body2">Medium Priority</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ bgcolor: 'info.light', color: 'info.contrastText' }}>
              <CardContent>
                <Typography variant="h4">
                  {groupedAlerts[AlertLevel.YELLOW]?.length || 0}
                </Typography>
                <Typography variant="body2">Low Priority</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ bgcolor: 'success.light', color: 'success.contrastText' }}>
              <CardContent>
                <Typography variant="h4">
                  {groupedAlerts[AlertLevel.GREEN]?.length || 0}
                </Typography>
                <Typography variant="body2">Normal Status</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* Alert List */}
      <Stack spacing={2}>
        {/* Critical Alerts First */}
        {groupedAlerts[AlertLevel.RED]?.map(renderAlert)}
        {groupedAlerts[AlertLevel.ORANGE]?.map(renderAlert)}
        {groupedAlerts[AlertLevel.YELLOW]?.map(renderAlert)}
        {groupedAlerts[AlertLevel.GREEN]?.map(renderAlert)}
      </Stack>

      {alerts.length === 0 && (
        <Box textAlign="center" py={4}>
          <CheckCircleIcon sx={{ fontSize: 48, color: 'success.main', mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            No active alerts
          </Typography>
          <Typography variant="body2" color="text.secondary">
            All systems are operating normally
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default AlertSystem;