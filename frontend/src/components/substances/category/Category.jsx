import axios from "axios";
import styles from "./Category.module.css";
import { useSelector } from "react-redux";
import { useState } from "react";

const Category = ({ categoryName, categoryCode, id }) => {
  const [substanceData, setSubstanceData] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const { token } = useSelector((state) => state.authReducer);

  const fetchSubstances = async (id) => {
    try {
      const response = await axios.get(`${window.domain}category/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = response.data.data.categories.substances.substances;
      setSubstanceData(data);
      setActiveCategory(id);
    } catch (err) {}
    console.log(substanceData);
  };

  return (
    <div>
      <ul>
        <li className={styles.tab} onClick={() => fetchSubstances(id)}>
          <span> {categoryCode}# </span> <span>{categoryName}</span>
        </li>
        {activeCategory === id &&
          substanceData.map((substance) => (
            <li key={substance._id} className={styles.substance}>
              {substance.name}
            </li>
          ))}
      </ul>
    </div>
  );
};

export default Category;
