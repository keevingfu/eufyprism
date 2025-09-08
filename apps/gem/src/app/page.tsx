'use client'

import { Box, Container, Heading, SimpleGrid, Stat, StatLabel, StatNumber, StatHelpText, StatArrow } from '@chakra-ui/react'
import Link from 'next/link'

export default function HomePage() {
  return (
    <Container maxW="container.xl" py={8}>
      <Heading as="h1" size="2xl" mb={8}>
        Growth Engine Management
      </Heading>

      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
        <Link href="/campaigns">
          <Stat
            p={6}
            borderWidth="1px"
            borderRadius="lg"
            cursor="pointer"
            _hover={{ shadow: 'lg', transform: 'translateY(-2px)' }}
            transition="all 0.2s"
          >
            <StatLabel>Active Campaigns</StatLabel>
            <StatNumber>12</StatNumber>
            <StatHelpText>
              <StatArrow type="increase" />
              23.5% conversion rate
            </StatHelpText>
          </Stat>
        </Link>

        <Link href="/experiments">
          <Stat
            p={6}
            borderWidth="1px"
            borderRadius="lg"
            cursor="pointer"
            _hover={{ shadow: 'lg', transform: 'translateY(-2px)' }}
            transition="all 0.2s"
          >
            <StatLabel>Running Experiments</StatLabel>
            <StatNumber>8</StatNumber>
            <StatHelpText>
              <StatArrow type="increase" />
              15% average uplift
            </StatHelpText>
          </Stat>
        </Link>

        <Link href="/analytics">
          <Stat
            p={6}
            borderWidth="1px"
            borderRadius="lg"
            cursor="pointer"
            _hover={{ shadow: 'lg', transform: 'translateY(-2px)' }}
            transition="all 0.2s"
          >
            <StatLabel>Monthly ROI</StatLabel>
            <StatNumber>385%</StatNumber>
            <StatHelpText>
              <StatArrow type="increase" />
              +45% from last month
            </StatHelpText>
          </Stat>
        </Link>

        <Link href="/budget">
          <Stat
            p={6}
            borderWidth="1px"
            borderRadius="lg"
            cursor="pointer"
            _hover={{ shadow: 'lg', transform: 'translateY(-2px)' }}
            transition="all 0.2s"
          >
            <StatLabel>Budget Efficiency</StatLabel>
            <StatNumber>92%</StatNumber>
            <StatHelpText>
              <StatArrow type="increase" />
              Optimal allocation
            </StatHelpText>
          </Stat>
        </Link>
      </SimpleGrid>

      <Box mt={8}>
        <Heading as="h2" size="lg" mb={6}>
          AI-Powered Features
        </Heading>
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          <Link href="/context-engineering">
            <Box
              p={6}
              borderWidth="2px"
              borderColor="purple.500"
              borderRadius="lg"
              cursor="pointer"
              _hover={{ shadow: 'lg', transform: 'translateY(-2px)', borderColor: 'purple.600' }}
              transition="all 0.2s"
              bg="purple.50"
            >
              <Heading as="h3" size="md" color="purple.700" mb={2}>
                AI Context Engineering
              </Heading>
              <Box color="gray.600" mb={4}>
                Optimize content for maximum AI search visibility and citation rates
              </Box>
              <Box fontSize="sm" color="purple.600">
                <Box mb={1}>✓ AI platform optimization</Box>
                <Box mb={1}>✓ E-E-A-T compliance</Box>
                <Box mb={1}>✓ Auto-distribution network</Box>
                <Box>✓ Real-time performance tracking</Box>
              </Box>
              <Box mt={4}>
                <Box fontSize="2xl" fontWeight="bold" color="purple.700">
                  42% <Box as="span" fontSize="sm" fontWeight="normal">AI Citation Rate</Box>
                </Box>
              </Box>
            </Box>
          </Link>

          <Link href="/ai-content-factory">
            <Box
              p={6}
              borderWidth="1px"
              borderRadius="lg"
              cursor="pointer"
              _hover={{ shadow: 'lg', transform: 'translateY(-2px)' }}
              transition="all 0.2s"
              opacity={0.7}
            >
              <Heading as="h3" size="md" color="gray.700" mb={2}>
                AI Content Factory
              </Heading>
              <Box color="gray.600" mb={4}>
                Automated content generation with multi-platform optimization
              </Box>
              <Box fontSize="sm" color="gray.500">
                Coming Soon
              </Box>
            </Box>
          </Link>

          <Link href="/predictive-analytics">
            <Box
              p={6}
              borderWidth="1px"
              borderRadius="lg"
              cursor="pointer"
              _hover={{ shadow: 'lg', transform: 'translateY(-2px)' }}
              transition="all 0.2s"
              opacity={0.7}
            >
              <Heading as="h3" size="md" color="gray.700" mb={2}>
                Predictive Analytics
              </Heading>
              <Box color="gray.600" mb={4}>
                AI-powered performance prediction and trend analysis
              </Box>
              <Box fontSize="sm" color="gray.500">
                Coming Soon
              </Box>
            </Box>
          </Link>
        </SimpleGrid>
      </Box>
    </Container>
  )
}