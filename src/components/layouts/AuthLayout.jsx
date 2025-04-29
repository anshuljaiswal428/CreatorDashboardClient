import React from "react";
import UI_IMG from "../../assets/images/auth-img.png";

const AuthLayout = ({ children }) => {
  return <div className="w-screen h-screen text-center px-12 pt-8 pb-12 flex flex-col justify-center">
    <h2 className="text-lg text-left mt-5 font-medium text-black">Creator Dashboard by Anshul Jaiswal</h2>
    {children}
  </div>
};

export default AuthLayout;
