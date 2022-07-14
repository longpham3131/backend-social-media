import { Carousel } from "antd";
import classNames from "classnames";
import React from "react";
import { useDispatch } from "react-redux";
import { setModalPost } from "@/store/modalPostSlice";
import SNImage from "./SNImage";

const SNPostAttachments = ({ attachments }) => {
  const dispatch = useDispatch();
  const inLastItem = (index) => {
    return attachments.length > 5 && index === 4;
  };
  const handleRenderImage = () => {
    switch (attachments.length) {
      case 1: {
        return (
          <SNImage
            iconPlaySize={32}
            isControlsVideo={true}
            media={attachments[0]}
            hasRounded={false}
          />
        );
      }
      case 2:
      case 4: {
        return (
          <div className="grid grid-cols-2 gap-[6px]">
            {attachments.map((att, index) => (
              <SNImage media={att} key={index} />
            ))}
          </div>
        );
      }
      case 3: {
        return (
          <div className="grid grid-cols-3 gap-[6px]">
            {attachments.map((att, index) => (
              <SNImage media={att} key={index} />
            ))}
          </div>
        );
      }

      default:
        return (
          <div className="grid grid-cols-6 gap-[6px]">
            {attachments.map((att, index) => (
              <div
                key={index}
                className={classNames({
                  "col-span-3": index === 0 || index === 1,
                  "col-span-2": index !== 0 && index !== 1,
                  hidden: index > 4,
                })}
              >
                {" "}
                <SNImage
                  media={att}
                  isHiddenOverlay={inLastItem(index)}
                  quantityImageMore={
                    inLastItem(index)
                      ? attachments.length - index - 1
                      : undefined
                  }
                />
              </div>
            ))}
          </div>
        );
    }
  };
  return (
    <div className={classNames({ "px-[28px]": attachments.length > 1 })}>
      {handleRenderImage()}
    </div>
  );
};

export default SNPostAttachments;
