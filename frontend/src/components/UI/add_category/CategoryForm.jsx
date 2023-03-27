import { Fragment, useState } from "react";
import { useQuery } from "react-query";
import { useSelector } from "react-redux";
import axios from "axios";
import styles from "./CategoryForm.module.css";
import Backdrop from "../backdrop/Backdrop";

function CategoryForm({ hideModel }) {
  const [categoryName, setCategoryName] = useState("");
  const [categoryCode, setCategoryCode] = useState("");
  const { token } = useSelector((state) => state.authReducer);

  const { data, refetch } = useQuery(
    "createCategory",
    async () => {
      try {
        const response = await axios.post(
          `${window.domain}category`,
          {
            category_name: categoryName,
            category_code: categoryCode,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token} `,
            },
          }
        );
        if (response.status === 201) {
          hideModel();
        }
        const data = await response.data;
        console.log(response);
        return data;
      } catch (err) {}
    },
    { refetchOnWindowFocus: false, enabled: false }
  );

  const handleSubmit = (event) => {
    event.preventDefault();
    refetch();
    console.log(
      `Category Name: ${categoryName}, Category Code: ${categoryCode}`
    );
  };

  return (
    <Fragment>
      <Backdrop hideModel={hideModel}>
        <button
          type="button"
          className={styles.closeButton}
          onClick={hideModel}
        >
          &times;
        </button>
        <form onSubmit={handleSubmit} className={styles.formContainer}>
          <div className={styles.labelContainer}>
            <input
              type="text"
              id="categoryName"
              className={styles.inputField}
              placeholder="أسم الصنف"
              value={categoryName}
              onChange={(event) => setCategoryName(event.target.value)}
            />
          </div>
          <div className={styles.labelContainer}>
            <input
              type="text"
              id="categoryCode"
              className={styles.inputField}
              placeholder="كود الصنف"
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
