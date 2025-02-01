import React from "react";
import { Flex, IconButton, Avatar } from "@chakra-ui/react";
import { BellIcon } from "@chakra-ui/icons";

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
      <Flex alignItems="center" gap={4}>
        <IconButton icon={<BellIcon />} variant="ghost" position="relative" />
        <Avatar size="sm" />
      </Flex>
    </Flex>
  );
};
