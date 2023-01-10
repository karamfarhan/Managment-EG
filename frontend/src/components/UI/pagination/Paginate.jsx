import {useContext} from 'react'
import { Pagination } from "antd";
import {useDispatch} from "react-redux";
import AuthContext from '../../../context/Auth-ctx'
import { imagesPagination } from "../../../store/upload-img-slice";

import classes from './Paginate.module.css'

const Paginate = ({ setCurrentPage, currentPage, count, itemsPerPage }) => {
  const authCtx = useContext(AuthContext)
  const dispatch = useDispatch()
  const {token} = authCtx

  const paginationHandler = (number) => {
    const obj = {
      page : number,
      token
    }
    // store current page in session storage
    sessionStorage.setItem("current-page", number);
    dispatch(imagesPagination(obj))
    setCurrentPage(number);
  };

  return (
   <div className = {classes.pagination}>
   
   <Pagination
   onChange={(value) => paginationHandler(value)}
   pageSize={itemsPerPage}
   total={count}
   current={currentPage}
 />

   </div>
  );
};

export default Paginate;
