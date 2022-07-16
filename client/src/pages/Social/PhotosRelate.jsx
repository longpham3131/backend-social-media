import React, { useCallback, useEffect, useState } from "react";
import { Input, List, message } from "antd";
import SNAvatar from "@/components/SNAvatar";
import { Link, useParams } from "react-router-dom";
import { debounce } from "lodash";
import userAPI from "@/apis/userAPI";
import { useSelector } from "react-redux";
import { UserAddOutlined, TeamOutlined } from "@ant-design/icons";
import SNCard from "@/components/SNCard";
import SNNoResult from "@/components/SNNoResult";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEarthAmericas, faLock } from "@fortawesome/free-solid-svg-icons";
import SNImage from "@/components/SNImage";
import postAPI from "@/apis/postAPI";

const { Search } = Input;
const PhotosRelate = () => {
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const myProfile = useSelector((state) => state.profile);
  const { searchKey } = useParams();
  const debounceSearch = useCallback(
    debounce((searchKey) => {
      fetchDataSearch(searchKey);
      // history.push(`/search-friend?search=${searchKey}`);
      // console.log("value", history.location.search.);
    }, 500),
    []
  );

  useEffect(() => {
    console.log("searchKey", searchKey);
    fetchDataSearch(searchKey);
  }, [searchKey]);

  const fetchDataSearch = async (searchKey) => {
    try {
      setLoading(true);
      const res = await postAPI.getPhotosRelate(searchKey);
      console.log("res", res.data.data);


      setSearchResult(res.data.data);
    } catch {
      message.error("Lỗi tìm kiếm người dùng");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col ">
      <p className="text-color-text-alt text-[0.75rem] font-semibold uppercase">
        Browse {searchKey}
      </p>
      <p className="mt-[8px] text-color-text text-[1.625rem] font-bold">
        Media{" "}
        <span className=" text-color-primary-dark text-[1.625rem] font-bold">
          {searchResult.length}
        </span>
      </p>
      <div className="grid grid-cols-6 gap-[16px] mt-[32px]">
        {searchResult.length ? (
          searchResult.map((item, index) => <SNImage media={item} key={index} />)
        ) : (
          <div className=" col-span-6 text-center">
            <SNNoResult />
          </div>
        )}
      </div>
    </div>
  );
};
export default PhotosRelate;
