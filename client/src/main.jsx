import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { ChakraProvider } from "@chakra-ui/react";
import { system } from "@chakra-ui/react/preset";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/* and pass value system below*/}
    <ChakraProvider value={system}>
      <App />
    </ChakraProvider>
  </StrictMode>
);
