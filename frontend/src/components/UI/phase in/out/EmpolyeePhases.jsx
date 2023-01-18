import { useState } from "react";
import { useContext } from "react";
import { useQuery } from "react-query";
import { useDispatch } from "react-redux";
import AuthContext from "../../../../context/Auth-ctx";
import { getEmpolyees } from "../../../../store/empolyees-slice";

import Backdrop from "../../backdrop/Backdrop";
import Inputs from "../../inputs/Inputs";
import classes from "./EmpolyeePhases.module.css";
const EmpolyeePhases = ({ id, hideForm, today_activity }) => {
  const dispatch = useDispatch();
  const authCtx = useContext(AuthContext);
  const { token } = authCtx;
  //states
  const [phases, setPhases] = useState({
    in: "",
    out: "",
  });

  console.log(today_activity.phase_out);
  console.log(today_activity);

  //send phase/in
  const { data: phaseIn, refetch: submitPhaseIn } = useQuery(
    "phase/in",
    async () => {
      try {
        const res = await fetch(
          `http://127.0.0.1:8000/employees/${id}/activity/`,
          {
            method: "POST",
            headers: {
              "Content-type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              phase_in: phases.in,
            }),
          }
        );

        if (res.ok) {
          dispatch(getEmpolyees(token));

          hideForm();
        }

        return await res.json();
      } catch (err) {}
    },
    { refetchOnWindowFocus: false, enabled: false }
  );
  //send phase/out
  const { data: phaseOut, refetch: submitPhaseOut } = useQuery(
    "phase/out",
    async () => {
      try {
        const res = await fetch(
          `http://127.0.0.1:8000/employees/${id}/activity/`,
          {
            method: "PATCH",
            headers: {
              "Content-type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              phase_out: phases.out,
              id: today_activity.id,
            }),
          }
        );
        const data = await res.json();
        console.log(data);
        if (res.ok) {
          dispatch(getEmpolyees(token));

          hideForm();
        }

        return await res.json();
      } catch (err) {}
    },
    { refetchOnWindowFocus: false, enabled: false }
  );

  console.log(phaseOut);

  //submit handler
  const submitHandler = (e) => {
    e.preventDefault();

    if (today_activity === false) {
      submitPhaseIn();
    }
    if (today_activity && today_activity.phase_out === null) {
      submitPhaseOut();
    }
  };

  return (
    <Backdrop hideModel={hideForm}>
      <form className={classes.form} onSubmit={submitHandler}>
        {today_activity === false && (
          <Inputs
            type="time"
            label="معاد الحضور"
            value={phases.in}
            onChange={(e) => setPhases({ ...phases, in: e.target.value })}
          />
        )}
        {today_activity && <p> معاد الحضور : {today_activity.phase_in} </p>}
        {today_activity && (
          <Inputs
            type="time"
            label="معاد الانصراف"
            value={phases.out}
            onChange={(e) => setPhases({ ...phases, out: e.target.value })}
          />
        )}

        <button type="submit">تأكيد</button>
      </form>
    </Backdrop>
  );
};

export default EmpolyeePhases;
