'use client'

import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  SimpleGrid,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Button,
  Badge,
  Progress,
  Select,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Tab,
  Tabs,
  TabList,
  TabPanel,
  TabPanels,
  Flex,
  Icon,
  Divider,
  List,
  ListItem,
  ListIcon,
  useToast,
  Tooltip,
  Tag,
  TagLabel,
  IconButton,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  CircularProgress,
  CircularProgressLabel,
} from '@chakra-ui/react'
import { useState, useEffect } from 'react'
import {
  FiTrendingUp,
  FiAlertCircle,
  FiTarget,
  FiActivity,
  FiCpu,
  FiBellOff,
  FiCheckCircle,
  FiClock,
  FiDollarSign,
  FiUsers,
  FiShoppingCart,
  FiRefreshCw,
  FiZap,
  FiAlertTriangle,
  FiInfo,
  FiEye,
  FiCalendar,
} from 'react-icons/fi'
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ChartTooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
  Cell,
} from '@/components/ChartComponents'

interface Prediction {
  id: string
  metric: string
  currentValue: number
  predictedValue: number
  confidence: number
  timeframe: string
  impact: 'high' | 'medium' | 'low'
  recommendation: string
  risk: number
}

interface Anomaly {
  id: string
  metric: string
  severity: 'critical' | 'warning' | 'info'
  timestamp: Date
  description: string
  expectedRange: [number, number]
  actualValue: number
}

interface TrendData {
  date: string
  actual: number
  predicted: number
  upperBound: number
  lowerBound: number
}

