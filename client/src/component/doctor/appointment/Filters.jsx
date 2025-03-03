// src/components/Filters.js
import React from 'react';
import { Search, Calendar, Filter, ChevronDown } from "lucide-react";

const Filters = ({
  searchQuery,
  setSearchQuery,
  dateFilter,
  setDateFilter,
  statusFilter,
  setStatusFilter,
}) => (
  <div className="flex flex-wrap items-center justify-between mb-6">
    <div className="flex items-center space-x-4 mb-2">
      <div className="relative">
        <input
          type="text"
          placeholder="Search patients..."
          className="pl-8 pr-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Search size={16} className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
      </div>

      <div className="relative">
        <input
          type="date"
          className="pl-8 pr-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
        />
        <Calendar size={16} className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
      </div>

      <div className="relative">
        <select
          className="pl-8 pr-8 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 appearance-none"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="confirmed">Confirmed</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <Filter size={16} className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <ChevronDown size={16} className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
      </div>
    </div>
  </div>
);

export default Filters;
