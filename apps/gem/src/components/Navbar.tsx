'use client'

import { Box, Container, HStack, Heading } from '@chakra-ui/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Navbar() {
  const pathname = usePathname()

  const isActive = (path: string) => {
    return pathname === path
  }

  return (
    <Box as="nav" bg="white" shadow="sm" position="sticky" top={0} zIndex={10}>
      <Container maxW="container.xl">
        <HStack spacing={8} py={4}>
          <Heading as="h1" size="md" color="brand.700">
            GEM - Growth Engine Management
          </Heading>
          <HStack spacing={6} flex={1}>
            <Link href="/">
              <Box 
                as="a" 
                color={isActive('/') ? 'brand.600' : 'gray.700'} 
                fontWeight={isActive('/') ? 'medium' : 'normal'}
                _hover={{ color: 'brand.600' }} 
                cursor="pointer"
                borderBottom={isActive('/') ? '2px solid' : 'none'}
                borderColor="brand.600"
                pb={1}
              >
                Dashboard
              </Box>
            </Link>
            <Link href="/campaigns">
              <Box 
                as="a" 
                color={isActive('/campaigns') ? 'brand.600' : 'gray.700'} 
                fontWeight={isActive('/campaigns') ? 'medium' : 'normal'}
                _hover={{ color: 'brand.600' }} 
                cursor="pointer"
                borderBottom={isActive('/campaigns') ? '2px solid' : 'none'}
                borderColor="brand.600"
                pb={1}
              >
                Campaigns
              </Box>
            </Link>
            <Link href="/experiments">
              <Box 
                as="a" 
                color={isActive('/experiments') ? 'brand.600' : 'gray.700'} 
                fontWeight={isActive('/experiments') ? 'medium' : 'normal'}
                _hover={{ color: 'brand.600' }} 
                cursor="pointer"
                borderBottom={isActive('/experiments') ? '2px solid' : 'none'}
                borderColor="brand.600"
                pb={1}
              >
                Experiments
              </Box>
            </Link>
            <Link href="/analytics">
              <Box 
                as="a" 
                color={isActive('/analytics') ? 'brand.600' : 'gray.700'} 
                fontWeight={isActive('/analytics') ? 'medium' : 'normal'}
                _hover={{ color: 'brand.600' }} 
                cursor="pointer"
                borderBottom={isActive('/analytics') ? '2px solid' : 'none'}
                borderColor="brand.600"
                pb={1}
              >
                Analytics
              </Box>
            </Link>
            <Link href="/context-engineering">
              <Box 
                as="a" 
                color={isActive('/context-engineering') ? 'purple.700' : 'purple.600'} 
                fontWeight="medium" 
                _hover={{ color: 'purple.700' }} 
                cursor="pointer"
                borderBottom={isActive('/context-engineering') ? '2px solid' : 'none'}
                borderColor="purple.600"
                pb={1}
                position="relative"
              >
                AI Context Engineering
                <Box
                  as="span"
                  position="absolute"
                  top={-2}
                  right={-8}
                  bg="purple.500"
                  color="white"
                  fontSize="xs"
                  px={1.5}
                  py={0.5}
                  borderRadius="full"
                  fontWeight="bold"
                >
                  NEW
                </Box>
              </Box>
            </Link>
          </HStack>
        </HStack>
      </Container>
    </Box>
  )
}