export default function PredictiveAnalyticsPage() {
  const [selectedTimeRange, setSelectedTimeRange] = useState('30d')
  const [selectedMetric, setSelectedMetric] = useState('revenue')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const toast = useToast()

  // Sample predictions data
  const predictions: Prediction[] = [
    {
      id: '1',
      metric: 'Revenue',
      currentValue: 845000,
      predictedValue: 1023000,
      confidence: 89,
      timeframe: 'Next 30 days',
      impact: 'high',
      recommendation: 'Increase marketing spend by 15% to capitalize on trending products',
      risk: 15,
    },
    {
      id: '2',
      metric: 'Customer Churn',
      currentValue: 5.2,
      predictedValue: 7.8,
      confidence: 76,
      timeframe: 'Next 60 days',
      impact: 'high',
      recommendation: 'Launch retention campaign targeting at-risk segments',
      risk: 65,
    },
    {
      id: '3',
      metric: 'Conversion Rate',
      currentValue: 3.4,
      predictedValue: 4.1,
      confidence: 82,
      timeframe: 'Next 14 days',
      impact: 'medium',
      recommendation: 'Optimize checkout flow based on user behavior patterns',
      risk: 25,
    },
    {
      id: '4',
      metric: 'Inventory Turnover',
      currentValue: 4.2,
      predictedValue: 3.1,
      confidence: 71,
      timeframe: 'Next 45 days',
      impact: 'medium',
      recommendation: 'Adjust procurement based on seasonal demand patterns',
      risk: 40,
    },
  ]

  // Sample anomalies data
  const anomalies: Anomaly[] = [
    {
      id: '1',
      metric: 'Traffic Spike',
      severity: 'warning',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      description: 'Unusual traffic pattern detected from social media',
      expectedRange: [5000, 8000],
      actualValue: 12500,
    },
    {
      id: '2',
      metric: 'Cart Abandonment',
      severity: 'critical',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      description: 'Cart abandonment rate exceeds threshold',
      expectedRange: [20, 30],
      actualValue: 45,
    },
    {
      id: '3',
      metric: 'API Response Time',
      severity: 'info',
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
      description: 'Slight increase in API latency',
      expectedRange: [100, 200],
      actualValue: 215,
    },
  ]

  // Generate trend data
  const generateTrendData = (): TrendData[] => {
    const data: TrendData[] = []
    const now = new Date()
    
    for (let i = 30; i >= -30; i--) {
      const date = new Date(now)
      date.setDate(date.getDate() - i)
      
      const baseValue = 100000 + Math.random() * 20000
      const trend = i < 0 ? 1.02 : 1 // Future values trend upward
      const noise = (Math.random() - 0.5) * 5000
      
      data.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        actual: i <= 0 ? baseValue + noise : 0,
        predicted: i >= 0 ? baseValue * trend + noise : 0,
        upperBound: baseValue * trend + 10000,
        lowerBound: baseValue * trend - 10000,
      })
    }
    
    return data
  }

  const trendData = generateTrendData()

  const handleRunAnalysis = () => {
    setIsAnalyzing(true)
    setTimeout(() => {
      setIsAnalyzing(false)
      toast({
        title: 'Analysis Complete',
        description: 'Predictive models have been updated with latest data.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
    }, 3000)
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'red'
      case 'medium': return 'yellow'
      case 'low': return 'green'
      default: return 'gray'
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'red'
      case 'warning': return 'yellow'
      case 'info': return 'blue'
      default: return 'gray'
    }
  }

  const getRiskColor = (risk: number) => {
    if (risk >= 60) return 'red.500'
    if (risk >= 30) return 'yellow.500'
    return 'green.500'
  }

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        {/* Header */}
        <Box>
          <Heading as="h1" size="2xl" mb={4}>
            Predictive Analytics
          </Heading>
          <Text fontSize="lg" color="gray.600">
            AI-powered performance prediction and trend analysis for proactive decision making
          </Text>
        </Box>

        {/* Key Metrics */}
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
          <Stat>
            <StatLabel>Prediction Accuracy</StatLabel>
            <StatNumber>94.2%</StatNumber>
            <StatHelpText>
              <StatArrow type="increase" />
              +2.1% this month
            </StatHelpText>
          </Stat>
          <Stat>
            <StatLabel>Anomalies Detected</StatLabel>
            <StatNumber>12</StatNumber>
            <StatHelpText>
              Last 24 hours
            </StatHelpText>
          </Stat>
          <Stat>
            <StatLabel>Models Active</StatLabel>
            <StatNumber>8</StatNumber>
            <StatHelpText>
              <Badge colorScheme="green">All healthy</Badge>
            </StatHelpText>
          </Stat>
          <Stat>
            <StatLabel>Insights Generated</StatLabel>
            <StatNumber>156</StatNumber>
            <StatHelpText>
              This week
            </StatHelpText>
          </Stat>
        </SimpleGrid>

        {/* Main Content */}
        <Tabs variant="enclosed">
          <TabList>
            <Tab><Icon as={FiTrendingUp} mr={2} /> Predictions</Tab>
            <Tab><Icon as={FiAlertCircle} mr={2} /> Anomaly Detection</Tab>
            <Tab><Icon as={FiActivity} mr={2} /> Trend Analysis</Tab>
            <Tab><Icon as={FiTarget} mr={2} /> Recommendations</Tab>
          </TabList>

          <TabPanels>
            {/* Predictions Tab */}
            <TabPanel>
              <VStack spacing={6} align="stretch">
                <HStack justify="space-between">
                  <Select
                    value={selectedTimeRange}
                    onChange={(e) => setSelectedTimeRange(e.target.value)}
                    width="200px"
                  >
                    <option value="7d">Next 7 Days</option>
                    <option value="14d">Next 14 Days</option>
                    <option value="30d">Next 30 Days</option>
                    <option value="90d">Next 90 Days</option>
                  </Select>
                  <Button
                    leftIcon={<FiRefreshCw />}
                    colorScheme="blue"
                    onClick={handleRunAnalysis}
                    isLoading={isAnalyzing}
                    loadingText="Analyzing..."
                  >
                    Run Analysis
                  </Button>
                </HStack>

                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                  {predictions.map((prediction) => (
                    <Card key={prediction.id}>
                      <CardHeader>
                        <HStack justify="space-between">
                          <VStack align="start" spacing={1}>
                            <Text fontSize="sm" color="gray.600">{prediction.metric}</Text>
                            <Heading size="md">
                              {typeof prediction.predictedValue === 'number' && prediction.predictedValue > 1000
                                ? `$${(prediction.predictedValue / 1000).toFixed(0)}K`
                                : `${prediction.predictedValue}%`}
                            </Heading>
                          </VStack>
                          <CircularProgress
                            value={prediction.confidence}
                            size="60px"
                            color="blue.400"
                          >
                            <CircularProgressLabel>
                              {prediction.confidence}%
                            </CircularProgressLabel>
                          </CircularProgress>
                        </HStack>
                      </CardHeader>
                      <CardBody>
                        <VStack align="stretch" spacing={3}>
                          <HStack justify="space-between">
                            <Text fontSize="sm">Current</Text>
                            <Text fontSize="sm" fontWeight="bold">
                              {typeof prediction.currentValue === 'number' && prediction.currentValue > 1000
                                ? `$${(prediction.currentValue / 1000).toFixed(0)}K`
                                : `${prediction.currentValue}%`}
                            </Text>
                          </HStack>
                          <HStack justify="space-between">
                            <Text fontSize="sm">Timeframe</Text>
                            <Text fontSize="sm">{prediction.timeframe}</Text>
                          </HStack>
                          <HStack justify="space-between">
                            <Text fontSize="sm">Impact</Text>
                            <Badge colorScheme={getImpactColor(prediction.impact)}>
                              {prediction.impact}
                            </Badge>
                          </HStack>
                          <HStack justify="space-between">
                            <Text fontSize="sm">Risk Level</Text>
                            <HStack spacing={1}>
                              <Progress
                                value={prediction.risk}
                                size="sm"
                                colorScheme={prediction.risk > 60 ? 'red' : prediction.risk > 30 ? 'yellow' : 'green'}
                                width="60px"
                              />
                              <Text fontSize="xs" color={getRiskColor(prediction.risk)}>
                                {prediction.risk}%
                              </Text>
                            </HStack>
                          </HStack>
                          <Divider />
                          <Box>
                            <Text fontSize="sm" fontWeight="medium" mb={1}>
                              Recommendation
                            </Text>
                            <Text fontSize="sm" color="gray.600">
                              {prediction.recommendation}
                            </Text>
                          </Box>
                        </VStack>
                      </CardBody>
                      <CardFooter>
                        <Button size="sm" colorScheme="blue" width="full">
                          View Details
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </SimpleGrid>
              </VStack>
            </TabPanel>

            {/* Anomaly Detection Tab */}
            <TabPanel>
              <VStack spacing={6} align="stretch">
                <Alert status="info">
                  <AlertIcon />
                  <Box>
                    <AlertTitle>Real-time Anomaly Detection</AlertTitle>
                    <AlertDescription>
                      Our AI continuously monitors your metrics and alerts you to unusual patterns
                      that may require attention.
                    </AlertDescription>
                  </Box>
                </Alert>

                <TableContainer>
                  <Table variant="simple">
                    <Thead>
                      <Tr>
                        <Th>Severity</Th>
                        <Th>Metric</Th>
                        <Th>Description</Th>
                        <Th>Detected</Th>
                        <Th>Value</Th>
                        <Th>Expected Range</Th>
                        <Th>Action</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {anomalies.map((anomaly) => (
                        <Tr key={anomaly.id}>
                          <Td>
                            <Badge colorScheme={getSeverityColor(anomaly.severity)}>
                              {anomaly.severity}
                            </Badge>
                          </Td>
                          <Td fontWeight="medium">{anomaly.metric}</Td>
                          <Td>{anomaly.description}</Td>
                          <Td>
                            {new Date(anomaly.timestamp).toLocaleString('en-US', {
                              hour: 'numeric',
                              minute: 'numeric',
                              hour12: true,
                            })}
                          </Td>
                          <Td>
                            <Text color={getSeverityColor(anomaly.severity) + '.600'}>
                              {anomaly.actualValue.toLocaleString()}
                            </Text>
                          </Td>
                          <Td>
                            {anomaly.expectedRange[0]} - {anomaly.expectedRange[1]}
                          </Td>
                          <Td>
                            <Button size="sm" variant="ghost">
                              Investigate
                            </Button>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </TableContainer>

                <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
                  <Card>
                    <CardHeader>
                      <Heading size="md">Anomaly Distribution</Heading>
                    </CardHeader>
                    <CardBody>
                      <VStack align="stretch" spacing={4}>
                        <HStack justify="space-between">
                          <HStack>
                            <Box w={3} h={3} bg="red.500" borderRadius="full" />
                            <Text>Critical</Text>
                          </HStack>
                          <Text fontWeight="bold">2</Text>
                        </HStack>
                        <HStack justify="space-between">
                          <HStack>
                            <Box w={3} h={3} bg="yellow.500" borderRadius="full" />
                            <Text>Warning</Text>
                          </HStack>
                          <Text fontWeight="bold">5</Text>
                        </HStack>
                        <HStack justify="space-between">
                          <HStack>
                            <Box w={3} h={3} bg="blue.500" borderRadius="full" />
                            <Text>Info</Text>
                          </HStack>
                          <Text fontWeight="bold">5</Text>
                        </HStack>
                      </VStack>
                    </CardBody>
                  </Card>

                  <Card>
                    <CardHeader>
                      <Heading size="md">Alert Settings</Heading>
                    </CardHeader>
                    <CardBody>
                      <VStack align="stretch" spacing={3}>
                        <HStack justify="space-between">
                          <Text>Email Notifications</Text>
                          <Badge colorScheme="green">Enabled</Badge>
                        </HStack>
                        <HStack justify="space-between">
                          <Text>SMS Alerts</Text>
                          <Badge colorScheme="gray">Disabled</Badge>
                        </HStack>
                        <HStack justify="space-between">
                          <Text>Webhook Integration</Text>
                          <Badge colorScheme="green">Active</Badge>
                        </HStack>
                        <HStack justify="space-between">
                          <Text>Sensitivity Level</Text>
                          <Text fontWeight="bold">Medium</Text>
                        </HStack>
                      </VStack>
                    </CardBody>
                    <CardFooter>
                      <Button size="sm" variant="outline" width="full">
                        Configure Alerts
                      </Button>
                    </CardFooter>
                  </Card>
                </SimpleGrid>
              </VStack>
            </TabPanel>

            {/* Trend Analysis Tab */}
            <TabPanel>
              <VStack spacing={6} align="stretch">
                <Card>
                  <CardHeader>
                    <HStack justify="space-between">
                      <Heading size="md">Revenue Trend & Forecast</Heading>
                      <Select
                        value={selectedMetric}
                        onChange={(e) => setSelectedMetric(e.target.value)}
                        width="200px"
                      >
                        <option value="revenue">Revenue</option>
                        <option value="users">Active Users</option>
                        <option value="conversion">Conversion Rate</option>
                        <option value="churn">Churn Rate</option>
                      </Select>
                    </HStack>
                  </CardHeader>
                  <CardBody>
                    <Box height={400}>
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={trendData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis />
                          <ChartTooltip />
                          <Legend />
                          <Area
                            type="monotone"
                            dataKey="upperBound"
                            stroke="#e0e0e0"
                            fill="#f0f0f0"
                            strokeWidth={0}
                            name="Confidence Interval"
                          />
                          <Area
                            type="monotone"
                            dataKey="lowerBound"
                            stroke="#e0e0e0"
                            fill="#ffffff"
                            strokeWidth={0}
                            name=" "
                          />
                          <Line
                            type="monotone"
                            dataKey="actual"
                            stroke="#3182ce"
                            strokeWidth={2}
                            dot={{ r: 1 }}
                            name="Actual"
                          />
                          <Line
                            type="monotone"
                            dataKey="predicted"
                            stroke="#e53e3e"
                            strokeWidth={2}
                            strokeDasharray="5 5"
                            dot={{ r: 1 }}
                            name="Predicted"
                          />
                          <ReferenceLine x="Nov 24" stroke="#666" label="Today" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </Box>
                  </CardBody>
                </Card>

                <SimpleGrid columns={{ base: 1, lg: 3 }} spacing={6}>
                  <Card>
                    <CardBody>
                      <VStack align="start" spacing={2}>
                        <Icon as={FiTrendingUp} size="24px" color="green.500" />
                        <Text fontSize="sm" color="gray.600">Growth Rate</Text>
                        <Heading size="md">+18.5%</Heading>
                        <Text fontSize="sm">Projected monthly growth</Text>
                      </VStack>
                    </CardBody>
                  </Card>
                  <Card>
                    <CardBody>
                      <VStack align="start" spacing={2}>
                        <Icon as={FiCalendar} size="24px" color="blue.500" />
                        <Text fontSize="sm" color="gray.600">Seasonal Impact</Text>
                        <Heading size="md">High</Heading>
                        <Text fontSize="sm">Holiday season approaching</Text>
                      </VStack>
                    </CardBody>
                  </Card>
                  <Card>
                    <CardBody>
                      <VStack align="start" spacing={2}>
                        <Icon as={FiEye} size="24px" color="purple.500" />
                        <Text fontSize="sm" color="gray.600">Confidence Level</Text>
                        <Heading size="md">87%</Heading>
                        <Text fontSize="sm">Model reliability score</Text>
                      </VStack>
                    </CardBody>
                  </Card>
                </SimpleGrid>
              </VStack>
            </TabPanel>

            {/* Recommendations Tab */}
            <TabPanel>
              <VStack spacing={6} align="stretch">
                <Alert status="success">
                  <AlertIcon />
                  <Box>
                    <AlertTitle>AI-Generated Recommendations</AlertTitle>
                    <AlertDescription>
                      Based on current trends and predictive analysis, here are actionable insights
                      to optimize your business performance.
                    </AlertDescription>
                  </Box>
                </Alert>

                <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
                  <Card borderWidth={2} borderColor="green.200">
                    <CardHeader bg="green.50">
                      <HStack>
                        <Icon as={FiDollarSign} color="green.600" />
                        <Heading size="md">Revenue Optimization</Heading>
                      </HStack>
                    </CardHeader>
                    <CardBody>
                      <List spacing={3}>
                        <ListItem>
                          <ListIcon as={FiCheckCircle} color="green.500" />
                          Increase ad spend on high-converting keywords by 20%
                        </ListItem>
                        <ListItem>
                          <ListIcon as={FiCheckCircle} color="green.500" />
                          Launch flash sale for trending products next Tuesday
                        </ListItem>
                        <ListItem>
                          <ListIcon as={FiCheckCircle} color="green.500" />
                          Implement dynamic pricing for peak traffic hours
                        </ListItem>
                      </List>
                    </CardBody>
                    <CardFooter>
                      <HStack>
                        <Text fontSize="sm" color="gray.600">Potential Impact:</Text>
                        <Text fontSize="sm" fontWeight="bold" color="green.600">
                          +$125K revenue
                        </Text>
                      </HStack>
                    </CardFooter>
                  </Card>

                  <Card borderWidth={2} borderColor="orange.200">
                    <CardHeader bg="orange.50">
                      <HStack>
                        <Icon as={FiUsers} color="orange.600" />
                        <Heading size="md">Customer Retention</Heading>
                      </HStack>
                    </CardHeader>
                    <CardBody>
                      <List spacing={3}>
                        <ListItem>
                          <ListIcon as={FiCheckCircle} color="orange.500" />
                          Send personalized offers to at-risk customers
                        </ListItem>
                        <ListItem>
                          <ListIcon as={FiCheckCircle} color="orange.500" />
                          Improve customer service response time
                        </ListItem>
                        <ListItem>
                          <ListIcon as={FiCheckCircle} color="orange.500" />
                          Launch loyalty program for top 20% customers
                        </ListItem>
                      </List>
                    </CardBody>
                    <CardFooter>
                      <HStack>
                        <Text fontSize="sm" color="gray.600">Potential Impact:</Text>
                        <Text fontSize="sm" fontWeight="bold" color="orange.600">
                          -2.3% churn rate
                        </Text>
                      </HStack>
                    </CardFooter>
                  </Card>

                  <Card borderWidth={2} borderColor="blue.200">
                    <CardHeader bg="blue.50">
                      <HStack>
                        <Icon as={FiShoppingCart} color="blue.600" />
                        <Heading size="md">Conversion Optimization</Heading>
                      </HStack>
                    </CardHeader>
                    <CardBody>
                      <List spacing={3}>
                        <ListItem>
                          <ListIcon as={FiCheckCircle} color="blue.500" />
                          Simplify checkout process to 2 steps
                        </ListItem>
                        <ListItem>
                          <ListIcon as={FiCheckCircle} color="blue.500" />
                          Add trust badges to product pages
                        </ListItem>
                        <ListItem>
                          <ListIcon as={FiCheckCircle} color="blue.500" />
                          Implement exit-intent popup with discount
                        </ListItem>
                      </List>
                    </CardBody>
                    <CardFooter>
                      <HStack>
                        <Text fontSize="sm" color="gray.600">Potential Impact:</Text>
                        <Text fontSize="sm" fontWeight="bold" color="blue.600">
                          +0.8% conversion rate
                        </Text>
                      </HStack>
                    </CardFooter>
                  </Card>

                  <Card borderWidth={2} borderColor="purple.200">
                    <CardHeader bg="purple.50">
                      <HStack>
                        <Icon as={FiActivity} color="purple.600" />
                        <Heading size="md">Operational Efficiency</Heading>
                      </HStack>
                    </CardHeader>
                    <CardBody>
                      <List spacing={3}>
                        <ListItem>
                          <ListIcon as={FiCheckCircle} color="purple.500" />
                          Automate inventory reordering for top products
                        </ListItem>
                        <ListItem>
                          <ListIcon as={FiCheckCircle} color="purple.500" />
                          Optimize warehouse layout based on order patterns
                        </ListItem>
                        <ListItem>
                          <ListIcon as={FiCheckCircle} color="purple.500" />
                          Implement predictive maintenance schedule
                        </ListItem>
                      </List>
                    </CardBody>
                    <CardFooter>
                      <HStack>
                        <Text fontSize="sm" color="gray.600">Potential Impact:</Text>
                        <Text fontSize="sm" fontWeight="bold" color="purple.600">
                          -15% operational costs
                        </Text>
                      </HStack>
                    </CardFooter>
                  </Card>
                </SimpleGrid>

                <Card>
                  <CardBody>
                    <HStack justify="center" spacing={4}>
                      <Button colorScheme="blue" size="lg" leftIcon={<FiZap />}>
                        Implement All Recommendations
                      </Button>
                      <Button variant="outline" size="lg">
                        Schedule Review
                      </Button>
                    </HStack>
                  </CardBody>
                </Card>
              </VStack>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </VStack>
    </Container>
  )
}