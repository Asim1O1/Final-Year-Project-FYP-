import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  config: {
    initialColorMode: "light",
    useSystemColorMode: false,
  },
  fonts: {
    heading: "'Poppins', sans-serif",
    body: "'Lato', sans-serif",
  },
  components: {
    Heading: {
      baseStyle: {
        fontWeight: "600",
      },
    },
    Text: {
      baseStyle: {
        fontFamily: "'Lato', sans-serif",
      },
    },
  },
});

export default theme;
