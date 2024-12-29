import { Box, Container, Flex } from '@chakra-ui/react'

const AuthLayout = ({ children }) => {
  return (
    <Box minH="100vh" bg="gray.50">
      <Container maxW="container.xl" py={10}>
        <Flex 
          bg="white" 
          rounded="xl" 
          shadow="xl" 
          h={{ base: "auto", md: "600px" }}
          overflow="hidden"
        >
          {children}
        </Flex>
      </Container>
    </Box>
  )
}

export default AuthLayout