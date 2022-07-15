import SNWidgetBox from "@/components/SNWidgetBox";
import { Button, message, Upload } from "antd";
import React from "react";
import { UploadOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import { getUrlImage } from "@/util/index";
import { useState } from "react";
import SNAvatar from "@/components/SNAvatar";
import SNButton from "@/components/SNButton";
import { useDispatch } from "react-redux";
import userAPI from "@/apis/userAPI";
import { setProfile } from "@/store/profileSlice";
const UpdateAvatarUser = () => {
  const profile = useSelector((state) => state.profile);
  const [previewCover, setPreviewCover] = useState(profile.coverPicture);
  const [previewAvatar, setPreviewAvatar] = useState(profile.avatar);
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
      coverPicture: previewCover,
      avatar: previewAvatar,
    };
    setLoadingSubmit(true);
    try {
      const res = await userAPI.updateProfile(covertData);
      dispatch(setProfile(res.data));
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

export default UpdateAvatarUser;
