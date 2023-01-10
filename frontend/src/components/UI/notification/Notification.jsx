import {useSelector} from 'react-redux'
import classes from "./Notification.module.css";
const Notification = () => {
    const {notification} = useSelector((state)=>state.notificationRed)
    console.log(notification)
  return (
    <div dir='rtl' className = {classes.notification} >
      <h3> خطأ</h3>
      <p>هنا لك خطأ ما حدث</p>
    </div>
  )
}

export default Notification
