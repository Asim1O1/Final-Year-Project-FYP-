import { Box, Image } from '@chakra-ui/react'

const ImageSection = ({ imageUrl }) => {
 
  return (
    <Box 
      display={{ base: 'none', md: 'block' }}
      w="43%" 
      p={4}
    >
      <Box 
        h="full" 
        rounded="xl" 
        overflow="hidden"
        shadow="lg"
      >
        <Image
          src={imageUrl}
          alt="Registration"
          objectFit="cover"
          h="full"
          w="full"
        />
      </Box>
    </Box>
  )
}

export default ImageSection