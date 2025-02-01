import React, { useState } from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Input,
  Button,
  Box,
  HStack,
  IconButton,
  Text,
} from "@chakra-ui/react";
import { Plus, Trash2, Edit2, Check, X } from "lucide-react";

const MedicalTestsEditor = ({ items, setFormData }) => {
  const [editingIndex, setEditingIndex] = useState(-1);
  const [newTest, setNewTest] = useState({ name: "", price: "" });
  const [isAdding, setIsAdding] = useState(false);

  const handleAdd = () => {
    if (newTest.name.trim() && newTest.price.trim()) {
      setFormData((prev) => ({
        ...prev,
        medicalTests: [...prev.medicalTests, newTest],
      }));
      setNewTest({ name: "", price: "" });
      setIsAdding(false);
    }
  };

  const handleRemove = (index) => {
    setFormData((prev) => ({
      ...prev,
      medicalTests: prev.medicalTests.filter((_, i) => i !== index),
    }));
  };

  const handleEdit = (index, updatedTest) => {
    setFormData((prev) => ({
      ...prev,
      medicalTests: prev.medicalTests.map((test, i) =>
        i === index ? updatedTest : test
      ),
    }));
    setEditingIndex(-1);
  };

  return (
    <Box overflow="auto">
      <Table variant="simple" size="sm">
        <Thead>
          <Tr>
            <Th>Test Name</Th>
            <Th>Price</Th>
            <Th width="100px">Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {items.map((test, index) => (
            <Tr key={index}>
              {editingIndex === index ? (
                <>
                  <Td>
                    <Input
                      value={test.name}
                      onChange={(e) =>
                        handleEdit(index, { ...test, name: e.target.value })
                      }
                      size="sm"
                    />
                  </Td>
                  <Td>
                    <Input
                      value={test.price}
                      onChange={(e) =>
                        handleEdit(index, { ...test, price: e.target.value })
                      }
                      size="sm"
                    />
                  </Td>
                  <Td>
                    <HStack spacing={2}>
                      <IconButton
                        icon={<Check className="w-4 h-4" />}
                        size="sm"
                        onClick={() => setEditingIndex(-1)}
                        colorScheme="green"
                      />
                      <IconButton
                        icon={<X className="w-4 h-4" />}
                        size="sm"
                        onClick={() => setEditingIndex(-1)}
                        colorScheme="red"
                      />
                    </HStack>
                  </Td>
                </>
              ) : (
                <>
                  <Td>{test.name}</Td>
                  <Td>{test.price}</Td>
                  <Td>
                    <HStack spacing={2}>
                      <IconButton
                        icon={<Edit2 className="w-4 h-4" />}
                        size="sm"
                        onClick={() => setEditingIndex(index)}
                      />
                      <IconButton
                        icon={<Trash2 className="w-4 h-4" />}
                        size="sm"
                        colorScheme="red"
                        onClick={() => handleRemove(index)}
                      />
                    </HStack>
                  </Td>
                </>
              )}
            </Tr>
          ))}
          {isAdding && (
            <Tr>
              <Td>
                <Input
                  placeholder="Test name"
                  value={newTest.name}
                  onChange={(e) =>
                    setNewTest({ ...newTest, name: e.target.value })
                  }
                  size="sm"
                />
              </Td>
              <Td>
                <Input
                  placeholder="Price"
                  value={newTest.price}
                  onChange={(e) =>
                    setNewTest({ ...newTest, price: e.target.value })
                  }
                  size="sm"
                />
              </Td>
              <Td>
                <HStack spacing={2}>
                  <IconButton
                    icon={<Check className="w-4 h-4" />}
                    size="sm"
                    onClick={handleAdd}
                    colorScheme="green"
                  />
                  <IconButton
                    icon={<X className="w-4 h-4" />}
                    size="sm"
                    onClick={() => {
                      setNewTest({ name: "", price: "" });
                      setIsAdding(false);
                    }}
                    colorScheme="red"
                  />
                </HStack>
              </Td>
            </Tr>
          )}
        </Tbody>
      </Table>
      {!isAdding && (
        <Button
          leftIcon={<Plus className="w-4 h-4" />}
          size="sm"
          onClick={() => setIsAdding(true)}
          mt={4}
        >
          Add New Test
        </Button>
      )}
    </Box>
  );
};

