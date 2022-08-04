import React from "react";
const AuthPage = ({ slot }) => {
  return (
    <div className="flex">
      <div className="bg-welcome-page h-screen w-full basis-[50%] bg-no-repeat">
        <div className="flex justify-center items-center h-full">
          <div className="w-[55%] text-center">
            <p className="text-[1.5rem] text-white font-medium">WELCOME TO</p>
            <p className=" font-secondary font-bold text-[6.5rem] text-white leading-[1em]">
              VIKINGER
            </p>
          </div>
        </div>
      </div>
      <div className="flex justify-center items-center h-sreen basis-[50%]">
        <div className="flex flex-col w-full text-center">
          <img
            src="images/logo.png"
            alt="logo"
            className="w-[4rem] h-[4rem] mx-auto"
          />
          <p className="pt-[3rem] text-[1.625rem] font-semi-bold">Welcome</p>
          <div className="mx-auto mt-[4rem] w-[40%]">{slot}</div>
        </div>
      </div>
    </div>
  );
};
export default AuthPage;
