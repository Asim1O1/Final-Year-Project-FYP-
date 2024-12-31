import React from "react";
import { Box, Image, useBreakpointValue } from "@chakra-ui/react";
import { motion } from "framer-motion";

const ImageSection = ({ imageUrl, alt = "Image" }) => {
  // Responsive width values
  const width = useBreakpointValue({
    base: "100%",
    sm: "90%",
    md: "43%",
    lg: "43%",
  });

  // Responsive height values
  const height = useBreakpointValue({
    base: "300px",
    sm: "400px",
    md: "full",
    lg: "full",
  });

  // Responsive padding values
  const padding = useBreakpointValue({
    base: 2,
    sm: 3,
    md: 4,
    lg: 4,
  });

  return (
    <Box
      as={motion.div}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      display="block" // Always show the image
      w={width}
      p={padding}
      position="relative"
    >
      <Box
        as={motion.div}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.3 }}
        h={height}
        rounded="xl"
        overflow="hidden"
        shadow="lg"
        position="relative"
        _before={{
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          bg: "blackAlpha.100",
          opacity: 0,
          transition: "opacity 0.3s ease",
          zIndex: 1,
        }}
        _hover={{
          shadow: "xl",
          _before: {
            opacity: 1,
          },
        }}
      >
        <Image
          src={imageUrl}
          alt={alt}
          objectFit="cover"
          h="full"
          w="full"
          transition="transform 0.3s ease"
          _hover={{
            transform: "scale(1.05)",
          }}
          fallback={
            <Box
              h="full"
              w="full"
              bg="gray.100"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              Loading...
            </Box>
          }
        />
      </Box>
    </Box>
  );
};

export default ImageSection;
