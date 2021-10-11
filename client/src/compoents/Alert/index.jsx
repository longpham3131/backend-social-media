import { useEffect } from "react";
import { useMemo } from "react";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";
import { useDispatch, useSelector } from "react-redux";
import { setNotify } from "store/common/common.action";

import "./style.scss";

const Alert = ({ onSuccess, title }) => {
  const dispatch = useDispatch();
  const notifyReducer = useSelector((state) => state.commonReducer.notify);
  useEffect(() => {
    console.log(notifyReducer);
  }, [notifyReducer]);

  useMemo(() => {
    if (notifyReducer === 200) {
      NotificationManager.success("Thành công", title);
      onSuccess();
    } else if (notifyReducer === 400 || notifyReducer === 500) {
      NotificationManager.error("Thất bại", title);
    }
    dispatch(setNotify(null));
  }, [notifyReducer, title]);

  return <NotificationContainer />;
};
export default Alert;
