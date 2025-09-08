import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
  VStack,
  HStack,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Switch,
  Text,
  Box,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  CheckboxGroup,
  Checkbox,
  SimpleGrid,
  FormHelperText,
  useToast,
  Badge,
  Divider,
} from '@chakra-ui/react'
import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'

interface CampaignFormData {
  name: string
  type: string
  objective: string
  startDate: string
  endDate: string
  budget: number
  dailyBudget: number
  channels: string[]
  targetAudience: {
    ageMin: number
    ageMax: number
    gender: string
    locations: string[]
    interests: string[]
  }
  creative: {
    headline: string
    description: string
    cta: string
  }
  automation: {
    enabled: boolean
    optimizeBudget: boolean
    optimizeBids: boolean
    pauseOnThreshold: boolean
    thresholdValue: number
  }
}

interface CampaignBuilderProps {
  isOpen: boolean
  onClose: () => void
}

export default function CampaignBuilder({ isOpen, onClose }: CampaignBuilderProps) {
  const [activeTab, setActiveTab] = useState(0)
  const toast = useToast()
  const { control, handleSubmit, watch, reset } = useForm<CampaignFormData>({
    defaultValues: {
      name: '',
      type: 'multi-channel',
      objective: 'conversions',
      budget: 10000,
      dailyBudget: 500,
      channels: [],
      targetAudience: {
        ageMin: 18,
        ageMax: 65,
        gender: 'all',
        locations: [],
        interests: [],
      },
      creative: {
        headline: '',
        description: '',
        cta: 'Learn More',
      },
      automation: {
        enabled: true,
        optimizeBudget: true,
        optimizeBids: true,
        pauseOnThreshold: false,
        thresholdValue: 100,
      },
    },
  })

  const automationEnabled = watch('automation.enabled')

  const onSubmit = (data: CampaignFormData) => {
    console.log('Campaign data:', data)
    toast({
      title: 'Campaign created',
      description: `"${data.name}" has been created successfully.`,
      status: 'success',
      duration: 3000,
      isClosable: true,
    })
    reset()
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent maxW="800px">
        <ModalHeader>Create New Campaign</ModalHeader>
        <ModalCloseButton />
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalBody>
            <Tabs index={activeTab} onChange={setActiveTab}>
              <TabList>
                <Tab>Basic Info</Tab>
                <Tab>Target Audience</Tab>
                <Tab>Creative</Tab>
                <Tab>Automation</Tab>
              </TabList>

              <TabPanels>
                <TabPanel>
                  <VStack spacing={4}>
                    <Controller
                      name="name"
                      control={control}
                      rules={{ required: true }}
                      render={({ field }) => (
                        <FormControl isRequired>
                          <FormLabel>Campaign Name</FormLabel>
                          <Input {...field} placeholder="Summer Sale 2024" />
                        </FormControl>
                      )}
                    />

                    <SimpleGrid columns={2} spacing={4} w="full">
                      <Controller
                        name="type"
                        control={control}
                        render={({ field }) => (
                          <FormControl>
                            <FormLabel>Campaign Type</FormLabel>
                            <Select {...field}>
                              <option value="multi-channel">Multi-channel</option>
                              <option value="email">Email Only</option>
                              <option value="social">Social Media</option>
                              <option value="search">Search Ads</option>
                              <option value="display">Display Ads</option>
                            </Select>
                          </FormControl>
                        )}
                      />

                      <Controller
                        name="objective"
                        control={control}
                        render={({ field }) => (
                          <FormControl>
                            <FormLabel>Objective</FormLabel>
                            <Select {...field}>
                              <option value="conversions">Conversions</option>
                              <option value="traffic">Traffic</option>
                              <option value="awareness">Brand Awareness</option>
                              <option value="engagement">Engagement</option>
                              <option value="leads">Lead Generation</option>
                            </Select>
                          </FormControl>
                        )}
                      />
                    </SimpleGrid>

                    <SimpleGrid columns={2} spacing={4} w="full">
                      <Controller
                        name="startDate"
                        control={control}
                        rules={{ required: true }}
                        render={({ field }) => (
                          <FormControl isRequired>
                            <FormLabel>Start Date</FormLabel>
                            <Input {...field} type="date" />
                          </FormControl>
                        )}
                      />

                      <Controller
                        name="endDate"
                        control={control}
                        rules={{ required: true }}
                        render={({ field }) => (
                          <FormControl isRequired>
                            <FormLabel>End Date</FormLabel>
                            <Input {...field} type="date" />
                          </FormControl>
                        )}
                      />
                    </SimpleGrid>

                    <SimpleGrid columns={2} spacing={4} w="full">
                      <Controller
                        name="budget"
                        control={control}
                        rules={{ required: true, min: 100 }}
                        render={({ field }) => (
                          <FormControl isRequired>
                            <FormLabel>Total Budget ($)</FormLabel>
                            <NumberInput {...field} min={100}>
                              <NumberInputField />
                              <NumberInputStepper>
                                <NumberIncrementStepper />
                                <NumberDecrementStepper />
                              </NumberInputStepper>
                            </NumberInput>
                          </FormControl>
                        )}
                      />

                      <Controller
                        name="dailyBudget"
                        control={control}
                        render={({ field }) => (
                          <FormControl>
                            <FormLabel>Daily Budget ($)</FormLabel>
                            <NumberInput {...field} min={10}>
                              <NumberInputField />
                              <NumberInputStepper>
                                <NumberIncrementStepper />
                                <NumberDecrementStepper />
                              </NumberInputStepper>
                            </NumberInput>
                            <FormHelperText>Leave empty for automatic distribution</FormHelperText>
                          </FormControl>
                        )}
                      />
                    </SimpleGrid>

                    <Controller
                      name="channels"
                      control={control}
                      render={({ field }) => (
                        <FormControl>
                          <FormLabel>Marketing Channels</FormLabel>
                          <CheckboxGroup {...field}>
                            <SimpleGrid columns={2} spacing={2}>
                              <Checkbox value="email">Email</Checkbox>
                              <Checkbox value="facebook">Facebook</Checkbox>
                              <Checkbox value="instagram">Instagram</Checkbox>
                              <Checkbox value="google">Google Ads</Checkbox>
                              <Checkbox value="linkedin">LinkedIn</Checkbox>
                              <Checkbox value="twitter">Twitter</Checkbox>
                            </SimpleGrid>
                          </CheckboxGroup>
                        </FormControl>
                      )}
                    />
                  </VStack>
                </TabPanel>

                <TabPanel>
                  <VStack spacing={4}>
                    <Text fontWeight="bold" alignSelf="start">
                      Demographics
                    </Text>

                    <SimpleGrid columns={3} spacing={4} w="full">
                      <Controller
                        name="targetAudience.ageMin"
                        control={control}
                        render={({ field }) => (
                          <FormControl>
                            <FormLabel>Min Age</FormLabel>
                            <NumberInput {...field} min={13} max={100}>
                              <NumberInputField />
                              <NumberInputStepper>
                                <NumberIncrementStepper />
                                <NumberDecrementStepper />
                              </NumberInputStepper>
                            </NumberInput>
                          </FormControl>
                        )}
                      />

                      <Controller
                        name="targetAudience.ageMax"
                        control={control}
                        render={({ field }) => (
                          <FormControl>
                            <FormLabel>Max Age</FormLabel>
                            <NumberInput {...field} min={13} max={100}>
                              <NumberInputField />
                              <NumberInputStepper>
                                <NumberIncrementStepper />
                                <NumberDecrementStepper />
                              </NumberInputStepper>
                            </NumberInput>
                          </FormControl>
                        )}
                      />

                      <Controller
                        name="targetAudience.gender"
                        control={control}
                        render={({ field }) => (
                          <FormControl>
                            <FormLabel>Gender</FormLabel>
                            <Select {...field}>
                              <option value="all">All</option>
                              <option value="male">Male</option>
                              <option value="female">Female</option>
                            </Select>
                          </FormControl>
                        )}
                      />
                    </SimpleGrid>

                    <Controller
                      name="targetAudience.locations"
                      control={control}
                      render={({ field }) => (
                        <FormControl>
                          <FormLabel>Target Locations</FormLabel>
                          <Textarea
                            {...field}
                            value={field.value.join(', ')}
                            onChange={(e) => field.onChange(e.target.value.split(',').map(s => s.trim()))}
                            placeholder="United States, Canada, United Kingdom"
                          />
                          <FormHelperText>Enter comma-separated locations</FormHelperText>
                        </FormControl>
                      )}
                    />

                    <Controller
                      name="targetAudience.interests"
                      control={control}
                      render={({ field }) => (
                        <FormControl>
                          <FormLabel>Interests & Behaviors</FormLabel>
                          <Textarea
                            {...field}
                            value={field.value.join(', ')}
                            onChange={(e) => field.onChange(e.target.value.split(',').map(s => s.trim()))}
                            placeholder="Smart home, Security, Technology, Home improvement"
                          />
                          <FormHelperText>Enter comma-separated interests</FormHelperText>
                        </FormControl>
                      )}
                    />
                  </VStack>
                </TabPanel>

                <TabPanel>
                  <VStack spacing={4}>
                    <Controller
                      name="creative.headline"
                      control={control}
                      rules={{ required: true }}
                      render={({ field }) => (
                        <FormControl isRequired>
                          <FormLabel>Headline</FormLabel>
                          <Input {...field} placeholder="Secure Your Home with Eufy" />
                          <FormHelperText>Max 30 characters for optimal display</FormHelperText>
                        </FormControl>
                      )}
                    />

                    <Controller
                      name="creative.description"
                      control={control}
                      rules={{ required: true }}
                      render={({ field }) => (
                        <FormControl isRequired>
                          <FormLabel>Description</FormLabel>
                          <Textarea
                            {...field}
                            placeholder="Experience next-level home security with our advanced smart locks and cameras."
                            rows={4}
                          />
                          <FormHelperText>Max 90 characters for optimal display</FormHelperText>
                        </FormControl>
                      )}
                    />

                    <Controller
                      name="creative.cta"
                      control={control}
                      render={({ field }) => (
                        <FormControl>
                          <FormLabel>Call to Action</FormLabel>
                          <Select {...field}>
                            <option value="Learn More">Learn More</option>
                            <option value="Shop Now">Shop Now</option>
                            <option value="Get Started">Get Started</option>
                            <option value="Sign Up">Sign Up</option>
                            <option value="Download">Download</option>
                            <option value="Contact Us">Contact Us</option>
                          </Select>
                        </FormControl>
                      )}
                    />

                    <Box p={4} borderWidth="1px" borderRadius="md" w="full">
                      <Text fontSize="sm" color="gray.600" mb={2}>
                        Preview
                      </Text>
                      <VStack align="start" spacing={2}>
                        <Text fontWeight="bold">{watch('creative.headline') || 'Your Headline'}</Text>
                        <Text fontSize="sm">{watch('creative.description') || 'Your description text'}</Text>
                        <Button size="sm" colorScheme="brand">
                          {watch('creative.cta')}
                        </Button>
                      </VStack>
                    </Box>
                  </VStack>
                </TabPanel>

                <TabPanel>
                  <VStack spacing={4} align="stretch">
                    <Controller
                      name="automation.enabled"
                      control={control}
                      render={({ field }) => (
                        <FormControl display="flex" alignItems="center">
                          <FormLabel htmlFor="automation-enabled" mb="0">
                            Enable Marketing Automation
                          </FormLabel>
                          <Switch
                            id="automation-enabled"
                            isChecked={field.value}
                            onChange={field.onChange}
                          />
                        </FormControl>
                      )}
                    />

                    {automationEnabled && (
                      <>
                        <Divider />

                        <Text fontWeight="bold">Optimization Settings</Text>

                        <Controller
                          name="automation.optimizeBudget"
                          control={control}
                          render={({ field }) => (
                            <FormControl display="flex" alignItems="center">
                              <FormLabel htmlFor="optimize-budget" mb="0">
                                Auto-optimize budget allocation
                              </FormLabel>
                              <Switch
                                id="optimize-budget"
                                isChecked={field.value}
                                onChange={field.onChange}
                              />
                            </FormControl>
                          )}
                        />

                        <Controller
                          name="automation.optimizeBids"
                          control={control}
                          render={({ field }) => (
                            <FormControl display="flex" alignItems="center">
                              <FormLabel htmlFor="optimize-bids" mb="0">
                                Smart bidding optimization
                              </FormLabel>
                              <Switch
                                id="optimize-bids"
                                isChecked={field.value}
                                onChange={field.onChange}
                              />
                            </FormControl>
                          )}
                        />

                        <Controller
                          name="automation.pauseOnThreshold"
                          control={control}
                          render={({ field }) => (
                            <FormControl display="flex" alignItems="center">
                              <FormLabel htmlFor="pause-threshold" mb="0">
                                Pause campaign if daily spend exceeds
                              </FormLabel>
                              <Switch
                                id="pause-threshold"
                                isChecked={field.value}
                                onChange={field.onChange}
                              />
                            </FormControl>
                          )}
                        />

                        {watch('automation.pauseOnThreshold') && (
                          <Controller
                            name="automation.thresholdValue"
                            control={control}
                            render={({ field }) => (
                              <FormControl>
                                <HStack>
                                  <Text>$</Text>
                                  <NumberInput {...field} min={10}>
                                    <NumberInputField />
                                    <NumberInputStepper>
                                      <NumberIncrementStepper />
                                      <NumberDecrementStepper />
                                    </NumberInputStepper>
                                  </NumberInput>
                                </HStack>
                              </FormControl>
                            )}
                          />
                        )}

                        <Box p={4} bg="blue.50" borderRadius="md">
                          <HStack spacing={2} mb={2}>
                            <Badge colorScheme="blue">AI-Powered</Badge>
                            <Text fontWeight="bold" fontSize="sm">
                              Optimization Features
                            </Text>
                          </HStack>
                          <Text fontSize="sm" color="gray.700">
                            When enabled, our AI will continuously monitor and optimize your campaign
                            performance, adjusting budgets and bids in real-time to maximize ROI.
                          </Text>
                        </Box>
                      </>
                    )}
                  </VStack>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button
              colorScheme="brand"
              type="submit"
              isDisabled={activeTab < 3}
              onClick={() => activeTab < 3 && setActiveTab(activeTab + 1)}
            >
              {activeTab < 3 ? 'Next' : 'Create Campaign'}
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  )
}