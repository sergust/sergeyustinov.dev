import React from "react";

export const Logo: React.FC = () => {
  return (
    <div className="flex items-baseline">
      <span className="text-xl font-bold bg-gradient-to-r from-blue-700 to-blue-900 bg-clip-text text-transparent">
        Sergey<span className="text-blue-700">Ustinov</span>
      </span>
      <span className="text-sm font-medium text-blue-600 ml-0.5 opacity-70">
        .dev
      </span>
      <span className="relative ml-1 group-hover:animate-bounce">
        <span className="absolute -top-0.5 w-1.5 h-1.5 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
      </span>
    </div>
  );
};
