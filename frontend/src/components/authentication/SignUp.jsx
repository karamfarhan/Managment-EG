import { useState } from 'react'
import Inputs from '../UI/inputs/Inputs'
import classes from './SignUp.module.css'


const SignUp = ()=> {
const [signUpData, setSignUpData] = useState({
    email : "",
    username : "",
    password : "",
    repeat_password : ""
})

const {email, username, password, repeat_password} = signUpData

    //Register
const registerApi = async()=> {
   try {
    const res = await fetch('http://127.0.0.1:8000/account/register/', {
        method : "POST",
        headers : {
            'Content-type' : 'application/json'
        },
        body : JSON.stringify({
            email,
            username,
            password,
            repeat_password
        })

    })


    const data = await res.json()
    console.log(data)

   }catch(err) {
    console.log(err)
   }
  }
  
  

  // handle change
  const handleChange = (e)=>{
    console.log(e.target.value)




  }
  






    return <> <Inputs type = "email" placeholder="البريد الالكتروني" value = {email} id = "email" onChange = {handleChange} />
    <Inputs type = "email" placeholder="اسم المستخدم"  value = {username} id = "user_name" onChange = {handleChange}/>
    <Inputs type = "password" placeholder="الرقم السري" value = {password} onChange = {handleChange}/>
    <Inputs type = "password" placeholder="أعد كتابة كلمة السر" value = {repeat_password} onChange = {handleChange}/>

    <button type="submit" className={classes.createNewAccBtn} onClick={registerApi}> انشاء حساب </button>

    </>
}

export default SignUp