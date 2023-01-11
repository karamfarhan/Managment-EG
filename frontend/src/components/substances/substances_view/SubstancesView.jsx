import { useSelector } from "react-redux";
import classes from "./SubstancesView.module.css";
const SubstancesView = () => {
  const { data: subsData } = useSelector((state) => state.subsReducer);

  return (
    <div className={classes["table_content"]}>
      {subsData && subsData.results.length === 0 && (
        <p className={classes.msg_p}> لا يوجد مواد </p>
      )}

      {subsData && subsData.results.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>أسم الخامة</th>
              <th>الكمية</th>
              <th>الوصف</th>
              <th>متوافر</th>
              <th>تاريخ الاضافة</th>
              <th>حدث</th>
            </tr>
          </thead>
          <tbody>
            {subsData &&
              subsData.results &&
              subsData.results.map((subs) => {
                return (
                  <tr key={subs.id}>
                    <td>{subs.name}</td>
                    <td>
                      {subs.units} {subs.unit_type}
                    </td>
                    <td>{subs.description}</td>

                    <td>{subs.is_available ? "متوافر" : "غير متوافر"}</td>

                    <td>{new Date(subs.created_at).toLocaleDateString()}</td>

                    <td>
                      <button>تعديل</button>
                      <button>حذف</button>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default SubstancesView;
