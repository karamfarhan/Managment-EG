import { useEffect, useContext, useState } from 'react';
import {useParams} from 'react-router-dom'
import AuthContext from '../../../context/Auth-ctx';

//classes 
import classes from './StoreDetail.module.css'


const StoreDetail = ()=> {
    const [data, setData] = useState({})
    const params = useParams()
    const {storeId} = params;


    //token
    const authCtx = useContext(AuthContext)
    const {token} = authCtx
    //get store

    const getTheStore = async()=> {
        const res = await fetch(`http://127.0.0.1:8000/stores/${storeId}`, {
            method : 'GET',
             headers  : {
                "Content-type" : 'application/json',
                'Authorization' : `Bearer ${token}`
             }
        })

        const data = await res.json();
        setData(data);
        
    }


    useEffect(()=> {

        getTheStore()

    }, [])






    return <div className={classes.content}>

<div>

<h2> الموارد </h2>

</div>

<div>

<h2> {data.name} 
</h2>
<span> {new Date(data.created_at).toLocaleString()}  </span>

<h3> {data.address} </h3>
<p> <span>{data.description}</span>  </p>

<p className={classes.status}> حالة المخزن : <span>{data.isActive ? 'غير نشط' :' نشط' } </span>  </p>

</div>
























    </div> 
}

export default StoreDetail