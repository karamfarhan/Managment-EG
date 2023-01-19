import { useState, useEffect, useContext } from "react";
import Bar from "../UI/bars/Bar";
import Search from "../UI/search/Search";
import { AiFillCar } from "react-icons/ai";
import classes from "./Cars.module.css";
import { Fragment } from "react";
import CreateCar from "../UI/create-car/CreateCar";
import { useDispatch, useSelector } from "react-redux";
import { getCars } from "../../store/cars-slice";
import AuthContext from "../../context/Auth-ctx";
import CarList from "./car-list/CarList";
const Cars = () => {
  const authCtx = useContext(AuthContext);
  const disptach = useDispatch();
  const [shoeForm, setShowForm] = useState(false);

  const { token } = authCtx;
  //fetch cars
  useEffect(() => {
    disptach(getCars(token));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [disptach]);

  //cars data
  const { data: cars } = useSelector((state) => state.carReducer);

  //hide form
  const hideModelForm = () => {
    setShowForm(false);
  };

  return (
    <Fragment>
      {shoeForm && <CreateCar hideModel={hideModelForm} />}
      <Bar>
        <div className="toolBar">
          <Search placeholder=" أسم السائق أو بيانات السيارة" />
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
      </div>
    </Fragment>
  );
};
export default Cars;
