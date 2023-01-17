import { Fragment, useContext, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "react-query";
import AuthContext from "../../../context/Auth-ctx";
import { AiOutlinePhone } from "react-icons/ai";
import { MdOutlineMarkEmailUnread } from "react-icons/md";
import classes from "./EmpolyeeId.module.css";
import ImgModel from "../../UI/imgModel/ImgModel";
import DeleteConfirmation from "../../UI/delete_confirmation/DeleteConfirmation";
import { getEmpolyees } from "../../../store/empolyees-slice";
import { useDispatch } from "react-redux";
const EmpolyeeId = () => {
  const dispatch = useDispatch();
  const [imgSrc, setImgSrc] = useState("");
  const [imgModel, setImgModel] = useState(false);
  //about page
  const [sections, setSections] = useState("general");
  const authCtx = useContext(AuthContext);
  const [isDelete, setIsDelete] = useState(false);
  const [staffId, setStaffId] = useState("");

  const { token } = authCtx;
  const navigate = useNavigate();

  const params = useParams();
  const { empolyeeId } = params;

  const { data: empolyee } = useQuery(
    "get/empolyee",
    async () => {
      try {
        const res = await fetch(
          `http://127.0.0.1:8000/employees/${empolyeeId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();
        console.log(data);
        return data;
      } catch (err) {}
    },
    { refetchOnWindowFocus: false }
  );

  //image model
  const imgModelHandler = (src) => {
    setImgModel(true);
    setImgSrc(src);
  };
  //hide image model
  const closeModelHandler = () => {
    setImgModel(false);
  }; //delete staff
  const deleteHandler = async (id) => {
    const res = await fetch(`http://127.0.0.1:8000/employees/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setIsDelete(false);
    if (res.ok) {
      navigate(`/staff`);
      dispatch(getEmpolyees(token));
    }
    const data = await res.json();

    return data;
  };
  //hide delete mode
  const hideDeleteModel = () => {
    setIsDelete(false);
  };
  //edit handler
  const editHanlder = (id) => {
    navigate(`/staff/edit/${id}`);
  };
  //show delete model
  const deleteModelHandler = (id) => {
    setIsDelete(true);
    setStaffId(id);
  };
  if (!empolyee) return;
  return (
    <Fragment>
      {imgModel && (
        <ImgModel imgSrc={imgSrc} closeModelHandler={closeModelHandler} />
      )}
      {isDelete && (
        <DeleteConfirmation
          deleteHandler={deleteHandler}
          id={staffId}
          hideModel={hideDeleteModel}
        />
      )}
      <div dir="rtl" className={classes.box}>
        <div className={classes.content}>
          <header>
            <div>
              {/* name  */}
              <div>
                <h3> {empolyee.name} </h3>
                <span> {empolyee.type} </span>
              </div>
            </div>
            <div className={classes.actions}>
              <button type="button" onClick={() => editHanlder(empolyee.id)}>
                تحديث البيانات
              </button>
              <button onClick={() => deleteModelHandler(empolyee.id)}>
                حذف
              </button>
            </div>
          </header>
          {/* body */}
          <div className={classes.body}>
            {/* connects */}
            <div className={classes.contacts}>
              <ul>
                <li>
                  <span>
                    <AiOutlinePhone />
                  </span>

                  <a href={`tel:${empolyee.number}`}>{empolyee.number}</a>
                </li>
                <li>
                  <span>
                    <MdOutlineMarkEmailUnread />{" "}
                  </span>
                  <a href={`mailto: ${empolyee.email}`}>{empolyee.email}</a>
                </li>
              </ul>
            </div>

            {/* activities */}

            <div className={classes.activities}>
              <ul>
                <li
                  className={sections === "general" ? classes.active : ""}
                  onClick={() => setSections("general")}>
                  معلومات عامة
                </li>
                <li
                  className={sections === "insurance" ? classes.active : ""}
                  onClick={() => setSections("insurance")}>
                  التأمينات
                </li>
                <li
                  className={sections === "papers" ? classes.active : ""}
                  onClick={() => setSections("papers")}>
                  الأوراق
                </li>
                <li
                  className={sections === "absence" ? classes.active : ""}
                  onClick={() => setSections("absence")}>
                  الحضور/الانصراف
                </li>
              </ul>
              <div>
                {/* about */}
                {sections === "general" && (
                  <div className={classes.about}>
                    <p>
                      تاريخ التوظيف : <span> {empolyee.signin_date} </span>{" "}
                    </p>
                    <p>
                      سنوات الخبرة :{" "}
                      <span> {empolyee.years_of_experiance}</span>
                    </p>
                    <p>
                      مقر العمل :
                      <span>
                        {empolyee.store_address === null
                          ? "مقر الشركة"
                          : empolyee.store_address}{" "}
                      </span>
                    </p>
                    <p>
                      نوع العقد :
                      <span>
                        {empolyee.is_primary === true
                          ? "موظف دائم"
                          : "موظف بعقد مؤقت"}{" "}
                      </span>
                    </p>
                    <p>
                      عدد الأجازات :<span>{empolyee.days_off} </span>
                    </p>
                  </div>
                )}
                {/* التأمينات */}

                {sections === "insurance" && (
                  <div className={classes.insurance}>
                    {empolyee.insurance === null && <p> ليس مؤمن عليه </p>}
                    {empolyee.insurance && (
                      <ul>
                        <li>
                          رقم التأمين :{" "}
                          <span> {empolyee.insurance.ins_code} </span>
                        </li>
                        <li>
                          شركة التأمين :{" "}
                          <span> {empolyee.insurance.ins_company} </span>
                        </li>
                        <li>
                          نوع التأمين :{" "}
                          <span> {empolyee.insurance.ins_type} </span>
                        </li>
                        <li>
                          تاريخ التأمين :{" "}
                          <span> {empolyee.insurance.start_at} </span>
                        </li>
                      </ul>
                    )}
                  </div>
                )}

                {/* images */}

                {sections === "papers" && (
                  <div className={classes.imgs}>
                    {empolyee.identity_image !== null ? (
                      <figure>
                        <img
                          src={empolyee.identity_image}
                          alt="identity"
                          onClick={() =>
                            imgModelHandler(empolyee.identity_image)
                          }
                        />
                        <figcaption>اثبات الشخصية</figcaption>
                      </figure>
                    ) : (
                      ""
                    )}
                    {empolyee.certificate_image !== null ? (
                      <figure>
                        <img
                          src={empolyee.certificate_image}
                          alt="certificate"
                          onClick={() =>
                            imgModelHandler(empolyee.certificate_image)
                          }
                        />
                        <figcaption>شهادة التخرج </figcaption>
                      </figure>
                    ) : (
                      ""
                    )}
                    {empolyee.criminal_record_image !== null ? (
                      <figure>
                        <img
                          onClick={() =>
                            imgModelHandler(empolyee.criminal_record_image)
                          }
                          src={empolyee.criminal_record_image}
                          alt="criminal-record"
                        />
                        <figcaption>فيش و تشبيه</figcaption>
                      </figure>
                    ) : (
                      ""
                    )}
                    {empolyee.experience_image !== null ? (
                      <figure>
                        <img
                          src={empolyee.experience_image}
                          alt="experience"
                          onClick={() =>
                            imgModelHandler(empolyee.experience_image)
                          }
                        />
                        <figcaption>شهادات الخبرة</figcaption>
                      </figure>
                    ) : (
                      ""
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default EmpolyeeId;