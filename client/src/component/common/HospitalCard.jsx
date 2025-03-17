

import { Image } from "@chakra-ui/react";
import { MapPin, Star, Bookmark, Phone, Mail } from "lucide-react";

export default function HospitalCard({ hospital }) {
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

        {hospital?.medicalTests && hospital.medicalTests.length > 0 && (
          <div className="mb-3">
            <h4 className="text-sm font-medium text-gray-700 mb-1">
              Available Tests:
            </h4>
            <div className="flex flex-wrap gap-1">
              {hospital.medicalTests.slice(0, 3).map((test, index) => (
                <span
                  key={index}
                  className="px-2 py-1 text-xs rounded-full bg-green-50 text-green-600"
                >
                  {test}
                </span>
              ))}
              {hospital.medicalTests.length > 3 && (
                <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-600">
                  +{hospital.medicalTests.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            <div className="flex items-center text-yellow-400 mr-1">
              <Star className="h-4 w-4 fill-current" />
            </div>
          </div>
        </div>

        {hospital?.campaigns && hospital.campaigns.length > 0 && (
          <div className="mb-3 p-2 bg-blue-50 rounded">
            <p className="text-xs text-blue-600 font-medium">
              Active Campaign: {hospital.campaigns[0]}
            </p>
          </div>
        )}

        {hospital?.notifications && hospital.notifications.length > 0 && (
          <div className="mb-3">
            <span className="inline-block px-2 py-1 text-xs bg-red-50 text-red-600 rounded-full">
              {hospital.notifications.length} New Notification
              {hospital.notifications.length > 1 ? "s" : ""}
            </span>
          </div>
        )}

        <div className="flex justify-between gap-2">
          <button className="flex-1 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded text-sm font-medium transition-colors">
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}
