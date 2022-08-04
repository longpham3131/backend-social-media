import React from "react";
import { FrownOutlined } from "@ant-design/icons";
const SNNoResult = () => {
  return (
    <div className="w-full flex items-center justify-center text-center">
      <div>
        <FrownOutlined
          style={{ fontSize: "170px", color: "var(--color-icon)" }}
        />
        <p className="mt-[54px] text-color-text text-[1.25rem] font-bold ">
          No result found
        </p>
        <p className="mt-[12px] text-color-text text-[1rem] font-medium ">
          Please try with another filter!
        </p>
      </div>
    </div>
  );
};

export default SNNoResult;
