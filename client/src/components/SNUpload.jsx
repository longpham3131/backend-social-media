import React, { useEffect, useState } from "react";
import { Upload, message, Button, Progress } from "antd";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { getUrlImage } from "@/util/index";
import "@tensorflow/tfjs-backend-cpu";
//import "@tensorflow/tfjs-backend-webgl";
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import axios from "axios";
import { UploadOutlined } from "@ant-design/icons";
import { getUrlVideo } from "@/util/index";
export default function SNUpload({
  isImagePost = true,
  onUploadSuccess,
  fileProp,
  onRemove,
}) {
  // const [tags, setTags] = useState([])
  const [defaultFileList, setDefaultFileList] = useState([]);

  useEffect(() => {
    console.log("data input", fileProp);
    setDefaultFileList(
      fileProp.map((f, index) => ({
        uid: f._id,
        name: f.fileName,
        status: "done",
        url:
          f.fileType === "video/mp4"
            ? getUrlVideo(f.filePath)
            : getUrlImage(f.filePath),
        thumbUrl:
          f.fileType === "video/mp4"
            ? getUrlVideo(f.filePath)
            : getUrlImage(f.filePath),
      }))
    );
  }, [fileProp]);
  const readImage = (file) => {
    return new Promise((rs, rj) => {
      const fileReader = new FileReader();
      fileReader.onload = () => rs(fileReader.result);
      fileReader.onerror = () => rj(fileReader.error);
      fileReader.readAsDataURL(file);
    });
  };

  const detectObjectsOnImage = async (imageElement, imgSize) => {
    const model = await cocoSsd.load({});
    const predictions = await model.detect(imageElement, 6);
    const tags = predictions.map((prediction) => prediction.class);
    return [...new Set(tags)];
  };

  const beforeUpload = async (file) => {
    // const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    // if (!isJpgOrPng) {
    //   message.info("You can only upload JPG/PNG file!");
    // }
    // const isLt2M = file.size / 1024 / 1024 < 2;
    // if (!isLt2M) {
    //   message.info("Image must smaller than 2MB!");
    // }
    // if (!isLt2M) return isLt2M;

    // const imgData = await readImage(file);
    // const imageElement = document.createElement("img");
    // imageElement.src = imgData;

    // imageElement.onload = async () => {
    //   const imgSize = {
    //     width: imageElement.width,
    //     height: imageElement.height,
    //   };
    //   const tags = await detectObjectsOnImage(imageElement, imgSize);
    //   setTags(tags)
    //   console.log('tags', tags)
    // };
    return true;
  };
  function imageInfo(src) {
    return new Promise((resolve, reject) => {
      const img = document.createElement("img");
      img.onload = (imageEvent) => {
        resolve(img);
      };
      img.onerror = reject;
      // tslint:disable-next-line:no-non-null-assertion
      img.src = src;
    });
  }
  const getTags = async (file) => {
    const imgData = await readImage(file);
    let tags = [];
    const imageElement = await imageInfo(imgData);
    tags = await detectObjectsOnImage(imageElement, {
      width: imageElement.width,
      height: imageElement.height,
    });
    return tags;
  };

  const uploadImage = async (options) => {
    const { onSuccess, onProgress, onError, file } = options;
    console.log("file", file);
    let tags = [];
    if (file.type !== "video/mp4") {
      tags = await getTags(file);
    }

    const fmData = new FormData();
    const config = {
      headers: { "content-type": "multipart/form-data" },
      onUploadProgress: (event) => {
        onProgress({ percent: (event.loaded / event.total) * 100 });
      },
    };
    fmData.append("file", file);
    fmData.append("tags", tags);
    try {
      const res = await axios.post(
        "http://localhost:4000/api/upload/singleFile",
        fmData,
        config
      );
      onUploadSuccess(res.data.data);
    } catch (err) {
      console.log("Eroor: ", err, "file", file);
      const error = new Error("Some error");
      onError({ err });
    }
  };

  const handleChange = ({ file, fileList }) => {
    setDefaultFileList(fileList);
  };

  return (
    <>
      <Upload
        className="avatar-uploader"
        listType="picture"
        fileList={defaultFileList}
        // action="https://uploadfile0510.herokuapp.com/api/upload/singleFile"
        customRequest={uploadImage}
        onChange={handleChange}
        onRemove={onRemove}
      >
        <Button icon={<UploadOutlined />}>Upload</Button>
      </Upload>
    </>
  );
}
// {!loading && fileProp ? (
//   <img
//     src={
//       isImagePost
//         ? getUrlImage(
//             fileProp.filePath ?? fileProp[0].response.data.filePath
//           )
//         : getUrlImage(fileProp)
//     }
//     alt="avatar"
//     className="w-full h-full"
//   />
// ) : (
//   uploadButton
// )}
