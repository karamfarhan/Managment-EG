import axios from "axios";
import styles from "./Category.module.css";
import { useSelector } from "react-redux";
import { useState } from "react";
import SubstancesView from "../substances_view/SubstancesView";

const Category = ({
  categoryName,
  categoryCode,
  id,
  activeIndex,
  substanceData,
  fetchSubstances,
  index,
  isLoading,
}) => {
  return (
    <div>
      <ul>
        <li
          id={id}
          className={`${styles.tab}`}
          onClick={() => fetchSubstances(index, id)}
        >
          <span>
            {categoryCode}# {categoryName}
          </span>
        </li>

        {index === activeIndex && isLoading === false && (
          <SubstancesView
            substances={substanceData}
            categoryCode={categoryCode}
          />
        )}
      </ul>
    </div>
  );
};

export default Category;
