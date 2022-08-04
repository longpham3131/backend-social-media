import { useContext, useEffect, useRef, useState } from "react";
import { message } from "antd";
export const getUrlImage = (imgId) => {
  return "https://res.cloudinary.com/lth/image/upload/v1632551713/" + imgId;
};

export const getUrlVideo = (videoId) => {
  return "https://res.cloudinary.com/lth/video/upload/v1632552167/" + videoId;
};

export const getUrlRaw = (fileId) => {
  return "https://res.cloudinary.com/lth/raw/upload/v1632552198/" + fileId;
};
export const friendRelate = (a, b) => {
  return symmetricDifference(a, b);
};

export const getConfig = () => {
  return {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  };
};
function difference(a1, a2) {
  let a2Set = new Set(a2);
  return a1.filter(function (x) {
    return a2Set.has(x);
  });
}

function symmetricDifference(a1, a2) {
  return difference(a1, a2);
}

export const useOutsideAlerter = (ref) => {
  useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    function handleClickOutside(event) {
      if (
        ref.current &&
        !ref.current.contains(event.target) &&
        event.target.className !== "fa fa-heart"
      ) {
        ref.current.style.display = "none";
      }
    }

    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);
};
export const usePrevious = (value) => {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};
export function beforeUpload(file) {
  const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
  if (!isJpgOrPng) {
    message.error("You can only upload JPG/PNG file!");
  }
  const isLt5M = file.size < 1024 * 1024 * 5;
  if (!isLt5M) {
    message.error("Image must smaller than 5MB!");
  }
  return isJpgOrPng && isLt5M;
}
export const formatMinutes = (dateString) => {
  var date = new Date(dateString);

  var nowDate = new Date();
  var deltaTime = parseInt((nowDate.getTime() - date.getTime()) / 1000);
  var minutes = parseInt(deltaTime / 60);
  if (minutes < 60) {
    if (minutes === 0) return "Now"
    return minutes + " minute ago";
  } else {
    var hours = parseInt(minutes / 60);
    if (hours < 24) {
      return hours + " hour ago";
    } else {
      var days = parseInt(hours / 24);
      if (days < 30) {
        return days + " day ago";
      } else {
        var months = parseInt(days / 30);
        if (months < 12) {
          return months + " month ago";
        } else {
          return parseInt(months / 12) + " year ago";
        }
      }
    }
  }
};
export const getFirstWord = (string) => {
  if (string) {
    const words = string.trim().split(" ");
    return (
      words[words.length - 1].charAt(0).toUpperCase() +
      words[words.length - 1].slice(1)
    );
  }
};
export const makeid = (length) => {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};
