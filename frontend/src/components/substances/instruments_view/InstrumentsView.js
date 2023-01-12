import {Fragment, useState, useContext} from 'react'
import { useSelector, useDispatch } from "react-redux";
import {useNavigate, Routes , Route} from 'react-router-dom'
import AuthContext from "../../../context/Auth-ctx";
import DeleteConfirmation from "../../UI/delete_confirmation/DeleteConfirmation";
import { deleteInstruments } from '../../../store/create-instruments';
import EditFormInstrum from '../edit-form-isntruments/EditFormInstrum';
import Paginate from "../../UI/pagination/Paginate";
import classes from "./Instruments.module.css";
import { instrumentsPagination } from '../../../store/create-instruments';
const InstrumentsView = ({currentPage, setCurrentPage}) => {
  const authCtx = useContext(AuthContext);

  const { token } = authCtx;
  const dispatch = useDispatch()
  const [isDelete, setIsDelete] = useState(false);
  const [instrumentId, setInstrumentId] = useState("");


  const { data: instrumentsData } = useSelector(
    (state) => state.instrumentsReducer
  );


  
  //pagination
  const instrumentsCount = instrumentsData && instrumentsData.count;

  //pagination
  const paginationFun = (obj) => {
    dispatch(instrumentsPagination(obj));
  };

  //delete handler
  const deleteHandler = (id) => {
    const obj = {
      id,
      token,
    };
    dispatch(deleteInstruments(obj));
    setIsDelete(false);
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



    const navigate = useNavigate()
  //edit instruments form
  const editInstrumentsForm = (id) => {
    navigate(`/create_subs/instrument/${id}`);
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
      {instrumentsData && instrumentsData.results.length === 0 && (
        <p className={classes.msg_p}> لا يوجد أجهزة </p>
      )}

        <Routes>
        <Route path = "/instrument/:edit" element = {<EditFormInstrum instruments ={instrumentsData} setCurrentPage={setCurrentPage} />}  />
        </Routes>


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
                      <button onClick = {()=>editInstrumentsForm(insruments.id)}>تعديل</button>
                      <button onClick={() => deleteModelHandler(insruments.id)} >حذف</button>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      )}
      {instrumentsCount > 10 && (
        <Paginate
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          count={instrumentsCount}
          paginationFun={paginationFun}
        />
      )}
    </div>
 </Fragment>
  );
};

export default InstrumentsView;
