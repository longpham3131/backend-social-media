import SNWidgetBox from "@/components/SNWidgetBox";
import React from "react";
import moment from "moment";
const About = ({ user }) => {
  // const profile
  return (
    <>
      <SNWidgetBox
        title={"About Me"}
        content={
          <>
            <p>Welcome to my profile!</p>
            <div className="flex flex-col gap-[14px]">
              <div className="flex flex-col gap-[10px] justify-between">
                <p className=" text-color-text-alt">Joined</p>
                <p>{moment(user.createAt).format("MMMM Do YYYY")}</p>
              </div>
              <div className="flex flex-col gap-[10px] justify-between">
                <p className=" text-color-text-alt">From</p>
                <p>
                  {user?.address
                    ? user?.address?.district + ", " + user?.address?.province
                    : "No results found"}
                </p>
              </div>
            </div>
          </>
        }
      />
      <div className=" col-span-2">
        <SNWidgetBox
          title={"Interests"}
          content={
            <div className="flex flex-col gap-[26px]">
              {user?.interests?.map((item, index) => (
                <div key={index}>
                  <p className=" text-color-text text-[0.875rem] font-bold">
                    {item.title}
                  </p>
                  <p className="mt-[10px]">{item.context}</p>
                </div>
              )) ?? <p>No results found</p>}
            </div>
          }
        />
      </div>
      <SNWidgetBox
        title={"Personal Info"}
        content={
          <>
            <div className="flex flex-col gap-[14px]">
              <div className="flex flex-col gap-[10px] justify-between">
                <p className=" text-color-text-alt">Email</p>
                <p>{user?.email}</p>
              </div>
              <div className="flex flex-col gap-[10px] justify-between">
                <p className=" text-color-text-alt">Occupation</p>
                <p>{user?.occupation ?? "No results found"}</p>
              </div>
              <div className="flex flex-col gap-[10px] justify-between">
                <p className=" text-color-text-alt">Birthplace</p>
                <p>
                  {user?.birthplace
                    ? user?.birthplace?.district +
                      ", " +
                      user?.birthplace?.province
                    : "No results found"}
                </p>
              </div>
            </div>
          </>
        }
      />
    </>
  );
};
export default About;
