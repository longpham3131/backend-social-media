import { Input, Popover } from "antd";
import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router";
import { SearchOutlined } from "@ant-design/icons";
import { debounce } from "lodash";
import userAPI from "@/apis/userAPI";
import { Link } from "react-router-dom";
import SNWidgetBoxItem from "@/components/SNWidgetBoxItem";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEarthAmericas, faLock } from "@fortawesome/free-solid-svg-icons";
import postAPI from "@/apis/postAPI";
import SNImage from "@/components/SNImage";

const Searchbar = () => {
  let navigate = useNavigate();
  const pathName = useLocation();
  const [listResult, setListResult] = useState([]);
  const [isShowBoxResult, setIsShowBoxResult] = useState(false);
  const [searchKey, setSearchKey] = useState("");
  const [isSearchPhotoRela, setIsSearchPhotoRela] = useState(false);
  const filterSearchKey = (key) => {
    return key[0] === "#" ? key.slice(1) : key;
  };
  const debounceSearch = useCallback(
    debounce(async (searchKey) => {
      if (!searchKey) {
        setIsShowBoxResult(false);
        return;
      }
      if (searchKey[0] === "#") {
        const rs = await postAPI.getPhotosRelate(searchKey.slice(1));
        setListResult(rs.data.data);
      } else {
        let rs = await userAPI.getSearch2({
          page: 1,
          pageSize: 3,
          searchKey: searchKey,
        });
        setListResult(rs.data.data);
      }

      setIsShowBoxResult(true);
    }, 500),
    []
  );

  useEffect(() => {
    setIsShowBoxResult(false);
  }, [pathName]);

  const redirect = (e) => {
    if (e.keyCode === 13)
      navigate(
        `/search?q=${filterSearchKey(searchKey)}${
          isSearchPhotoRela ? `&isSearchPhotoRela=true` : ""
        }`
      );
  };
  return (
    <div className="header-searchbar">
      <Popover
        placement="bottom"
        trigger="click"
        overlayClassName="header-searchbar-box"
        onVisibleChange={(visble) => {
          if (!visble) {
            setIsShowBoxResult(visble);
          }
        }}
        content={
          <div className="header-searchbar-box-result">
            {isSearchPhotoRela && (
              <div className="header-searchbar-box-result-category">
                <div className="header-searchbar-box-result-category-name">
                  Photos related - {listResult?.length} result
                  <div className="grid grid-cols-4 gap-[16px] mt-[10px] overflow-y-scroll max-h-[300px]">
                    {listResult?.length > 0 &&
                      listResult.map((p, index) => {
                        // if (index <= 7) {
                        //   return <SNImage media={p} key={index} />;
                        // }
                        return <SNImage media={p} key={index} />;
                      })}
                    {/* {listResult?.length > 8 && (
                      <p className="header-searchbar-box-no-result">
                        Enter to see more
                      </p>
                    )} */}
                  </div>
                </div>
                {/* kết quả không tìm thấy */}
                {listResult.length === 0 && (
                  <p className="header-searchbar-box-no-result">
                    NO RESULTS FOUND
                  </p>
                )}
              </div>
            )}

            {!isSearchPhotoRela && (
              <>
                <div className="header-searchbar-box-result-category">
                  <div className="header-searchbar-box-result-category-name">
                    Members
                    {listResult?.users?.length >= 0 &&
                      listResult.users.map((u, index) => (
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
                      ))}
                  </div>
                  {/* kết quả không tìm thấy */}
                  {listResult.user?.length === 0 && (
                    <p className="header-searchbar-box-no-result">
                      NO RESULTS FOUND
                    </p>
                  )}
                </div>
                <div className="header-searchbar-box-result-category">
                  <div className="header-searchbar-box-result-category-name">
                    Groups
                    {listResult?.groups?.length > 0 &&
                      listResult.groups.map((g, index) => (
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
                      ))}
                  </div>
                  {/* kết quả không tìm thấy */}
                  {listResult.groups?.length === 0 && (
                    <p className="header-searchbar-box-no-result">
                      NO RESULTS FOUND
                    </p>
                  )}
                </div>
              </>
            )}
          </div>
        }
        visible={isShowBoxResult}
      >
        <Input
          placeholder="Enter your search here..."
          className="header-searchbar-input"
          onChange={(e) => {
            debounceSearch(e.target.value);
            setSearchKey(e.target.value);
            setIsSearchPhotoRela(e.target.value[0] === "#" ? true : false);
          }}
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
