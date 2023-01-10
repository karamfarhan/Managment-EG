import {Fragment, useState} from "react"
import {GiSaddle} from "react-icons/gi"
import {TbToolsKitchen} from "react-icons/tb"
import CreateSubsModel from "../UI/create_substances/CreateSubsModel";
import classes from "./CreateSubs.module.css"
const CreateSubs = () => {
  const [showModel, setShowModel] = useState(false)

  //hide model
  const hideSubstancesHandler = ()=> {
    setShowModel(false)
  }
  return (
 <Fragment>
{showModel &&  <CreateSubsModel hideSubstancesHandler={hideSubstancesHandler} />}

 <div>
 <div className = {classes.actions}>
   <button onClick = {()=>setShowModel(true)}> اضافة مواد <span> <TbToolsKitchen /> </span> </button>
   <button> اضافة أجهزة / الات <span> <GiSaddle /> </span></button>
 </div>
</div>
 </Fragment>
  );
};

export default CreateSubs;
