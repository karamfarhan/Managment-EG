import { useState } from "react";
import { useQuery } from "react-query";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import Inputs from "../../../UI/inputs/Inputs";
import EditInsurance from "./editInsurance/EditInsurance";
import classes from "./EditEmpolyee.module.css";
import { useSelector } from "react-redux";
import { getEmpolyees } from "../../../../store/empolyees-slice";
const EditEmpolyee = () => {
  const dispatch = useDispatch();
  const locations = useLocation();
  const { token } = useSelector((state) => state.authReducer);
  const navigate = useNavigate();

  const params = useParams();
  const [steps, setSteps] = useState(1);
  const { data: empolyeeId } = useSelector((state) => state.empolyeeReducer);

  const selectedEmpolyee =
    empolyeeId &&
    empolyeeId.results &&
    empolyeeId.results.find((el) => el.id === parseInt(params.empId));

  const [data, setData] = useState("");
  //imgs
  const [identityImg, setIdentityImg] = useState(
    selectedEmpolyee.identity_image
  );
  const [certificateImg, setCertificateImg] = useState(
    selectedEmpolyee.certificate_image
  );
  const [experienceImg, setExperienceImg] = useState(
    selectedEmpolyee.experience_image
  );
  const [criminalRec, setCriminalRec] = useState(
    selectedEmpolyee.criminal_record_image
  );

  //empolyee data
  const [empolyeeData, setEmpolyeeData] = useState({
    name: selectedEmpolyee.name,
    type: selectedEmpolyee.type,
    email: selectedEmpolyee.email,
    number: selectedEmpolyee.number,
    years_of_experiance: selectedEmpolyee.years_of_experiance,
    days_off: selectedEmpolyee.days_off,
    note: selectedEmpolyee.note,
    location:
      selectedEmpolyee.store_address === null
        ? ""
        : selectedEmpolyee.store_address,
    is_primary: selectedEmpolyee.is_primary,
    signin_date: selectedEmpolyee.signin_date,
  });

  //insurance data
  const [insuranceData, setInsuranceData] = useState({
    ins_code: selectedEmpolyee.insurance && selectedEmpolyee.insurance.ins_code,
    ins_type: selectedEmpolyee.insurance && selectedEmpolyee.insurance.ins_type,
    ins_company:
      selectedEmpolyee.insurance && selectedEmpolyee.insurance.ins_company,
    start_at: selectedEmpolyee.insurance && selectedEmpolyee.insurance.start_at,
  });
  // const [isInsurance, setIsInsurance] = useState(
  //   Object.values(insuranceData).some((x) => x !== "")
  // );

  const { ins_code, ins_type, ins_company, start_at } = insuranceData;

  //INSURANCE FIRST RENDER
  const insCode =
      selectedEmpolyee.insurance && selectedEmpolyee.insurance.ins_code,
    insType = selectedEmpolyee.insurance && selectedEmpolyee.insurance.ins_type,
    insCompany =
      selectedEmpolyee.insurance && selectedEmpolyee.insurance.ins_company,
    startAt = selectedEmpolyee.insurance && selectedEmpolyee.insurance.start_at;

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
  const nameVar = selectedEmpolyee.name;
  const emailVar = selectedEmpolyee.email;
  const typeVar = selectedEmpolyee.type;
  const numVar = selectedEmpolyee.number;
  const yearsVar = selectedEmpolyee.years_of_experiance;
  const daysVar = selectedEmpolyee.days_off;
  const primVar = selectedEmpolyee.is_primary;
  const signInVar = selectedEmpolyee.signin_date;
  const noteVar = selectedEmpolyee.note;

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
      const res = await fetch(`${window.domain}/stores/select_list/`, {
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
    console.log(is_primary);

    setData("");

    const formdata = new FormData();

    if (nameVar !== name) {
      formdata.append("name", name);
    }

    if (number !== numVar) {
      formdata.append("number", number);
    }
    if (type !== typeVar) {
      formdata.append("type", type);
    }
    if (signin_date !== signInVar) {
      formdata.append("signin_date", signin_date);
    }

    if (emailVar !== email) {
      formdata.append("email", email);
    }
    if (daysVar !== days_off) {
      formdata.append("days_off", days_off);
    }
    if (yearsVar !== years_of_experiance) {
      formdata.append("years_of_experiance", years_of_experiance);
    }
    if (selectedEmpolyee.identity_image !== identityImg) {
      formdata.append("identity_image", identityImg);
    }
    if (selectedEmpolyee.experience_image !== experienceImg) {
      formdata.append("experience_image", experienceImg);
    }
    if (selectedEmpolyee.certificate_image !== certificateImg) {
      formdata.append("certificate_image", certificateImg);
    }
    if (selectedEmpolyee.criminal_record_image !== criminalRec) {
      formdata.append("criminal_record_image", criminalRec);
    }

    if (primVar !== is_primary) {
      console.log("d");

      formdata.append("is_primary", is_primary === "true" ? true : false);
    }
    if (is_primary !== "true") {
      console.log("d");
      formdata.append("store", location);
    }

    if (ins_code !== insCode) {
      formdata.append("insurance.ins_code", ins_code);
    }
    if (ins_type !== insType) {
      formdata.append("insurance.ins_type", ins_type);
    }
    if (start_at !== startAt) {
      formdata.append("insurance.start_at", start_at);
    }
    if (ins_company !== insCompany) {
      formdata.append("insurance.ins_company", ins_company);
    }
    if (note !== noteVar) {
      formdata.append("note", note);
    }
    try {
      const res = await fetch(
        `${window.domain}/employees/${parseInt(params.empId)}/`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formdata,
        }
      );
      if (res.ok) {
        dispatch(getEmpolyees(token));
        navigate("/staff");
      }

      //setStaffForm(false);
      const data = await res.json();
      if (!res.ok) {
        setData(data);
      }
      console.log(data);
    } catch (err) {
      //setStaffForm(true);
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
      navigate("/staff");
    }
    setSteps((prev) => prev - 1);
  };

  return (
    <form className={classes.form} onSubmit={submitHandler}>
      <h3> تعديل بيانات الموظف</h3>
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

            <div className={classes.select}>
              <label>مظف بمقر الشركة</label>
              <select
                value={is_primary}
                onChange={(e) =>
                  setEmpolyeeData({
                    ...empolyeeData,
                    is_primary: e.target.value,
                  })
                }
              >
                ْ<option disabled>موظف بمقر الشركة</option>ْ
                <option value={true}>نعم</option>
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
                  }
                >
                  <option selected hidden>
                    موقع العمل
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
            {/* <Inputs value = {name} onChange={(e)=>setEmpolyeeData({...empolyeeData, name : e.target.value})} type="text" placeholder=" تاريخ التعيين" /> */}

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
          </div>
        )}
        {steps === 2 && (
          <div>
            {/* Insurance  */}
            {Object.values(insuranceData).some((x) => x !== "") === true && (
              <EditInsurance
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
              }
            ></textarea>
          </div>
        )}
        {steps === 3 && (
          <div className={classes.actions}>
            <button type="submit">تعديل</button>{" "}
          </div>
        )}
        <div className={classes.arrows}>
          {steps !== 3 && (
            <button onClick={nextStepHandler} type="button">
              التالي
            </button>
          )}
          <button type="button" onClick={PrevStepHandler}>
            {" "}
            {steps === 1 ? "رجوع" : "السابق"}{" "}
          </button>
        </div>
      </div>
    </form>
  );
};

export default EditEmpolyee;
