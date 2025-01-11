import React from 'react';
import { Box, Heading, Table, Thead, Tbody, Tr, Th, Td, Button, HStack } from '@chakra-ui/react';
import { AdminLayout } from '../../layouts/AdminLayout';

export const Users = () => {
  return (
    <AdminLayout>
      <Box>
        <Heading mb={6} size="lg">User Management</Heading>
        
        <Box bg="white" rounded="lg" shadow="sm">
          <Table>
            <Thead>
              <Tr>
                <Th>Name</Th>
                <Th>Email</Th>
                <Th>Role</Th>
                <Th>Status</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {/* Sample row */}
              <Tr>
                <Td>John Doe</Td>
                <Td>john@example.com</Td>
                <Td>Hospital Admin</Td>
                <Td>Active</Td>
                <Td>
                  <HStack spacing={2}>
                    <Button size="sm">Edit</Button>
                    <Button size="sm" colorScheme="red">Deactivate</Button>
                  </HStack>
                </Td>
              </Tr>
            </Tbody>
          </Table>
        </Box>
      </Box>
    </AdminLayout>
  );
};