import { useState } from "react";
import Inputs from "../../UI/inputs/Inputs";
import classes from "./StaffFrom.module.css";
const StaffForm = ({ setStaffForm }) => {
  const [isInsurance, setIsInsurance] = useState(false);

  console.log(isInsurance);
  return (
    <form className={classes.form}>
      <h3> برجاء ادخال بيانات الموظف </h3>

      <Inputs type="text" placeholder="أسم الموظف" />
      <Inputs type="text" placeholder="المسمي الوظيفي" />
      <Inputs type="text" placeholder=" تاريخ التعيين" />
      <Inputs type="email" placeholder="البريد الألكتروني" />
      <Inputs type="number" placeholder="عدد الاجازات" />
      <div className={classes.select}>
        <select
          value={isInsurance}
          onChange={(e) => setIsInsurance(e.target.value)}>
          <option selected hidden>
            التأمين
          </option>
          <option selected hidden>
            نعم
          </option>
          <option value={true}>نعم</option>
          <option value={false}>لا</option>
        </select>
      </div>
      {isInsurance === "true" && (
        <div>
          <h3>بيانات التأمين</h3>
          <Inputs
            type="date"
            placeholder="الرقم التأميني"
            label="بداية التأمين"
          />
          <Inputs type="text" placeholder="الرقم التأميني" />
          <Inputs type="text" placeholder="نوع التأمين" />
          <Inputs type="text" placeholder="شركة التأمين" />
        </div>
      )}
      <Inputs type="file" id="identity" label="صورة البطاقة/شهادة ميلاد" />
      <Inputs type="file" id="graduation" label="صورة المؤهل الدراسي" />
      <Inputs type="file" id="certificate" label="صورة شهادات الخبرة" />
      <Inputs type="file" id="criminal-record" label="صورة الفيش و التشبيه" />
      <div className={classes.actions}>
        <button type="submit">اضافة</button>{" "}
        <button type="button" onClick={() => setStaffForm(false)}>
          الغاء
        </button>
      </div>
    </form>
  );
};

export default StaffForm;
