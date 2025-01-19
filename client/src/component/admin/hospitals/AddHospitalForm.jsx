import React, { useState } from "react";
import {
  Box,
  Button,
  Input,
  Card,
  CardBody,
  Heading,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  Grid,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  VStack,
  HStack,
  NumberInput,
  NumberInputField,
  IconButton,
  Textarea,
} from "@chakra-ui/react";
const AddHospitalForm = ({
  isOpen,
  onClose,
  formData,
  setFormData,
  onSave,
}) => {
  const addSpecialty = () => {
    setFormData((prev) => ({
      ...prev,
      specialties: [...prev.specialties, ""],
    }));
  };

  const addMedicalTest = () => {
    setFormData((prev) => ({
      ...prev,
      medicalTests: [...prev.medicalTests, { name: "", price: 0 }],
    }));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="4xl">
      <ModalOverlay />
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add New Hospital</ModalHeader>
        <ModalBody>
          <Tabs>
            <TabList>
              <Tab>Basic Info</Tab>
              <Tab>Specialties & Tests</Tab>
              <Tab>Campaigns</Tab>
            </TabList>

            <TabPanels>
              <TabPanel>
                <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                  <FormControl isRequired>
                    <FormLabel>Hospital Name</FormLabel>
                    <Input placeholder="Enter hospital name" />
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel>Location</FormLabel>
                    <Input placeholder="Enter location" />
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel>Contact Number</FormLabel>
                    <Input placeholder="Enter contact number" />
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel>Email</FormLabel>
                    <Input placeholder="Enter email" type="email" />
                  </FormControl>
                  <FormControl gridColumn="span 2">
                    <FormLabel>Hospital Image URL</FormLabel>
                    <Input placeholder="Enter image URL" />
                  </FormControl>
                </Grid>
              </TabPanel>

              <TabPanel>
                <VStack align="stretch" spacing={4}>
                  <Box>
                    <Heading size="sm" mb={2}>
                      Specialties
                    </Heading>
                    {formData.specialties.map((specialty, index) => (
                      <HStack key={index} mb={2}>
                        <Input
                          placeholder="Enter specialty"
                          value={specialty}
                          onChange={(e) => {
                            const newSpecialties = [...formData.specialties];
                            newSpecialties[index] = e.target.value;
                            setFormData({
                              ...formData,
                              specialties: newSpecialties,
                            });
                          }}
                        />
                        <IconButton
                          aria-label="Remove specialty"
                          icon={<X size={16} />}
                          onClick={() => {
                            const newSpecialties = formData.specialties.filter(
                              (_, i) => i !== index
                            );
                            setFormData({
                              ...formData,
                              specialties: newSpecialties,
                            });
                          }}
                        />
                      </HStack>
                    ))}
                    <Button size="sm" onClick={addSpecialty}>
                      Add Specialty
                    </Button>
                  </Box>

                  <Box>
                    <Heading size="sm" mb={2}>
                      Medical Tests
                    </Heading>
                    {formData.medicalTests.map((test, index) => (
                      <HStack key={index} mb={2}>
                        <Input
                          placeholder="Test name"
                          value={test.name}
                          onChange={(e) => {
                            const newTests = [...formData.medicalTests];
                            newTests[index] = { ...test, name: e.target.value };
                            setFormData({
                              ...formData,
                              medicalTests: newTests,
                            });
                          }}
                        />
                        <NumberInput min={0}>
                          <NumberInputField
                            placeholder="Price"
                            value={test.price}
                            onChange={(e) => {
                              const newTests = [...formData.medicalTests];
                              newTests[index] = {
                                ...test,
                                price: Number(e.target.value),
                              };
                              setFormData({
                                ...formData,
                                medicalTests: newTests,
                              });
                            }}
                          />
                        </NumberInput>
                        <IconButton
                          aria-label="Remove test"
                          icon={<X size={16} />}
                          onClick={() => {
                            const newTests = formData.medicalTests.filter(
                              (_, i) => i !== index
                            );
                            setFormData({
                              ...formData,
                              medicalTests: newTests,
                            });
                          }}
                        />
                      </HStack>
                    ))}
                    <Button size="sm" onClick={addMedicalTest}>
                      Add Medical Test
                    </Button>
                  </Box>
                </VStack>
              </TabPanel>

              <TabPanel>
                <VStack align="stretch" spacing={4}>
                  {formData.campaigns.map((campaign, index) => (
                    <Card key={index}>
                      <CardBody>
                        <VStack spacing={4}>
                          <FormControl>
                            <FormLabel>Campaign Title</FormLabel>
                            <Input
                              placeholder="Enter campaign title"
                              value={campaign.title}
                              onChange={(e) => {
                                const newCampaigns = [...formData.campaigns];
                                newCampaigns[index] = {
                                  ...campaign,
                                  title: e.target.value,
                                };
                                setFormData({
                                  ...formData,
                                  campaigns: newCampaigns,
                                });
                              }}
                            />
                          </FormControl>
                          <FormControl>
                            <FormLabel>Description</FormLabel>
                            <Textarea
                              placeholder="Enter campaign description"
                              value={campaign.description}
                              onChange={(e) => {
                                const newCampaigns = [...formData.campaigns];
                                newCampaigns[index] = {
                                  ...campaign,
                                  description: e.target.value,
                                };
                                setFormData({
                                  ...formData,
                                  campaigns: newCampaigns,
                                });
                              }}
                            />
                          </FormControl>
                          <FormControl>
                            <FormLabel>Date</FormLabel>
                            <Input
                              type="date"
                              value={campaign.date}
                              onChange={(e) => {
                                const newCampaigns = [...formData.campaigns];
                                newCampaigns[index] = {
                                  ...campaign,
                                  date: e.target.value,
                                };
                                setFormData({
                                  ...formData,
                                  campaigns: newCampaigns,
                                });
                              }}
                            />
                          </FormControl>
                        </VStack>
                      </CardBody>
                    </Card>
                  ))}
                  <Button
                    size="sm"
                    onClick={() => {
                      setFormData({
                        ...formData,
                        campaigns: [
                          ...formData.campaigns,
                          {
                            title: "",
                            description: "",
                            date: "",
                            volunteers: [],
                          },
                        ],
                      });
                    }}
                  >
                    Add Campaign
                  </Button>
                </VStack>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button colorScheme="blue">Save Hospital</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AddHospitalForm;
