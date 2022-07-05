import { Input, Popover } from "antd";
import React, { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { SearchOutlined } from "@ant-design/icons";
import { debounce } from "lodash";
const Searchbar = () => {
  let navigate = useNavigate();

  const [isShowBoxResult, setIsShowBoxResult] = useState(false);
  const debounceSearch = useCallback(
    debounce((keySearch) => {
      if (!keySearch) {
        setIsShowBoxResult(false);
        return;
      }
      setIsShowBoxResult(true);
    }, 500),
    []
  );
  return (
    <div className="header-searchbar">
      <Popover
        placement="bottom"
        overlayClassName="header-searchbar-box"
        content={
          <div className="header-searchbar-box-result">
            <div className="header-searchbar-box-result-category">
              <p className="header-searchbar-box-result-category-name">
                MEMBERS
              </p>
              {/* kết quả không tìm thấy */}
              <p className="header-searchbar-box-no-result">NO RESULTS FOUND</p>
            </div>
            <div className="header-searchbar-box-result-category">
              <p className="header-searchbar-box-result-category-name">
                GROUPS
              </p>
              {/* kết quả không tìm thấy */}
              <p className="header-searchbar-box-no-result">NO RESULTS FOUND</p>
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
        />
      </Popover>
    </div>
  );
};

export default Searchbar;
