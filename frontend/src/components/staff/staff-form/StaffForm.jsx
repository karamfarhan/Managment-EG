import { useState } from "react";
import { useQuery } from "react-query";
import { useSelector } from "react-redux";
import Inputs from "../../UI/inputs/Inputs";
import Insurance from "./insurance/Insurance";
import classes from "./StaffFrom.module.css";
const StaffForm = ({ setStaffForm }) => {
  const { token } = useSelector((state) => state.authReducer);

  const [isInsurance, setIsInsurance] = useState("");

  //form validation

  let formIsValid = false;

  const [data, setData] = useState("");
  //imgs
  const [identityImg, setIdentityImg] = useState("");
  const [certificateImg, setCertificateImg] = useState("");
  const [experienceImg, setExperienceImg] = useState("");
  const [criminalRec, setCriminalRec] = useState("");

  //steps
  const [steps, setSteps] = useState(1);

  //empolyee data
  const [empolyeeData, setEmpolyeeData] = useState({
    name: "",
    type: "",
    email: "",
    number: "",
    years_of_experiance: 0,
    days_off: "",
    note: "",
    location: "",
    is_primary: "",
    signin_date: "",
  });

  //insurance data
  const [insuranceData, setInsuranceData] = useState({
    ins_code: "",
    ins_type: "",
    ins_company: "",
    start_at: "",
  });
  const { ins_code, ins_type, ins_company, start_at } = insuranceData;

  const {
    name,
    type,
    email,
    number,
    years_of_experiance,
    days_off,
    note,
    is_primary,
    location,
    signin_date,
  } = empolyeeData;

  //validation
  if (
    steps === 1 &&
    name.trim() !== "" &&
    type.trim() !== "" &&
    email.trim() !== "" &&
    email.includes("@") &&
    signin_date.trim() !== "" &&
    is_primary !== ""
  ) {
    formIsValid = true;
  }
  //validation insurance
  if (
    (steps === 2 &&
      isInsurance === "true" &&
      ins_code.trim() !== "" &&
      ins_company.trim() !== "" &&
      ins_type.trim("") &&
      start_at.trim() !== "") ||
    isInsurance === "false"
  ) {
    formIsValid = true;
  }

  //images
  //setbackground function
  const fileTypes = [
    "image/apng",
    "image/bmp",
    "image/gif",
    "image/jpeg",
    "image/pjpeg",
    "image/png",
    "image/svg+xml",
    "image/tiff",
    "image/webp",
    "image/x-icon",
  ];
  function validFileType(file) {
    return fileTypes.includes(file.type);
  }

  function identityImgHandler(e) {
    if (validFileType) {
      setIdentityImg(e.target.files[0]);
    }
  }
  function criminalRecHandler(e) {
    if (validFileType) {
      setCriminalRec(e.target.files[0]);
    }
  }

  function experienceImgHandler(e) {
    if (validFileType) {
      setExperienceImg(e.target.files[0]);
    }
  }

  function certificateImgHandler(e) {
    if (validFileType) {
      setCertificateImg(e.target.files[0]);
    }
  }

  //select locations
  const { data: stores } = useQuery(
    "fetch/locations",
    async () => {
      const res = await fetch("http://127.0.0.1:8000/stores/select_list/", {
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

  //send empolyee data
  const sendEmpolyeeData = async () => {
    setData("");

    const formdata = new FormData();
    formdata.append("name", name);
    formdata.append("number", number);
    formdata.append("identity_image", identityImg);
    formdata.append("experience_image", experienceImg);
    formdata.append("certificate_image", certificateImg);
    formdata.append("criminal_record_image", criminalRec);
    formdata.append("type", type);
    formdata.append("signin_date", signin_date);
    formdata.append("email", email);
    formdata.append("is_primary", is_primary);
    formdata.append("note", note);
    if (location !== "") {
      formdata.append("store", location);
    }
    formdata.append("days_off", days_off);
    formdata.append("years_of_experiance", years_of_experiance);
    if (
      Object.values(insuranceData).some(
        (x) => x !== "" && isInsurance === "true"
      )
    ) {
      formdata.append("insurance.ins_code", ins_code);
      formdata.append("insurance.ins_type", ins_type);
      formdata.append("insurance.start_at", start_at);
      formdata.append("insurance.ins_company", ins_company);
    }

    try {
      const res = await fetch("http://127.0.0.1:8000/employees/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formdata,
      });
      if (res.ok) {
        setStaffForm(false);
      }

      //setStaffForm(false);
      const data = await res.json();
      if (!res.ok) {
        setData(data);
      }
      console.log(data);
    } catch (err) {
      console.log(err);
    }
  };

  //submit handler
  const submitHandler = (e) => {
    e.preventDefault();
    sendEmpolyeeData();
  };

  //next step
  const nextStepHandler = () => {
    if (steps === 3) return;
    setSteps((prev) => prev + 1);
  }; //prev step
  const PrevStepHandler = () => {
    if (steps === 1) {
      setStaffForm(false);
    }
    setSteps((prev) => prev - 1);
  };

  return (
    <form className={classes.form} onSubmit={submitHandler}>
      <h3> برجاء ادخال بيانات الموظف </h3>

      {/* main data  */}
      <div>
        {steps === 1 && (
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
            {data && data.name && <p className="err-msg"> {data.name} </p>}
            <Inputs
              required
              value={number}
              onChange={(e) =>
                setEmpolyeeData({ ...empolyeeData, number: e.target.value })
              }
              type="tel"
              placeholder="رقم الهاتف"
            />
            <Inputs
              required
              value={email}
              onChange={(e) =>
                setEmpolyeeData({ ...empolyeeData, email: e.target.value })
              }
              type="email"
              placeholder="البريد الألكتروني"
            />
            <Inputs
              required
              value={type}
              onChange={(e) =>
                setEmpolyeeData({ ...empolyeeData, type: e.target.value })
              }
              type="text"
              placeholder="المسمي الوظيفي"
            />
            <Inputs
              required
              value={signin_date}
              label="تاريخ التوظيف"
              onChange={(e) =>
                setEmpolyeeData({
                  ...empolyeeData,
                  signin_date: e.target.value,
                })
              }
              type="date"
              placeholder="تاريخ التوظيف"
            />
            <Inputs
              id="experience"
              label="سنوات الخبرة"
              value={years_of_experiance}
              onChange={(e) =>
                setEmpolyeeData({
                  ...empolyeeData,
                  years_of_experiance: e.target.value,
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
            </div>
            {is_primary === "false" && (
              <div className={classes.select}>
                <select
                  value={location}
                  onChange={(e) =>
                    setEmpolyeeData({
                      ...empolyeeData,
                      location: e.target.value,
                    })
                  }>
                  <option selected hidden>
                    موقع الشركة
                  </option>

                  {stores &&
                    stores.map((location) => {
                      return (
                        <option key={location.pk} value={location.pk}>
                          {location.address}
                        </option>
                      );
                    })}
                </select>
              </div>
            )}
          </div>
        )}

        {/* <Inputs value = {name} onChange={(e)=>setEmpolyeeData({...empolyeeData, name : e.target.value})} type="text" placeholder=" تاريخ التعيين" /> */}

        {steps === 2 && (
          <div>
            <div className={classes.select}>
              <select
                value={isInsurance}
                onChange={(e) => setIsInsurance(e.target.value)}>
                <option selected hidden>
                  التأمين
                </option>
                <option value={true}>نعم</option>
                <option value={false}>لا</option>
              </select>
            </div>
            {/* Insurance  */}
            {isInsurance === "true" && (
              <Insurance
                ins_code={ins_code}
                ins_company={ins_company}
                ins_type={ins_type}
                start_at={start_at}
                setInsuranceData={setInsuranceData}
                insuranceData={insuranceData}
                data={data}
              />
            )}
          </div>
        )}

        {/* Insurance  */}

        {steps === 3 && (
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
        )}
      </div>
      <div className={classes.actions}>
        {steps === 3 && <button type="submit">اضافة</button>}
      </div>

      <div className={classes.arrows}>
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
      </div>
    </form>
  );
};

export default StaffForm;
