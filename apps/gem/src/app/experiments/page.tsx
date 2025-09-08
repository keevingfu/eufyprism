'use client'

import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  SimpleGrid,
  Card,
  CardBody,
  CardFooter,
  Text,
  Badge,
  Progress,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  useDisclosure,
  HStack,
  VStack,
} from '@chakra-ui/react'
import { AddIcon } from '@chakra-ui/icons'
import { useState } from 'react'
import ExperimentDesigner from '@/components/ExperimentDesigner'

interface Experiment {
  id: string
  name: string
  hypothesis: string
  type: 'A/B Test' | 'Multivariate' | 'Split URL'
  status: 'running' | 'completed' | 'scheduled' | 'paused'
  startDate: string
  participants: number
  variants: {
    name: string
    traffic: number
    conversions: number
    conversionRate: number
  }[]
  confidence: number
  uplift: number
}

const mockExperiments: Experiment[] = [
  {
    id: '1',
    name: 'Homepage CTA Button Color',
    hypothesis: 'Changing CTA button from blue to green will increase CTR by 15%',
    type: 'A/B Test',
    status: 'running',
    startDate: '2024-08-01',
    participants: 45230,
    variants: [
      { name: 'Control (Blue)', traffic: 50, conversions: 1234, conversionRate: 5.45 },
      { name: 'Variant (Green)', traffic: 50, conversions: 1456, conversionRate: 6.43 },
    ],
    confidence: 94.5,
    uplift: 18.0,
  },
  {
    id: '2',
    name: 'Email Subject Line Testing',
    hypothesis: 'Personalized subject lines will increase open rates by 25%',
    type: 'A/B Test',
    status: 'completed',
    startDate: '2024-07-15',
    participants: 100000,
    variants: [
      { name: 'Generic', traffic: 50, conversions: 23000, conversionRate: 46.0 },
      { name: 'Personalized', traffic: 50, conversions: 29500, conversionRate: 59.0 },
    ],
    confidence: 99.8,
    uplift: 28.3,
  },
  {
    id: '3',
    name: 'Product Page Layout',
    hypothesis: 'New layout with larger images will increase add-to-cart rate',
    type: 'Multivariate',
    status: 'running',
    startDate: '2024-08-10',
    participants: 12450,
    variants: [
      { name: 'Control', traffic: 25, conversions: 234, conversionRate: 7.51 },
      { name: 'Large Images', traffic: 25, conversions: 267, conversionRate: 8.58 },
      { name: 'Video First', traffic: 25, conversions: 289, conversionRate: 9.28 },
      { name: 'Reviews Top', traffic: 25, conversions: 245, conversionRate: 7.87 },
    ],
    confidence: 87.2,
    uplift: 23.6,
  },
]

export default function ExperimentsPage() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [experiments, setExperiments] = useState(mockExperiments)

  const getStatusColor = (status: Experiment['status']) => {
    switch (status) {
      case 'running':
        return 'green'
      case 'completed':
        return 'blue'
      case 'scheduled':
        return 'purple'
      case 'paused':
        return 'yellow'
    }
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 95) return 'green.500'
    if (confidence >= 90) return 'yellow.500'
    return 'orange.500'
  }

  return (
    <Container maxW="container.xl" py={8}>
      <Flex justify="space-between" align="center" mb={8}>
        <Heading as="h1" size="xl">
          A/B Testing & Experiments
        </Heading>
        <Button leftIcon={<AddIcon />} colorScheme="brand" onClick={onOpen}>
          New Experiment
        </Button>
      </Flex>

      <SimpleGrid columns={{ base: 1, lg: 2, xl: 3 }} spacing={6}>
        {experiments.map((experiment) => (
          <Card key={experiment.id}>
            <CardBody>
              <Flex justify="space-between" align="start" mb={4}>
                <Box flex="1">
                  <Heading size="md" mb={2}>
                    {experiment.name}
                  </Heading>
                  <HStack spacing={2} mb={3}>
                    <Badge colorScheme={getStatusColor(experiment.status)}>
                      {experiment.status}
                    </Badge>
                    <Badge variant="outline">{experiment.type}</Badge>
                  </HStack>
                </Box>
              </Flex>

              <Text fontSize="sm" color="gray.600" mb={4}>
                {experiment.hypothesis}
              </Text>

              <VStack align="stretch" spacing={3}>
                <Stat size="sm">
                  <StatLabel>Participants</StatLabel>
                  <StatNumber>{experiment.participants.toLocaleString()}</StatNumber>
                </Stat>

                <Box>
                  <Text fontSize="sm" fontWeight="medium" mb={2}>
                    Confidence Level
                  </Text>
                  <Progress 
                    value={experiment.confidence} 
                    colorScheme={experiment.confidence >= 95 ? 'green' : 'yellow'}
                    size="sm"
                    mb={1}
                  />
                  <Text fontSize="xs" color={getConfidenceColor(experiment.confidence)}>
                    {experiment.confidence}%
                  </Text>
                </Box>

                <Box>
                  <Text fontSize="sm" fontWeight="medium" mb={2}>
                    Performance
                  </Text>
                  {experiment.variants.map((variant, idx) => (
                    <Box key={idx} mb={2}>
                      <Flex justify="space-between" align="center" mb={1}>
                        <Text fontSize="xs">{variant.name}</Text>
                        <Text fontSize="xs" fontWeight="bold">
                          {variant.conversionRate.toFixed(2)}%
                        </Text>
                      </Flex>
                      <Progress
                        value={variant.conversionRate}
                        max={Math.max(...experiment.variants.map(v => v.conversionRate))}
                        size="xs"
                        colorScheme={idx === 0 ? 'gray' : 'brand'}
                      />
                    </Box>
                  ))}
                </Box>

                {experiment.uplift > 0 && (
                  <Stat size="sm">
                    <StatLabel>Uplift</StatLabel>
                    <StatNumber color="green.500">+{experiment.uplift}%</StatNumber>
                  </Stat>
                )}
              </VStack>
            </CardBody>
            <CardFooter>
              <Button size="sm" variant="outline" width="full">
                View Details
              </Button>
            </CardFooter>
          </Card>
        ))}
      </SimpleGrid>

      <ExperimentDesigner isOpen={isOpen} onClose={onClose} />
    </Container>
  )
}