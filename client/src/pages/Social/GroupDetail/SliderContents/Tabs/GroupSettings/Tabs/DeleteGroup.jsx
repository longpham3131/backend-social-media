import SNWidgetBox from "@/components/SNWidgetBox";
import { Form, Input, message } from "antd";
import SNButton from "@/components/SNButton";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import groupAPI from "@/apis/groupAPI";

const DeleteGroup = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { groupId } = useParams();
  const group = useSelector((state) => state.group);
  const onFinish = async (values) => {
    setLoading(true);
    try {
      await groupAPI.deleteGroup(groupId);
      message.success("Delete your group success!");
      navigate("/groups");
    } catch {
      message.success("Opps! something wrong");
    } finally {
      setLoading(false);
    }
  };
  return (
    <SNWidgetBox
      title={"Delete group"}
      content={
        <Form
          form={form}
          initialValues={{ remember: true }}
          layout={"vertical"}
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            label="Enter your group name before delete"
            rules={[
              {
                required: true,
                message: "Please confirm your group name!",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || group.groupName === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("The group name that you entered do not match!")
                  );
                },
              }),
            ]}
            name="groupName"
          >
            <Input />
          </Form.Item>

          <SNButton
            loading={loading}
            htmlType="submit"
            text={"Delete"}
          ></SNButton>
        </Form>
      }
    />
  );
};

export default DeleteGroup;
