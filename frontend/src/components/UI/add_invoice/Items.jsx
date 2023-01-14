import Inputs from "../inputs/Inputs";
import { MdDelete } from "react-icons/md";
import classes from './Items.module.css'
const Items = ({ index, inputField, setInputFields, inputFields, selectBox }) => {
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
    <div className = {classes.items} dir = "rtl">
      <ul>
        <li>
          <select
            value={inputField.substance}
            id="substance"
            required
            onChange={(event) => handleChangeInput(event, index)}
          >
          
          {selectBox && selectBox.map((select)=>{
            return <option key ={select.pk} value={select.pk} > {select.name} </option>
          })}
          
          
          </select>
          {/*  <Inputs
            type="text"
            id="substance_name"
            placeholder="أسم المادة"
            required
            onChange={(event) => handleChangeInput(event, index)}
  /> */}
        </li>
        <li>
          <Inputs
            type="number"
            id="mass"
            placeholder="الكمية"
            required
            value={inputField.mass}
            min="1"
            onChange={(event) => handleChangeInput(event, index)}
          />
        </li>
        <li>
          <Inputs
            type="text"
            id="description"
            placeholder="ملاحظة"
            value={inputField.description }
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
