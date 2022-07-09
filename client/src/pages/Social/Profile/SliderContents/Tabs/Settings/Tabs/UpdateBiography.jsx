import SNWidgetBox from "@/components/SNWidgetBox";
import SNButton from "@/components/SNButton";
import SNTextField from "@/components/SNTextField";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Cascader, DatePicker, Form, Input, message } from "antd";
import addressAPI from "@/apis/addressAPI";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import moment from "moment";
import { useDispatch } from "react-redux";
import userAPI from "@/apis/userAPI";
import { setProfile } from "@/store/profileSlice";

const UpdateBiography = () => {
  const [options, setOptions] = useState([]);
  const [optionsBirthplace, setOptionsBirthplace] = useState([]);
  const myProfile = useSelector((state) => state.profile);
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const onFinish = async (values) => {
    const convertData = {
      ...values,
      address: {
        province: values.address[0] ?? "",
        district: values.address[1] ?? "",
      },
      birthplace: {
        province: values.birthplace[0] ?? "",
        district: values.birthplace[1] ?? "",
      },
      dateOfBirth: values.dateOfBirth
        ? moment(values.dateOfBirth).toISOString()
        : "",
    };
    try {
      const res = await userAPI.updateProfile(convertData);
      dispatch(setProfile(res.data));
      message.success("Update profile success!");
    } catch {
      message.success("Update profile failed!");
    }
  };

  const fetchProvinces = async (codeProvince = undefined) => {
    try {
      const res = await addressAPI.getProvinces(codeProvince);
      setOptions(
        res.data.map((item) => ({
          label: item.name,
          code: item.code,
          value: item.name,
          children: [
            {
              label: myProfile?.address?.district,
              value: myProfile?.address?.district,
            },
          ],
          isLeaf: false,
        }))
      );
      setOptionsBirthplace(
        res.data.map((item) => ({
          label: item.name,
          code: item.code,
          value: item.name,
          children: [
            {
              label: myProfile?.birthplace?.district,
              value: myProfile?.birthplace?.district,
            },
          ],
          isLeaf: false,
        }))
      );
    } catch {
      message.error("Error");
    }
  };

  const loadData = async (selectedOptions, isAddress) => {
    const targetOption = selectedOptions[selectedOptions.length - 1];
    if (targetOption?.isEnd) {
      return;
    }
    targetOption.loading = true; // load options lazily
    try {
      const res = await addressAPI.getProvinces(targetOption.code);
      targetOption.children = res.data.districts.map((item) => ({
        label: item.name,
        value: item.name,
        isEnd: true,
      }));
      isAddress
        ? setOptions([...options])
        : setOptionsBirthplace([...optionsBirthplace]);
    } catch {
      message.error("Error");
    } finally {
      targetOption.loading = false;
    }
  };
  useEffect(() => {
    fetchProvinces();
    form.setFieldsValue({
      fullName: myProfile.fullName,
      email: myProfile.email,
      occupation: myProfile.occupation,
      dateOfBirth: moment(myProfile.dateOfBirth, "YYYY-MM-DD"),
      address: [myProfile?.address?.province, myProfile?.address?.district],
      birthplace: [
        myProfile?.birthplace?.province,
        myProfile?.birthplace?.district,
      ],
    });
    setOptions();
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
          <Form.Item
            label="Full name"
            name="fullName"
            rules={[
              { required: true, message: "Please input your full name!" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: "Please input your email!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item label="Occupation" name="occupation">
            <Input />
          </Form.Item>

          <Form.Item label="Date of birth" name="dateOfBirth">
            <DatePicker />
          </Form.Item>
          <Form.Item label="Address" name="address">
            <Cascader
              options={options}
              onChange={(value, selectedOptions) =>
                loadData(selectedOptions, true)
              }
              changeOnSelect
            />
          </Form.Item>

          <Form.Item label="Birthplace" name="birthplace">
            <Cascader
              options={optionsBirthplace}
              onChange={(value, selectedOptions) =>
                loadData(selectedOptions, false)
              }
              changeOnSelect
            />
          </Form.Item>

          <SNButton htmlType="submit" text={"Update"}></SNButton>
        </Form>
      }
    />
  );
};

export default UpdateBiography;
