import { Button, Form, Input, message, Modal, Segmented } from "antd";
import SNCard from "@/components/SNCard";
import SNNoResult from "@/components/SNNoResult";
import React, { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import groupAPI from "@/apis/groupAPI";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEarthAmericas, faLock } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
const { TextArea } = Input;
const Groups = () => {
  const [groups, setGroups] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const handleOk = async () => {
    form.submit();
    const values = form.getFieldsValue();
    const covertData = {
      groupName: values.groupName,
      groupDescription: values.groupDescription,
      isPrivate: values.groupType === "Private" ? true : false,
    };
    setLoading(true);
    try {
      const res = await groupAPI.createGroup(covertData);
      navigate(`/groups/${res.data.data._id}`);
      message.success("Create your group success!");
    } catch {
      message.error("Create your group fail");
    } finally {
      setLoading(false);
    }
  };

  const fetchGroups = async () => {
    try {
      const res = await groupAPI.getAllGroups();
      setGroups(res.data.data);
    } catch (error) {
      message.error("Get group fail!");
    }
  };
  useEffect(() => {
    fetchGroups();
    form.setFieldsValue({
      groupType: "Public",
    });
  }, []);
  return (
    <>
      <div className=" w-1/3 mb-[16px]">
        <Button
          size="xl"
          type="primary"
          shape="round"
          onClick={() => setIsModalVisible(true)}
        >
          Create group
        </Button>
        <Modal
          title="Create group"
          centered={true}
          visible={isModalVisible}
          onOk={handleOk}
          confirmLoading={loading}
          onCancel={() => setIsModalVisible(false)}
        >
          <Form name="basic" form={form} layout={"vertical"} autoComplete="off">
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
          </Form>
        </Modal>
      </div>
      <div className="grid grid-cols-4 gap-[16px] mt-[32px]">
        {groups.length > 0 ? (
          groups.map((item, index) => (
            <Link key={index} to={`/groups/${item._id}`}>
              <SNCard
                name={item.groupName}
                coverPicture={item.cover}
                avatar={item.avatar}
                isGroup={true}
                description={item.groupDescription}
                quantityCount={[
                  {
                    quantity: item.isPrivate ? (
                      <FontAwesomeIcon
                        icon={faLock}
                        className=" text-lg text-color-text"
                      />
                    ) : (
                      <FontAwesomeIcon
                        icon={faEarthAmericas}
                        className=" text-lg text-color-text"
                      />
                    ),
                    name: item.isPrivate ? "Private" : "Public",
                  },
                  {
                    quantity: item.members.length,
                    name: "members",
                  },
                  {
                    quantity: item.postCount,
                    name: "post",
                  },
                ]}
              />
            </Link>
          ))
        ) : (
          <div className="mt-[32px]">
            <SNNoResult />
          </div>
        )}
      </div>
    </>
  );
};

export default Groups;
