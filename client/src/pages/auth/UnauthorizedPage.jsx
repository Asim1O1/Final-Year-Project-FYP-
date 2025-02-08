import React, { useEffect } from "react";
import { ShieldAlert, Hospital, KeyRound } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { resetAuthState } from "../../features/auth/authSlice";
import { useDispatch } from "react-redux";

const UnauthorizedPage = ({
  contentType = "Medical Resource",
  requiredRole = "Authorized Healthcare Professional",
}) => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(resetAuthState());
  }, [dispatch]);
  const navigate = useNavigate();

  const handleLoginClick = () => {
    console.log("ENTERED THE HANDLE LOGIN CLICK AND NAVIGATIONG TO LOGIN PAGE")
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-sky-50 p-4">
      <div className="max-w-xl w-full bg-white shadow-2xl rounded-2xl border border-sky-100 overflow-hidden">
        <div className="bg-sky-500 text-white p-6 flex items-center space-x-4">
          <ShieldAlert size={40} className="text-white" />
          <h1 className="text-2xl font-bold">Access Restricted</h1>
        </div>

        <div className="p-8 space-y-6">
          <div className="flex items-center space-x-4 bg-sky-50 p-4 rounded-lg border border-sky-200">
            <Hospital size={40} className="text-sky-600" />
            <div>
              <h2 className="font-semibold text-xl text-sky-800">
                Secure Healthcare Platform
              </h2>
              <p className="text-gray-600">
                Protecting sensitive medical information
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <KeyRound size={20} className="text-yellow-600" />
                <span className="font-semibold text-yellow-800">
                  Access Requirements
                </span>
              </div>
              <p className="text-gray-700">
                This {contentType} requires special authorization. Only{" "}
                <span className="font-bold text-yellow-900">
                  {requiredRole}
                </span>{" "}
                can access this resource.
              </p>
            </div>

            <div className="space-y-2">
              <button
                onClick={handleLoginClick}
                className="w-full bg-sky-600 text-white py-3 rounded-lg hover:bg-sky-700 transition-colors font-semibold flex items-center justify-center space-x-2"
              >
                <KeyRound size={20} />
                <span>Login to Access</span>
              </button>

              <p className="text-center text-sm text-gray-500 mt-2">
                Forgotten credentials? Contact your system administrator.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

UnauthorizedPage.propTypes = {
  contentType: PropTypes.string,
  requiredRole: PropTypes.string,
};

UnauthorizedPage.defaultProps = {
  contentType: "Medical Resource",
  requiredRole: "Authorized Healthcare Professional",
};

export default UnauthorizedPage;
