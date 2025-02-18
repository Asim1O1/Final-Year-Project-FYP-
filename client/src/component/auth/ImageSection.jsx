import React from "react";
import { Box, Image, useBreakpointValue } from "@chakra-ui/react";
import { motion } from "framer-motion";

const ImageSection = ({ imageUrl, alt = "Image" }) => {
  const containerWidth = useBreakpointValue({
    md: "90%",
    lg: "85%",
    xl: "80%",
  });

  const imageSize = useBreakpointValue({
    md: "400px",
    lg: "450px",
    xl: "500px",
  });

  return (
    <Box
      as={motion.div}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      w={containerWidth}
      h={imageSize}
      position="relative"
    >
      <Box
        as={motion.div}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.3 }}
        w="100%"
        h="100%"
        rounded="2xl"
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
          bg: "blackAlpha.50",
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
          objectFit="contain"
          h="100%"
          w="100%"
          p={6}
          transition="all 0.3s ease"
          _hover={{
            transform: "scale(1.05)",
          }}
          loading="eager"
          fallback={
            <Box
              h="100%"
              w="100%"
              bg="gray.50"
              display="flex"
              alignItems="center"
              justifyContent="center"
              fontSize="sm"
              color="gray.500"
            >
              Loading image...
            </Box>
          }
        />
      </Box>
    </Box>
  );
};
export default ImageSection;
