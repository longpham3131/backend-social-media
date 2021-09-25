export const getUrlImage = (imgId) => {
  return "https://res.cloudinary.com/lth/image/upload/v1632551713/" + imgId;
};

export const getUrlVideo = (videoId) => {
  return "https://res.cloudinary.com/lth/video/upload/v1632552167/" + videoId;
};

export const getUrlRaw = (fileId) => {
  return "https://res.cloudinary.com/lth/raw/upload/v1632552198/" + fileId;
};
