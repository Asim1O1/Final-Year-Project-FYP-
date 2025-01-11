import React from 'react';
import { Flex, InputGroup, Input, InputRightElement, IconButton, Avatar, Box } from '@chakra-ui/react';
import { SearchIcon, BellIcon } from '@chakra-ui/icons';

export const TopNav = () => {
  return (
    <Flex
      bg="white"
      p={4}
      borderBottom="1px"
      borderColor="gray.200"
      alignItems="center"
      justifyContent="space-between"
    >
      <InputGroup maxW="400px">
        <Input placeholder="Search..." />
        <InputRightElement>
          <SearchIcon color="gray.500" />
        </InputRightElement>
      </InputGroup>
      
      <Flex alignItems="center" gap={4}>
        <IconButton
          icon={<BellIcon />}
          variant="ghost"
          position="relative"
        />
        <Avatar size="sm" />
      </Flex>
    </Flex>
  );
};