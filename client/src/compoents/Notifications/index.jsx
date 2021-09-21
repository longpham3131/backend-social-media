import { useMemo } from "react";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";

import "./style.scss";

const Notifications = ({ response, onSuccess, title }) => {
  useMemo(() => {
    if (response?.status === 200) {
      NotificationManager.success("Thành công", title);
      onSuccess();
    } else if (response?.status === 400 || response?.status === 500) {
      NotificationManager.error("Thất bại", response?.data?.message);
    }
  }, [response, title]);

  return <NotificationContainer />;
};
export default Notifications;
