import React from "react";

const CustomLoader = () => {
  return (
    <div className="relative w-12 h-12">
      <style jsx>{`
        @keyframes rotation {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>

      {/* Main loader with white top border and transparent right border */}
      <div
        className="w-12 h-12 rounded-full inline-block border-4 border-transparent border-t-sky-600 border-r-transparent box-border"
        style={{ animation: "rotation 1s linear infinite" }}
      >
        {/* After element with stationary bottom border */}
        <div className="absolute left-0 top-0 w-12 h-12 rounded-full border-4 border-transparent border-b-teal-500 border-l-transparent box-border"></div>
      </div>
    </div>
  );
};

export default CustomLoader;
