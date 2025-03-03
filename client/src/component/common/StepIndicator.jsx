import React from 'react';
import { Flex, Text, Box, Circle } from '@chakra-ui/react';

export const StepIndicator = ({ currentStep }) => {
  const steps = [
    { number: 1, label: 'Select Specialty' },
    { number: 2, label: 'Choose Doctor' },
    { number: 3, label: 'Select Time' },
    { number: 4, label: 'Patient Details' },
    { number: 5, label: 'Confirmation' }
  ];

  return (
    <Flex justifyContent="center" w="100%" mt={4} mb={8}>
      {steps.map((step, index) => (
        <Flex 
          key={step.number} 
          flexDirection="column" 
          alignItems="center"
          mx={4}
        >
          <Circle 
            size="40px" 
            bg={currentStep === step.number ? "blue.400" : "gray.200"}
            color={currentStep === step.number ? "white" : "gray.600"}
            fontWeight="bold"
            mb={2}
          >
            {step.number}
          </Circle>
          <Text 
            fontSize="sm" 
            color={currentStep === step.number ? "blue.400" : "gray.500"}
            fontWeight={currentStep === step.number ? "medium" : "normal"}
          >
            {step.label}
          </Text>
          
          {index < steps.length - 1 && (
            <Box 
              position="absolute" 
              height="2px" 
              bg="gray.200" 
              width="80px" 
              left={`calc(50% + ${(index - 2) * 120}px)`} 
              top="20px"
              display={["none", "none", "block"]}
            />
          )}
        </Flex>
      ))}
    </Flex>
  );
};

export default StepIndicator;