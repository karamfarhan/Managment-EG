import {Fragment} from 'react'
import { useSelector } from "react-redux";
import classes from "./Instruments.module.css";
const InstrumentsView = () => {
  const { data: instrumentsData } = useSelector(
    (state) => state.instrumentsReducer
  );

  return (

 <Fragment>
     
    <div className={classes["table_content"]}>
      {instrumentsData && instrumentsData.results.length === 0 && (
        <p className={classes.msg_p}> لا يوجد أجهزة </p>
      )}

 


      {instrumentsData && instrumentsData.results.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>أسم الاله</th>
              <th>أخر صيانة</th>
              <th>متوافرة في المخزن</th>
              <th>الحالة</th>
              <th>تاريخ الاضافة</th>
              <th>معلومات اضافية</th>
              <th>حدث</th>
            </tr>
          </thead>
          <tbody>
            {instrumentsData &&
              instrumentsData.results &&
              instrumentsData.results.map((insruments) => {
                return (
                  <tr key={insruments.id}>
                    <td>{insruments.name}</td>
                    <td>{insruments.last_maintain}</td>
                    <td>{insruments.in_action === false ? "متواجدة" : "خارج المخزن"}</td>

                    <td>{insruments.is_working ? "تعمل" : "معطلة"}</td>
                    <td>
                      {new Date(insruments.created_at).toLocaleDateString()}
                    </td>

                    <td>{insruments.description}</td>

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
 </Fragment>
  );
};

export default InstrumentsView;
