import { Form, Input, message } from "antd";
import postAPI from "@/apis/postAPI";
import React, { useState } from "react";
import { formatMinutes } from "@/util/index";
import SNWidgetBoxItem from "./SNWidgetBoxItem";
import { useDispatch, useSelector } from "react-redux";
import { createComment } from "@/store/postSlice";
import classNames from "classnames";
import { useParams } from "react-router";

const SNComment = ({
  postId,
  comments,
  isShowAllComment,
  isPostDetail,
  onSuccessAct,
}) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const myProfile = useSelector((state) => state.profile);
  const [isShowComment, setIsShowComment] = useState(false);

  const handleComment = async (values) => {
    try {
      console.log("comment", values);
      const res = await postAPI.comment(values);
      const dataDispatchStore = {
        ...res.data.data,
        user: {
          _id: myProfile._id,
          username: myProfile.username,
          fullName: myProfile.fullName,
          avatar: myProfile.avatar,
        },
      };
      isPostDetail
        ? onSuccessAct()
        : dispatch(
            createComment({ postId: values.postId, comment: dataDispatchStore })
          );
      console.log("success", res.data);
    } catch {
      message.error("Failed!");
    }
  };
  const onSubmitCmt = (values) => {
    const data = {
      content: values.contentComment,
      postId: postId,
      file: [],
    };
    handleComment(data);
    form.resetFields();
    setIsShowComment(true);
  };
  return (
    <div className="sn-comment">
      <div className="sn-comment-list">
        {comments.length ? (
          <>
            <div
              className={classNames(" sn-comment-list-wrapper", {
                show: isShowComment || isPostDetail,
              })}
            >
              {comments.map((item, index) => (
                <SNWidgetBoxItem
                  key={item._id}
                  srcAvatar={item.user.avatar}
                  name={
                    <>
                      {item.user.fullName}{" "}
                      <span className="ml-[5px] font-medium">
                        - {formatMinutes(item.createAt)}
                      </span>
                    </>
                  }
                  description={item.content}
                />
              ))}
            </div>

            {!isPostDetail && (
              <p
                className={"sn-comment-list-show-btn"}
                onClick={() => setIsShowComment(!isShowComment)}
              >
                {isShowComment ? "Hide" : "Show list comment"}
              </p>
            )}
          </>
        ) : (
          <></>
        )}
      </div>
      <div className="pt-[20px]">
        <Form
          form={form}
          name="basic"
          layout={"vertical"}
          initialValues={{ remember: true }}
          onFinish={onSubmitCmt}
          autoComplete="off"
        >
          <Form.Item
            name="contentComment"
            rules={[
              {
                required: true,
                message: "OPPS !! You can't post an empty comment",
              },
            ]}
          >
            <Input.TextArea
              placeholder="Comment"
              showCount
              maxLength={50}
              autoSize={{ minRows: 1, maxRows: 6 }}
              onPressEnter={() => form.submit()}
            />
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default SNComment;
