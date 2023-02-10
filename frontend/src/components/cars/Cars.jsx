import { useState, useEffect } from "react";
import jwt_decode from "jwt-decode";
import Bar from "../UI/bars/Bar";
import Search from "../UI/search/Search";
import { AiFillCar } from "react-icons/ai";
import classes from "./Cars.module.css";
import { Fragment } from "react";
import CreateCar from "../UI/create-car/CreateCar";
import { useDispatch, useSelector } from "react-redux";
import {
  carsPaginations,
  carsSearch,
  carsSearchPagination,
  getCars,
} from "../../store/cars-slice";
import Paginate from "../UI/pagination/Paginate";
import CarList from "./car-list/CarList";

const Cars = () => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.authReducer);
  const decoded = jwt_decode(token);
  const { is_superuser, permissions } = decoded;
  const [shoeForm, setShowForm] = useState(false);
  //current page
  const [currentPage, setCurrentPage] = useState(1);
  //search
  const [searchValue, setSearchValue] = useState("");
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
  const cars = useSelector((state) => state.carReducer.data);

  //search handler
  const searchHandler = (e) => {
    setSearchValue(e.target.value);
  };
  //hide form
  const hideModelForm = () => {
    setShowForm(false);
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
      {shoeForm && <CreateCar hideModel={hideModelForm} />}
      <Bar>
        <div className="toolBar">
          {(is_superuser || permissions.includes("view_car")) && (
            <Search
              placeholder=" أسم السائق أو بيانات السيارة"
              onChange={searchHandler}
              value={searchValue}
              searchData={fetchSearchHandler}
            />
          )}
          {(is_superuser || permissions.includes("add_car")) && (
            <button
              className={classes.createBtn}
              onClick={() => setShowForm(true)}>
              انشاء سيارة
              <span>
                <AiFillCar />
              </span>
            </button>
          )}
        </div>
      </Bar>

      <div className={classes.grid}>
        {cars &&
          cars !== undefined &&
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
