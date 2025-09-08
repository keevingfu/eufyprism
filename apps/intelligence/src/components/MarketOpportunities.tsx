import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Chip,
  Grid,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  LinearProgress,
  Tooltip,
  IconButton
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  ContentPaste as ContentIcon,
  DateRange as SeasonalIcon,
  Search as KeywordIcon,
  Warning as WeaknessIcon,
  FlashOn as SpikeIcon,
  CheckCircle as CheckIcon,
  Launch as LaunchIcon
} from '@mui/icons-material';
import { MarketOpportunity } from '@/types/intelligence';

interface MarketOpportunitiesProps {
  opportunities: MarketOpportunity[];
  onAction?: (opportunity: MarketOpportunity) => void;
}

const opportunityIcons = {
  content_gap: <ContentIcon />,
  seasonal_trend: <SeasonalIcon />,
  emerging_keyword: <KeywordIcon />,
  competitor_weakness: <WeaknessIcon />,
  demand_spike: <SpikeIcon />
};

const impactColors = {
  high: 'error' as const,
  medium: 'warning' as const,
  low: 'info' as const
};

export const MarketOpportunities: React.FC<MarketOpportunitiesProps> = ({ 
  opportunities, 
  onAction 
}) => {
  const getOpportunityIcon = (type: MarketOpportunity['type']) => {
    return opportunityIcons[type] || <TrendingUpIcon />;
  };

  const renderOpportunity = (opportunity: MarketOpportunity) => {
    const impactColor = impactColors[opportunity.potentialImpact];
    
    return (
      <Grid item xs={12} md={6} key={opportunity.id}>
        <Card 
          sx={{ 
            height: '100%',
            transition: 'all 0.3s ease',
            '&:hover': {
              boxShadow: 4,
              transform: 'translateY(-2px)'
            }
          }}
        >
          <CardContent>
            <Box display="flex" alignItems="flex-start" justifyContent="space-between" mb={2}>
              <Box display="flex" alignItems="center">
                <Box sx={{ mr: 2, color: `${impactColor}.main` }}>
                  {getOpportunityIcon(opportunity.type)}
                </Box>
                <Box>
                  <Typography variant="h6" component="div">
                    {opportunity.title}
                  </Typography>
                  <Box display="flex" gap={1} mt={1}>
                    <Chip 
                      label={opportunity.type.replace('_', ' ')}
                      size="small"
                      variant="outlined"
                    />
                    <Chip 
                      label={`${opportunity.potentialImpact} impact`}
                      color={impactColor}
                      size="small"
                    />
                  </Box>
                </Box>
              </Box>
              {onAction && (
                <Tooltip title="Take Action">
                  <IconButton 
                    size="small" 
                    onClick={() => onAction(opportunity)}
                  >
                    <LaunchIcon />
                  </IconButton>
                </Tooltip>
              )}
            </Box>

            <Typography variant="body2" color="text.secondary" paragraph>
              {opportunity.description}
            </Typography>

            {/* Confidence Score */}
            <Box mb={2}>
              <Box display="flex" justifyContent="space-between" mb={1}>
                <Typography variant="caption" color="text.secondary">
                  Confidence Score
                </Typography>
                <Typography variant="caption">
                  {opportunity.confidence}%
                </Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={opportunity.confidence} 
                sx={{
                  height: 6,
                  borderRadius: 3,
                  bgcolor: 'action.hover',
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 3,
                    bgcolor: opportunity.confidence > 80 ? 'success.main' :
                            opportunity.confidence > 60 ? 'warning.main' : 'error.main'
                  }
                }}
              />
            </Box>

            {/* Metrics */}
            {(opportunity.estimatedVolume || opportunity.competitionLevel) && (
              <Box display="flex" gap={2} mb={2}>
                {opportunity.estimatedVolume && (
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Est. Volume
                    </Typography>
                    <Typography variant="body2" fontWeight="medium">
                      {opportunity.estimatedVolume.toLocaleString()}/mo
                    </Typography>
                  </Box>
                )}
                {opportunity.competitionLevel && (
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Competition
                    </Typography>
                    <Typography variant="body2" fontWeight="medium">
                      {opportunity.competitionLevel}
                    </Typography>
                  </Box>
                )}
              </Box>
            )}

            {/* Related Keywords */}
            {opportunity.relatedKeywords && opportunity.relatedKeywords.length > 0 && (
              <Box mb={2}>
                <Typography variant="caption" color="text.secondary" gutterBottom>
                  Related Keywords
                </Typography>
                <Box display="flex" flexWrap="wrap" gap={0.5} mt={0.5}>
                  {opportunity.relatedKeywords.map((keyword, idx) => (
                    <Chip 
                      key={idx}
                      label={keyword}
                      size="small"
                      variant="outlined"
                      sx={{ fontSize: '0.75rem' }}
                    />
                  ))}
                </Box>
              </Box>
            )}

            {/* Recommendations */}
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Recommended Actions
              </Typography>
              <List dense>
                {opportunity.recommendations.slice(0, 3).map((rec, idx) => (
                  <ListItem key={idx} disablePadding>
                    <ListItemIcon sx={{ minWidth: 32 }}>
                      <CheckIcon fontSize="small" color="success" />
                    </ListItemIcon>
                    <ListItemText 
                      primary={rec}
                      primaryTypographyProps={{
                        variant: 'body2',
                        color: 'text.secondary'
                      }}
                    />
                  </ListItem>
                ))}
              </List>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    );
  };

  return (
    <Box>
      {/* Summary Stats */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={4}>
          <Card sx={{ bgcolor: 'error.light' }}>
            <CardContent>
              <Typography variant="h4" color="error.contrastText">
                {opportunities.filter(o => o.potentialImpact === 'high').length}
              </Typography>
              <Typography variant="body2" color="error.contrastText">
                High Impact Opportunities
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card sx={{ bgcolor: 'warning.light' }}>
            <CardContent>
              <Typography variant="h4" color="warning.contrastText">
                {opportunities.filter(o => o.confidence >= 80).length}
              </Typography>
              <Typography variant="body2" color="warning.contrastText">
                High Confidence (≥80%)
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card sx={{ bgcolor: 'success.light' }}>
            <CardContent>
              <Typography variant="h4" color="success.contrastText">
                {opportunities.filter(o => o.type === 'content_gap').length}
              </Typography>
              <Typography variant="body2" color="success.contrastText">
                Content Opportunities
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Opportunities Grid */}
      <Grid container spacing={3}>
        {opportunities.map(renderOpportunity)}
      </Grid>

      {opportunities.length === 0 && (
        <Box textAlign="center" py={4}>
          <Typography variant="h6" color="text.secondary">
            No market opportunities found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Check back later for new insights
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default MarketOpportunities;