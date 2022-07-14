import SNWidgetBox from "@/components/SNWidgetBox";
import { Button, message, Upload } from "antd";
import React from "react";
import { UploadOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import { getUrlImage } from "@/util/index";
import { useState } from "react";
import SNAvatar from "@/components/SNAvatar";
import SNButton from "@/components/SNButton";
import groupAPI from "@/apis/groupAPI";
import { useDispatch } from "react-redux";
import { editGroup } from "@/store/groupSlice";
const UpdateAvatar = () => {
  const group = useSelector((state) => state.group);
  const [previewCover, setPreviewCover] = useState(group.cover);
  const [previewAvatar, setPreviewAvatar] = useState(group.avatar);
  const [loadingCover, setLoadingCover] = useState(false);
  const [loadingAvatar, setLoadingAvatar] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const dispatch = useDispatch();
  const propsUploadCoverPic = {
    action: "https://uploadfile0510.herokuapp.com/api/upload/singleFile",
    beforeUpload: (file) => {
      const isImage = file.type !== "video/mp4";

      if (!isImage) {
        message.error(`${file.name} is not a png file`);
      }

      return isImage || Upload.LIST_IGNORE;
    },

    showUploadList: false,
  };
  const onChangeCover = ({ file }) => {
    setLoadingCover(true);
    if (file.status === "done") {
      console.log("cover", file);
      setPreviewCover(file.response.data.filePath);
      setLoadingCover(false);
    }
  };
  const onChangeAvatar = ({ file }) => {
    setLoadingAvatar(true);
    if (file.status === "done") {
      setPreviewAvatar(file.response.data.filePath);
      setLoadingAvatar(false);
    }
  };
  const handleUpdate = async () => {
    const covertData = {
      _id: group._id,
      cover: previewCover,
      avatar: previewAvatar,
    };
    setLoadingSubmit(true);
    try {
      await groupAPI.updateGroupInfo(covertData);
      dispatch(editGroup(covertData));
      message.success("Update success");
    } catch {
      message.error("Update error!");
    } finally {
      setLoadingSubmit(false);
    }
  };
  return (
    <SNWidgetBox
      title={"Update avatar and cover picture"}
      content={
        <div className="flex flex-col gap-[15px]">
          <div className="flex flex-col gap-[10px]">
            <p className="font-bold ">Avatar</p>
            <div className="mx-auto">
              <SNAvatar src={previewAvatar} size={120} />
            </div>
            <Upload
              {...propsUploadCoverPic}
              onChange={onChangeAvatar}
              className="text-center"
            >
              <Button loading={loadingAvatar} icon={<UploadOutlined />}>
                Click to Upload
              </Button>
            </Upload>
          </div>
          <div className="flex flex-col gap-[10px]">
            <p className="font-bold ">Cover picture</p>
            <img
              src={getUrlImage(previewCover)}
              alt=""
              className="w-full rounded-xl object-cover"
            />
            <Upload
              {...propsUploadCoverPic}
              onChange={onChangeCover}
              className="text-center"
            >
              <Button loading={loadingCover} icon={<UploadOutlined />}>
                Click to Upload
              </Button>
            </Upload>
          </div>
          <SNButton
            isLoading={loadingSubmit}
            text={"Update"}
            onClick={handleUpdate}
          />
        </div>
      }
    />
  );
};

export default UpdateAvatar;
