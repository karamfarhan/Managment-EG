import { Fragment, useContext, useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "react-query";
import AuthContext from "../../../context/Auth-ctx";
import classes from "./EmpolyeeId.module.css";
import ImgModel from "../../UI/imgModel/ImgModel";
const EmpolyeeId = () => {
  const [imgSrc, setImgSrc] = useState("");
  const [imgModel, setImgModel] = useState(false);
  const authCtx = useContext(AuthContext);
  const { token } = authCtx;

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
  };

  if (!empolyee) return;
  return (
    <Fragment>
      {imgModel && (
        <ImgModel imgSrc={imgSrc} closeModelHandler={closeModelHandler} />
      )}
      <div dir="rtl" className={classes["table_content"]}>
        <table>
          <tr>
            <th>أسم الموظف</th>
            <td>{empolyee.name}</td>
          </tr>
          <tr>
            <th>المسمي الوظيفي</th>
            <td>{empolyee.type}</td>
          </tr>

          <tr>
            <th>البريد الاكتروني</th>
            <td>{empolyee.email}</td>
          </tr>

          <tr>
            <th>رقم الهاتف</th>
            <td>{empolyee.number}</td>
          </tr>

          <tr>
            <th>سنوات الخبرة</th>
            <td>{empolyee.years_of_experiance}</td>
          </tr>
          <tr>
            <th>تاريخ التوظيف</th>
            <td>{empolyee.signin_date}</td>
          </tr>

          <tr>
            <th>التأمين</th>
            <td>
              {empolyee.insurance === null && "لا يوجد تأمين"}
              {empolyee.insurance !== null && (
                <ul>
                  <li>
                    رقم التأمين <span>: {empolyee.insurance.ins_code}</span>
                  </li>
                  <li>
                    شركة التأمين <span>: {empolyee.insurance.ins_company}</span>
                  </li>
                  <li>
                    تاريخ التأمين <span>: {empolyee.insurance.start_at}</span>
                  </li>
                  <li>
                    نوع التأمين <span>: {empolyee.insurance.ins_type}</span>
                  </li>
                </ul>
              )}
            </td>
          </tr>
          <tr>
            <th>مقر العمل</th>
            <td>
              {empolyee.store_address === null
                ? "مقر الشركة"
                : empolyee.store_address}
            </td>
          </tr>
          <tr>
            <th>حالة الموظف</th>
            <td>{empolyee.is_primary ? "موظف دائم" : "موظف بعقد سنوي"}</td>
          </tr>
          <tr>
            <th>اثبات الشخصية</th>
            <td>
              <div>
                {empolyee.identity_image === null ? (
                  "لا يوجد"
                ) : (
                  <img
                    onClick={() => imgModelHandler(empolyee.identity_image)}
                    src={empolyee.identity_image}
                    alt="identity"
                  />
                )}
              </div>
            </td>
          </tr>

          <tr>
            <th>الفيش و التشبيه</th>
            <td>
              <div>
                {empolyee.criminal_record_image === null ? (
                  "لا يوجد"
                ) : (
                  <img
                    onClick={() =>
                      imgModelHandler(empolyee.criminal_record_image)
                    }
                    src={empolyee.criminal_record_image}
                    alt="criminal-record"
                  />
                )}
              </div>
            </td>
          </tr>
          <tr>
            <th>المؤهل الدراسي</th>
            <td>
              <div>
                {empolyee.certificate_image === null ? (
                  "لا يوجد"
                ) : (
                  <img
                    onClick={() => imgModelHandler(empolyee.certificate_image)}
                    src={empolyee.certificate_image}
                    alt="certificate_image"
                  />
                )}
              </div>
            </td>
          </tr>
          <tr>
            <th>شهادات أخري</th>
            <td>
              <div>
                {empolyee.experience_image === null ? (
                  "لا يوجد"
                ) : (
                  <img
                    onClick={() => imgModelHandler(empolyee.experience_image)}
                    src={empolyee.experience_image}
                    alt="experience_image"
                  />
                )}
              </div>
            </td>
          </tr>
        </table>
      </div>
    </Fragment>
  );
};

export default EmpolyeeId;
