import { useState, useEffect, useContext } from "react";
import Bar from "../UI/bars/Bar";
import Search from "../UI/search/Search";
import { AiFillCar } from "react-icons/ai";
import classes from "./Cars.module.css";
import { Fragment } from "react";
import CreateCar from "../UI/create-car/CreateCar";
import { useDispatch, useSelector } from "react-redux";
import {
  CarsPaginations,
  CarsSearch,
  CarsSearchPagination,
  getCars,
} from "../../store/cars-slice";
import AuthContext from "../../context/Auth-ctx";
import Paginate from "../UI/pagination/Paginate";
import CarList from "./car-list/CarList";
import { Route, Routes } from "react-router-dom";
import EditCar from "./edit-car/EditCar";
const Cars = () => {
  const authCtx = useContext(AuthContext);
  const dispatch = useDispatch();
  const [shoeForm, setShowForm] = useState(false);
  //current page
  const [currentPage, setCurrentPage] = useState(1);
  //search
  const [searchValue, setSearchValue] = useState("");
  const { token } = authCtx;
  //fetch cars
  useEffect(() => {
    if (currentPage === 1 && searchValue.trim() === "") {
      dispatch(getCars(token));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, currentPage, searchValue]);

  //cars data
  const { data: cars } = useSelector((state) => state.carReducer);
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
    dispatch(CarsPaginations(obj));
  };

  //fetch search data
  function fetchSearchHandler() {
    setCurrentPage(1);
    const obj = {
      token,
      search: searchValue,
    };

    dispatch(CarsSearch(obj));
  }
  //search behavior
  const searchPagination = (obj) => {
    // //search pagination
    dispatch(CarsSearchPagination(obj));
  };

  return (
    <Fragment>
      {shoeForm && <CreateCar hideModel={hideModelForm} />}
      <Bar>
        <div className="toolBar">
          <Search
            placeholder=" أسم السائق أو بيانات السيارة"
            onChange={searchHandler}
            value={searchValue}
            searchData={fetchSearchHandler}
          />
          <button
            className={classes.createBtn}
            onClick={() => setShowForm(true)}>
            انشاء سيارة
            <span>
              <AiFillCar />
            </span>
          </button>
        </div>
      </Bar>

      <div className={classes.grid}>
        {cars &&
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
