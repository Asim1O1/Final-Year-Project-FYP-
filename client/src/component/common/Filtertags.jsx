import React from 'react';
import { Tag, HStack } from '@chakra-ui/react';

export const FilterTags = () => {
  const filters = [
    { icon: "🏥", label: "Specializations" },
    { icon: "💉", label: "Insurance" },
    { icon: "🏗️", label: "Facilities" },
    { icon: "⭐", label: "Rating" },
    { icon: "📍", label: "Distance" },
    { icon: "🕒", label: "Hours" },
  ];

  return (
    <HStack spacing={4} className="flex flex-wrap justify-center my-6">
      {filters.map((filter) => (
        <Tag
          key={filter.label}
          size="lg"
          variant="subtle"
          className="px-4 py-2 cursor-pointer hover:bg-gray-100"
        >
          <span className="mr-2">{filter.icon}</span>
          {filter.label}
        </Tag>
      ))}
    </HStack>
  );
};