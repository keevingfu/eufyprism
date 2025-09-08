'use client'

import { useState } from 'react'
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Tab,
  Tabs,
  TabList,
  TabPanel,
  TabPanels,
  Button,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Progress,
  Badge,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Flex,
  Icon,
  useToast,
  Textarea,
  Select,
  FormControl,
  FormLabel,
  Input,
  Checkbox,
  CheckboxGroup,
  Stack,
  Divider,
  List,
  ListItem,
  ListIcon,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Code,
  Link,
  Tooltip,
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  useDisclosure,
} from '@chakra-ui/react'
import {
  FiSearch,
  FiTarget,
  FiTrendingUp,
  FiCheckCircle,
  FiAlertCircle,
  FiClock,
  FiActivity,
  FiAward,
  FiBarChart,
  FiCpu,
  FiDatabase,
  FiEdit,
  FiEye,
  FiGlobe,
  FiInfo,
  FiLayers,
  FiList,
  FiRefreshCw,
  FiSend,
  FiSettings,
  FiZap,
  FiBookOpen,
  FiShield,
  FiStar,
  FiUsers,
} from 'react-icons/fi'

interface AIOptimizationResult {
  platform: string
  visibilityScore: number
  citationProbability: number
  recommendations: string[]
}

interface ContentAnalysis {
  readabilityScore: number
  authorityScore: number
  structureScore: number
  citationQuality: number
  multimodalScore: number
}

