import { Button } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";

const NavButton = ({ children, variant = "solid" }) => (
  <Button
    as={RouterLink}
    to={children === "Login" ? "/login" : "/signup"}
    colorScheme={variant === "solid" ? "blue" : "gray"}
    variant={variant === "solid" ? "solid" : "ghost"}
    size="md"
  >
    {children}
  </Button>
);

export default NavButton;