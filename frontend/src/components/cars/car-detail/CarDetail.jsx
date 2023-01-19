import { Fragment, useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "react-query";
import Paginate from "../../UI/pagination/Paginate";
import AuthContext from "../../../context/Auth-ctx";
import classes from "./CarDetail.module.css";
import CarActivity from "../../UI/car-activity/CarActivity";
import CarDetailList from "./CarDetailList";
import { useDispatch, useSelector } from "react-redux";
import { getCarPagination } from "../../../store/car-activity";

const CarDetail = () => {
  const [showForm, setShowForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const authCtx = useContext(AuthContext);
  const { token } = authCtx;
  const dispatch = useDispatch();
  const params = useParams();

  const { carId, driverId } = params;

  const { data, refetch } = useQuery(
    "car/activity",
    async () => {
      try {
        const res = await fetch(
          `http://127.0.0.1:8000/cars/${carId}/activity/`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        return await res.json();
      } catch (err) {
        console.log(err);
      }
    },
    { refetchOnWindowFocus: false, enabled: false }
  );

  useEffect(() => {
    if (showForm === false && currentPage === 1) {
      refetch();
    }
  }, [currentPage, refetch, showForm]);

  //count
  const count = data && data.count;
  console.log(data);
  const closeFormHandler = () => {
    setShowForm(false);
  };
  //pagination
  const paginationFun = (obj) => {
    dispatch(getCarPagination(obj));
  };

  const { data: carAct } = useSelector((state) => state.carActivityRed);

  return (
    <Fragment>
      {showForm && (
        <CarActivity
          driver={driverId}
          id={carId}
          hideModel={closeFormHandler}
        />
      )}
      <div className={classes.content} dir="rtl">
        <div>
          <button onClick={() => setShowForm(true)}>
            اضافة أخر تحركات للسيارة
          </button>
        </div>
        {data && data.results.length > 0 && (
          <div className={classes["table_content"]}>
            <table className={classes.activities}>
              <thead>
                <tr>
                  <th>أسم السائق</th>
                  <th>تاريخ التحرك</th>
                  <th>المسافة المقطوعة</th>
                  <th>خط السير</th>
                  <th>ملاحظات</th>
                </tr>
              </thead>
              <tbody>
                {data &&
                  currentPage === 1 &&
                  data.results.map((el) => {
                    return <CarDetailList key={el.id} data={el} />;
                  })}

                {carAct &&
                  carAct.count > 10 &&
                  carAct.results.map((el) => {
                    return <CarDetailList key={el.id} data={el} />;
                  })}
              </tbody>
            </table>
          </div>
        )}
        {count > 10 && (
          <Paginate
            count={count}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            paginationFun={paginationFun}
            id={carId}
          />
        )}
      </div>
    </Fragment>
  );
};

export default CarDetail;
