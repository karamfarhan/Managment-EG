import { Fragment, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "react-query";

import Paginate from "../../UI/pagination/Paginate";
import classes from "./CarDetail.module.css";
import CarActivity from "../../UI/car-activity/CarActivity";
import LoadingSpinner from "../../UI/loading/LoadingSpinner";
import CarDetailList from "./CarDetailList";
import { useDispatch, useSelector } from "react-redux";
import { getCarPagination } from "../../../store/car-activity";
import Car from "./Car";
import { logout } from "../../../store/auth-slice";

const CarDetail = () => {
  const [sections, setSections] = useState("cars");
  const [showForm, setShowForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const { token } = useSelector((state) => state.authReducer);
  // const decoded = jwt_decode(token);
  // const { is_superuser, permissions } = decoded;
  //const carActivity = permissions.join(" ").includes("activity");
  const dispatch = useDispatch();
  const params = useParams();

  const { carId, driverId } = params;

  const { data: car, refetch } = useQuery(
    "car/detail",
    async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`${window.domain}cars/${carId}/`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.status === 401) {
          return dispatch(logout());
        }
        setIsLoading(false);

        return await res.json();
      } catch (err) {
        setIsLoading(false);

        console.log(err);
      }
    },
    { refetchOnWindowFocus: false }
  );

  //count
  const count = 10;
  const closeFormHandler = () => {
    setShowForm(false);
  };
  //pagination
  const paginationFun = (obj) => {
    dispatch(getCarPagination(obj));
  };
  useEffect(() => {
    if (showForm === false && currentPage === 1) {
      refetch();
    }
  }, [currentPage, refetch, showForm]);
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
        {isLoading && <LoadingSpinner />}
        <div className={classes.content}>
          <button onClick={() => setShowForm(true)}>
            اضافة أخر تحركات للسيارة
          </button>

          <header>
            <nav>
              <ul>
                <li
                  className={sections === "cars" ? classes.active : ""}
                  onClick={() => setSections("cars")}
                >
                  بيانات السيارة{" "}
                </li>

                <li
                  className={sections === "carActivity" ? classes.active : ""}
                  onClick={() => setSections("carActivity")}
                >
                  تحركات السائق{" "}
                </li>
              </ul>
            </nav>
          </header>

          {/* body  */}
          <div className={classes.body}>
            {sections === "cars" && <Car car={car.car} />}
            {sections === "carActivity" &&
              car &&
              car.car &&
              car.car.carActivity.length === 0 &&
              !isLoading && (
                <p style={{ textAlign: "center" }}> لا يوجد سجلات للسائق </p>
              )}
            {sections === "carActivity" &&
              car &&
              car.car &&
              car.car.carActivity.length > 0 && (
                <div className={classes["table_content"]}>
                  <table className={classes.activities}>
                    <thead>
                      <tr>
                        {/* <th>أسم السائق</th> */}
                        <th>تاريخ التحرك</th>
                        <th>المسافة المقطوعة</th>
                        <th>خط السير</th>
                        <th>ملاحظات</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* {car &&
                        isLoading &&
                        car.car &&
                        car.car.carActivity &&
                        car.car.carActivity.length > 0 &&
                        currentPage === 1 &&
                        car.car.carActivity.map((el) => {
                          return <CarDetailList key={el._id} data={el} />;
                        })} */}

                      {car &&
                        car.car &&
                        car.car.carActivity &&
                        car.car.carActivity.map((el) => {
                          return <CarDetailList key={el._id} data={el} />;
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
