import { Fragment, useState, useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import AuthContext from "../../../context/Auth-ctx";
import { getSubs } from "../../../store/create-substance";
import DeleteConfirmation from "../../UI/delete_confirmation/DeleteConfirmation";
import classes from "./SubstancesView.module.css";
const SubstancesView = () => {
  const { data: subsData } = useSelector((state) => state.subsReducer);

  const [isDelete, setIsDelete] = useState(false);
  const [instrumentId, setInstrumentId] = useState("");
  const dispatch = useDispatch();
  const authCtx = useContext(AuthContext);
  const { token } = authCtx;

  //delete handler


  const deleteHandler = async (id) => {
    

    try {
      const res = await fetch(`http://127.0.0.1:8000/substances/${id}/`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      const data = await res.json();
      console.log(data);
      console.log(res)

      setIsDelete(false);


          dispatch(getSubs(token));
    
      


    } catch (err) {}
  };

  //show delete mode
  const deleteModelHandler = (id) => {
    setIsDelete(true);
    setInstrumentId(id);
  };

  //hide delete mode
  const hideDeleteModel = () => {
    setIsDelete(false);
  };
  return (
    <Fragment>
      {isDelete && (
        <DeleteConfirmation
          hideModel={hideDeleteModel}
          deleteHandler={deleteHandler}
          id={instrumentId}
        />
      )}

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
                        <button onClick={() => deleteModelHandler(subs.id)}>
                          حذف
                        </button>
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

export default SubstancesView;
