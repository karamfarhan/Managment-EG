import { Fragment } from "react";
import { useTranslation } from "react-i18next";
import Backdrop from "../backdrop/Backdrop";
import classes from "./DeleteConfirmation.module.css";

const DeleteConfirmation = ({ deleteHandler, hideModel, id }) => {
  const [t, i18n] = useTranslation();
  return (
    <Fragment>
      <Backdrop hideModel={hideModel} />

      <div
        className={classes.confirmation}
        dir={i18n.language === "en" ? "ltr" : "rtl"}
      >
        <p> {t("confirmMsg")} </p>

        <div className={classes.actions}>
          <button type="button" onClick={() => deleteHandler(id)}>
            {t("delete")}
          </button>
          <button type="button" onClick={hideModel}>
            {t("cancel")}
          </button>
        </div>
      </div>
    </Fragment>
  );
};

export default DeleteConfirmation;
