
// import { AdminDashboard } from './AdminDashboard';
// import { AdminLayout } from '../../layouts/AdminLayout';

// const HospitalManagement = () => {
//   const { isOpen, onOpen, onClose } = useDisclosure();
//   const [hospitals] = useState([
//     {
//       id: 1,
//       name: "Central Medical Center",
//       location: "New York, NY",
//       contactNumber: "+1 234 567 8900",
//       email: "central@medical.com",
//       specialties: ["Cardiology", "Neurology"],
//       hospitalImage: "hospital1.jpg",
//       medicalTests: [
//         { name: "Blood Test", price: 100 },
//         { name: "X-Ray", price: 200 }
//       ],
//       notifications: [
//         { message: "New equipment arrived", date: new Date() }
//       ],
//       campaigns: [
//         { 
//           title: "Free Health Check", 
//           description: "Annual free health checkup camp",
//           date: new Date(),
//           volunteers: []
//         }
//       ]
//     }
//   ]);

//   const [formData, setFormData] = useState({
//     name: '',
//     location: '',
//     contactNumber: '',
//     email: '',
//     specialties: [''],
//     hospitalImage: '',
//     medicalTests: [{ name: '', price: 0 }],
//     campaigns: [{ title: '', description: '', date: '', volunteers: [] }]
//   });

//   const addSpecialty = () => {
//     setFormData(prev => ({
//       ...prev,
//       specialties: [...prev.specialties, '']
//     }));
//   };

//   const addMedicalTest = () => {
//     setFormData(prev => ({
//       ...prev,
//       medicalTests: [...prev.medicalTests, { name: '', price: 0 }]
//     }));
//   };

//   return (
//    <AdminLayout>
//     <Container maxW="container.xl" py={6}>
//       {/* Header Section */}
//       <Flex justify="space-between" align="center" mb={6}>
//         <Heading size="lg">Hospital Management</Heading>
//         <Button 
//           colorScheme="blue" 
//           leftIcon={<Plus size={20} />}
//           onClick={onOpen}
//         >
//           Add New Hospital
//         </Button>
//       </Flex>

//       {/* Search and Filter Section */}
//       <Card mb={6}>
//         <CardBody>
//           <Flex gap={4}>
//             <InputGroup flex={1}>
//               <InputLeftElement>
//                 <Search size={20} />
//               </InputLeftElement>
//               <Input placeholder="Search hospitals..." />
//             </InputGroup>
//             <Button variant="outline">Filter</Button>
//           </Flex>
//         </CardBody>
//       </Card>

//       {/* Hospitals Table */}
//       <Card mb={6}>
//         <CardHeader>
//           <Heading size="md">Hospitals List</Heading>
//         </CardHeader>
//         <CardBody>
//           <Table variant="simple">
//             <Thead>
//               <Tr>
//                 <Th>Hospital Name</Th>
//                 <Th>Location</Th>
//                 <Th>Contact</Th>
//                 <Th>Specialties</Th>
//                 <Th>Tests</Th>
//                 <Th>Actions</Th>
//               </Tr>
//             </Thead>
//             <Tbody>
//               {hospitals.map((hospital) => (
//                 <Tr key={hospital.id}>
//                   <Td>{hospital.name}</Td>
//                   <Td>{hospital.location}</Td>
//                   <Td>{hospital.contactNumber}</Td>
//                   <Td>
//                     <Flex gap={1} flexWrap="wrap">
//                       {hospital.specialties.map((specialty, index) => (
//                         <Badge key={index} colorScheme="blue">
//                           {specialty}
//                         </Badge>
//                       ))}
//                     </Flex>
//                   </Td>
//                   <Td>{hospital.medicalTests.length} tests</Td>
//                   <Td>
//                     <Flex gap={2}>
//                       <IconButton
//                         aria-label="Edit hospital"
//                         icon={<Edit2 size={16} />}
//                         size="sm"
//                         variant="ghost"
//                       />
//                       <IconButton
//                         aria-label="Delete hospital"
//                         icon={<Trash2 size={16} />}
//                         size="sm"
//                         variant="ghost"
//                         colorScheme="red"
//                       />
//                     </Flex>
//                   </Td>
//                 </Tr>
//               ))}
//             </Tbody>
//           </Table>
//         </CardBody>
//       </Card>

//       {/* Add Hospital Modal */}
    //   <Modal isOpen={isOpen} onClose={onClose} size="4xl">
  
    //   </Modal>
//     </Container>
//     </AdminLayout>
//   );
// };

// export default HospitalManagement;


import React, { useState } from 'react';
import { Box, Button, Container, Flex, Heading, IconButton, InputGroup, InputLeftElement, useDisclosure } from '@chakra-ui/react';
import { Plus, Search } from 'lucide-react';
import { AdminLayout } from '../../layouts/AdminLayout';
import AddHospitalForm from '../../component/admin/hospitals/AddHospitalForm';
import HospitalList from '../../component/admin/hospitals/HospitalLists';
import { Input } from 'antd';

const HospitalManagement = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [hospitals] = useState([
    {
      id: 1,
      name: "Central Medical Center",
      location: "New York, NY",
      contactNumber: "+1 234 567 8900",
      email: "central@medical.com",
      specialties: ["Cardiology", "Neurology"],
      hospitalImage: "hospital1.jpg",
      medicalTests: [
        { name: "Blood Test", price: 100 },
        { name: "X-Ray", price: 200 }
      ],
      notifications: [
        { message: "New equipment arrived", date: new Date() }
      ],
      campaigns: [
        { 
          title: "Free Health Check", 
          description: "Annual free health checkup camp",
          date: new Date(),
          volunteers: []
        }
      ]
    }
  ]);

  const [formData, setFormData] = useState({
    name: '',
    location: '',
    contactNumber: '',
    email: '',
    specialties: [''],
    hospitalImage: '',
    medicalTests: [{ name: '', price: 0 }],
    campaigns: [{ title: '', description: '', date: '', volunteers: [] }]
  });

  const handleSaveHospital = () => {
    // Handle hospital saving logic here
    onClose(); // Close modal after saving
  };

  return (
    <AdminLayout>
      <Container maxW="container.xl" py={6}>
        <Flex justify="space-between" align="center" mb={6}>
          <Heading size="lg">Hospital Management</Heading>
          <Button colorScheme="blue" leftIcon={<Plus size={20} />} onClick={onOpen}>
            Add New Hospital
          </Button>
        </Flex>

        {/* Search Section */}
        <Box mb={6}>
          <Flex gap={4}>
            <InputGroup flex={1}>
              <InputLeftElement>
                <Search size={20} />
              </InputLeftElement>
              <Input placeholder="Search hospitals..." />
            </InputGroup>
            <Button variant="outline">Filter</Button>
          </Flex>
        </Box>

        {/* Hospital List */}
        <HospitalList hospitals={hospitals} onEdit={() => {}} onDelete={() => {}} />

        {/* Add Hospital Modal */}
        <AddHospitalForm
          isOpen={isOpen}
          onClose={onClose}
          formData={formData}
          setFormData={setFormData}
          onSave={handleSaveHospital}
        />
      </Container>
    </AdminLayout>
  );
};

export default HospitalManagement;
