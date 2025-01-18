import React from 'react';
import { Table, Thead, Tbody, Tr, Th, Td, Badge, Flex, IconButton } from '@chakra-ui/react';
import { Edit2, Trash2 } from 'lucide-react';

const HospitalList = ({ hospitals, onEdit, onDelete }) => {
  return (
    <Table variant="simple">
      <Thead>
        <Tr>
          <Th>Hospital Name</Th>
          <Th>Location</Th>
          <Th>Contact</Th>
          <Th>Specialties</Th>
          <Th>Tests</Th>
          <Th>Actions</Th>
        </Tr>
      </Thead>
      <Tbody>
        {hospitals.map((hospital) => (
          <Tr key={hospital.id}>
            <Td>{hospital.name}</Td>
            <Td>{hospital.location}</Td>
            <Td>{hospital.contactNumber}</Td>
            <Td>
              <Flex gap={1} flexWrap="wrap">
                {hospital.specialties.map((specialty, index) => (
                  <Badge key={index} colorScheme="blue">
                    {specialty}
                  </Badge>
                ))}
              </Flex>
            </Td>
            <Td>{hospital.medicalTests.length} tests</Td>
            <Td>
              <Flex gap={2}>
                <IconButton
                  aria-label="Edit hospital"
                  icon={<Edit2 size={16} />}
                  size="sm"
                  variant="ghost"
                  onClick={() => onEdit(hospital.id)}
                />
                <IconButton
                  aria-label="Delete hospital"
                  icon={<Trash2 size={16} />}
                  size="sm"
                  variant="ghost"
                  colorScheme="red"
                  onClick={() => onDelete(hospital.id)}
                />
              </Flex>
            </Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
};

export default HospitalList;
