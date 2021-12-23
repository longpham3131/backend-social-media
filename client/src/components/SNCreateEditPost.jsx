import { Form, Input, Modal, Select } from "antd";
import React, { useEffect, useImperativeHandle } from "react";
import { useState } from "react";
import SNUpload from "./SNUpload";

const CreateEditPost = React.forwardRef(
  ({ title, visible, okText, onClose, onSubmit }, ref) => {
    const [file, setFile] = useState("");
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
        audience: "public",
      });
      setFile("");
    };

    const setFields = (audience, content, attach) => {
      form.setFieldsValue({
        content,
        audience,
      });
      setFile(attach ? attach : "");
    };

    const handleOk = () => {
      form.submit();
      const values = form.getFieldsValue();

      const post = {
        text: values.content,
        audience: values.audience,
        attachments: file
          ? [
              {
                file: file.filePath ?? file.file,
                type: file.fileType ?? file.type,
                name: file.fileName ?? file.name,
                size: file.fileSize ?? file.size,
              },
            ]
          : [],
        postParent: "",
      };
      if (values.content) {
        onSubmit(post);
      }
    };
    const handleCancel = () => {
      console.log("Cancel modal");
      onClose();
    };
    const handleChangeAudience = (value) => {};
    return (
      <Modal
        title={title}
        visible={visible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText={okText}
        cancelText={"Hủy"}
      >
        <Form
          name="basic"
          form={form}
          layout={"vertical"}
          initialValues={{ remember: true }}
          autoComplete="off"
        >
          <Form.Item label="Post audience:" name="audience">
            <Select onChange={handleChangeAudience}>
              <Select.Option value="public">Public</Select.Option>
              <Select.Option value="friends">Friend</Select.Option>
              <Select.Option value="private">Only me</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="What are you thinking:"
            name="content"
            rules={[{ required: true, message: "Vui lòng nhập nội dung" }]}
          >
            <Input.TextArea />
          </Form.Item>

          <Form.Item label="Attach your photo or video" name="file">
            <SNUpload
              onUploadSuccess={(value) => setFile(value)}
              fileProp={file}
            />
          </Form.Item>
        </Form>
      </Modal>
    );
  }
);
export default CreateEditPost;
