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
  






    return <> <Inputs type = "email" placeholder="البريد الالكتروني" value = {email} id = "email" onChange = {(e)=> setSignUpData({...signUpData, email : e.target.value })} />
    <Inputs type = "text" placeholder="اسم المستخدم"  value = {username} id = "user_name" onChange = {(e)=> setSignUpData({...signUpData, username : e.target.value })}/>
    <Inputs type = "password" placeholder="الرقم السري" value = {password} onChange = {(e)=> setSignUpData({...signUpData, password : e.target.value })}/>
    <Inputs type = "password" placeholder="أعد كتابة كلمة السر" value = {repeat_password} onChange = {(e)=> setSignUpData({...signUpData, repeat_password : e.target.value })}/>

    <button type="submit" className={classes.createNewAccBtn} onClick={registerApi}> انشاء حساب </button>

    </>
}

export default SignUp