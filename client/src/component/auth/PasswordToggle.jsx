import { IconButton } from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";

const PasswordToggle = ({ showPassword, togglePasswordVisibility }) => {
  return (
    <IconButton
      aria-label={showPassword ? "Hide password" : "Show password"}
      title={showPassword ? "Hide password" : "Show password"}
      icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
      onClick={togglePasswordVisibility}
      variant="ghost"
      size="sm"
    />
  );
};

export default PasswordToggle;
