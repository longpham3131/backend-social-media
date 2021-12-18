import React, { useCallback, useState } from "react";
import { Input, List, message } from "antd";
import SNAvatar from "@/components/SNAvatar";
import { Link } from "react-router-dom";
import { debounce } from "lodash";
import userAPI from "@/apis/userAPI";
import { useSelector } from "react-redux";
import { UserAddOutlined, TeamOutlined } from "@ant-design/icons";
import { useHistory } from "react-router";

const { Search } = Input;
const SearchFriend = () => {
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const myProfile = useSelector((state) => state.profile);

  const debounceSearch = useCallback(
    debounce((keySearch) => {
      fetchDataSearch(keySearch);
      // history.push(`/search-friend?search=${keySearch}`);
      // console.log("value", history.location.search.);
    }, 500),
    []
  );

  const fetchDataSearch = async (keySearch) => {
    try {
      setLoading(true);
      const res = await userAPI.getSearch(keySearch);
      console.log(res.data);
      const filterRes = res.data.filter((item) => item._id !== myProfile._id);
      console.log("filter", filterRes);
      setSearchResult(filterRes);
    } catch {
      message.error("Lỗi tìm kiếm người dùng");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col p-[5rem]">
      <Search
        placeholder="Nhập tên người dùng để tìm kiếm"
        enterButton="Tìm"
        size="large"
        onChange={(e) => debounceSearch(e.target.value)}
        loading={loading}
      />
      <p className="font-quicksan py-[2rem]">
        Kết quả tìm kiếm: {searchResult.length} người dùng được tìm thấy.
      </p>
      <List
        itemLayout="horizontal"
        dataSource={searchResult}
        locale={{ emptyText: "Không tìm thấy." }}
        renderItem={(item) => (
          <List.Item
            actions={[
              item.friends.findIndex((item) => item.user === myProfile._id) ===
              -1 ? (
                <Link to={`profile/${item._id}`}>
                  <UserAddOutlined className="text-xl cursor-pointer" />
                </Link>
              ) : (
                <Link to={`profile/${item._id}`}>
                  <TeamOutlined className="text-xl cursor-pointer text-green-3" />
                </Link>
              ),
            ]}
          >
            <List.Item.Meta
              avatar={<SNAvatar src={item.avatar} fullName={item.fullName} />}
              title={<Link to={`/profile/${item._id}`}>{item.fullName}</Link>}
              description="Ant Design, a design language for background applications, is refined by Ant UED Team"
            />
          </List.Item>
        )}
      />
    </div>
  );
};
export default SearchFriend;
