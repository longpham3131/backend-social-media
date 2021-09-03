import { useEffect } from "react";
import { useHistory } from "react-router";

const SocialMedia = () => {
  let history = useHistory();
  // Người dùng chưa đăng nhập
  useEffect(() => {
    if (!localStorage.getItem("accessToken")) {
      history.push("/auth");
    }
  }, []);

  return <div>SOCIAL MEDIA</div>;
};
export default SocialMedia;
