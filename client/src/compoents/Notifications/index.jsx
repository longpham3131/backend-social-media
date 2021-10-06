import { useMemo } from "react";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";

import "./style.scss";

const Notifications = ({ response, onSuccess, title }) => {
  useMemo(() => {
    if (response === 200) {
      NotificationManager.success("Thành công", title);
      onSuccess();
    } else if (response === 400 || response === 500) {
      NotificationManager.error("Thất bại", title);
    }
  }, [response, title]);

  return <NotificationContainer />;
};
export default Notifications;
