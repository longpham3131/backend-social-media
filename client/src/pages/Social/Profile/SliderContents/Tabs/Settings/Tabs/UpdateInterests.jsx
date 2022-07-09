import SNWidgetBox from "@/components/SNWidgetBox";
import SNButton from "@/components/SNButton";
import SNTextField from "@/components/SNTextField";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Form, Input, message, Select, Space } from "antd";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import userAPI from "@/apis/userAPI";
import { useDispatch, useSelector } from "react-redux";
import { setProfile } from "@/store/profileSlice";
const { TextArea } = Input;
const UpdateInterests = () => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const myProfile = useSelector((state) => state.profile);
  const onFinish = async (values) => {
    try {
      const res = await userAPI.updateProfile(values);
      dispatch(setProfile(res.data));
      message.success("Update interests success!");
    } catch {
      console.log("error update user");
      message.error("Update interests failed!");
    }
  };
  useEffect(() => {
    form.setFieldsValue({
      interests: myProfile.interests,
    });
  }, []);
  return (
    <SNWidgetBox
      title={"Update Interests"}
      content={
        <Form
          form={form}
          name="dynamic_form_nest_item"
          onFinish={onFinish}
          autoComplete="off"
          layout="vertical"
        >
          <Form.List name="interests">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <div key={key} className="flex gap-[12px] mb-[12px]">
                    <Form.Item
                      {...restField}
                      name={[name, "title"]}
                      label={"Title"}
                    >
                      {/* <SNTextField
                     name="title"
                     label={"Title"}
                     control={control}
                   /> */}
                      <Input size={"large"} />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      label={"Description"}
                      name={[name, "context"]}
                      className="flex-grow"
                    >
                      {/* <SNTextField
                     name="context"
                     label={"List your favorite in this topic"}
                     control={control}
                   /> */}
                      <TextArea
                        placeholder="List the things you like in this topic"
                        autoSize={{ minRows: 3, maxRows: 5 }}
                      />
                    </Form.Item>

                    <MinusCircleOutlined onClick={() => remove(name)} />
                  </div>
                ))}

                <Form.Item className={"ml-auto"}>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    block
                    icon={<PlusOutlined />}
                    size={"large"}
                  >
                    Add Interest Topic
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
          <SNButton htmlType="submit" text={"Submit"}></SNButton>
        </Form>
      }
    />
  );
};

export default UpdateInterests;
