import { Fragment, useState, useContext } from "react";
import {useDispatch} from 'react-redux';
import AuthContext from "../../../context/Auth-ctx";
import Backdrop from "../backdrop/Backdrop";
import Inputs from "../inputs/Inputs";
import {AiOutlineCloseCircle} from 'react-icons/ai'
import classes from "./CreateSubsModel.module.css";
import { createSubs } from "../../../store/create-substance";
const CreateSubsModel = ({hideSubstancesHandler}) => {
  const authCtx = useContext(AuthContext)
  const {token} = authCtx
  console.log(token)
  const [categortyBtn, setCategoryBtn] = useState(["مادة سائلة", "مادة صلبة"]);

  const [substancesData, setSubstancesData] = useState({
    name : '',
    categorty : '',
    unit_type : ''
  }) 

  const dispatch = useDispatch()
  const {name, categorty, unit_type} = substancesData


  //submit handler 
  const submitHandler =(e)=> {
    e.preventDefault();


    const obj = {
      name,
      category : 'liq',
      unitType : unit_type,
      token : token
    }


    //post subtances
    dispatch(createSubs(obj))
  }


  return (
    <Fragment>
      <Backdrop hideModel ={hideSubstancesHandler} />
      <div className={classes.form}>
    <span className = {classes.closeModel} onClick = {hideSubstancesHandler}> <AiOutlineCloseCircle /> </span>


        <h2>اضافة مادة</h2>
        <form onSubmit = {submitHandler}>
          <Inputs type="text" placeholder="أسم المادة" value={name} onChange = {(e)=> setSubstancesData({...substancesData, name : e.target.value})}  />
          <Inputs type="text" placeholder="الكمية" value = {unit_type} onChange = {(e)=> setSubstancesData({...substancesData, unit_type : e.target.value})}  />
d
          <div className={classes.actions}>
            {categortyBtn.map((el, i) => {
              return (
                <button value={el} type="button" key = {i}>
                  {el}
                </button>
              );
            })}
          </div>
          <button type='submit'> أضف </button>
        </form>
      </div>
    </Fragment>
  );
};

export default CreateSubsModel;
