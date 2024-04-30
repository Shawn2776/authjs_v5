import React from "react";
import Navbar from "./_components/Navbar";

const layout = ({ children }) => {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full gap-y-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-400 to-blue-800">
      <Navbar />
      {children}
    </div>
  );
};

export default layout;
