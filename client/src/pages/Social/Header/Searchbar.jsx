import { Input, Popover } from "antd";
import React, { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { SearchOutlined } from "@ant-design/icons";
import { debounce } from "lodash";
import userAPI from "@/apis/userAPI";
import { Link } from "react-router-dom";
import SNWidgetBoxItem from "@/components/SNWidgetBoxItem";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEarthAmericas, faLock } from "@fortawesome/free-solid-svg-icons";
const Searchbar = () => {
  let navigate = useNavigate();
  const [listResult, setListResult] = useState([])
  const [isShowBoxResult, setIsShowBoxResult] = useState(false);
  const debounceSearch = useCallback(
    debounce(async (searchKey) => {
      if (!searchKey) {
        setIsShowBoxResult(false);
        return;
      }
      setIsShowBoxResult(true);
      let rs = await userAPI.getSearch2({ page: 1, pageSize: 3, searchKey })
      setListResult(rs.data.data)
    }, 500),
    []
  );

  const redirect = (e) => {
    if (e.keyCode === 13)
      navigate("/search/" + e.target.value)
  }
  return (
    <div className="header-searchbar">
      <Popover
        placement="bottom"
        overlayClassName="header-searchbar-box"
        content={
          <div className="header-searchbar-box-result">
            <div className="header-searchbar-box-result-category">
              <p className="header-searchbar-box-result-category-name">
                Members
                {
                  listResult?.users?.length > 0 && listResult.users.map((u, index) => (
                    <Link key={index} to={`/profile/${u._id}`}>
                      <SNWidgetBoxItem
                        srcAvatar={u.avatar}
                        name={
                          <>
                            {u.fullName}{" "}
                            {/* <Badge color="#87d068" dot={u.user.isOnline} /> */}
                          </>
                        }
                        description={"@" + u.username}
                      />
                    </Link>
                  ))
                }
              </p>
              {/* kết quả không tìm thấy */}
              {(!listResult || !listResult.user?.length === 0) && <p className="header-searchbar-box-no-result">NO RESULTS FOUND</p>}
            </div>
            <div className="header-searchbar-box-result-category">
              <p className="header-searchbar-box-result-category-name">
                Groups
                {
                  listResult?.groups?.length > 0 && listResult.groups.map((g, index) => (
                    <Link key={index} to={`/groups/${g._id}`}>
                      <SNWidgetBoxItem
                        srcAvatar={g.avatar}
                        name={g.groupName}
                        description={g?.members?.length + " members"}
                        leftIcon={
                          g.isPrivate ? (
                            <FontAwesomeIcon
                              icon={faLock}
                              className=" text-lg text-color-icon"
                            />
                          ) : (
                            <FontAwesomeIcon
                              icon={faEarthAmericas}
                              className=" text-lg text-color-icon"
                            />
                          )
                        }
                      />
                    </Link>
                  ))
                }

              </p>
              {/* kết quả không tìm thấy */}
              {(!listResult || !listResult.group?.length === 0) && <p className="header-searchbar-box-no-result">NO RESULTS FOUND</p>}
            </div>
          </div>
        }
        visible={isShowBoxResult}
      >
        <Input
          placeholder="Enter your search here..."
          className="header-searchbar-input"
          onChange={(e) => debounceSearch(e.target.value)}
          suffix={
            <SearchOutlined
              style={{ fontSize: "20px", color: "var(--color-header-icon)" }}
            />
          }
          onKeyDown={redirect}
        />
      </Popover>
    </div>
  );
};

export default Searchbar;
