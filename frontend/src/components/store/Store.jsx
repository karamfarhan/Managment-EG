import { Fragment, useState, useCallback, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import jwt_decode from "jwt-decode";
import { SiHomeassistantcommunitystore } from "react-icons/si";
import CreateStoreUi from "../UI/create_store_popup/CreateStoreUi";
import Paginate from "../UI/pagination/Paginate";
import Bar from "../UI/bars/Bar";
import {
  getStores,
  storePagination,
  storeSearch,
  storeSearchPagination,
} from "../../store/create-store-slice";
import DeleteConfirmation from "../UI/delete_confirmation/DeleteConfirmation";
import Search from "../UI/search/Search";
import AddInvoice from "../UI/add_invoice/AddInvoice";
import classes from "./Store.module.css";

const Store = () => {
  const { token } = useSelector((state) => state.authReducer);
  const dispatch = useDispatch();
  const [showForm, setShowForm] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [storeIdInvoice, setStoreIdInvoice] = useState("");
  //current page
  const [currentPage, setCurrentPage] = useState(1);

  //search
  const [searchValue, setSearchValue] = useState("");

  //create invoice
  const [showInvoiceForm, setShowInvoiceForm] = useState(false);
  const [storeName, setStoreName] = useState("");
  const [storeId, setStoreId] = useState("");

  const decoded = jwt_decode(token);
  const { is_superuser, permissions } = decoded;

  const getSoresPremission = ["change_store", "view_store", "delete_store"];
  const getAllStores = permissions.some((el) =>
    getSoresPremission.includes(el)
  );

  //paginationFun
  const paginationFun = useCallback(
    (obj) => {
      dispatch(storePagination(obj));
    },
    [dispatch]
  );

  //store data
  const { store_data } = useSelector((state) => state.storeSlice);

  //stores count
  const storeCount = store_data && store_data.count;

  //get stores
  useEffect(() => {
    //first render
    if (
      currentPage === 1 &&
      searchValue.trim() === "" &&
      (is_superuser || getAllStores)
    ) {
      dispatch(getStores(token));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, currentPage, searchValue, is_superuser, getAllStores]);

  //RESET CURRENT PAGE

  // //hide form handler
  const hideFormHandler = () => {
    setShowForm(false);
  };
  //show form handler
  const showFormHandler = () => {
    setShowForm(true);
  };

  //delete handler
  const deleteHandler = async (id) => {
    if (is_superuser === false || !permissions.includes("delete_store"))
      try {
        const res = await fetch(`${window.domain}/stores/${id}/`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setIsDelete(false);
        dispatch(getStores(token));

        const data = await res.json();
        return data;
      } catch (err) {
        console.log(err.message);
      }
  };

  //show delete mode
  const deleteModelHandler = (id) => {
    setIsDelete(true);
    setStoreId(id);
  };

  //hide delete mode
  const hideDeleteModel = () => {
    setIsDelete(false);
  };
  //search handler
  const searchHandler = (e) => {
    setSearchValue(e.target.value);
  };
  //fetch search data
  function fetchSearchHandler() {
    setCurrentPage(1);
    const obj = {
      token,
      search: searchValue,
    };

    dispatch(storeSearch(obj));
  }

  //search behavior
  const searchPagination = (obj) => {
    // //search pagination
    dispatch(storeSearchPagination(obj));
  };

  //show invoice handler
  const showInvoiceHandler = (name, id) => {
    setShowInvoiceForm(true);
    setStoreName(name);
    setStoreIdInvoice(id);
  };

  //hide invoice handler
  const hideInvoiceHandler = () => {
    setShowInvoiceForm(false);
  };

  return (
    <Fragment>
      {showInvoiceForm && (
        <AddInvoice
          storeId={storeIdInvoice}
          storeName={storeName}
          hideModel={hideInvoiceHandler}
        />
      )}

      {showForm && <CreateStoreUi hideFormHandler={hideFormHandler} />}
      {isDelete && (
        <DeleteConfirmation
          hideModel={hideDeleteModel}
          deleteHandler={deleteHandler}
          id={storeId}
        />
      )}
      <Bar>
        <div className="toolBar">
          {(is_superuser || getAllStores) && (
            <Search
              placeholder="أسم المخزن أو التاريخ YYYY-DD-MM"
              onChange={searchHandler}
              value={searchValue}
              searchData={fetchSearchHandler}
            />
          )}
          {(is_superuser || permissions.includes("add_store")) && (
            <button
              onClick={showFormHandler}
              type="button"
              className={classes.addInventory}>
              <SiHomeassistantcommunitystore /> انشاء مخزن
            </button>
          )}
        </div>
      </Bar>

      {store_data && store_data.length === 0 && (
        <p className={classes.msg_p}> لا يوجد مخازن </p>
      )}
      {store_data && store_data.results && store_data.results.length > 0 && (
        <div className={classes["table_content"]}>
          <table>
            <thead>
              <tr>
                <th>أسم المخزن</th>
                <th>عنوان المخزن</th>
                <th>انشيء عن طريق</th>
                <th>تاريخ الانشاء</th>
                <th>معلومات اضافية</th>
                <th>حدث</th>
              </tr>
            </thead>

            <tbody>
              {store_data &&
                store_data.results &&
                store_data.results.map((store) => {
                  return (
                    <tr key={store.id}>
                      <td>
                        <Link to={`/store/${store.id}`}>{store.name}</Link>
                      </td>
                      <td> {store.address} </td>
                      <td> {store.created_by} </td>
                      <td>{new Date(store.created_at).toDateString()} </td>
                      <td> {store.description} </td>
                      <td>
                        {(is_superuser ||
                          permissions.includes("delete_store")) && (
                          <button
                            className={classes.deleteBtn}
                            type="button"
                            onClick={() => deleteModelHandler(store.id)}>
                            حذف
                          </button>
                        )}

                        {(is_superuser ||
                          permissions.includes("add_invoice")) && (
                          <button
                            className={classes.editBtn}
                            type="button"
                            onClick={() => {
                              showInvoiceHandler(store.name, store.id);
                            }}>
                            تحويل
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>

          {storeCount > 10 && (
            <Paginate
              setCurrentPage={setCurrentPage}
              currentPage={currentPage}
              count={storeCount}
              search={searchValue}
              paginationFun={paginationFun}
              searchPagination={searchPagination}
              searchFn={fetchSearchHandler}
            />
          )}
        </div>
      )}
    </Fragment>
  );
};
export default Store;
