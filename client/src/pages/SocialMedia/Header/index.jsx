import "./style.scss";
import { Input } from "antd";
import _defaultAvatar from "../../../assets/images/default-avatar.jpg";
import { useState } from "react";
import Notifications from "./Notifications";

const { Search } = Input;
const Header = () => {
  const onSearch = (value) => console.log(value);

  return (
    <div className="header">
      <div className="header__content">
        <div className="logo">Social</div>
        <div className="searchInput">
          <Search
            placeholder="Tìm kiếm"
            onSearch={onSearch}
            style={{ width: 200 }}
          />
        </div>
        <div className="listTab">
          <div className="listTab__tabHome">
            <i class="fa fa-home"></i>
          </div>
          <div className="listTab__tabMessages">
            <i class="fa fa-comments "></i>
          </div>

          <Notifications />

          <img src={_defaultAvatar} alt="avatar" />
        </div>
      </div>
    </div>
  );
};

export default Header;
