import { Form, Input, Modal, Segmented, Select } from "antd";
import { ContentState, convertToRaw, EditorState } from "draft-js";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";
import React, { useEffect, useImperativeHandle } from "react";
import { useState } from "react";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { useParams } from "react-router";
import SNUpload from "./SNUpload";
const SNCreateEditPost = React.forwardRef(
  ({ title, visible, okText, onClose, onSubmit }, ref) => {
    const [file, setFile] = useState([]);
    const { groupId } = useParams();
    const [form] = Form.useForm();
    useImperativeHandle(ref, () => ({
      resetFields,
      setFields,
    }));

    useEffect(() => {
      resetFields();
    }, []);

    const resetFields = () => {
      form.setFieldsValue({
        content: "",
        audience: "Public",
      });
      setFile([]);
    };

    const setFields = (audience, content, attach) => {
      form.setFieldsValue({
        audience: audience.charAt(0).toUpperCase() + audience.slice(1),
        content,
      });
      setFile(attach ? attach : []);
      console.log("attach", attach);
    };

    const getFiles = (files) => {
      return files.map((f) => ({
        file: f.filePath,
        type: f.fileType,
        name: f.fileName,
        size: f.fileSize,
        tags: f.tags,
      }));
    };

    const handleOk = () => {
      form.submit();
      const values = form.getFieldsValue();
      const post = {
        text: values.content,
        audience: values?.audience?.toLowerCase(),
        attachments: file ? getFiles(file) : [],
        postParent: "",
      };
      onSubmit(post);
    };
    const handleRemoveFile = (itemRemove) => {
      console.log("file remove", itemRemove);
      setFile(file.filter((f) => f._id !== itemRemove.uid));
    };
    const handleCancel = () => {
      onClose();
    };
    return (
      <Modal
        title={title}
        visible={visible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText={okText}
        cancelText={"Cancel"}
      >
        <Form
          name="basic"
          form={form}
          layout={"vertical"}
          initialValues={{ remember: true }}
          autoComplete="off"
        >
          {!groupId && (
            <Form.Item label="Audience" name="audience">
              <Segmented options={["Public", "Friends", "Private"]} />
            </Form.Item>
          )}

          <Form.Item
            label="What are you thinking:"
            name="content"
            rules={[{ required: true, message: "Please enter your content" }]}
          >
            <Input.TextArea />
          </Form.Item>
          <Form.Item label="Attach your photo or video" name="file">
            <SNUpload
              onUploadSuccess={(value) => setFile([...file, value])}
              fileProp={file}
              onRemove={handleRemoveFile}
            />
          </Form.Item>
        </Form>
      </Modal>
    );
  }
);
export default SNCreateEditPost;
