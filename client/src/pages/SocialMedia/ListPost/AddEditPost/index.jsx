import React, {
  Component,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import DefualtAvatar from "assets/images/default-avatar.jpg";
import { Select, Form, Input, Upload } from "antd";

import { createPost, editPost } from "store/post/post.action";
import { useDispatch } from "react-redux";
import { getUrlImage } from "util/index";

const { TextArea } = Input;
const { Option } = Select;

const AddEditPost = React.forwardRef(({ avatar, fullName }, ref) => {
  //
  const [formCreateEditPost] = Form.useForm();
  const dispatch = useDispatch();
  useEffect(() => {
    console.log("DidMount");
  }, []);

  //Form post

  const [audience, setAudience] = useState("public");
  const [text, setText] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);

  //
  useImperativeHandle(ref, () => ({
    setInitState,
    setValuesForm,
    handleSubmit,
  }));

  const setInitState = () => {
    console.log("SET INIT");
    formCreateEditPost.resetFields();
    setAttachments([]);
    setAudience("public");
    setText("");
  };

  const setValuesForm = (audience, text, editAttach, postId) => {
    formCreateEditPost.setFieldsValue({
      Text: text,
    });
    setText(text);
    setSelectedPost(postId);
    setAttachments(editAttach);
    setAudience(audience);
  };

  const handleSubmit = (typeForm) => {
    switch (typeForm) {
      case "create": {
        console.log("CREATE");
        let newAttachments = attachments.map((item) => ({
          file: item.response.data.filePath,
          type: item.response.data.fileType,
          name: item.response.data.fileName,
          size: item.response.data.fileSize,
        }));
        const post = {
          text,
          audience,
          attachments: newAttachments,
          postParent: "",
        };
        // await console.log("create", post);
        dispatch(createPost(post));
        break;
      }
      case "edit": {
        console.log("EDIT", attachments);
        let newAttachments = attachments.map((item) => ({
          file: item.file ? item.file : item.response.data.filePath,
          type: item.type ? item.type : item.response.data.fileType,
          name: item.name ? item.name : item.response.data.fileName,
          size: item.size ? item.size : item.response.data.fileSize,
        }));
        const post = {
          postId: selectedPost,
          text,
          audience,
          attachments: newAttachments,
          postParent: "",
        };
        // await console.log("create", post);
        dispatch(editPost(post));
        break;
      }
      default: {
        break;
      }
    }
  };

  //
  const onPreview = async (file) => {
    let src = file.url;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onload = () => resolve(reader.result);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow.document.write(image.outerHTML);
  };

  return (
    <div>
      <Form form={formCreateEditPost} onFinish={handleSubmit}>
        <div className="postStatus__content">
          <div className="d-flex align-items-center">
            <img
              src={avatar ? getUrlImage(avatar) : DefualtAvatar}
              alt="avatar"
              className="avatar"
              style={{ paddingRight: "0" }}
            />
            <div>
              <p className="m-0">{fullName}</p>
              <Select
                defaultValue="public"
                style={{ width: 120 }}
                onChange={(value) => {
                  setAudience(value);
                }}
                value={audience}
              >
                <Option value="public">Công khai</Option>
                <Option value="friends">Bạn bè</Option>
                <Option value="private">Chỉ mình tôi</Option>
              </Select>
            </div>
          </div>
          <div className="pt-2">
            <Form.Item
              label={"Nội dung"}
              name="Text"
              labelCol={{ span: 24 }}
              rules={[
                {
                  required: true,
                  message: "Nội dung không được trống",
                },
              ]}
            >
              <TextArea
                autoSize={{ minRows: 3 }}
                placeholder="Bạn đang nghĩ gì thế"
                onChange={(e) => {
                  setText(e.target.value);
                }}
              />
            </Form.Item>
            <Form.Item
              label={"Hình ảnh"}
              name="Attachments"
              labelCol={{ span: 24 }}
            >
              <Upload
                action="http://localhost:4000/api/upload/singleFile"
                listType="picture-card"
                fileList={attachments}
                onChange={({ fileList: newFileList }) => {
                  setAttachments(newFileList);
                }}
                onPreview={onPreview}
              >
                {attachments.length < 5 && "+ Upload"}
              </Upload>
            </Form.Item>
          </div>
          <p className="options">Tùy chọn thêm</p>
          {/* <div className="d-flex align-items-center justify-content-start">
            <i className="fa fa-image"></i>
            <i className="fa fa-tag"></i>
          </div> */}
        </div>
      </Form>
    </div>
  );
});

export default AddEditPost;
