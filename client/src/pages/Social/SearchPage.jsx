import React, { useCallback, useEffect, useState } from "react";
import { Input, List, message } from "antd";
import SNAvatar from "@/components/SNAvatar";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { debounce } from "lodash";
import userAPI from "@/apis/userAPI";
import { useSelector } from "react-redux";
import { UserAddOutlined, TeamOutlined } from "@ant-design/icons";
import SNCard from "@/components/SNCard";
import SNNoResult from "@/components/SNNoResult";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEarthAmericas, faLock } from "@fortawesome/free-solid-svg-icons";
import postAPI from "@/apis/postAPI";
import SNImage from "@/components/SNImage";

const SearchPage = () => {
  const [searchResult, setSearchResult] = useState([]);
  const [searchResultGroup, setSearchResultGroup] = useState([]);
  const [searchResultPhoto, setSearchResultPhoto] = useState([]);
  const [loading, setLoading] = useState(false);
  const myProfile = useSelector((state) => state.profile);
  const [searchParams] = useSearchParams();
  const [isSearchPhotoRela, setIsSearchPhotoRela] = useState(false);
  useEffect(() => {
    setIsSearchPhotoRela(searchParams.get("isSearchPhotoRela") ? true : false);
    fetchDataSearch(searchParams.get("q"));
  }, [searchParams.get("q")]);

  const fetchDataSearch = async (searchKey) => {
    try {
      setLoading(true);
      if (searchParams.get("isSearchPhotoRela")) {
        const rs = await postAPI.getPhotosRelate(searchParams.get("q"));
        setSearchResultPhoto(rs.data.data);
      } else {
        const res = await userAPI.getSearch2({ searchKey });
        const filterRes = res.data.data.users.filter(
          (item) => item._id !== myProfile._id
        );
        setSearchResultGroup(res.data.data.groups);
        setSearchResult(filterRes);
      }
    } catch {
      message.error("Search fail!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col ">
      <p className="text-color-text-alt text-[0.75rem] font-semibold uppercase">
        Browse
      </p>
      {isSearchPhotoRela && (
        <div className="col-span-4">
          <p className="mt-[8px] text-color-text text-[1.625rem] font-bold">
            Photos{" "}
            <span className=" text-color-primary-dark text-[1.625rem] font-bold">
              {searchResultPhoto.length}
            </span>
          </p>
          <div className="grid grid-cols-4 gap-[16px] mt-[32px]">
            {searchResultPhoto.length > 0 ? (
              searchResultPhoto.map((item, index) => (
                <SNImage media={item} key={index} />
              ))
            ) : (
              <div className="col-span-4 mt-[32px]">
                <SNNoResult />
              </div>
            )}
          </div>
        </div>
      )}
      {!isSearchPhotoRela && (
        <div className="col-span-4">
          <p className="mt-[8px] text-color-text text-[1.625rem] font-bold">
            MEMBERS{" "}
            <span className=" text-color-primary-dark text-[1.625rem] font-bold">
              {searchResult.length}
            </span>
          </p>
          <div className="grid grid-cols-4 gap-[16px] mt-[32px]">
            {searchResult.length > 0 ? (
              searchResult.map((item, index) => (
                <Link key={index} to={`/profile/${item._id}`}>
                  <SNCard
                    name={item.fullName}
                    coverPicture={item.coverPicture}
                    avatar={item.avatar}
                    quantityCount={[
                      {
                        name: "posts",
                        quantity: item.postCount,
                      },
                      {
                        name: "friends",
                        quantity: item.friends.length,
                      },
                      {
                        name: "groups",
                        quantity: item.groups.length,
                      },
                    ]}
                    username={item.username}
                  />
                </Link>
              ))
            ) : (
              <div className="col-span-4 mt-[32px]">
                <SNNoResult />
              </div>
            )}
          </div>
          <p className="text-color-text-alt text-[0.75rem] font-semibold uppercase mt-10">
            Browse
          </p>
          <p className="mt-[8px] text-color-text text-[1.625rem] font-bold">
            Groups{" "}
            <span className=" text-color-primary-dark text-[1.625rem] font-bold">
              {searchResultGroup.length}
            </span>
          </p>
          <div className="grid grid-cols-4 gap-[16px] mt-[32px]">
            {searchResultGroup.length > 0 ? (
              searchResultGroup.map((item, index) => (
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
              <div className="col-span-4 mt-[32px]">
                <SNNoResult />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
export default SearchPage;
