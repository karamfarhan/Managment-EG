import { Fragment, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "react-query";
import jwt_decode from "jwt-decode";
import Paginate from "../../UI/pagination/Paginate";
import classes from "./CarDetail.module.css";
import CarActivity from "../../UI/car-activity/CarActivity";
import CarDetailList from "./CarDetailList";
import { useDispatch, useSelector } from "react-redux";
import { getCarPagination } from "../../../store/car-activity";
import Car from "./Car";
import { logout } from "../../../store/auth-slice";

const CarDetail = () => {
  const [sections, setSections] = useState("cars");
  const [showForm, setShowForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const { token } = useSelector((state) => state.authReducer);
  const decoded = jwt_decode(token);
  const { is_superuser, permissions } = decoded;
  const carActivity = permissions.join(" ").includes("activity");
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
    { refetchOnWindowFocus: false }
  );
  const { data: car, refetch: carFetch } = useQuery(
    "car/detail",
    async () => {
      try {
        const res = await fetch(`http://127.0.0.1:8000/cars/${carId}/`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.status === 401) {
          return dispatch(logout());
        }

        return await res.json();
      } catch (err) {
        console.log(err);
      }
    },
    { refetchOnWindowFocus: false }
  );

  useEffect(() => {
    if (showForm === false && currentPage === 1) {
      refetch();
    }
  }, [currentPage, refetch, showForm]);

  //count
  const count = data && data.count;
  const closeFormHandler = () => {
    setShowForm(false);
  };
  //pagination
  const paginationFun = (obj) => {
    dispatch(getCarPagination(obj));
  };

  const { data: carAct } = useSelector((state) => state.carActivityRed);
  if (!car) return;
  return (
    <Fragment>
      {showForm && (
        <CarActivity
          driver={driverId}
          id={carId}
          hideModel={closeFormHandler}
        />
      )}
      <div className={classes.box} dir="rtl">
        <div className={classes.content}>
          {(is_superuser || permissions.includes("add_caractivity")) && (
            <button onClick={() => setShowForm(true)}>
              اضافة أخر تحركات للسيارة
            </button>
          )}
          <header>
            <nav>
              <ul>
                <li
                  className={sections === "cars" ? classes.active : ""}
                  onClick={() => setSections("cars")}>
                  بيانات السيارة{" "}
                </li>
                {(is_superuser || carActivity) && (
                  <li
                    className={sections === "carActivity" ? classes.active : ""}
                    onClick={() => setSections("carActivity")}>
                    تحركات السائق{" "}
                  </li>
                )}
              </ul>
            </nav>
          </header>

          {/* body  */}
          <div className={classes.body}>
            {sections === "cars" && <Car car={car} />}
            {sections === "carActivity" && (
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
            )}
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default CarDetail;
