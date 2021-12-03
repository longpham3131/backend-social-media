import { useEffect, useState } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { HTTP_CONNECT } from "config";
import { List, Skeleton, Avatar, Input, DatePicker, Button } from "antd";
import defaultAvatar from "assets/images/default-avatar.jpg";
import { getUrlImage } from "util/index";
import { useDispatch, useSelector } from "react-redux";
import {
  friendRequest,
  getUserProfile,
  unfriend,
} from "store/user/user.action";
const Search = (props) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const config = {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  };
  const profileUserReducer = useSelector(
    (state) => state.userReducer.profileCurentUser
  );
  const [listUsers, setListUsers] = useState([]);
  useEffect(() => {
    getData();
  }, [props.match.params]);


  const getData = async () => {
    let result = await axios.get(
      `${HTTP_CONNECT}/users/search/${props.match.params.keySearch}`,
      config
    );
    setListUsers(result.data);
    console.log(result.data);
  };

  return (
    <div className="bodyPage">
      <List
        style={{ width: 550 }}
        className="demo-loadmore-list"
        // loading={initLoading}
        itemLayout="horizontal"
        // loadMore={loadMore}
        dataSource={listUsers}
        renderItem={(item) =>
          console.log(item) || (
            <List.Item
              actions={[
                <Button
                  key="list-loadmore-more"
                  onClick={() => {
                    history.push(`/profile/${item._id}`);
                  }}
                >
                  Xem trang cá nhân
                </Button>,
              ]}
            >
              <List.Item.Meta
                onClick={() => {
                  history.push(`/profile/${item._id}`);
                }}
                avatar={
                  <Avatar
                    src={
                      item?.avatar != ""
                        ? getUrlImage(item.avatar)
                        : defaultAvatar
                    }
                  />
                }
                title={<a href={`/profile/${item._id}`}>{item?.fullName}</a>}
                // description="Ant Design, a design language for background applications, is refined by Ant UED Team"
              />
              <div></div>
            </List.Item>
          )
        }
      />
    </div>
  );
};
export default Search;
