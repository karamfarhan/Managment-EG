import { useContext } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "react-query";
import AuthContext from "../../../context/Auth-ctx";
import classes from "./EmpolyeeId.module.css";
const EmpolyeeId = () => {
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
  if (!empolyee) return;
  return (
    <div dir="rtl" className={classes["table_content"]}>
      <table>
        <thead>
          <th>أسم الموظف</th>
          <th>المسمي الوظيفي</th>
          <th>البريد الاكتروني</th>
          <th>رقم الهاتف</th>
          <th>سنوات الخبرة</th>
          <th>تاريخ التوظيف</th>
          <th>التأمين</th>
          <th>مقر العمل</th>
          <th>حالة الموظف</th>
          <th>اثبات الشخصية</th>
          <th>الفيش و التشبيه</th>
          <th>المؤهل الدراسي</th>
          <th>شهادات أخري</th>
        </thead>

        <tbody>
          <tr>
            <td>{empolyee.name}</td>
            <td>{empolyee.type}</td>
            <td>{empolyee.email}</td>
            <td>{empolyee.number}</td>
            <td>{empolyee.years_of_experiance}</td>
            <td>{empolyee.signin_date}</td>
            <td>{empolyee.insurance === null ? "لا يوجد" : "مؤمن عليه"}</td>
            <td>{empolyee.store_address}</td>
            <td>{empolyee.is_primary ? "موظف دائم" : "موظف بعقد سنوي"}</td>
            <td>
              <div>
                <img src={empolyee.identity_image} alt="identity" />
              </div>
            </td>
            <td>
              <div>
                <img src={empolyee.criminal_record_image} alt="identity" />
              </div>
            </td>{" "}
            <td>
              <div>
                <img src={empolyee.certificate_image} alt="identity" />
              </div>
            </td>
            <td>
              <div>
                <img src={empolyee.experience_image} alt="identity" />
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default EmpolyeeId;
