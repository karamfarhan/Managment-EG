import { useState } from "react";
import { useQuery } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import Inputs from "../../../UI/inputs/Inputs";
import classes from "./EditEmpolyee.module.css";
import { useSelector } from "react-redux";
import { getEmpolyees } from "../../../../store/empolyees-slice";
const EditEmpolyee = () => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.authReducer);
  const navigate = useNavigate();

  const params = useParams();
  const { data: empolyeeId } = useSelector((state) => state.empolyeeReducer);
  const selectedEmpolyee =
    empolyeeId &&
    empolyeeId.results &&
    empolyeeId.results.employees.find((el) => el._id === params.empId);

  const [data, setData] = useState("");
  console.log(selectedEmpolyee);
  //empolyee data
  const [empolyeeData, setEmpolyeeData] = useState({
    name: selectedEmpolyee.name,
    job: selectedEmpolyee.job,
    category: selectedEmpolyee.category,
    dateOfWork: selectedEmpolyee.dateOfWork,
    experience: selectedEmpolyee.experience,
    phone: selectedEmpolyee.phone,
    email: selectedEmpolyee.email,
    days_off: selectedEmpolyee.days_off,
    insurance: selectedEmpolyee.insurance,
    location: selectedEmpolyee.location,
  });

  //insurance data

  // const [isInsurance, setIsInsurance] = useState(
  //   Object.values(insuranceData).some((x) => x !== "")
  // );

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
  const nameVar = selectedEmpolyee && selectedEmpolyee.name;
  const emailVar = selectedEmpolyee && selectedEmpolyee.email;
  const typeVar = selectedEmpolyee && selectedEmpolyee.job;
  const numVar = selectedEmpolyee && selectedEmpolyee.phone;
  const yearsVar = selectedEmpolyee && selectedEmpolyee.experience;
  const daysVar = selectedEmpolyee && selectedEmpolyee.days_off;
  const signInVar = selectedEmpolyee && selectedEmpolyee.signin_date;
  const noteVar = selectedEmpolyee && selectedEmpolyee.note;
  console.log(params.empId);
  const { data: empolyee } = useQuery(
    "get/empolyee",
    async () => {
      //setIsLoading(true);
      try {
        const res = await fetch(`${window.domain}employees/${params.empId}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const selectedEmpolyee = await res.json();
        setEmpolyeeData({
          name: selectedEmpolyee.employee.name,
          type: selectedEmpolyee.type,
          email: selectedEmpolyee.email,
          number: selectedEmpolyee.number,
          years_of_experiance: selectedEmpolyee.years_of_experiance,
          days_off: selectedEmpolyee.days_off,
          note: selectedEmpolyee.note,
          employee_category: selectedEmpolyee.employee_category,
          location:
            selectedEmpolyee.store_address === null
              ? ""
              : selectedEmpolyee.store_address,
          storePk:
            selectedEmpolyee.is_primary === true ? "" : selectedEmpolyee.store,
          is_primary: selectedEmpolyee.is_primary,
          signin_date:
            selectedEmpolyee.signin_date === null
              ? ""
              : selectedEmpolyee.signin_date,
        });

        return data;
        //setIsLoading(false);
      } catch (err) {}
    },
    { refetchOnWindowFocus: false }
  );

  //select locations
  const { data: stores } = useQuery(
    "fetch/locations",
    async () => {
      const res = await fetch(`${window.domain}stores/select-store`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      return data;
    },
    { refetchOnWindowFocus: false }
  );

  function removeDublicate(bodyKey, vars, key, val, formdata) {
    if (bodyKey !== vars) {
      formdata.append(key, val);
    }
    return formdata;
  }

  //send empolyee data
  const sendEmpolyeeData = async () => {
    setData("");

    const formdata = new FormData();

    removeDublicate(name, nameVar, "name", name, formdata);
    removeDublicate(phone, numVar, "number", phone, formdata);
    removeDublicate(job, typeVar, "type", job, formdata);
    removeDublicate(dateOfWork, signInVar, "signin_date", dateOfWork, formdata);
    removeDublicate(email, emailVar, "email", email, formdata);
    removeDublicate(days_off, daysVar, "days_off", days_off, formdata);
    removeDublicate(
      experience,
      yearsVar,
      "years_of_experiance",
      experience,
      formdata
    );

    try {
      const res = await fetch(`${window.domain}employees/${params.empId}/`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-type": "application/json",
        },
        body: JSON.stringify(empolyeeData),
      });
      if (res.ok) {
        dispatch(getEmpolyees(token));
        navigate("/staff");
      }

      //setStaffForm(false);
      const data = await res.json();
      console.log(data);
      if (!res.ok) {
        setData(data);
      }
    } catch (err) {
      //setStaffForm(true);
    }
  };
  console.log(stores);
  //submit handler
  const submitHandler = (e) => {
    e.preventDefault();
    sendEmpolyeeData();
  };

  console.log(location);
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
              <option selected>مؤمن عليه ؟</option>ْ
              <option value={true}>نعم</option>
              <option value={false}>لا</option>
            </select>
          </div>

          <div className={classes.select}>
            <select
              value={location}
              onChange={(e) =>
                setEmpolyeeData({
                  ...empolyeeData,
                  location: e.target.value === "" ? null : e.target.value,
                })
              }>
              <option value="">موقع الشركة</option>

              {stores &&
                stores.data.stores.map((location) => {
                  return (
                    <option key={location._id} value={location._id}>
                      {location.store_address}
                    </option>
                  );
                })}
            </select>
          </div>
        </div>
      </div>
      <div className={classes.actions}>
        <button type="submit">اضافة</button>
      </div>
    </form>
  );
};

export default EditEmpolyee;
