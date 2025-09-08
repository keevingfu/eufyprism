'use client'

import {
  Box,
  Container,
  Heading,
  SimpleGrid,
  Card,
  CardBody,
  CardHeader,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Select,
  Flex,
  Text,
  VStack,
  HStack,
  Progress,
  Divider,
  Spinner,
  Center,
} from '@chakra-ui/react'
import { useState, useEffect } from 'react'
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from '@/components/ChartComponents'

const revenueData = [
  { month: 'Jan', revenue: 120000, cost: 45000, profit: 75000 },
  { month: 'Feb', revenue: 135000, cost: 48000, profit: 87000 },
  { month: 'Mar', revenue: 148000, cost: 52000, profit: 96000 },
  { month: 'Apr', revenue: 165000, cost: 58000, profit: 107000 },
  { month: 'May', revenue: 182000, cost: 62000, profit: 120000 },
  { month: 'Jun', revenue: 195000, cost: 65000, profit: 130000 },
]

const channelData = [
  { name: 'Email', value: 35, color: '#8884d8' },
  { name: 'Social Media', value: 28, color: '#82ca9d' },
  { name: 'Paid Search', value: 22, color: '#ffc658' },
  { name: 'Direct', value: 15, color: '#ff7c7c' },
]

const conversionFunnel = [
  { stage: 'Visitors', value: 100000, conversion: 100 },
  { stage: 'Product Views', value: 45000, conversion: 45 },
  { stage: 'Add to Cart', value: 15000, conversion: 15 },
  { stage: 'Checkout', value: 8000, conversion: 8 },
  { stage: 'Purchase', value: 5000, conversion: 5 },
]

const customerMetrics = {
  cac: 125,
  ltv: 1850,
  ratio: 14.8,
  churnRate: 5.2,
  retentionRate: 94.8,
}

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('6months')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <Container maxW="container.xl" py={8}>
      <Flex justify="space-between" align="center" mb={8}>
        <Heading as="h1" size="xl">
          ROI Analytics Dashboard
        </Heading>
        <Select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          width="200px"
        >
          <option value="30days">Last 30 Days</option>
          <option value="3months">Last 3 Months</option>
          <option value="6months">Last 6 Months</option>
          <option value="1year">Last Year</option>
        </Select>
      </Flex>

      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={8}>
        <Stat>
          <StatLabel>Total Revenue</StatLabel>
          <StatNumber>$845,000</StatNumber>
          <StatHelpText>
            <StatArrow type="increase" />
            23.5% from last period
          </StatHelpText>
        </Stat>

        <Stat>
          <StatLabel>Marketing Spend</StatLabel>
          <StatNumber>$283,000</StatNumber>
          <StatHelpText>
            <StatArrow type="decrease" />
            8.2% from last period
          </StatHelpText>
        </Stat>

        <Stat>
          <StatLabel>Overall ROI</StatLabel>
          <StatNumber>298%</StatNumber>
          <StatHelpText>
            <StatArrow type="increase" />
            45% improvement
          </StatHelpText>
        </Stat>

        <Stat>
          <StatLabel>ROAS</StatLabel>
          <StatNumber>3.98x</StatNumber>
          <StatHelpText>
            <StatArrow type="increase" />
            0.42x from last period
          </StatHelpText>
        </Stat>
      </SimpleGrid>

      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6} mb={8}>
        <Card>
          <CardHeader>
            <Heading size="md">Revenue & Profit Trend</Heading>
          </CardHeader>
          <CardBody>
            <Box height={300}>
              {mounted ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stackId="1"
                      stroke="#8884d8"
                      fill="#8884d8"
                      fillOpacity={0.6}
                    />
                    <Area
                      type="monotone"
                      dataKey="profit"
                      stackId="2"
                      stroke="#82ca9d"
                      fill="#82ca9d"
                      fillOpacity={0.6}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <Center height="100%">
                  <Spinner size="xl" color="blue.500" />
                </Center>
              )}
            </Box>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <Heading size="md">Revenue by Channel</Heading>
          </CardHeader>
          <CardBody>
            <Box height={300}>
              {mounted ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={channelData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={(entry) => `${entry.name}: ${entry.value}%`}
                    >
                      {channelData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <Center height="100%">
                  <Spinner size="xl" color="blue.500" />
                </Center>
              )}
            </Box>
          </CardBody>
        </Card>
      </SimpleGrid>

      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
        <Card>
          <CardHeader>
            <Heading size="md">Conversion Funnel</Heading>
          </CardHeader>
          <CardBody>
            <VStack align="stretch" spacing={4}>
              {conversionFunnel.map((stage, idx) => (
                <Box key={idx}>
                  <Flex justify="space-between" mb={2}>
                    <Text fontWeight="medium">{stage.stage}</Text>
                    <Text>
                      {stage.value.toLocaleString()} ({stage.conversion}%)
                    </Text>
                  </Flex>
                  <Progress
                    value={stage.conversion}
                    colorScheme="brand"
                    size="sm"
                  />
                </Box>
              ))}
            </VStack>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <Heading size="md">Customer Value Metrics</Heading>
          </CardHeader>
          <CardBody>
            <VStack align="stretch" spacing={6}>
              <HStack justify="space-between">
                <Box>
                  <Text fontSize="sm" color="gray.600">
                    Customer Acquisition Cost (CAC)
                  </Text>
                  <Text fontSize="2xl" fontWeight="bold">
                    ${customerMetrics.cac}
                  </Text>
                </Box>
                <Box textAlign="right">
                  <Text fontSize="sm" color="gray.600">
                    Lifetime Value (LTV)
                  </Text>
                  <Text fontSize="2xl" fontWeight="bold">
                    ${customerMetrics.ltv}
                  </Text>
                </Box>
              </HStack>

              <Box>
                <Text fontSize="sm" color="gray.600" mb={2}>
                  LTV:CAC Ratio
                </Text>
                <Flex align="center">
                  <Box flex="1" mr={4}>
                    <Progress
                      value={(customerMetrics.ratio / 20) * 100}
                      colorScheme={customerMetrics.ratio > 3 ? 'green' : 'orange'}
                      size="md"
                    />
                  </Box>
                  <Text fontWeight="bold" fontSize="lg" color={customerMetrics.ratio > 3 ? 'green.500' : 'orange.500'}>
                    {customerMetrics.ratio}:1
                  </Text>
                </Flex>
                <Text fontSize="xs" color="gray.500" mt={1}>
                  Target: 3:1 or higher
                </Text>
              </Box>

              <Divider />

              <SimpleGrid columns={2} spacing={4}>
                <Box>
                  <Text fontSize="sm" color="gray.600">
                    Monthly Churn Rate
                  </Text>
                  <Text fontSize="xl" fontWeight="bold" color="red.500">
                    {customerMetrics.churnRate}%
                  </Text>
                </Box>
                <Box>
                  <Text fontSize="sm" color="gray.600">
                    Retention Rate
                  </Text>
                  <Text fontSize="xl" fontWeight="bold" color="green.500">
                    {customerMetrics.retentionRate}%
                  </Text>
                </Box>
              </SimpleGrid>
            </VStack>
          </CardBody>
        </Card>
      </SimpleGrid>
    </Container>
  )
}