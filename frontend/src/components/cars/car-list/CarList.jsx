import { Fragment, useState, useContext } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getCars } from "../../../store/cars-slice";
import AuthContext from "../../../context/Auth-ctx";
import DeleteConfirmation from "../../UI/delete_confirmation/DeleteConfirmation";
import classes from "./CarList.module.css";
const CarList = ({
  car_model,
  car_type,
  car_number,
  driver_name,
  note,
  driver,
  id,
}) => {
  const navigate = useNavigate();
  const detailPageHandler = () => {
    navigate(`/cars/${driver}/${id}`);
  };
  const authCtx = useContext(AuthContext);
  const dispatch = useDispatch();
  const [isDelete, setIsDelete] = useState(false);
  const [carId, setCarId] = useState("");

  const { token } = authCtx;
  //delete handler
  const deleteHandler = async (id) => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/cars/${id}/`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setIsDelete(false);
      dispatch(getCars(token));

      const data = await res.json();
      return data;
    } catch (err) {
      console.log(err.message);
    }
  };
  //show delete mode
  const deleteModelHandler = (id) => {
    setIsDelete(true);
    setCarId(id);
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
          id={carId}
        />
      )}

      <div className={classes.car}>
        <header>
          <p>
            سائق السيارة <span>{driver_name}</span>{" "}
          </p>
          <p>
            سيارة رقم <span>{car_number}</span>{" "}
          </p>
        </header>
        <div>
          <p>
            نوع و طراز السيارة{" "}
            <span>
              {car_type} - {car_model}
            </span>
          </p>

          <p>
            ملاحظات : <span> {note === "" ? "لا يوجد" : note} </span>
          </p>
        </div>

        <button onClick={detailPageHandler}> تحركات السيارة </button>

        <div className={classes.actions}>
          <button
            className={classes.deleteBtn}
            onClick={() => deleteModelHandler(id)}>
            {" "}
            حذف{" "}
          </button>
          <button className={classes.deleteBtn}> تعديل </button>
        </div>
      </div>
    </Fragment>
  );
};

export default CarList;
