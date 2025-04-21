import { useState, useEffect } from "react";
import { MapPin, Search, Filter, X, Trash2, RefreshCw } from "lucide-react";
import { useDispatch } from "react-redux";

import { fetchAllHospitals } from "../../features/hospital/hospitalSlice";
import PREDEFINED_SPECIALTIES from "../../../../constants/Specialties.js";

function TopSection() {
  const dispatch = useDispatch();
  const [location, setLocation] = useState("");
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState({
    speciality: null,
    testAvailable: false,
  });
  const [sort, setSort] = useState("createdAt");

  // Fetch all hospitals when component mounts
  useEffect(() => {
    dispatch(fetchAllHospitals({ page: 1 }));
  }, [dispatch]);

  // Handler for the main search form
  const handleSearch = (e) => {
    if (e) e.preventDefault();

    // Only include non-empty parameters
    const searchParams = {
      page: 1,
      sort,
    };

    if (location) searchParams.location = location;
    if (search) searchParams.search = search;
    if (activeFilters.speciality)
      searchParams.speciality = activeFilters.speciality;
    if (activeFilters.testAvailable) searchParams.testAvailable = "true";

    dispatch(fetchAllHospitals(searchParams));
  };

  // Handle location input change with auto-refresh on clear
  const handleLocationChange = (e) => {
    const newLocation = e.target.value;
    setLocation(newLocation);

    // If field was cleared, refresh results
    if (newLocation === "" && location !== "") {
      setTimeout(() => {
        dispatch(
          fetchAllHospitals({
            page: 1,
            search,
            sort,
            ...activeFilters,
          })
        );
      }, 300);
    }
  };

  // Handle search input change with auto-refresh on clear
  const handleSearchChange = (e) => {
    const newSearch = e.target.value;
    setSearch(newSearch);

    // If field was cleared, refresh results
    if (newSearch === "" && search !== "") {
      setTimeout(() => {
        dispatch(
          fetchAllHospitals({
            page: 1,
            location,
            sort,
            ...activeFilters,
          })
        );
      }, 300);
    }
  };

  // Handler for specialty filter
  const handleSpecialityFilter = (speciality) => {
    const newFilters = {
      ...activeFilters,
      speciality: activeFilters.speciality === speciality ? null : speciality,
    };

    setActiveFilters(newFilters);

    const searchParams = { page: 1, sort };
    if (location) searchParams.location = location;
    if (search) searchParams.search = search;
    if (newFilters.speciality) searchParams.speciality = newFilters.speciality;
    if (newFilters.testAvailable) searchParams.testAvailable = "true";

    dispatch(fetchAllHospitals(searchParams));
  };

  // Handler for test availability filter
  const toggleTestAvailableFilter = () => {
    const newTestAvailable = !activeFilters.testAvailable;
    const newFilters = {
      ...activeFilters,
      testAvailable: newTestAvailable,
    };

    setActiveFilters(newFilters);

    const searchParams = { page: 1, sort };
    if (location) searchParams.location = location;
    if (search) searchParams.search = search;
    if (newFilters.speciality) searchParams.speciality = newFilters.speciality;
    if (newFilters.testAvailable) searchParams.testAvailable = "true";

    dispatch(fetchAllHospitals(searchParams));
  };

  // Handler for changing sort order
  const handleSortChange = (e) => {
    const newSort = e.target.value;
    setSort(newSort);

    const searchParams = { page: 1, sort: newSort };
    if (location) searchParams.location = location;
    if (search) searchParams.search = search;
    if (activeFilters.speciality)
      searchParams.speciality = activeFilters.speciality;
    if (activeFilters.testAvailable) searchParams.testAvailable = "true";

    dispatch(fetchAllHospitals(searchParams));
  };

  // Clear specific input fields
  const clearLocationInput = () => {
    setLocation("");

    // Refresh results without location filter
    const searchParams = { page: 1, sort };
    if (search) searchParams.search = search;
    if (activeFilters.speciality)
      searchParams.speciality = activeFilters.speciality;
    if (activeFilters.testAvailable) searchParams.testAvailable = "true";

    dispatch(fetchAllHospitals(searchParams));
  };

  const clearSearchInput = () => {
    setSearch("");

    // Refresh results without search filter
    const searchParams = { page: 1, sort };
    if (location) searchParams.location = location;
    if (activeFilters.speciality)
      searchParams.speciality = activeFilters.speciality;
    if (activeFilters.testAvailable) searchParams.testAvailable = "true";

    dispatch(fetchAllHospitals(searchParams));
  };

  // Clear all filters
  const clearAllFilters = () => {
    setLocation("");
    setSearch("");
    setActiveFilters({
      speciality: null,
      testAvailable: false,
    });
    setSort("createdAt");

    dispatch(fetchAllHospitals({ page: 1 }));

    // Close filter panel after clearing
    setShowFilters(false);
  };

  // Check if any filters are active
  const hasActiveFilters = Boolean(
    location ||
      search ||
      activeFilters.speciality ||
      activeFilters.testAvailable
  );

  return (
    <div className="w-full py-8 px-4 bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-blue-600 text-center mb-6">
          Find Hospitals Near You
        </h1>

        {/* Main Search Form */}
        <div className="max-w-2xl mx-auto mb-8">
          <form
            onSubmit={handleSearch}
            className="flex flex-col md:flex-row gap-2 shadow-md rounded-lg overflow-hidden"
          >
            {/* Location search */}
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MapPin className="h-5 w-5 text-blue-400" />
              </div>
              <input
                type="text"
                placeholder="Enter your location"
                className="block w-full pl-10 pr-10 py-3 border-0 focus:ring-2 focus:ring-blue-500 bg-white"
                value={location}
                onChange={handleLocationChange}
              />
              {location && (
                <button
                  type="button"
                  onClick={clearLocationInput}
                  className="absolute inset-y-0 right-0 mr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Hospital name search */}
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-blue-400" />
              </div>
              <input
                type="text"
                placeholder="Search hospital name"
                className="block w-full pl-10 pr-10 py-3 border-0 border-l md:border-l border-gray-200 focus:ring-2 focus:ring-blue-500 bg-white"
                value={search}
                onChange={handleSearchChange}
              />
              {search && (
                <button
                  type="button"
                  onClick={clearSearchInput}
                  className="absolute inset-y-0 right-0 mr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 transition-colors flex items-center justify-center gap-2"
            >
              <Search className="h-5 w-5" />
              <span className="hidden md:inline">Search</span>
            </button>
          </form>
        </div>

        {/* Filter & Sort Controls */}
        <div className="flex flex-wrap justify-center gap-4 mb-6">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2 border rounded-full transition-colors ${
              showFilters
                ? "bg-blue-50 border-blue-300 text-blue-700"
                : "bg-white border-gray-300 hover:border-blue-400"
            }`}
          >
            <Filter className="h-4 w-4" />
            <span>Filters</span>
            {hasActiveFilters && (
              <span className="bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {(activeFilters.speciality ? 1 : 0) +
                  (activeFilters.testAvailable ? 1 : 0) +
                  (location ? 1 : 0) +
                  (search ? 1 : 0)}
              </span>
            )}
          </button>

          {/* Sort dropdown */}
          <div className="relative">
            <select
              value={sort}
              onChange={handleSortChange}
              className="appearance-none px-4 py-2 bg-white border border-gray-300 rounded-full hover:border-blue-400 transition-colors pr-8"
            >
              <option value="createdAt">Newest First</option>
              <option value="-createdAt">Oldest First</option>
              <option value="name">Name (A-Z)</option>
              <option value="-name">Name (Z-A)</option>
              <option value="rating">Highest Rating</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg
                className="fill-current h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>

          {/* Reset all filters button */}
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-full hover:bg-red-100 transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Reset All</span>
            </button>
          )}
        </div>

        {/* Expanded Filters Panel */}
        {showFilters && (
          <div className="mb-8 p-6 bg-white rounded-lg shadow-md max-w-3xl mx-auto border border-gray-100">
            {/* Specialty Filters */}
            <div className="mb-6">
              <h3 className="font-medium text-gray-800 mb-3 flex items-center">
                <span className="mr-2">Specialties</span>
                {activeFilters.speciality && (
                  <button
                    onClick={() =>
                      handleSpecialityFilter(activeFilters.speciality)
                    }
                    className="text-xs text-blue-600 hover:text-blue-800"
                  >
                    (Clear)
                  </button>
                )}
              </h3>
              <div className="flex flex-wrap gap-2">
                {PREDEFINED_SPECIALTIES.map((speciality) => (
                  <button
                    key={speciality}
                    onClick={() => handleSpecialityFilter(speciality)}
                    className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                      activeFilters.speciality === speciality
                        ? "bg-blue-100 border-blue-300 text-blue-700 font-medium shadow-sm"
                        : "bg-white border-gray-200 hover:border-blue-300 hover:bg-blue-50"
                    }`}
                  >
                    {speciality}
                  </button>
                ))}
              </div>
            </div>

            {/* Test Availability Filter */}
            <div className="mb-4">
              <h3 className="font-medium text-gray-800 mb-3">
                Additional Filters
              </h3>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={toggleTestAvailableFilter}
                  className={`px-3 py-1.5 rounded-full text-sm border transition-colors flex items-center gap-1 ${
                    activeFilters.testAvailable
                      ? "bg-blue-100 border-blue-300 text-blue-700 font-medium shadow-sm"
                      : "bg-white border-gray-200 hover:border-blue-300 hover:bg-blue-50"
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M19 2H5a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2Z" />
                    <path d="M9 9h6" />
                    <path d="M9 13h6" />
                    <path d="M9 17h6" />
                  </svg>
                  <span>Has Medical Tests</span>
                </button>
              </div>
            </div>

            {/* Clear filters button */}
            {hasActiveFilters && (
              <div className="mt-6 pt-4 border-t border-gray-100 text-center">
                <button
                  onClick={clearAllFilters}
                  className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-full hover:bg-red-100 transition-colors mx-auto"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>Clear all filters</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className="max-w-3xl mx-auto mb-8 flex flex-wrap items-center gap-2 px-4">
            <span className="text-sm text-gray-500">Active filters:</span>

            {location && (
              <span className="bg-blue-50 text-blue-700 text-sm px-3 py-1 rounded-full flex items-center gap-1 border border-blue-100">
                <MapPin className="h-3 w-3" />
                {location}
                <button
                  onClick={clearLocationInput}
                  className="ml-1 text-blue-500 hover:text-blue-700"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}

            {search && (
              <span className="bg-blue-50 text-blue-700 text-sm px-3 py-1 rounded-full flex items-center gap-1 border border-blue-100">
                <Search className="h-3 w-3" />
                {search}
                <button
                  onClick={clearSearchInput}
                  className="ml-1 text-blue-500 hover:text-blue-700"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}

            {activeFilters.speciality && (
              <span className="bg-blue-50 text-blue-700 text-sm px-3 py-1 rounded-full flex items-center gap-1 border border-blue-100">
                {activeFilters.speciality}
                <button
                  onClick={() =>
                    handleSpecialityFilter(activeFilters.speciality)
                  }
                  className="ml-1 text-blue-500 hover:text-blue-700"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}

            {activeFilters.testAvailable && (
              <span className="bg-blue-50 text-blue-700 text-sm px-3 py-1 rounded-full flex items-center gap-1 border border-blue-100">
                Has Medical Tests
                <button
                  onClick={toggleTestAvailableFilter}
                  className="ml-1 text-blue-500 hover:text-blue-700"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}

            <button
              onClick={clearAllFilters}
              className="text-sm text-red-500 hover:text-red-700 ml-auto flex items-center gap-1"
            >
              <RefreshCw className="h-3 w-3" />
              Reset All
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default TopSection;
