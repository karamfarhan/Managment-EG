import { Fragment, useEffect } from "react";
import {useDispatch} from 'react-redux'
import { getSubs } from "../../../store/create-substance";
import Backdrop from "../backdrop/Backdrop";
import classes from "./DeleteConfirmation.module.css";


const DeleteConfirmation = ({ deleteHandler, hideModel, id }) => {

  return (
    <Fragment>
      <Backdrop hideModel={hideModel} />

      <div className={classes.confirmation}>
        <p> هل أنت متأكد ؟ </p>

        <div className={classes.actions}>
          <button type="button" onClick={() => deleteHandler(id)}>
            مسح
          </button>
          <button type="button" onClick={hideModel}>
            الغاء
          </button>
        </div>
      </div>
    </Fragment>
  );
};

export default DeleteConfirmation;
