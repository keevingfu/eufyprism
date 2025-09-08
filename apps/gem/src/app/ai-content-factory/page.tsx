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
  Button,
  Badge,
  Progress,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Icon,
  Flex,
  Select,
  Input,
  Textarea,
  FormControl,
  FormLabel,
  Tag,
  TagLabel,
  TagCloseButton,
  Wrap,
  WrapItem,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Tab,
  Tabs,
  TabList,
  TabPanel,
  TabPanels,
  useToast,
  IconButton,
  Tooltip,
  Divider,
  List,
  ListItem,
  ListIcon,
  Stack,
  Switch,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  SliderMark,
} from '@chakra-ui/react'
import { useState } from 'react'
import {
  FiEdit3,
  FiCpu,
  FiTarget,
  FiTrendingUp,
  FiZap,
  FiLayers,
  FiBookOpen,
  FiImage,
  FiVideo,
  FiFileText,
  FiClock,
  FiCheck,
  FiRefreshCw,
  FiSettings,
  FiCopy,
  FiDownload,
  FiSend,
  FiGlobe,
  FiUsers,
  FiHash,
  FiMessageSquare,
  FiMail,
  FiLinkedin,
  FiFacebook,
  FiTwitter,
  FiInstagram,
} from 'react-icons/fi'

interface ContentTemplate {
  id: string
  name: string
  category: string
  description: string
  avgPerformance: number
  usageCount: number
}

interface GeneratedContent {
  id: string
  platform: string
  content: string
  performance: number
  status: 'draft' | 'scheduled' | 'published'
  scheduledFor?: Date
}

