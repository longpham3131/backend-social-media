import { Form, Input, message, Segmented } from "antd";
import SNButton from "@/components/SNButton";
import React, { useEffect, useState } from "react";
import SNWidgetBox from "@/components/SNWidgetBox";
import { useSelector } from "react-redux";
import groupAPI from "@/apis/groupAPI";
import { useDispatch } from "react-redux";

import { editGroup } from "@/store/groupSlice";
const { TextArea } = Input;
const UpdateGroupInfo = () => {
  const group = useSelector((state) => state.group);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const onFinish = async (values) => {
    const convertValue = {
      _id: group._id,
      isPrivate: values.groupType === "Private" ? true : false,
      groupName: values.groupName,
      groupDescription: values.groupDescription,
    };
    setLoading(true);
    try {
      await groupAPI.updateGroupInfo(convertValue);
      dispatch(editGroup(convertValue));
      message.success("Update your group success!");
    } catch {
      message.error("Update fail!");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    form.setFieldsValue({
      groupType: group.isPrivate ? "Private" : "Public",
      groupName: group.groupName,
      groupDescription: group.groupDescription,
    });
  }, []);
  return (
    <SNWidgetBox
      title={"Update Profile"}
      content={
        <Form
          form={form}
          initialValues={{ remember: true }}
          layout={"vertical"}
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item label="Group type" name="groupType">
            <Segmented options={["Public", "Private"]} />
          </Form.Item>

          <Form.Item
            label="Group name"
            rules={[
              { required: true, message: "Please input your group name!" },
            ]}
            name="groupName"
          >
            <Input />
          </Form.Item>

          <Form.Item label="Group description" name="groupDescription">
            <TextArea autoSize={{ minRows: 3, maxRows: 5 }} />
          </Form.Item>

          <SNButton
            loading={loading}
            htmlType="submit"
            text={"Update"}
          ></SNButton>
        </Form>
      }
    />
  );
};

export default UpdateGroupInfo;
