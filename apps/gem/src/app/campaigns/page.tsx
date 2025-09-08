'use client'

import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  IconButton,
  useDisclosure,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from '@chakra-ui/react'
import { AddIcon, EditIcon, ViewIcon, DeleteIcon, ChevronDownIcon } from '@chakra-ui/icons'
import { useState } from 'react'
import CampaignBuilder from '@/components/CampaignBuilder'

interface Campaign {
  id: string
  name: string
  type: string
  status: 'active' | 'paused' | 'completed' | 'draft'
  startDate: string
  endDate: string
  budget: number
  spent: number
  conversions: number
  roi: number
}

const mockCampaigns: Campaign[] = [
  {
    id: '1',
    name: 'Summer Sale 2024',
    type: 'Email',
    status: 'active',
    startDate: '2024-06-01',
    endDate: '2024-08-31',
    budget: 50000,
    spent: 23450,
    conversions: 1234,
    roi: 285,
  },
  {
    id: '2',
    name: 'Product Launch - Smart Lock Pro',
    type: 'Multi-channel',
    status: 'active',
    startDate: '2024-07-15',
    endDate: '2024-09-15',
    budget: 100000,
    spent: 45670,
    conversions: 2567,
    roi: 412,
  },
  {
    id: '3',
    name: 'Back to School',
    type: 'Social Media',
    status: 'paused',
    startDate: '2024-08-01',
    endDate: '2024-09-30',
    budget: 30000,
    spent: 12340,
    conversions: 789,
    roi: 192,
  },
]

export default function CampaignsPage() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [campaigns, setCampaigns] = useState(mockCampaigns)

  const getStatusColor = (status: Campaign['status']) => {
    switch (status) {
      case 'active':
        return 'green'
      case 'paused':
        return 'yellow'
      case 'completed':
        return 'blue'
      case 'draft':
        return 'gray'
    }
  }

  return (
    <Container maxW="container.xl" py={8}>
      <Flex justify="space-between" align="center" mb={8}>
        <Heading as="h1" size="xl">
          Marketing Campaigns
        </Heading>
        <Button leftIcon={<AddIcon />} colorScheme="brand" onClick={onOpen}>
          New Campaign
        </Button>
      </Flex>

      <Box overflowX="auto">
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Campaign Name</Th>
              <Th>Type</Th>
              <Th>Status</Th>
              <Th>Duration</Th>
              <Th isNumeric>Budget</Th>
              <Th isNumeric>Spent</Th>
              <Th isNumeric>Conversions</Th>
              <Th isNumeric>ROI</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {campaigns.map((campaign) => (
              <Tr key={campaign.id}>
                <Td fontWeight="medium">{campaign.name}</Td>
                <Td>{campaign.type}</Td>
                <Td>
                  <Badge colorScheme={getStatusColor(campaign.status)}>
                    {campaign.status}
                  </Badge>
                </Td>
                <Td fontSize="sm">
                  {new Date(campaign.startDate).toLocaleDateString()} - {new Date(campaign.endDate).toLocaleDateString()}
                </Td>
                <Td isNumeric>${campaign.budget.toLocaleString()}</Td>
                <Td isNumeric>${campaign.spent.toLocaleString()}</Td>
                <Td isNumeric>{campaign.conversions.toLocaleString()}</Td>
                <Td isNumeric fontWeight="bold" color={campaign.roi > 200 ? 'green.500' : 'orange.500'}>
                  {campaign.roi}%
                </Td>
                <Td>
                  <Menu>
                    <MenuButton
                      as={IconButton}
                      icon={<ChevronDownIcon />}
                      variant="outline"
                      size="sm"
                    />
                    <MenuList>
                      <MenuItem icon={<ViewIcon />}>View Details</MenuItem>
                      <MenuItem icon={<EditIcon />}>Edit Campaign</MenuItem>
                      <MenuItem icon={<DeleteIcon />} color="red.500">
                        Delete
                      </MenuItem>
                    </MenuList>
                  </Menu>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>

      <CampaignBuilder isOpen={isOpen} onClose={onClose} />
    </Container>
  )
}