import { Fragment, useState } from "react";
import styles from "./CategoryForm.module.css";
import Backdrop from "../backdrop/Backdrop";

function CategoryForm() {
  const [categoryName, setCategoryName] = useState("");
  const [categoryCode, setCategoryCode] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(
      `Category Name: ${categoryName}, Category Code: ${categoryCode}`
    );
  };

  return (
    <Fragment>
      <Backdrop>
        <button type="button" className={styles.closeButton}>
          &times;
        </button>
        <form onSubmit={handleSubmit} className={styles.formContainer}>
          <div className={styles.labelContainer}>
            <input
              type="text"
              id="categoryName"
              className={styles.inputField}
              placeholder="Enter category name"
              value={categoryName}
              onChange={(event) => setCategoryName(event.target.value)}
            />
          </div>
          <div className={styles.labelContainer}>
            <input
              type="text"
              id="categoryCode"
              className={styles.inputField}
              placeholder="Enter category code"
              value={categoryCode}
              onChange={(event) => setCategoryCode(event.target.value)}
            />
          </div>
          <button type="submit" className={styles.submitButton}>
            Submit
          </button>
        </form>
      </Backdrop>
    </Fragment>
  );
}

export default CategoryForm;