const SpecialtiesEditor = ({ items, setFormData }) => {
  const [editingIndex, setEditingIndex] = useState(-1);
  const [newSpecialty, setNewSpecialty] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const handleAdd = () => {
    if (newSpecialty.trim()) {
      setFormData((prev) => ({
        ...prev,
        specialties: [...prev.specialties, newSpecialty.trim()],
      }));
      setNewSpecialty("");
      setIsAdding(false);
    }
  };

  const handleRemove = (index) => {
    setFormData((prev) => ({
      ...prev,
      specialties: prev.specialties.filter((_, i) => i !== index),
    }));
  };

  const handleEdit = (index, value) => {
    setFormData((prev) => ({
      ...prev,
      specialties: prev.specialties.map((specialty, i) =>
        i === index ? value : specialty
      ),
    }));
    setEditingIndex(-1);
  };

  return (
    <Box overflow="auto">
      <Table variant="simple" size="sm">
        <Thead>
          <Tr>
            <Th>Specialty Name</Th>
            <Th width="100px">Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {items.map((specialty, index) => (
            <Tr key={index}>
              {editingIndex === index ? (
                <>
                  <Td>
                    <Input
                      value={specialty}
                      onChange={(e) => handleEdit(index, e.target.value)}
                      size="sm"
                    />
                  </Td>
                  <Td>
                    <HStack spacing={2}>
                      <IconButton
                        icon={<Check className="w-4 h-4" />}
                        size="sm"
                        onClick={() => setEditingIndex(-1)}
                        colorScheme="green"
                      />
                      <IconButton
                        icon={<X className="w-4 h-4" />}
                        size="sm"
                        onClick={() => setEditingIndex(-1)}
                        colorScheme="red"
                      />
                    </HStack>
                  </Td>
                </>
              ) : (
                <>
                  <Td>{specialty}</Td>
                  <Td>
                    <HStack spacing={2}>
                      <IconButton
                        icon={<Edit2 className="w-4 h-4" />}
                        size="sm"
                        onClick={() => setEditingIndex(index)}
                      />
                      <IconButton
                        icon={<Trash2 className="w-4 h-4" />}
                        size="sm"
                        colorScheme="red"
                        onClick={() => handleRemove(index)}
                      />
                    </HStack>
                  </Td>
                </>
              )}
            </Tr>
          ))}
          {isAdding && (
            <Tr>
              <Td>
                <Input
                  placeholder="Specialty name"
                  value={newSpecialty}
                  onChange={(e) => setNewSpecialty(e.target.value)}
                  size="sm"
                />
              </Td>
              <Td>
                <HStack spacing={2}>
                  <IconButton
                    icon={<Check className="w-4 h-4" />}
                    size="sm"
                    onClick={handleAdd}
                    colorScheme="green"
                  />
                  <IconButton
                    icon={<X className="w-4 h-4" />}
                    size="sm"
                    onClick={() => {
                      setNewSpecialty("");
                      setIsAdding(false);
                    }}
                    colorScheme="red"
                  />
                </HStack>
              </Td>
            </Tr>
          )}
        </Tbody>
      </Table>
      {!isAdding && (
        <Button
          leftIcon={<Plus className="w-4 h-4" />}
          size="sm"
          onClick={() => setIsAdding(true)}
          mt={4}
        >
          Add New Specialty
        </Button>
      )}
    </Box>
  );
};

export { MedicalTestsEditor, SpecialtiesEditor };
