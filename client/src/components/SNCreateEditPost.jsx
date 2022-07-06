import { Form, Input, Modal, Select } from "antd";
import { ContentState, convertToRaw, EditorState } from "draft-js";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";
import React, { useEffect, useImperativeHandle } from "react";
import { useState } from "react";
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import SNUpload from "./SNUpload";
const CreateEditPost = React.forwardRef(
  ({ title, visible, okText, onClose, onSubmit }, ref) => {
    const [file, setFile] = useState("");
    const [form] = Form.useForm();
    const [editorState, setEditorState] = useState('')
    useImperativeHandle(ref, () => ({
      resetFields,
      setFields,
    }));

    useEffect(() => {
    })
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
        audience,
      });
      let raw =htmlToDraft(content)
      const contentState = ContentState.createFromBlockArray(raw.contentBlocks);
      const editorState = EditorState.createWithContent(contentState);
      setEditorState(editorState)
      setFile(attach ? attach : "");
    };

    const handleOk = () => {

      form.submit();
      const values = form.getFieldsValue();
      const post = {
        text: draftToHtml(convertToRaw(editorState.getCurrentContent())),
        audience: values.audience,
        attachments: file
          ? [
            {
              file: file.response.data.filePath ?? file.file,
              type: file.response.data.fileType ?? file.type,
              name: file.response.data.fileName ?? file.name,
              size: file.response.data.fileSize ?? file.size,
              tags:file.response.data.tags
            },
          ]
          : [],
        postParent: "",
      };
      if (editorState !== undefined) {
        onSubmit(post);
      }
    };
    const handleCancel = () => {
      console.log("Cancel modal");
      onClose();
    };
    const onEditorStateChange = (value) => {
      // setEditorState(value)
      let html= draftToHtml(convertToRaw(value.getCurrentContent()))
      console.log('html',html.toString())
      let raw =htmlToDraft(html)
      const contentState = ContentState.createFromBlockArray(raw.contentBlocks);
      const editorState = EditorState.createWithContent(contentState);
      setEditorState(value)
      // console.log('content',draftToHtml(convertToRaw(value.getCurrentContent())))
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
          {/* <Form.Item label="Post audience:" name="audience">
            <Select onChange={handleChangeAudience}>
              <Select.Option value="public">Public</Select.Option>
              <Select.Option value="friends">Friend</Select.Option>
              <Select.Option value="private">Only me</Select.Option>
            </Select>
          </Form.Item> */}
          {/* <Form.Item
            label="What are you thinking:"
            name="content"
            rules={[{ required: true, message: "Please enter your content" }]}
          >
            <Input.TextArea />
          </Form.Item> */}
          <Editor editorState={editorState} onEditorStateChange={onEditorStateChange} />
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
