import React, { useEffect, useState } from "react";
import { Upload, message } from "antd";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { getUrlImage } from "@/util/index";
import "@tensorflow/tfjs-backend-cpu";
//import "@tensorflow/tfjs-backend-webgl";
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import axios from "axios";
export default function SNUpload({
  isImagePost = true,
  onUploadSuccess,
  fileProp,
}) {

  const [loading, setLoading] = useState(false);
  // const [tags, setTags] = useState([])
  const [defaultFileList, setDefaultFileList] = useState([]);
  const [progress, setProgress] = useState(0);
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
    const tags = predictions.map(prediction => prediction.class)
    return [...new Set(tags)];
  };

  const beforeUpload = async (file) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.info("You can only upload JPG/PNG file!");
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.info("Image must smaller than 2MB!");
    }
    if (!isJpgOrPng || !isLt2M)
      return isJpgOrPng && isLt2M;

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
    return true

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
    let tags = []
    const imageElement = await imageInfo(imgData)
    tags = await detectObjectsOnImage(imageElement, {
      width: imageElement.width,
      height: imageElement.height,
    });
    return tags
  }

  const uploadImage = async options => {
    const { onSuccess, onError, file, onProgress } = options;
    let tags = await getTags(file)
    console.log('tag dau', tags)
    const fmData = new FormData();
    const config = {
      headers: { "content-type": "multipart/form-data" },
      onUploadProgress: event => {
        const percent = Math.floor((event.loaded / event.total) * 100);
        setProgress(percent);
        if (percent === 100) {
          setTimeout(() => setProgress(0), 1000);
        }
        onProgress({ percent: (event.loaded / event.total) * 100 });
      }
    };
    fmData.append("file", file);
    fmData.append("tags", tags)
    try {
      const res = await axios.post(
        "http://localhost:4000/api/upload/singleFile",
        fmData,
        config
      );
      onSuccess(res.data);
      console.log("server res: ", res);
    } catch (err) {
      console.log("Eroor: ", err, 'file', file);
      const error = new Error("Some error");
      onError({ err });
    }
  };

  const handleChangeAvatar = ({ file }) => {
    setLoading(true);
    if (file.status === "done") {
      // setAvatar(file?.response?.data?.filePath);
      console.log('alo', file)
      onUploadSuccess(file);
      setLoading(false);
    } else if (file.status === "error") {
      setLoading(false);
      message.error("Upload fail");
    }
  };
  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );


  return (
    <Upload
      listType="picture-card"
      className="avatar-uploader"
      showUploadList={false}
      // action="https://uploadfile0510.herokuapp.com/api/upload/singleFile"
      customRequest={uploadImage}
      beforeUpload={beforeUpload}
      onChange={handleChangeAvatar}
    >
      {!loading && fileProp ? (
        <img
          src={
            isImagePost
              ? getUrlImage(fileProp.filePath ?? fileProp[0].response.data.filePath)
              : getUrlImage(fileProp)
          }
          alt="avatar"
          className="w-full h-full"
        />
      ) : (
        uploadButton
      )}
    </Upload>
  );
}
