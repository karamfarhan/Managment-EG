import Inputs from "../inputs/Inputs";
import { MdDelete } from "react-icons/md";
import classes from "./InstrumentsItems.module.css";
const Items = ({
  index,
  inputField,
  setInputFields,
  inputFields,
  selectBox,
}) => {
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
          <select
            value={inputField.instrument}
            id="instrument"
            required
            onChange={(event) => handleChangeInput(event, index)}>
            <option hidden selected value="">
              {" "}
              أختار ماكينة{" "}
            </option>

            {selectBox &&
              selectBox.map((select) => {
                return (
                  <option key={select.pk} value={select.pk}>
                    {" "}
                    {select.name}{" "}
                  </option>
                );
              })}
          </select>
        </li>
        <li>
          <Inputs
            type="text"
            id="description"
            value={inputField.description}
            placeholder="ملاحظة"
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
