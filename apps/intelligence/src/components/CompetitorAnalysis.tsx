import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tooltip,
  IconButton
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Info as InfoIcon,
  Launch as LaunchIcon
} from '@mui/icons-material';
import { CompetitorData } from '@/types/intelligence';
import { format } from 'date-fns';

interface CompetitorAnalysisProps {
  competitors: CompetitorData[];
}

export const CompetitorAnalysis: React.FC<CompetitorAnalysisProps> = ({ competitors }) => {
  // Mock data for demonstration
  const mockCompetitors = [
    {
      id: '1',
      name: 'Ring',
      products: [
        {
          id: 'p1',
          name: 'Ring Video Doorbell Pro',
          currentPrice: 187.49,
          originalPrice: 249.99,
          rating: 4.1,
          reviewCount: 15420,
          availability: 'in_stock' as const,
          productUrl: '#'
        }
      ],
      marketingActivities: [],
      priceHistory: [],
      socialMetrics: {
        followers: { twitter: 125000, facebook: 850000, instagram: 320000 },
        engagement: {},
        sentiment: 0.65,
        mentions: 2340
      },
      lastUpdated: new Date()
    },
    {
      id: '2',
      name: 'Arlo',
      products: [
        {
          id: 'p2',
          name: 'Arlo Pro 4',
          currentPrice: 179.99,
          originalPrice: 199.99,
          rating: 4.3,
          reviewCount: 8320,
          availability: 'in_stock' as const,
          productUrl: '#'
        }
      ],
      marketingActivities: [],
      priceHistory: [],
      socialMetrics: {
        followers: { twitter: 89000, facebook: 620000, instagram: 180000 },
        engagement: {},
        sentiment: 0.72,
        mentions: 1560
      },
      lastUpdated: new Date()
    },
    {
      id: '3',
      name: 'Wyze',
      products: [
        {
          id: 'p3',
          name: 'Wyze Cam v3',
          currentPrice: 35.99,
          originalPrice: 35.99,
          rating: 4.2,
          reviewCount: 22100,
          availability: 'limited' as const,
          productUrl: '#'
        }
      ],
      marketingActivities: [],
      priceHistory: [],
      socialMetrics: {
        followers: { twitter: 45000, facebook: 380000, instagram: 92000 },
        engagement: {},
        sentiment: 0.78,
        mentions: 890
      },
      lastUpdated: new Date()
    }
  ];

  const displayCompetitors = competitors.length > 0 ? competitors : mockCompetitors;

  return (
    <Box>
      {/* Competitor Overview Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {displayCompetitors.map((competitor) => (
          <Grid item xs={12} md={4} key={competitor.id}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                    {competitor.name.charAt(0)}
                  </Avatar>
                  <Box flex={1}>
                    <Typography variant="h6">{competitor.name}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      Updated {format(new Date(competitor.lastUpdated), 'PPp')}
                    </Typography>
                  </Box>
                </Box>

                {/* Social Metrics */}
                <Box mb={2}>
                  <Typography variant="subtitle2" gutterBottom>
                    Social Presence
                  </Typography>
                  <Box display="flex" gap={1} flexWrap="wrap">
                    {Object.entries(competitor.socialMetrics.followers).map(([platform, count]) => (
                      <Chip
                        key={platform}
                        label={`${platform}: ${(count / 1000).toFixed(0)}K`}
                        size="small"
                        variant="outlined"
                      />
                    ))}
                  </Box>
                </Box>

                {/* Sentiment Score */}
                <Box mb={2}>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="subtitle2">Sentiment Score</Typography>
                    <Box display="flex" alignItems="center">
                      {competitor.socialMetrics.sentiment > 0.7 ? (
                        <TrendingUpIcon color="success" fontSize="small" />
                      ) : (
                        <TrendingDownIcon color="error" fontSize="small" />
                      )}
                      <Typography variant="body2" ml={0.5}>
                        {(competitor.socialMetrics.sentiment * 100).toFixed(0)}%
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                {/* Product Count */}
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="subtitle2">Products Tracked</Typography>
                  <Typography variant="body2">{competitor.products.length}</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Product Comparison Table */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Product Comparison
          </Typography>
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Competitor</TableCell>
                  <TableCell>Product</TableCell>
                  <TableCell align="right">Price</TableCell>
                  <TableCell align="center">Discount</TableCell>
                  <TableCell align="center">Rating</TableCell>
                  <TableCell align="center">Reviews</TableCell>
                  <TableCell align="center">Status</TableCell>
                  <TableCell align="center">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {displayCompetitors.flatMap(competitor =>
                  competitor.products.map(product => (
                    <TableRow key={product.id}>
                      <TableCell>{competitor.name}</TableCell>
                      <TableCell>{product.name}</TableCell>
                      <TableCell align="right">
                        ${product.currentPrice}
                        {product.originalPrice && product.originalPrice > product.currentPrice && (
                          <Typography variant="caption" color="text.secondary" display="block">
                            <s>${product.originalPrice}</s>
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell align="center">
                        {product.discount ? (
                          <Chip
                            label={`-${product.discount}%`}
                            size="small"
                            color="error"
                          />
                        ) : '-'}
                      </TableCell>
                      <TableCell align="center">
                        <Box display="flex" alignItems="center" justifyContent="center">
                          <Typography variant="body2">{product.rating}</Typography>
                          <Typography variant="caption" color="text.secondary" ml={0.5}>
                            /5
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell align="center">
                        {product.reviewCount?.toLocaleString() || '-'}
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          label={product.availability}
                          size="small"
                          color={
                            product.availability === 'in_stock' ? 'success' :
                            product.availability === 'limited' ? 'warning' : 'error'
                          }
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title="View Product">
                          <IconButton size="small" href={product.productUrl} target="_blank">
                            <LaunchIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
};

export default CompetitorAnalysis;