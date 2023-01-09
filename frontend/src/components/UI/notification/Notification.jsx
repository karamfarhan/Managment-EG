import { MdOutlineDownloadDone } from "react-icons/md";
import { AiFillWarning } from "react-icons/ai";
import classes from "./Notification.module.css";

const Notification = ({ status, message }) => {
  return (
    <div className={classes.notification}>
      <div>
        <AiFillWarning />
      </div>
      <div>
        <h4>نجح</h4>
        <p>تم انشاء مخزن</p>
      </div>
    </div>
  );
};

export default Notification;
