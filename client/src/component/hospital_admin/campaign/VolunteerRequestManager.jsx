import React, { useState, useEffect } from "react";
import { Loader, Check, X, AlertCircle } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchVolunteerRequests,
  handleVolunteerRequest,
} from "../../../features/campaign/campaignSlice";
import { Box, ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import Pagination from "../../../utils/Pagination";
const VolunteerRequestsManager = () => {
  const dispatch = useDispatch();
  const [expandedRequests, setExpandedRequests] = useState({});
  const { volunteerRequests, isLoading, error } = useSelector(
    (state) => state?.campaignSlice
  );
  const { currentPage, totalPages } = useSelector(
    (state) => state?.campaignSlice?.volunteerRequests
  );

  const [processingIds, setProcessingIds] = useState([]);

  useEffect(() => {
    console.log("eneterd the user effect to fetch all volunteer requests");
    dispatch(fetchVolunteerRequests({ page: 1, limit: 10 }));
  }, [dispatch]);

  const toggleRequestDetails = (requestId) => {
    setExpandedRequests((prev) => ({
      ...prev,
      [requestId]: !prev[requestId],
    }));
  };

  const handleRequest = async (campaignId, requestId, status) => {
    const requestIdentifier = `${campaignId}-${requestId}`;
    setProcessingIds((prev) => [...prev, requestIdentifier]);

    try {
      await dispatch(
        handleVolunteerRequest({ campaignId, requestId, status })
      ).unwrap();

      // No need to manually update state - Redux will handle it
    } catch (err) {
      console.error("Failed to handle request:", err);
    } finally {
      setProcessingIds((prev) => prev.filter((id) => id !== requestIdentifier));
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= volunteerRequests?.totalPages) {
      dispatch(fetchVolunteerRequests({ page: newPage, limit: 10 }));
    }
  };

  if (isLoading && volunteerRequests.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader className="w-8 h-8 animate-spin text-blue-500" />
        <span className="ml-2">Loading volunteer requests...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64 text-red-500">
        <AlertCircle className="w-8 h-8 mr-2" />
        <span>{error.message || "Error loading requests"}</span>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Volunteer Requests</h1>

      {volunteerRequests.data?.length === 0 ? (
        <div className="text-center p-8 text-gray-500">
          No volunteer requests found.
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-3 text-left border-b">Campaign</th>
                  <th className="p-3 text-left border-b">Volunteer</th>
                  <th className="p-3 text-left border-b">Requested At</th>
                  <th className="p-3 text-left border-b">Status</th>
                  <th className="p-3 text-left border-b">Actions</th>
                </tr>
              </thead>
              <tbody>
                {volunteerRequests.data?.map((campaign) =>
                  campaign.volunteerRequests.map((request) => {
                    const requestIdentifier = `${campaign._id}-${request._id}`;
                    const isProcessing =
                      processingIds.includes(requestIdentifier);
                    const isExpanded = expandedRequests[request._id];

                    return (
                      <React.Fragment key={request._id}>
                        <tr className="hover:bg-gray-50">
                          <td className="p-3 border-b">
                            <div className="font-medium">{campaign.title}</div>
                            <div className="text-sm text-gray-500 mt-1">
                              {new Date(campaign.date).toLocaleDateString()} at{" "}
                              {campaign.location}
                            </div>
                          </td>
                          <td className="p-3 border-b">
                            <div>{request.user.name}</div>
                            <div className="text-sm text-gray-500">
                              {request.user.email}
                            </div>
                          </td>
                          <td className="p-3 border-b">
                            {new Date(request.requestedAt).toLocaleDateString()}
                          </td>
                          <td className="p-3 border-b">
                            <span
                              className={`px-2 py-1 rounded text-sm ${
                                request.status === "pending"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : request.status === "approved"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {request.status.charAt(0).toUpperCase() +
                                request.status.slice(1)}
                            </span>
                          </td>
                          <td className="p-3 border-b">
                            <div className="flex space-x-2">
                              {request.status === "pending" ? (
                                <>
                                  <button
                                    onClick={() =>
                                      handleRequest(
                                        campaign._id,
                                        request._id,
                                        "approved"
                                      )
                                    }
                                    disabled={isProcessing}
                                    className="flex items-center px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-300"
                                  >
                                    {isProcessing ? (
                                      <Loader className="w-4 h-4 animate-spin mr-1" />
                                    ) : (
                                      <Check className="w-4 h-4 mr-1" />
                                    )}
                                    Approve
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleRequest(
                                        campaign._id,
                                        request._id,
                                        "rejected"
                                      )
                                    }
                                    disabled={isProcessing}
                                    className="flex items-center px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 disabled:bg-gray-300"
                                  >
                                    {isProcessing ? (
                                      <Loader className="w-4 h-4 animate-spin mr-1" />
                                    ) : (
                                      <X className="w-4 h-4 mr-1" />
                                    )}
                                    Reject
                                  </button>
                                </>
                              ) : (
                                <span className="text-gray-500">
                                  {request.status === "approved"
                                    ? "Approved"
                                    : "Rejected"}
                                </span>
                              )}
                              <button
                                onClick={() =>
                                  toggleRequestDetails(request._id)
                                }
                                className="px-2 py-1 ml-2 bg-gray-100 rounded hover:bg-gray-200"
                              >
                                {isExpanded ? (
                                  <ChevronUpIcon className="w-4 h-4" />
                                ) : (
                                  <ChevronDownIcon className="w-4 h-4" />
                                )}
                              </button>
                            </div>
                          </td>
                        </tr>
                        {isExpanded && (
                          <tr>
                            <td colSpan="5" className="p-0 border-b">
                              <div className="bg-gray-50 p-4">
                                <h3 className="font-semibold mb-2">
                                  Volunteer Questions & Answers
                                </h3>
                                {request.answers &&
                                request.answers.length > 0 ? (
                                  <div className="space-y-3">
                                    {request.answers.map((answer, index) => (
                                      <div
                                        key={index}
                                        className="bg-white p-3 rounded shadow-sm"
                                      >
                                        <div className="font-medium">
                                          {answer.question ||
                                            `Question ${index + 1}`}
                                        </div>
                                        <div className="mt-1">
                                          {typeof answer.answer === "boolean"
                                            ? answer.answer
                                              ? "Yes"
                                              : "No"
                                            : answer.answer}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <div className="text-gray-500">
                                    No answers provided
                                  </div>
                                )}
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          <Box mt={6}>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages || 1}
              onPageChange={handlePageChange}
            />
          </Box>
        </>
      )}
    </div>
  );
};

export default VolunteerRequestsManager;
