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
  Text,
  Box,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  SimpleGrid,
  FormHelperText,
  useToast,
  Badge,
  Divider,
  Radio,
  RadioGroup,
  Stack,
  IconButton,
  Alert,
  AlertIcon,
} from '@chakra-ui/react'
import { AddIcon, DeleteIcon } from '@chakra-ui/icons'
import { useState } from 'react'
import { useForm, Controller, useFieldArray } from 'react-hook-form'

interface Variant {
  name: string
  description: string
  traffic: number
}

interface ExperimentFormData {
  name: string
  hypothesis: string
  type: string
  element: string
  metric: string
  variants: Variant[]
  duration: number
  minSampleSize: number
  confidenceLevel: number
}

interface ExperimentDesignerProps {
  isOpen: boolean
  onClose: () => void
}

export default function ExperimentDesigner({ isOpen, onClose }: ExperimentDesignerProps) {
  const toast = useToast()
  const { control, handleSubmit, watch, reset, setValue } = useForm<ExperimentFormData>({
    defaultValues: {
      name: '',
      hypothesis: '',
      type: 'ab',
      element: 'button',
      metric: 'conversion_rate',
      variants: [
        { name: 'Control', description: 'Current version', traffic: 50 },
        { name: 'Variant A', description: '', traffic: 50 },
      ],
      duration: 14,
      minSampleSize: 1000,
      confidenceLevel: 95,
    },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'variants',
  })

  const experimentType = watch('type')
  const variants = watch('variants')
  const confidenceLevel = watch('confidenceLevel')

  const totalTraffic = variants.reduce((sum, v) => sum + v.traffic, 0)

  const redistributeTraffic = () => {
    const equalTraffic = Math.floor(100 / variants.length)
    const remainder = 100 - equalTraffic * variants.length
    
    variants.forEach((_, index) => {
      setValue(`variants.${index}.traffic`, index === 0 ? equalTraffic + remainder : equalTraffic)
    })
  }

  const calculateSampleSize = () => {
    // Simplified sample size calculation
    const baseSize = 1000
    const confidenceMultiplier = confidenceLevel === 99 ? 1.5 : confidenceLevel === 95 ? 1 : 0.8
    const variantMultiplier = variants.length - 1
    return Math.round(baseSize * confidenceMultiplier * variantMultiplier)
  }

  const onSubmit = (data: ExperimentFormData) => {
    if (totalTraffic !== 100) {
      toast({
        title: 'Invalid traffic distribution',
        description: 'Traffic percentages must add up to 100%',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
      return
    }

    console.log('Experiment data:', data)
    toast({
      title: 'Experiment created',
      description: `"${data.name}" has been created and will start running.`,
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
        <ModalHeader>Design A/B Test Experiment</ModalHeader>
        <ModalCloseButton />
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalBody>
            <VStack spacing={6}>
              <Controller
                name="name"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <FormControl isRequired>
                    <FormLabel>Experiment Name</FormLabel>
                    <Input {...field} placeholder="Homepage CTA Button Test" />
                  </FormControl>
                )}
              />

              <Controller
                name="hypothesis"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <FormControl isRequired>
                    <FormLabel>Hypothesis</FormLabel>
                    <Textarea
                      {...field}
                      placeholder="Changing the CTA button color from blue to green will increase click-through rate by 15%"
                      rows={3}
                    />
                    <FormHelperText>
                      What do you expect to happen and why?
                    </FormHelperText>
                  </FormControl>
                )}
              />

              <SimpleGrid columns={2} spacing={4} w="full">
                <Controller
                  name="type"
                  control={control}
                  render={({ field }) => (
                    <FormControl>
                      <FormLabel>Test Type</FormLabel>
                      <RadioGroup {...field}>
                        <Stack direction="column">
                          <Radio value="ab">A/B Test</Radio>
                          <Radio value="multivariate">Multivariate</Radio>
                          <Radio value="split_url">Split URL</Radio>
                        </Stack>
                      </RadioGroup>
                    </FormControl>
                  )}
                />

                <Controller
                  name="element"
                  control={control}
                  render={({ field }) => (
                    <FormControl>
                      <FormLabel>Test Element</FormLabel>
                      <Select {...field}>
                        <option value="button">Button</option>
                        <option value="headline">Headline</option>
                        <option value="image">Image</option>
                        <option value="layout">Page Layout</option>
                        <option value="copy">Copy/Text</option>
                        <option value="form">Form</option>
                        <option value="pricing">Pricing</option>
                        <option value="other">Other</option>
                      </Select>
                    </FormControl>
                  )}
                />
              </SimpleGrid>

              <Divider />

              <Box w="full">
                <HStack justify="space-between" mb={4}>
                  <Text fontWeight="bold">Variants</Text>
                  <Button
                    size="sm"
                    leftIcon={<AddIcon />}
                    onClick={() => append({ name: `Variant ${String.fromCharCode(65 + fields.length - 1)}`, description: '', traffic: 0 })}
                    isDisabled={fields.length >= 5}
                  >
                    Add Variant
                  </Button>
                </HStack>

                <VStack spacing={4}>
                  {fields.map((field, index) => (
                    <Box key={field.id} p={4} borderWidth="1px" borderRadius="md" w="full">
                      <HStack justify="space-between" mb={3}>
                        <Badge colorScheme={index === 0 ? 'gray' : 'brand'}>
                          {index === 0 ? 'Control' : `Variant ${index}`}
                        </Badge>
                        {index > 1 && (
                          <IconButton
                            aria-label="Remove variant"
                            icon={<DeleteIcon />}
                            size="sm"
                            variant="ghost"
                            colorScheme="red"
                            onClick={() => remove(index)}
                          />
                        )}
                      </HStack>

                      <SimpleGrid columns={2} spacing={4}>
                        <Controller
                          name={`variants.${index}.name`}
                          control={control}
                          rules={{ required: true }}
                          render={({ field }) => (
                            <FormControl isRequired>
                              <FormLabel fontSize="sm">Name</FormLabel>
                              <Input {...field} size="sm" />
                            </FormControl>
                          )}
                        />

                        <Controller
                          name={`variants.${index}.traffic`}
                          control={control}
                          rules={{ required: true, min: 0, max: 100 }}
                          render={({ field }) => (
                            <FormControl isRequired>
                              <FormLabel fontSize="sm">Traffic %</FormLabel>
                              <NumberInput {...field} min={0} max={100} size="sm">
                                <NumberInputField />
                                <NumberInputStepper>
                                  <NumberIncrementStepper />
                                  <NumberDecrementStepper />
                                </NumberInputStepper>
                              </NumberInput>
                            </FormControl>
                          )}
                        />
                      </SimpleGrid>

                      <Controller
                        name={`variants.${index}.description`}
                        control={control}
                        render={({ field }) => (
                          <FormControl mt={3}>
                            <FormLabel fontSize="sm">Description</FormLabel>
                            <Textarea
                              {...field}
                              placeholder="What changes in this variant?"
                              size="sm"
                              rows={2}
                            />
                          </FormControl>
                        )}
                      />
                    </Box>
                  ))}
                </VStack>

                <HStack justify="space-between" mt={4}>
                  <Text fontSize="sm" color={totalTraffic === 100 ? 'green.500' : 'red.500'}>
                    Total traffic: {totalTraffic}%
                  </Text>
                  <Button size="sm" variant="outline" onClick={redistributeTraffic}>
                    Distribute Equally
                  </Button>
                </HStack>
              </Box>

              <Divider />

              <Box w="full">
                <Text fontWeight="bold" mb={4}>Success Criteria</Text>

                <Controller
                  name="metric"
                  control={control}
                  render={({ field }) => (
                    <FormControl>
                      <FormLabel>Primary Metric</FormLabel>
                      <Select {...field}>
                        <option value="conversion_rate">Conversion Rate</option>
                        <option value="click_through_rate">Click-through Rate</option>
                        <option value="revenue_per_visitor">Revenue per Visitor</option>
                        <option value="bounce_rate">Bounce Rate</option>
                        <option value="average_order_value">Average Order Value</option>
                        <option value="engagement_rate">Engagement Rate</option>
                      </Select>
                    </FormControl>
                  )}
                />

                <Controller
                  name="confidenceLevel"
                  control={control}
                  render={({ field }) => (
                    <FormControl mt={4}>
                      <FormLabel>
                        Statistical Confidence Level: {field.value}%
                      </FormLabel>
                      <Slider {...field} min={80} max={99}>
                        <SliderTrack>
                          <SliderFilledTrack />
                        </SliderTrack>
                        <SliderThumb boxSize={6}>
                          <Text fontSize="xs">{field.value}</Text>
                        </SliderThumb>
                      </Slider>
                      <FormHelperText>
                        Higher confidence requires larger sample size
                      </FormHelperText>
                    </FormControl>
                  )}
                />
              </Box>

              <SimpleGrid columns={2} spacing={4} w="full">
                <Controller
                  name="duration"
                  control={control}
                  rules={{ required: true, min: 1 }}
                  render={({ field }) => (
                    <FormControl isRequired>
                      <FormLabel>Test Duration (days)</FormLabel>
                      <NumberInput {...field} min={1} max={90}>
                        <NumberInputField />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                      <FormHelperText>Recommended: 14-28 days</FormHelperText>
                    </FormControl>
                  )}
                />

                <FormControl>
                  <FormLabel>Minimum Sample Size</FormLabel>
                  <Input value={calculateSampleSize().toLocaleString()} isReadOnly />
                  <FormHelperText>Auto-calculated based on settings</FormHelperText>
                </FormControl>
              </SimpleGrid>

              <Alert status="info">
                <AlertIcon />
                <Box>
                  <Text fontWeight="bold" fontSize="sm">
                    Experiment Duration Estimate
                  </Text>
                  <Text fontSize="sm">
                    Based on your current traffic, this experiment will need approximately{' '}
                    {watch('duration')} days to reach statistical significance with{' '}
                    {calculateSampleSize().toLocaleString()} visitors per variant.
                  </Text>
                </Box>
              </Alert>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="brand" type="submit">
              Start Experiment
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  )
}