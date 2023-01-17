import { useState } from "react";
import { useContext } from "react";
import { useQuery } from "react-query";
import AuthContext from "../../../../context/Auth-ctx";

import Backdrop from "../../backdrop/Backdrop";
import Inputs from "../../inputs/Inputs";
import classes from "./EmpolyeePhases.module.css";
const EmpolyeePhases = ({ id, hideForm }) => {
  const authCtx = useContext(AuthContext);
  const { token } = authCtx;
  //states
  const [phases, setPhases] = useState({
    in: "",
    out: "",
  });

  //send data
  const { refetch: submitPhases } = useQuery(
    "phases",
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
              phase_out: phases.out,
            }),
          }
        );

        if (res.ok) {
          hideForm();
        }
        const data = await res.json();
        console.log(data);
      } catch (err) {}
    },
    { refetchOnWindowFocus: false, enabled: false }
  );

  //submit handler
  const submitHandler = (e) => {
    e.preventDefault();
    submitPhases();
  };

  return (
    <Backdrop hideModel={hideForm}>
      <form className={classes.form} onSubmit={submitHandler}>
        <Inputs
          type="time"
          label="معاد الحضور"
          value={phases.in}
          onChange={(e) => setPhases({ ...phases, in: e.target.value })}
        />
        <Inputs
          type="time"
          label="معاد الانصراف"
          value={phases.out}
          onChange={(e) => setPhases({ ...phases, out: e.target.value })}
        />
        <button type="submit">تأكيد</button>
      </form>
    </Backdrop>
  );
};

export default EmpolyeePhases;
