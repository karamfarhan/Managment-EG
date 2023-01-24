import { Fragment, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "react-query";
import AuthContext from "../../../context/Auth-ctx";
import { AiOutlinePhone } from "react-icons/ai";
import { MdOutlineMarkEmailUnread } from "react-icons/md";
import ImgModel from "../../UI/imgModel/ImgModel";
import DeleteConfirmation from "../../UI/delete_confirmation/DeleteConfirmation";
import { getEmpolyees } from "../../../store/empolyees-slice";
import { useDispatch, useSelector } from "react-redux";
import InsuranceSection from "./InsuranceSection";
import ImagesSecion from "./ImagesSecion";
import AboutSecion from "./AboutSecion";
import PhaseInOutSecion from "./PhaseInOutSecion";

//styles
import classes from "./EmpolyeeId.module.css";

const EmpolyeeId = () => {
  const dispatch = useDispatch();
  const [imgSrc, setImgSrc] = useState("");
  const [imgModel, setImgModel] = useState(false);
  //about page
  const [sections, setSections] = useState("general");
  const [isDelete, setIsDelete] = useState(false);
  const [staffId, setStaffId] = useState("");

  const { token } = useSelector((state) => state.authReducer);
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
                    <AboutSecion empolyee={empolyee} />
                  </div>
                )}
                {/* التأمينات */}

                {sections === "insurance" && (
                  <div className={classes.insurance}>
                    <InsuranceSection empolyee={empolyee} />
                  </div>
                )}

                {/* images */}

                {sections === "papers" && (
                  <div className={classes.imgs}>
                    <ImagesSecion
                      empolyee={empolyee}
                      imgModelHandler={imgModelHandler}
                    />
                  </div>
                )}

                {sections === "absence" && (
                  <div className={classes.absence}>
                    <PhaseInOutSecion id={empolyee.id} />
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
