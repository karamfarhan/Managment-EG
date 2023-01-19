import Inputs from "../../UI/inputs/Inputs";
import { MdDelete } from "react-icons/md";
import classes from "./Items.module.css";
const Items = ({ index, inputField, setInputFields, inputFields }) => {
  // delete specific field
  const removeHandeler = (index) => {
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
    <div className={classes.items} dir="rtl">
      <ul>
        <li>
          <Inputs
            type="text"
            id="place_from"
            placeholder="من"
            required
            value={inputField.place_from}
            onChange={(event) => handleChangeInput(event, index)}
          />
        </li>
        <li>
          <Inputs
            type="text"
            id="place_to"
            placeholder="الي"
            required
            value={inputField.place_to}
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
