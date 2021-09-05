import "./style.scss";
import { Input } from "antd";
import _defaultAvatar from "../../../assets/images/default-avatar.jpg";

const { Search } = Input;
const Header = () => {
  const onSearch = (value) => console.log(value);
  return (
    <div className="header">
      <div className="header__content">
        <div className="logo">Social</div>
        <div className="searchInput">
          <Search
            placeholder="input search text"
            onSearch={onSearch}
            style={{ width: 200 }}
          />
        </div>
        <div className="listTab">
          <i class="fa fa-home"></i>
          <i class="fa fa-comments "></i>
          <i class="fa fa-heart"></i>

          <img src={_defaultAvatar} alt="avatar" />
        </div>
      </div>
    </div>
  );
};

export default Header;
