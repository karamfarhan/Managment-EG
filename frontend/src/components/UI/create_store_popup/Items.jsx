import { MdDelete } from "react-icons/md";
import Inputs from "../inputs/Inputs";
const Items = ({ index, inputFields, inputField, setInputFields }) => {
  // delete specific field
  const removeHandeler = (index) => {
    if (inputFields.length === 1) {
      return;
    }
    const list = [...inputFields];
    list.splice(index, 1);
    setInputFields(list);
  };
  //handle change

  const handleChangeInput = (e, index) => {
    const { id, value } = e.target;
    const list = [...inputFields];
    list[index][id] = value;
    setInputFields(list);
  };

  return (
    <div>
      <ul>
        <li>
          <Inputs
            type="text"
            id="name"
            placeholder="أسم الخامة"
            value={inputField.title}
            required
            onChange={(event) => handleChangeInput(event, index)}
          />
        </li>
        <li>
          <select id="category">
            <option hidden selected>
              التصنيف
            </option>
            <option>مادة</option>
            <option>أله</option>
          </select>
        </li>
        <li>
          <Inputs
            type="number"
            id="count"
            placeholder="الكمية"
            min="1"
            required
            value={+inputField.unit_price}
            onChange={(event) => handleChangeInput(event, index)}
          />
        </li>

        <li>
          <div style={{ fontSize: "26px" }}>
            <MdDelete onClick={() => removeHandeler(index)} />
          </div>
        </li>
      </ul>
    </div>
  );
};
export default Items;