export default function AIContentFactoryPage() {
  const [contentType, setContentType] = useState('blog')
  const [platform, setPlatform] = useState('all')
  const [tone, setTone] = useState('professional')
  const [length, setLength] = useState(500)
  const [keywords, setKeywords] = useState<string[]>([])
  const [newKeyword, setNewKeyword] = useState('')
  const [topic, setTopic] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent[]>([])
  const toast = useToast()

  const templates: ContentTemplate[] = [
    {
      id: '1',
      name: 'Product Launch Announcement',
      category: 'Marketing',
      description: 'High-converting product launch content with strong CTAs',
      avgPerformance: 92,
      usageCount: 1247,
    },
    {
      id: '2',
      name: 'Educational How-To Guide',
      category: 'Education',
      description: 'Step-by-step guides that establish thought leadership',
      avgPerformance: 88,
      usageCount: 892,
    },
    {
      id: '3',
      name: 'Customer Success Story',
      category: 'Social Proof',
      description: 'Compelling case studies that drive conversions',
      avgPerformance: 94,
      usageCount: 654,
    },
    {
      id: '4',
      name: 'Industry Insights Report',
      category: 'Thought Leadership',
      description: 'Data-driven content that positions brand as expert',
      avgPerformance: 86,
      usageCount: 432,
    },
  ]

  const handleAddKeyword = () => {
    if (newKeyword.trim() && !keywords.includes(newKeyword.trim())) {
      setKeywords([...keywords, newKeyword.trim()])
      setNewKeyword('')
    }
  }

  const handleRemoveKeyword = (keyword: string) => {
    setKeywords(keywords.filter(k => k !== keyword))
  }

  const handleGenerateContent = async () => {
    if (!topic) {
      toast({
        title: 'Topic Required',
        description: 'Please enter a topic for content generation.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      })
      return
    }

    setIsGenerating(true)

    // Simulate content generation
    setTimeout(() => {
      const platforms = platform === 'all' 
        ? ['blog', 'linkedin', 'twitter', 'facebook', 'instagram']
        : [platform]

      const newContent = platforms.map((p, idx) => ({
        id: `content-${Date.now()}-${idx}`,
        platform: p,
        content: generatePlatformContent(p, topic, tone, length),
        performance: Math.floor(Math.random() * 20) + 80,
        status: 'draft' as const,
      }))

      setGeneratedContent([...newContent, ...generatedContent])
      setIsGenerating(false)

      toast({
        title: 'Content Generated',
        description: `Successfully generated content for ${platforms.length} platform(s).`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
    }, 3000)
  }

  const generatePlatformContent = (platform: string, topic: string, tone: string, length: number): string => {
    const toneMap = {
      professional: 'professional and authoritative',
      casual: 'friendly and conversational',
      humorous: 'witty and engaging',
      educational: 'informative and educational',
    }

    switch (platform) {
      case 'blog':
        return `# ${topic}\n\nThis ${toneMap[tone]} blog post explores ${topic} in depth. With approximately ${length} words, it covers key insights, practical applications, and actionable takeaways that readers can implement immediately.\n\n## Key Points\n- Comprehensive overview of ${topic}\n- Real-world examples and case studies\n- Step-by-step implementation guide\n- Expert insights and best practices\n\n[Full content optimized for SEO and reader engagement...]`
      
      case 'linkedin':
        return `🚀 Exciting insights on ${topic}!\n\nAs professionals in our industry, we often face challenges related to ${topic}. Here's what I've learned from recent experiences...\n\n💡 Key takeaways:\n• Strategic approach to ${topic}\n• Measurable results and ROI\n• Lessons learned and future applications\n\nWhat's your experience with ${topic}? Let's discuss in the comments!\n\n#${keywords.join(' #')}`
      
      case 'twitter':
        return `Thread 🧵 on ${topic}:\n\n1/ ${topic} is transforming how we approach business. Here's why it matters...\n\n2/ Key insight: [Data-driven observation about ${topic}]\n\n3/ Practical tip: [Actionable advice]\n\n4/ Results we've seen: [Metrics and outcomes]\n\nWhat's your take on ${topic}? RT if you found this helpful!`
      
      case 'facebook':
        return `📢 ${topic} - What You Need to Know\n\nHey everyone! 👋\n\nWe've been exploring ${topic} and discovered some game-changing insights we had to share with you...\n\n✨ Why this matters to you:\n- [Benefit 1]\n- [Benefit 2]\n- [Benefit 3]\n\n👉 Read more: [Link]\n\nDrop a comment if you have questions! We're here to help. 💬`
      
      case 'instagram':
        return `✨ ${topic} ✨\n\n[Carousel Post - 10 slides]\n\nSlide 1: Eye-catching headline about ${topic}\nSlide 2-9: Key points with visual representations\nSlide 10: Strong CTA\n\n📝 Caption:\n${topic} doesn't have to be complicated. Swipe to see our simple framework that's helped hundreds of businesses...\n\n💬 Save this for later and share with someone who needs to see it!\n\n${keywords.map(k => `#${k}`).join(' ')}`
      
      default:
        return `Content about ${topic} in a ${tone} tone.`
    }
  }

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        {/* Header */}
        <Box>
          <Heading as="h1" size="2xl" mb={4}>
            AI Content Factory
          </Heading>
          <Text fontSize="lg" color="gray.600">
            Generate multi-platform content with AI-powered optimization and performance tracking
          </Text>
        </Box>

        {/* Metrics */}
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
          <Stat>
            <StatLabel>Content Generated</StatLabel>
            <StatNumber>3,847</StatNumber>
            <StatHelpText>
              <StatArrow type="increase" />
              +285 this week
            </StatHelpText>
          </Stat>
          <Stat>
            <StatLabel>Avg. Engagement Rate</StatLabel>
            <StatNumber>8.7%</StatNumber>
            <StatHelpText>
              <StatArrow type="increase" />
              +1.2% improvement
            </StatHelpText>
          </Stat>
          <Stat>
            <StatLabel>Time Saved</StatLabel>
            <StatNumber>423h</StatNumber>
            <StatHelpText>
              This month alone
            </StatHelpText>
          </Stat>
          <Stat>
            <StatLabel>ROI</StatLabel>
            <StatNumber>12.3x</StatNumber>
            <StatHelpText>
              <Badge colorScheme="green">Above target</Badge>
            </StatHelpText>
          </Stat>
        </SimpleGrid>

        {/* Main Content Area */}
        <Tabs variant="enclosed">
          <TabList>
            <Tab><Icon as={FiEdit3} mr={2} /> Generate Content</Tab>
            <Tab><Icon as={FiBookOpen} mr={2} /> Templates</Tab>
            <Tab><Icon as={FiLayers} mr={2} /> Content Library</Tab>
            <Tab><Icon as={FiTrendingUp} mr={2} /> Performance</Tab>
          </TabList>

          <TabPanels>
            {/* Generate Content Tab */}
            <TabPanel>
              <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
                <Card>
                  <CardHeader>
                    <Heading size="md">Content Configuration</Heading>
                  </CardHeader>
                  <CardBody>
                    <VStack spacing={4} align="stretch">
                      <FormControl>
                        <FormLabel>Content Topic</FormLabel>
                        <Input
                          placeholder="e.g., AI in Digital Marketing"
                          value={topic}
                          onChange={(e) => setTopic(e.target.value)}
                        />
                      </FormControl>

                      <FormControl>
                        <FormLabel>Content Type</FormLabel>
                        <Select value={contentType} onChange={(e) => setContentType(e.target.value)}>
                          <option value="blog">Blog Post</option>
                          <option value="social">Social Media</option>
                          <option value="email">Email Campaign</option>
                          <option value="ad">Ad Copy</option>
                          <option value="video">Video Script</option>
                        </Select>
                      </FormControl>

                      <FormControl>
                        <FormLabel>Target Platform</FormLabel>
                        <Select value={platform} onChange={(e) => setPlatform(e.target.value)}>
                          <option value="all">All Platforms</option>
                          <option value="blog">Blog/Website</option>
                          <option value="linkedin">LinkedIn</option>
                          <option value="twitter">Twitter</option>
                          <option value="facebook">Facebook</option>
                          <option value="instagram">Instagram</option>
                        </Select>
                      </FormControl>

                      <FormControl>
                        <FormLabel>Tone of Voice</FormLabel>
                        <Select value={tone} onChange={(e) => setTone(e.target.value)}>
                          <option value="professional">Professional</option>
                          <option value="casual">Casual</option>
                          <option value="humorous">Humorous</option>
                          <option value="educational">Educational</option>
                        </Select>
                      </FormControl>

                      <FormControl>
                        <FormLabel>Content Length (words)</FormLabel>
                        <Slider
                          value={length}
                          onChange={setLength}
                          min={100}
                          max={2000}
                          step={100}
                        >
                          <SliderMark value={100} mt={2} fontSize="xs">
                            100
                          </SliderMark>
                          <SliderMark value={1000} mt={2} fontSize="xs">
                            1000
                          </SliderMark>
                          <SliderMark value={2000} mt={2} fontSize="xs">
                            2000
                          </SliderMark>
                          <SliderTrack>
                            <SliderFilledTrack />
                          </SliderTrack>
                          <SliderThumb />
                        </Slider>
                        <Text fontSize="sm" color="gray.600" mt={4}>
                          Target length: {length} words
                        </Text>
                      </FormControl>

                      <FormControl>
                        <FormLabel>Keywords</FormLabel>
                        <HStack>
                          <Input
                            placeholder="Add keyword"
                            value={newKeyword}
                            onChange={(e) => setNewKeyword(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleAddKeyword()}
                          />
                          <Button onClick={handleAddKeyword}>Add</Button>
                        </HStack>
                        <Wrap mt={2}>
                          {keywords.map((keyword) => (
                            <WrapItem key={keyword}>
                              <Tag size="md" variant="solid" colorScheme="blue">
                                <TagLabel>{keyword}</TagLabel>
                                <TagCloseButton onClick={() => handleRemoveKeyword(keyword)} />
                              </Tag>
                            </WrapItem>
                          ))}
                        </Wrap>
                      </FormControl>
                    </VStack>
                  </CardBody>
                  <CardFooter>
                    <Button
                      colorScheme="blue"
                      size="lg"
                      width="full"
                      leftIcon={<FiZap />}
                      onClick={handleGenerateContent}
                      isLoading={isGenerating}
                      loadingText="Generating Content..."
                    >
                      Generate Content
                    </Button>
                  </CardFooter>
                </Card>

                <VStack spacing={4} align="stretch">
                  <Card>
                    <CardHeader>
                      <Heading size="md">AI Optimization Settings</Heading>
                    </CardHeader>
                    <CardBody>
                      <VStack spacing={4} align="stretch">
                        <HStack justify="space-between">
                          <Text>SEO Optimization</Text>
                          <Switch defaultChecked colorScheme="blue" />
                        </HStack>
                        <HStack justify="space-between">
                          <Text>Emotional Engagement</Text>
                          <Switch defaultChecked colorScheme="blue" />
                        </HStack>
                        <HStack justify="space-between">
                          <Text>Call-to-Action Optimization</Text>
                          <Switch defaultChecked colorScheme="blue" />
                        </HStack>
                        <HStack justify="space-between">
                          <Text>Hashtag Suggestions</Text>
                          <Switch defaultChecked colorScheme="blue" />
                        </HStack>
                        <HStack justify="space-between">
                          <Text>Multi-variant Testing</Text>
                          <Switch colorScheme="blue" />
                        </HStack>
                      </VStack>
                    </CardBody>
                  </Card>

                  <Alert status="info">
                    <AlertIcon />
                    <Box>
                      <AlertTitle>AI Learning Active</AlertTitle>
                      <AlertDescription>
                        The AI is continuously learning from your content performance to improve future generations.
                      </AlertDescription>
                    </Box>
                  </Alert>
                </VStack>
              </SimpleGrid>

              {/* Generated Content */}
              {generatedContent.length > 0 && (
                <Box mt={8}>
                  <Heading size="md" mb={4}>Generated Content</Heading>
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                    {generatedContent.map((content) => (
                      <Card key={content.id}>
                        <CardHeader>
                          <HStack justify="space-between">
                            <HStack>
                              <Icon as={getPlatformIcon(content.platform)} />
                              <Text fontWeight="bold" textTransform="capitalize">
                                {content.platform}
                              </Text>
                            </HStack>
                            <Badge colorScheme={getStatusColor(content.status)}>
                              {content.status}
                            </Badge>
                          </HStack>
                        </CardHeader>
                        <CardBody>
                          <Text fontSize="sm" noOfLines={6}>
                            {content.content}
                          </Text>
                          <HStack mt={4} justify="space-between">
                            <Text fontSize="sm" color="gray.600">
                              Performance Score: {content.performance}%
                            </Text>
                            <HStack>
                              <Tooltip label="Copy">
                                <IconButton
                                  icon={<FiCopy />}
                                  aria-label="Copy"
                                  size="sm"
                                  variant="ghost"
                                />
                              </Tooltip>
                              <Tooltip label="Edit">
                                <IconButton
                                  icon={<FiEdit3 />}
                                  aria-label="Edit"
                                  size="sm"
                                  variant="ghost"
                                />
                              </Tooltip>
                              <Tooltip label="Schedule">
                                <IconButton
                                  icon={<FiClock />}
                                  aria-label="Schedule"
                                  size="sm"
                                  variant="ghost"
                                />
                              </Tooltip>
                            </HStack>
                          </HStack>
                        </CardBody>
                      </Card>
                    ))}
                  </SimpleGrid>
                </Box>
              )}
            </TabPanel>

            {/* Templates Tab */}
            <TabPanel>
              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                {templates.map((template) => (
                  <Card key={template.id} cursor="pointer" _hover={{ shadow: 'lg' }}>
                    <CardHeader>
                      <VStack align="start" spacing={2}>
                        <Badge colorScheme="purple">{template.category}</Badge>
                        <Heading size="sm">{template.name}</Heading>
                      </VStack>
                    </CardHeader>
                    <CardBody>
                      <Text fontSize="sm" color="gray.600" mb={4}>
                        {template.description}
                      </Text>
                      <HStack justify="space-between">
                        <VStack align="start" spacing={0}>
                          <Text fontSize="xs" color="gray.500">Avg. Performance</Text>
                          <Text fontSize="lg" fontWeight="bold" color="green.600">
                            {template.avgPerformance}%
                          </Text>
                        </VStack>
                        <VStack align="end" spacing={0}>
                          <Text fontSize="xs" color="gray.500">Used</Text>
                          <Text fontSize="lg" fontWeight="bold">
                            {template.usageCount.toLocaleString()}
                          </Text>
                        </VStack>
                      </HStack>
                    </CardBody>
                    <CardFooter>
                      <Button size="sm" colorScheme="blue" width="full">
                        Use Template
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </SimpleGrid>
            </TabPanel>

            {/* Content Library Tab */}
            <TabPanel>
              <Alert status="info" mb={6}>
                <AlertIcon />
                <Box>
                  <AlertTitle>Content Library</AlertTitle>
                  <AlertDescription>
                    Access your entire content history with advanced filtering and search capabilities.
                    Export, repurpose, or schedule any content from your library.
                  </AlertDescription>
                </Box>
              </Alert>
              <Text color="gray.600">Content library visualization coming soon...</Text>
            </TabPanel>

            {/* Performance Tab */}
            <TabPanel>
              <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
                <Card>
                  <CardHeader>
                    <Heading size="md">Content Performance by Platform</Heading>
                  </CardHeader>
                  <CardBody>
                    <VStack align="stretch" spacing={4}>
                      {['LinkedIn', 'Blog', 'Twitter', 'Facebook', 'Instagram'].map((platform) => (
                        <Box key={platform}>
                          <HStack justify="space-between" mb={2}>
                            <Text fontWeight="medium">{platform}</Text>
                            <Text fontSize="sm" color="gray.600">
                              {Math.floor(Math.random() * 20) + 80}% engagement
                            </Text>
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

                <Card>
                  <CardHeader>
                    <Heading size="md">AI Learning Insights</Heading>
                  </CardHeader>
                  <CardBody>
                    <List spacing={3}>
                      <ListItem>
                        <ListIcon as={FiCheck} color="green.500" />
                        Questions in headlines increase engagement by 23%
                      </ListItem>
                      <ListItem>
                        <ListIcon as={FiCheck} color="green.500" />
                        Content with 3-5 hashtags performs 40% better
                      </ListItem>
                      <ListItem>
                        <ListIcon as={FiCheck} color="green.500" />
                        Tuesday 10 AM posts get highest reach
                      </ListItem>
                      <ListItem>
                        <ListIcon as={FiCheck} color="green.500" />
                        Educational tone drives 2x more shares
                      </ListItem>
                      <ListItem>
                        <ListIcon as={FiCheck} color="green.500" />
                        Videos under 60s have 85% completion rate
                      </ListItem>
                    </List>
                  </CardBody>
                </Card>
              </SimpleGrid>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </VStack>
    </Container>
  )
}

function getPlatformIcon(platform: string) {
  switch (platform) {
    case 'linkedin': return FiLinkedin
    case 'twitter': return FiTwitter
    case 'facebook': return FiFacebook
    case 'instagram': return FiInstagram
    case 'blog': return FiFileText
    default: return FiGlobe
  }
}

function getStatusColor(status: string) {
  switch (status) {
    case 'published': return 'green'
    case 'scheduled': return 'blue'
    case 'draft': return 'gray'
    default: return 'gray'
  }
}