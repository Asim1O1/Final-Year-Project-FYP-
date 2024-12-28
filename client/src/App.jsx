import { Box, Button, Text } from "@chakra-ui/react";

function App() {
  return (
    <>
      <Box padding="4" maxW="320px" borderWidth="1px">
        <Text fontSize="xl">Welcome to Chakra UI</Text>
        <Button colorScheme="teal" size="lg" mt="4">
          Chakra Button
        </Button>
      </Box>
      <div className="bg-blue-500 text-white p-4">Hello, Tailwind!</div>
    </>
  );
}

export default App;
