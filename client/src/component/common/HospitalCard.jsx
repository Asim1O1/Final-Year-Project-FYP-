import { Image } from "@chakra-ui/react";
import { MapPin, Star, Bookmark, Phone, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function HospitalCard({ hospital }) {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/hospitals/${hospital._id}`);
  };
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
      <div className="relative aspect-w-16 aspect-h-9">
        <Image
          src={hospital?.hospitalImage || "/placeholder.svg"}
          alt={hospital?.name}
          fill
          className="object-cover"
        />
      </div>

      <div className="p-4">
        <h3 className="text-lg font-bold text-blue-600 mb-1">
          {hospital?.name}
        </h3>

        <div className="flex items-center text-gray-500 mb-2">
          <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
          <span className="text-sm truncate">{hospital?.location}</span>
        </div>

        <div className="flex items-center text-gray-500 mb-2">
          <Phone className="h-4 w-4 mr-1 flex-shrink-0" />
          <span className="text-sm">{hospital?.contactNumber}</span>
        </div>

        <div className="flex items-center text-gray-500 mb-3">
          <Mail className="h-4 w-4 mr-1 flex-shrink-0" />
          <span className="text-sm truncate">{hospital?.email}</span>
        </div>

        <div className="flex flex-wrap gap-2 mb-3">
          {hospital?.specialties?.map((specialty, index) => (
            <span
              key={index}
              className="px-2 py-1 text-xs rounded-full bg-blue-50 text-blue-600"
            >
              {specialty}
            </span>
          ))}
        </div>

        <div className="flex justify-between gap-2">
          <button
            onClick={handleViewDetails}
            className="flex-1 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded text-sm font-medium transition-colors"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}
