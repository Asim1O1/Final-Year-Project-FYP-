import Navbar from "../layout/NavBar";

import { useState } from "react";
import { MapPin } from "lucide-react";

function TopSection() {
  const [location, setLocation] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    // Handle search functionality
    console.log("Searching for hospitals near:", location);
  };

  return (
    <div className="w-full] py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-blue-600 text-center mb-6">
          Find Hospitals Near You
        </h1>

        <div className="max-w-xl mx-auto mb-6">
          <form onSubmit={handleSearch} className="flex">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MapPin className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Enter your location"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-r-md transition-colors"
            >
              Search
            </button>
          </form>
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          <FilterButton icon="🔍" label="Specializations" />
          <FilterButton icon="🏥" label="Insurance" />
          <FilterButton icon="🏢" label="Facilities" />
          <FilterButton icon="⭐" label="Rating" />
          <FilterButton icon="📍" label="Distance" />
          <FilterButton icon="🕒" label="Hours" />
        </div>
      </div>
    </div>
  );
}

export default TopSection;

function FilterButton({ icon, label }) {
  return (
    <button className="flex items-center gap-1 px-3 py-1 bg-white rounded-full text-sm border border-gray-200 hover:border-blue-300 transition-colors">
      <span>{icon}</span>
      <span>{label}</span>
    </button>
  );
}
