import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getEmpolyees } from "../../../store/empolyees-slice";
import Backdrop from "../backdrop/Backdrop";
import classes from "./Phases.module.css";
const Phases = ({ employeeActivity, hideModel, setCurrentPage }) => {
  const [time, setTime] = useState("");
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.authReducer);
  const { id, today_activity } = employeeActivity;
  console.log(employeeActivity);
  //send phase/in
  const sendPhaseIn = async () => {
    let phasesBody = {};

    if (today_activity === undefined) {
      phasesBody = {
        phase_in: time,
      };
    }
    if (today_activity !== undefined) {
      phasesBody = {
        phase_out: time,
        id: today_activity,
      };
    }
    try {
      const res = await fetch(`${window.domain}/employees/${id}/activity/`, {
        method: today_activity === undefined ? "POST" : "PATCH",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(phasesBody),
      });
      if (res.ok) {
        dispatch(getEmpolyees(token));
        hideModel();
      }
      const data = await res.json();
      console.log(data);
    } catch (err) {}
  };

  //submit handler
  const submitHandler = (e) => {
    e.preventDefault();
    sendPhaseIn();
    setCurrentPage(1);
  };

  //change handler
  const onChangeHandler = (e) => {
    setTime(e.target.value);
  };

  return (
    <Backdrop hideModel={hideModel}>
      <form onSubmit={submitHandler} className={classes.phase_form}>
        <h3>
          {" "}
          {today_activity === false || today_activity === undefined
            ? "وقت الحضور"
            : "وقت الانصراف"}{" "}
        </h3>
        <input type="time" onChange={onChangeHandler} />
        <button type="submit">تأكيد</button>
      </form>
    </Backdrop>
  );
};

export default Phases;
