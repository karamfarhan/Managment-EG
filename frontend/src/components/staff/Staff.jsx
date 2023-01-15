import { useState } from "react";
import Bar from "../UI/bars/Bar";
import { AiOutlineUserAdd } from "react-icons/ai";

//style
import classes from "./Staff.module.css";
import StaffForm from "./staff-form/StaffForm";
export const Staff = () => {
  //show staff form
  const [staffForm, setStaffForm] = useState(false);
  return (
    <div dir="rtl">
      {!staffForm && (
        <Bar>
          <button className={classes.btn} onClick={() => setStaffForm(true)}>
            انشاء موظف
            <span>
              <AiOutlineUserAdd />
            </span>
          </button>
        </Bar>
      )}

      {staffForm && <StaffForm setStaffForm={setStaffForm} />}
    </div>
  );
};
