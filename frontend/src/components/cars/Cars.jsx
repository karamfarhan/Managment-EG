import { useState, useEffect, Fragment } from "react";
import jwt_decode from "jwt-decode";
import { useDispatch, useSelector } from "react-redux";
import {
  carsPaginations,
  carsSearch,
  carsSearchPagination,
  getCars,
} from "../../store/cars-slice";
import Bar from "../UI/bars/Bar";
import Search from "../UI/search/Search";
import Paginate from "../UI/pagination/Paginate";
import LoadingSpinner from "../UI/loading/LoadingSpinner";
import CarList from "./car-list/CarList";
import { AiFillCar } from "react-icons/ai";
import classes from "./Cars.module.css";
import CreateCar from "../UI/create-car/CreateCar";
import { useTranslation } from "react-i18next";

const Cars = () => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.authReducer);
  const decoded = jwt_decode(token);
  const [t, i18n] = useTranslation();
  const { is_superuser, permissions } = decoded;
  //current page
  const [currentPage, setCurrentPage] = useState(1);
  //search
  const [searchValue, setSearchValue] = useState("");
  //car form
  const [showCarForm, setShowCarForm] = useState(false);
  //fetch cars
  useEffect(() => {
    if (
      currentPage === 1 &&
      searchValue.trim() === "" &&
      (is_superuser || permissions.includes("view_car"))
    ) {
      dispatch(getCars(token));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, currentPage, searchValue]);
  //cars data
  const { data: cars, isLoading } = useSelector((state) => state.carReducer);

  //search handler
  const searchHandler = (e) => {
    setSearchValue(e.target.value);
  };

  //pagination functions
  const paginationFun = (obj) => {
    dispatch(carsPaginations(obj));
  };

  //fetch search data
  function fetchSearchHandler() {
    setCurrentPage(1);
    const obj = {
      token,
      search: searchValue,
    };

    dispatch(carsSearch(obj));
  }
  //search behavior
  const searchPagination = (obj) => {
    // //search pagination
    dispatch(carsSearchPagination(obj));
  };

  return (
    <Fragment>
      {showCarForm && <CreateCar hideModel={() => setShowCarForm(false)} />}
      <Bar>
        <div className="toolBar">
          {(is_superuser || permissions.includes("view_car")) && (
            <Search
              onChange={searchHandler}
              value={searchValue}
              searchData={fetchSearchHandler}
            />
          )}

          {(is_superuser || permissions.includes("add_car")) && (
            <button
              className={classes.createBtn}
              onClick={() => setShowCarForm(true)}>
              <AiFillCar /> {t("addCar")}
            </button>
          )}
        </div>
      </Bar>
      {isLoading && <LoadingSpinner />}
      {cars &&
        cars !== undefined &&
        !isLoading &&
        (is_superuser || permissions.includes("view_car")) &&
        cars.results.length === 0 && <h2> {t("carMsg")} </h2>}
      <div className={classes.grid}>
        {cars &&
          cars !== undefined &&
          !isLoading &&
          (is_superuser || permissions.includes("view_car")) &&
          cars.results.map((el) => {
            return (
              <CarList
                key={el.id}
                id={el.id}
                driver={el.driver}
                car_model={el.car_model}
                car_type={el.car_type}
                car_number={el.car_number}
                driver_name={el.driver_name}
                last_maintain={el.last_maintain}
                maintain_place={el.maintain_place}
                note={el.note}
              />
            );
          })}

        {cars && cars.count > 10 && (
          <Paginate
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            count={cars.count}
            paginationFun={paginationFun}
            searchFn={fetchSearchHandler}
            searchPagination={searchPagination}
            search={searchValue}
          />
        )}
      </div>
    </Fragment>
  );
};
export default Cars;
