import React from "react";

const SNWidgetBox = ({ title, content }) => {
  return (
    <div className=" bg-white px-[28px] py-[32px] rounded-xl shadow-color-box-shadow relative h-fit">
      {/* WIDGET BOX TITLE */}
      <p className=" text-[1rem] font-bold text-[var(--color-text)] leading-[1em]">
        {title}
      </p>
      {/* WIDGET BOX CONTENT */}
      <div className="flex flex-col gap-[22px] mt-[36px]">{content}</div>
    </div>
  );
};

export default SNWidgetBox;
