import { useState } from "react";
import { useQuery } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import jwt_decode from "jwt-decode";

import Inputs from "../../UI/inputs/Inputs";
import classes from "./StaffFrom.module.css";
import { getEmpolyees } from "../../../store/empolyees-slice";
const StaffForm = ({ setStaffForm }) => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.authReducer);

  // const getStaff = permissions.some((el) => empolyeePremission.includes(el));
  //form validation

  const [data, setData] = useState("");
  //imgs
  // const [identityImg, setIdentityImg] = useState("");
  // const [certificateImg, setCertificateImg] = useState("");
  // const [experienceImg, setExperienceImg] = useState("");
  // const [criminalRec, setCriminalRec] = useState("");

  //steps
  const [steps, setSteps] = useState(1);

  //empolyee data
  const [empolyeeData, setEmpolyeeData] = useState({
    name: "",
    job: "",
    category: "",
    dateOfWork: "",
    experience: "",
    phone: "",
    email: "",
    days_off: "",
    insurance: "",
    location: "",
  });

  //insurance data
  // const [insuranceData, setInsuranceData] = useState({
  //   ins_code: "",
  //   ins_type: "",
  //   ins_company: "",
  //   start_at: "",
  // });
  // const { ins_code, ins_type, ins_company, start_at } = insuranceData;

  const {
    name,
    job,
    category,
    dateOfWork,
    experience,
    phone,
    email,
    days_off,
    insurance,
    location,
  } = empolyeeData;

  //validation
  let formIsValid = false;

  if (
    steps === 1 &&
    name.trim() !== "" &&
 
   
    insurance !== "" &&
    job.trim() !== "" &&
    category.trim() !== ""
  ) {
    formIsValid = true;
  }

  //select locations
  const { data: stores } = useQuery(
    "fetch/locations",
    async () => {
      const res = await fetch(`${window.domain}stores/select-store/`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      return data.data.stores;
    },
    { refetchOnWindowFocus: false }
  );
  //send empolyee data
  const sendEmpolyeeData = async () => {
    try {
      const res = await fetch(`${window.domain}employees/`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(empolyeeData),
      });
      if (res.ok) {
        // if (is_superuser || getStaff) {

        dispatch(getEmpolyees(token));
        // }
        //  navigate("/staff");
        setStaffForm(false);
      }
      //setStaffForm(false);
      const data = await res.json();
      console.log(data);
      if (!res.ok) {
        setData(data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  //submit handler
  const submitHandler = (e) => {
    e.preventDefault();

    sendEmpolyeeData();
  };
console.log(stores)
  return (
    <form className={classes.form} onSubmit={submitHandler}>
      <h3> برجاء ادخال بيانات الموظف </h3>

      {/* main data  */}
      <div>
        <div>
          <Inputs
            required
            value={name}
            onChange={(e) =>
              setEmpolyeeData({ ...empolyeeData, name: e.target.value })
            }
            type="text"
            placeholder="أسم الموظف"
          />
          <Inputs
            required
            value={job}
            onChange={(e) =>
              setEmpolyeeData({ ...empolyeeData, job: e.target.value })
            }
            type="text"
            placeholder="المسمي الوظيفي"
          />
          <div className={classes.select}>
            <select
              value={category}
              onChange={(e) =>
                setEmpolyeeData({
                  ...empolyeeData,
                  category: e.target.value,
                })
              }>
              <option selected hidden>
                تصنيف الموظف
              </option>
              <option value="engineer">مهندس</option>
              <option value="driver">سائق</option>
              <option value="accountant">محاسب</option>
              <option value="purchase">مشرف</option>
            </select>
          </div>
          {data && data.name && <p className="err-msg"> {data.name} </p>}
          <Inputs
            value={phone}
            onChange={(e) =>
              setEmpolyeeData({ ...empolyeeData, phone: e.target.value })
            }
            type="tel"
            placeholder="رقم الهاتف"
          />
          <Inputs
            value={email}
            onChange={(e) =>
              setEmpolyeeData({ ...empolyeeData, email: e.target.value })
            }
            type="email"
            placeholder="البريد الألكتروني"
          />

          <Inputs
            value={dateOfWork}
            label="تاريخ التوظيف"
            onChange={(e) =>
              setEmpolyeeData({
                ...empolyeeData,
                dateOfWork: e.target.value,
              })
            }
            type="date"
            placeholder="تاريخ التوظيف"
          />

          <Inputs
            id="experience"
            label="سنوات الخبرة"
            value={experience}
            onChange={(e) =>
              setEmpolyeeData({
                ...empolyeeData,
                experience: e.target.value,
              })
            }
            type="number"
            placeholder="سنوات الخبرة"
          />
          <Inputs
            value={days_off}
            id="day-off"
            label="عدد الاجازات"
            onChange={(e) =>
              setEmpolyeeData({ ...empolyeeData, days_off: e.target.value })
            }
            type="number"
            placeholder="عدد الاجازات"
          />
          <div className={classes.select}>
            <select
              value={insurance}
              onChange={(e) =>
                setEmpolyeeData({
                  ...empolyeeData,
                  insurance: e.target.value,
                })
              }>
              <option selected hidden>
                مؤمن عليه ؟
              </option>
              ْ<option value={true}>نعم</option>
              <option value={false}>لا</option>
            </select>
          </div>
          {/* <div className={classes.select}>
              <select
                value={is_primary}
                onChange={(e) =>
                  setEmpolyeeData({
                    ...empolyeeData,
                    is_primary: e.target.value,
                  })
                }>
                <option selected hidden>
                  موظف في مقر الشركة
                </option>
                ْ<option value={true}>نعم</option>
                <option value={false}>لا</option>
              </select>
            </div> */}

          <div className={classes.select}>
            <select
              value={location}
              onChange={(e) =>
                setEmpolyeeData({
                  ...empolyeeData,
                  location: e.target.value === "" ? null : e.target.value,
                })
              }>
              <option value={null}>موقع الشركة</option>

              {stores &&
                stores.map((location) => {
                  return (
                    <option key={location._id} value={location._id}>
                      {location.store_name}
                    </option>
                  );
                })}
            </select>
          </div>
        </div>

        {/* <Inputs value = {name} onChange={(e)=>setEmpolyeeData({...empolyeeData, name : e.target.value})} type="text" placeholder=" تاريخ التعيين" /> */}

        {/* Insurance  */}

        {/* {steps === 3 && (
          <div>
            <Inputs
              onChange={identityImgHandler}
              type="file"
              accept="image/png, image/jpeg, image/png"
              name="image_uploads"
              id="identity"
              label="صورة البطاقة/شهادة ميلاد"
            />
            <Inputs
              type="file"
              id="graduation"
              label="صورة المؤهل الدراسي"
              onChange={certificateImgHandler}
              accept="image/png, image/jpeg, image/png"
            />
            <Inputs
              type="file"
              id="certificate"
              label="صورة شهادات الخبرة"
              onChange={experienceImgHandler}
              accept="image/png, image/jpeg, image/png"
            />
            <Inputs
              type="file"
              id="criminal-record"
              label="صورة الفيش و التشبيه"
              onChange={criminalRecHandler}
              accept="image/png, image/jpeg, image/png"
            />
            <textarea
              placeholder="ملاحظة"
              value={note}
              onChange={(e) =>
                setEmpolyeeData({ ...empolyeeData, note: e.target.value })
              }></textarea>
          </div>
        )} */}
      </div>
      <div className={classes.actions}>
        <button type="submit" disabled={!formIsValid}>
          اضافة
        </button>
      </div>

      {/* <div className={classes.arrows}>
        {steps !== 3 && (
          <button
            onClick={nextStepHandler}
            type="button"
            disabled={!formIsValid}>
            التالي
          </button>
        )}
        <button type="button" onClick={PrevStepHandler}>
          {" "}
          {steps === 1 ? "رجوع" : "السابق"}{" "}
        </button>
      </div> */}
    </form>
  );
};

export default StaffForm;
