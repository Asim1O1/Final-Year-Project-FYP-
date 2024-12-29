import {
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";

const InputForm = ({
  label,
  type = "text",
  name,
  value,
  onChange,
  rightElement,
  ...props
}) => {
  return (
    <FormControl>
      <FormLabel>{label}</FormLabel>
      <InputGroup>
        <Input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          focusBorderColor="purple.500"
          {...props}
        />
        {rightElement && <InputRightElement>{rightElement}</InputRightElement>}
      </InputGroup>
    </FormControl>
  );
};

export default InputForm;
