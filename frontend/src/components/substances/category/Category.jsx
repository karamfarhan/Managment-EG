import SubstancesView from "../substances_view/SubstancesView";

import styles from "./Category.module.css";

const Category = ({
  categoryName,
  categoryCode,
  id,
  activeIndex,
  substanceData,
  fetchSubstances,
  index,
  isLoading,
  showAccordion,
  showMatters,
}) => {
  console.log(showMatters);
  return (
    <div>
      <ul>
        <li
          id={id}
          className={`${styles.tab}`}
          onClick={() => fetchSubstances(index, id)}>
          <span>
            {categoryCode}# {categoryName}
          </span>
        </li>

        {index === activeIndex &&
          isLoading === false &&
          showAccordion === true && (
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