export default function ContextEngineeringPage() {
  const [content, setContent] = useState('')
  const [topic, setTopic] = useState('')
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['chatgpt', 'perplexity'])
  const [isOptimizing, setIsOptimizing] = useState(false)
  const [optimizationResults, setOptimizationResults] = useState<AIOptimizationResult[]>([])
  const [contentAnalysis, setContentAnalysis] = useState<ContentAnalysis | null>(null)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const toast = useToast()

  const handleOptimize = async () => {
    if (!topic || !content) {
      toast({
        title: 'Missing Information',
        description: 'Please provide both topic and content to optimize.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      })
      return
    }

    setIsOptimizing(true)

    // Simulate optimization process
    setTimeout(() => {
      setOptimizationResults([
        {
          platform: 'ChatGPT',
          visibilityScore: 92,
          citationProbability: 85,
          recommendations: [
            'Add more structured Q&A format',
            'Include code examples with comments',
            'Add authoritative citations',
          ],
        },
        {
          platform: 'Perplexity',
          visibilityScore: 88,
          citationProbability: 78,
          recommendations: [
            'Improve semantic markup',
            'Add more data visualizations',
            'Include recent research citations',
          ],
        },
        {
          platform: 'Claude',
          visibilityScore: 90,
          citationProbability: 82,
          recommendations: [
            'Enhance technical depth',
            'Add step-by-step examples',
            'Include edge case discussions',
          ],
        },
      ])

      setContentAnalysis({
        readabilityScore: 8.5,
        authorityScore: 7.8,
        structureScore: 9.2,
        citationQuality: 8.1,
        multimodalScore: 6.5,
      })

      setIsOptimizing(false)
      toast({
        title: 'Optimization Complete',
        description: 'Your content has been optimized for AI visibility.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
    }, 3000)
  }

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        {/* Header */}
        <Box>
          <Heading as="h1" size="2xl" mb={4}>
            AI Context Engineering Hub
          </Heading>
          <Text fontSize="lg" color="gray.600">
            Optimize content for maximum AI search visibility and citation rates using advanced Context Engineering methodology
          </Text>
        </Box>

        {/* Key Metrics */}
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
          <Stat>
            <StatLabel>AI Citation Rate</StatLabel>
            <StatNumber>42%</StatNumber>
            <StatHelpText>
              <StatArrow type="increase" />
              +18% this month
            </StatHelpText>
          </Stat>
          <Stat>
            <StatLabel>First Recommendation Rate</StatLabel>
            <StatNumber>65%</StatNumber>
            <StatHelpText>
              <StatArrow type="increase" />
              +12% improvement
            </StatHelpText>
          </Stat>
          <Stat>
            <StatLabel>Authority Score</StatLabel>
            <StatNumber>8.7/10</StatNumber>
            <StatHelpText>
              <Badge colorScheme="green">E-E-A-T Optimized</Badge>
            </StatHelpText>
          </Stat>
          <Stat>
            <StatLabel>Avg. Indexing Time</StatLabel>
            <StatNumber>36h</StatNumber>
            <StatHelpText>
              <StatArrow type="decrease" />
              25% faster
            </StatHelpText>
          </Stat>
        </SimpleGrid>

        {/* Main Content Area */}
        <Tabs variant="enclosed">
          <TabList>
            <Tab><Icon as={FiEdit} mr={2} /> Content Optimizer</Tab>
            <Tab><Icon as={FiSearch} mr={2} /> Research Center</Tab>
            <Tab><Icon as={FiLayers} mr={2} /> PRP Generator</Tab>
            <Tab><Icon as={FiSend} mr={2} /> Distribution Network</Tab>
            <Tab><Icon as={FiBarChart} mr={2} /> Analytics</Tab>
          </TabList>

          <TabPanels>
            {/* Content Optimizer Tab */}
            <TabPanel>
              <VStack spacing={6} align="stretch">
                <Card>
                  <CardHeader>
                    <HStack justify="space-between">
                      <Heading size="md">AI-Optimized Content Creation</Heading>
                      <Button
                        leftIcon={<FiInfo />}
                        variant="ghost"
                        size="sm"
                        onClick={onOpen}
                      >
                        How it works
                      </Button>
                    </HStack>
                  </CardHeader>
                  <CardBody>
                    <VStack spacing={4} align="stretch">
                      <FormControl>
                        <FormLabel>Target Topic</FormLabel>
                        <Input
                          placeholder="e.g., Next.js 14 App Router Best Practices"
                          value={topic}
                          onChange={(e) => setTopic(e.target.value)}
                        />
                      </FormControl>

                      <FormControl>
                        <FormLabel>Content</FormLabel>
                        <Textarea
                          placeholder="Paste your content here for AI optimization..."
                          value={content}
                          onChange={(e) => setContent(e.target.value)}
                          minH="200px"
                        />
                      </FormControl>

                      <FormControl>
                        <FormLabel>Target AI Platforms</FormLabel>
                        <CheckboxGroup
                          value={selectedPlatforms}
                          onChange={(values) => setSelectedPlatforms(values as string[])}
                        >
                          <Stack direction="row" spacing={4}>
                            <Checkbox value="chatgpt">ChatGPT</Checkbox>
                            <Checkbox value="perplexity">Perplexity</Checkbox>
                            <Checkbox value="claude">Claude</Checkbox>
                            <Checkbox value="bard">Bard</Checkbox>
                          </Stack>
                        </CheckboxGroup>
                      </FormControl>

                      <HStack>
                        <Button
                          colorScheme="blue"
                          leftIcon={<FiZap />}
                          onClick={handleOptimize}
                          isLoading={isOptimizing}
                          loadingText="Optimizing..."
                        >
                          Optimize for AI
                        </Button>
                        <Button variant="outline" leftIcon={<FiCpu />}>
                          Generate PRP
                        </Button>
                      </HStack>
                    </VStack>
                  </CardBody>
                </Card>

                {/* Optimization Results */}
                {optimizationResults.length > 0 && (
                  <Card>
                    <CardHeader>
                      <Heading size="md">Optimization Results</Heading>
                    </CardHeader>
                    <CardBody>
                      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
                        {optimizationResults.map((result) => (
                          <Box
                            key={result.platform}
                            p={4}
                            borderWidth={1}
                            borderRadius="md"
                          >
                            <VStack align="start" spacing={3}>
                              <HStack justify="space-between" width="full">
                                <Text fontWeight="bold">{result.platform}</Text>
                                <Badge colorScheme="green">
                                  {result.visibilityScore}% Visibility
                                </Badge>
                              </HStack>
                              <Progress
                                value={result.citationProbability}
                                size="sm"
                                colorScheme="blue"
                              />
                              <Text fontSize="xs" color="gray.600">
                                {result.citationProbability}% Citation Probability
                              </Text>
                              <Divider />
                              <Text fontSize="sm" fontWeight="medium">
                                Recommendations:
                              </Text>
                              <List spacing={1}>
                                {result.recommendations.map((rec, idx) => (
                                  <ListItem key={idx} fontSize="xs">
                                    <ListIcon as={FiCheckCircle} color="green.500" />
                                    {rec}
                                  </ListItem>
                                ))}
                              </List>
                            </VStack>
                          </Box>
                        ))}
                      </SimpleGrid>
                    </CardBody>
                  </Card>
                )}

                {/* Content Analysis */}
                {contentAnalysis && (
                  <Card>
                    <CardHeader>
                      <Heading size="md">Content Analysis</Heading>
                    </CardHeader>
                    <CardBody>
                      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                        <Box>
                          <Text fontWeight="medium" mb={2}>
                            AI Readability Score
                          </Text>
                          <HStack>
                            <Progress
                              value={contentAnalysis.readabilityScore * 10}
                              size="lg"
                              colorScheme="green"
                              flex={1}
                            />
                            <Text>{contentAnalysis.readabilityScore}/10</Text>
                          </HStack>
                        </Box>
                        <Box>
                          <Text fontWeight="medium" mb={2}>
                            Authority Score (E-E-A-T)
                          </Text>
                          <HStack>
                            <Progress
                              value={contentAnalysis.authorityScore * 10}
                              size="lg"
                              colorScheme="blue"
                              flex={1}
                            />
                            <Text>{contentAnalysis.authorityScore}/10</Text>
                          </HStack>
                        </Box>
                        <Box>
                          <Text fontWeight="medium" mb={2}>
                            Structure Score
                          </Text>
                          <HStack>
                            <Progress
                              value={contentAnalysis.structureScore * 10}
                              size="lg"
                              colorScheme="purple"
                              flex={1}
                            />
                            <Text>{contentAnalysis.structureScore}/10</Text>
                          </HStack>
                        </Box>
                        <Box>
                          <Text fontWeight="medium" mb={2}>
                            Citation Quality
                          </Text>
                          <HStack>
                            <Progress
                              value={contentAnalysis.citationQuality * 10}
                              size="lg"
                              colorScheme="orange"
                              flex={1}
                            />
                            <Text>{contentAnalysis.citationQuality}/10</Text>
                          </HStack>
                        </Box>
                      </SimpleGrid>
                    </CardBody>
                  </Card>
                )}
              </VStack>
            </TabPanel>

            {/* Research Center Tab */}
            <TabPanel>
              <VStack spacing={6} align="stretch">
                <Card>
                  <CardHeader>
                    <Heading size="md">Deep Research System</Heading>
                  </CardHeader>
                  <CardBody>
                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                      <Box>
                        <Heading size="sm" mb={3}>
                          <Icon as={FiCpu} mr={2} />
                          AI Platform Preferences
                        </Heading>
                        <VStack align="start" spacing={2}>
                          <Text fontSize="sm">
                            <Badge mr={2}>ChatGPT</Badge>
                            Prefers conversational tone, examples
                          </Text>
                          <Text fontSize="sm">
                            <Badge mr={2}>Perplexity</Badge>
                            Values citations, data accuracy
                          </Text>
                          <Text fontSize="sm">
                            <Badge mr={2}>Claude</Badge>
                            Appreciates depth, nuance
                          </Text>
                          <Text fontSize="sm">
                            <Badge mr={2}>Bard</Badge>
                            Likes multimedia, recent info
                          </Text>
                        </VStack>
                      </Box>
                      <Box>
                        <Heading size="sm" mb={3}>
                          <Icon as={FiTrendingUp} mr={2} />
                          Competitor Analysis
                        </Heading>
                        <VStack align="start" spacing={2}>
                          <HStack justify="space-between" width="full">
                            <Text fontSize="sm">TechCrunch</Text>
                            <Badge colorScheme="green">92% AI visibility</Badge>
                          </HStack>
                          <HStack justify="space-between" width="full">
                            <Text fontSize="sm">Vercel Blog</Text>
                            <Badge colorScheme="green">88% AI visibility</Badge>
                          </HStack>
                          <HStack justify="space-between" width="full">
                            <Text fontSize="sm">MDN Web Docs</Text>
                            <Badge colorScheme="green">95% AI visibility</Badge>
                          </HStack>
                        </VStack>
                      </Box>
                    </SimpleGrid>
                  </CardBody>
                </Card>

                <Card>
                  <CardHeader>
                    <Heading size="md">Query Pattern Mining</Heading>
                  </CardHeader>
                  <CardBody>
                    <Alert status="info" mb={4}>
                      <AlertIcon />
                      <Box>
                        <AlertTitle>Trending Queries</AlertTitle>
                        <AlertDescription>
                          "How to implement server components in Next.js 14" - 
                          <Badge ml={2}>+450% this week</Badge>
                        </AlertDescription>
                      </Box>
                    </Alert>
                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                      <Box>
                        <Text fontWeight="medium" mb={2}>Popular Query Types</Text>
                        <List spacing={2}>
                          <ListItem fontSize="sm">
                            <ListIcon as={FiSearch} />
                            "How to..." queries (45%)
                          </ListItem>
                          <ListItem fontSize="sm">
                            <ListIcon as={FiSearch} />
                            "Best practices for..." (28%)
                          </ListItem>
                          <ListItem fontSize="sm">
                            <ListIcon as={FiSearch} />
                            "Difference between..." (15%)
                          </ListItem>
                          <ListItem fontSize="sm">
                            <ListIcon as={FiSearch} />
                            "Why does..." (12%)
                          </ListItem>
                        </List>
                      </Box>
                      <Box>
                        <Text fontWeight="medium" mb={2}>User Intent Analysis</Text>
                        <VStack align="start" spacing={2}>
                          <HStack>
                            <Icon as={FiBookOpen} color="blue.500" />
                            <Text fontSize="sm">Learning: 35%</Text>
                          </HStack>
                          <HStack>
                            <Icon as={FiTarget} color="green.500" />
                            <Text fontSize="sm">Problem-solving: 42%</Text>
                          </HStack>
                          <HStack>
                            <Icon as={FiList} color="purple.500" />
                            <Text fontSize="sm">Comparison: 23%</Text>
                          </HStack>
                        </VStack>
                      </Box>
                    </SimpleGrid>
                  </CardBody>
                </Card>
              </VStack>
            </TabPanel>

            {/* PRP Generator Tab */}
            <TabPanel>
              <VStack spacing={6} align="stretch">
                <Card>
                  <CardHeader>
                    <Heading size="md">Prompt-Response Pair (PRP) Generator</Heading>
                  </CardHeader>
                  <CardBody>
                    <VStack spacing={4} align="stretch">
                      <Alert status="info">
                        <AlertIcon />
                        <Box>
                          <AlertTitle>What is PRP?</AlertTitle>
                          <AlertDescription>
                            PRP (Prompt-Response Pair) is a comprehensive context document that ensures 
                            AI systems can generate perfect content in one attempt. It includes complete 
                            context, validation gates, implementation blueprint, and test cases.
                          </AlertDescription>
                        </Box>
                      </Alert>

                      <Box>
                        <Text fontWeight="medium" mb={2}>Generated PRP Structure</Text>
                        <Code display="block" p={4} whiteSpace="pre">
{`{
  "context": {
    "topic": "Next.js 14 App Router",
    "audience": "Senior developers",
    "intent": "Educational guide",
    "platform_preferences": {...}
  },
  "validation_gates": [
    "Must include working code examples",
    "E-E-A-T compliance score > 8.5",
    "Citation density: 1 per 300 words",
    "Readability: Grade 8-10"
  ],
  "implementation_blueprint": {
    "structure": "Problem → Theory → Practice → Edge Cases",
    "tone": "Professional yet approachable",
    "length": "2500-3000 words",
    "media": ["code_snippets", "diagrams", "performance_charts"]
  },
  "test_cases": [...]
}`}
                        </Code>
                      </Box>

                      <HStack>
                        <Button colorScheme="purple" leftIcon={<FiCpu />}>
                          Generate Full PRP
                        </Button>
                        <Button variant="outline">
                          Download Template
                        </Button>
                      </HStack>
                    </VStack>
                  </CardBody>
                </Card>

                <Card>
                  <CardHeader>
                    <Heading size="md">Auto-Validation System</Heading>
                  </CardHeader>
                  <CardBody>
                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                      <Box>
                        <Text fontWeight="medium" mb={3}>Validation Checks</Text>
                        <VStack align="start" spacing={2}>
                          <HStack>
                            <Icon as={FiCheckCircle} color="green.500" />
                            <Text fontSize="sm">AI readability score: 8.7/10</Text>
                          </HStack>
                          <HStack>
                            <Icon as={FiCheckCircle} color="green.500" />
                            <Text fontSize="sm">Structured data: Valid</Text>
                          </HStack>
                          <HStack>
                            <Icon as={FiCheckCircle} color="green.500" />
                            <Text fontSize="sm">Citation quality: High</Text>
                          </HStack>
                          <HStack>
                            <Icon as={FiAlertCircle} color="yellow.500" />
                            <Text fontSize="sm">Answer completeness: 85%</Text>
                          </HStack>
                        </VStack>
                      </Box>
                      <Box>
                        <Text fontWeight="medium" mb={3}>Performance Metrics</Text>
                        <VStack align="start" spacing={2}>
                          <Text fontSize="sm">
                            <Icon as={FiClock} mr={2} />
                            Generation time: 1.2s
                          </Text>
                          <Text fontSize="sm">
                            <Icon as={FiActivity} mr={2} />
                            Success rate: 87%
                          </Text>
                          <Text fontSize="sm">
                            <Icon as={FiRefreshCw} mr={2} />
                            Iteration needed: 13%
                          </Text>
                        </VStack>
                      </Box>
                    </SimpleGrid>
                  </CardBody>
                </Card>
              </VStack>
            </TabPanel>

            {/* Distribution Network Tab */}
            <TabPanel>
              <VStack spacing={6} align="stretch">
                <Card>
                  <CardHeader>
                    <Heading size="md">AI Platform Distribution</Heading>
                  </CardHeader>
                  <CardBody>
                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                      <Box>
                        <Text fontWeight="medium" mb={3}>Active Push Channels</Text>
                        <VStack align="start" spacing={3}>
                          <HStack justify="space-between" width="full">
                            <HStack>
                              <Icon as={FiGlobe} color="blue.500" />
                              <Text>OpenAI Crawler</Text>
                            </HStack>
                            <Badge colorScheme="green">Connected</Badge>
                          </HStack>
                          <HStack justify="space-between" width="full">
                            <HStack>
                              <Icon as={FiGlobe} color="purple.500" />
                              <Text>Perplexity API</Text>
                            </HStack>
                            <Badge colorScheme="green">Active</Badge>
                          </HStack>
                          <HStack justify="space-between" width="full">
                            <HStack>
                              <Icon as={FiGlobe} color="orange.500" />
                              <Text>Claude Knowledge</Text>
                            </HStack>
                            <Badge colorScheme="yellow">Pending</Badge>
                          </HStack>
                          <HStack justify="space-between" width="full">
                            <HStack>
                              <Icon as={FiGlobe} color="red.500" />
                              <Text>Bard Content Sync</Text>
                            </HStack>
                            <Badge colorScheme="green">Synced</Badge>
                          </HStack>
                        </VStack>
                      </Box>
                      <Box>
                        <Text fontWeight="medium" mb={3}>Distribution Network</Text>
                        <VStack align="start" spacing={2}>
                          <Checkbox defaultChecked>Official website</Checkbox>
                          <Checkbox defaultChecked>GitHub repository</Checkbox>
                          <Checkbox defaultChecked>Dev.to platform</Checkbox>
                          <Checkbox>Medium publication</Checkbox>
                          <Checkbox>Stack Overflow</Checkbox>
                          <Checkbox>Reddit communities</Checkbox>
                        </VStack>
                        <Button size="sm" mt={3} leftIcon={<FiSend />}>
                          Distribute Content
                        </Button>
                      </Box>
                    </SimpleGrid>
                  </CardBody>
                </Card>

                <Card>
                  <CardHeader>
                    <Heading size="md">Indexing Status</Heading>
                  </CardHeader>
                  <CardBody>
                    <VStack align="start" spacing={3}>
                      <HStack width="full" justify="space-between">
                        <Text>Latest content push</Text>
                        <Text fontSize="sm" color="gray.600">2 hours ago</Text>
                      </HStack>
                      <Progress value={75} size="sm" colorScheme="blue" width="full" />
                      <Text fontSize="sm" color="gray.600">
                        75% platforms indexed • 3/4 AI systems updated
                      </Text>
                      <Divider />
                      <SimpleGrid columns={2} spacing={4} width="full">
                        <Box>
                          <Text fontSize="sm" fontWeight="medium">Average indexing time</Text>
                          <Text fontSize="2xl" fontWeight="bold">36h</Text>
                        </Box>
                        <Box>
                          <Text fontSize="sm" fontWeight="medium">Citation appearance</Text>
                          <Text fontSize="2xl" fontWeight="bold">48-72h</Text>
                        </Box>
                      </SimpleGrid>
                    </VStack>
                  </CardBody>
                </Card>
              </VStack>
            </TabPanel>

            {/* Analytics Tab */}
            <TabPanel>
              <VStack spacing={6} align="stretch">
                <Card>
                  <CardHeader>
                    <Heading size="md">AI Performance Analytics</Heading>
                  </CardHeader>
                  <CardBody>
                    <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
                      <Box p={4} borderWidth={1} borderRadius="md">
                        <VStack align="start">
                          <HStack>
                            <Icon as={FiAward} color="yellow.500" />
                            <Text fontWeight="medium">Citation Rate</Text>
                          </HStack>
                          <Text fontSize="3xl" fontWeight="bold">42%</Text>
                          <Progress value={42} size="sm" colorScheme="yellow" width="full" />
                          <Text fontSize="xs" color="gray.600">
                            Target: 40% • Status: Exceeded
                          </Text>
                        </VStack>
                      </Box>
                      <Box p={4} borderWidth={1} borderRadius="md">
                        <VStack align="start">
                          <HStack>
                            <Icon as={FiStar} color="blue.500" />
                            <Text fontWeight="medium">First Recommendation</Text>
                          </HStack>
                          <Text fontSize="3xl" fontWeight="bold">65%</Text>
                          <Progress value={65} size="sm" colorScheme="blue" width="full" />
                          <Text fontSize="xs" color="gray.600">
                            Target: 60% • Status: On track
                          </Text>
                        </VStack>
                      </Box>
                      <Box p={4} borderWidth={1} borderRadius="md">
                        <VStack align="start">
                          <HStack>
                            <Icon as={FiShield} color="green.500" />
                            <Text fontWeight="medium">Authority Score</Text>
                          </HStack>
                          <Text fontSize="3xl" fontWeight="bold">8.7</Text>
                          <Progress value={87} size="sm" colorScheme="green" width="full" />
                          <Text fontSize="xs" color="gray.600">
                            Target: 8.5/10 • Status: Achieved
                          </Text>
                        </VStack>
                      </Box>
                    </SimpleGrid>
                  </CardBody>
                </Card>

                <Card>
                  <CardHeader>
                    <Heading size="md">Content Performance by Platform</Heading>
                  </CardHeader>
                  <CardBody>
                    <VStack align="stretch" spacing={4}>
                      {['ChatGPT', 'Perplexity', 'Claude', 'Bard'].map((platform) => (
                        <Box key={platform} p={3} borderWidth={1} borderRadius="md">
                          <HStack justify="space-between" mb={2}>
                            <Text fontWeight="medium">{platform}</Text>
                            <HStack spacing={4}>
                              <Badge>Citations: {Math.floor(Math.random() * 50) + 100}</Badge>
                              <Badge colorScheme="green">
                                Visibility: {Math.floor(Math.random() * 20) + 80}%
                              </Badge>
                            </HStack>
                          </HStack>
                          <Progress
                            value={Math.floor(Math.random() * 30) + 70}
                            size="sm"
                            colorScheme="blue"
                          />
                        </Box>
                      ))}
                    </VStack>
                  </CardBody>
                </Card>
              </VStack>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </VStack>

      {/* How it Works Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Context Engineering Methodology</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack align="start" spacing={4}>
              <Box>
                <Heading size="sm" mb={2}>1. Deep Research System</Heading>
                <Text fontSize="sm" color="gray.600">
                  Analyze AI platform preferences, competitor strategies, user query patterns, 
                  and performance data to understand what makes content visible to AI systems.
                </Text>
              </Box>
              <Box>
                <Heading size="sm" mb={2}>2. PRP Generation Engine</Heading>
                <Text fontSize="sm" color="gray.600">
                  Create comprehensive Prompt-Response Pairs with complete context, validation 
                  gates, implementation blueprints, and test cases for one-shot perfect content.
                </Text>
              </Box>
              <Box>
                <Heading size="sm" mb={2}>3. Auto-Execution System</Heading>
                <Text fontSize="sm" color="gray.600">
                  Implement content perfectly on first attempt, run automatic validation loops, 
                  monitor real-time performance, and optimize iteratively based on results.
                </Text>
              </Box>
              <Box>
                <Heading size="sm" mb={2}>4. AI Visibility Optimization</Heading>
                <Text fontSize="sm" color="gray.600">
                  Build content authority through E-E-A-T principles, optimize knowledge structure 
                  with semantic markup, and integrate multimodal content for maximum AI preference.
                </Text>
              </Box>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={onClose}>
              Got it
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Container>
  )
}