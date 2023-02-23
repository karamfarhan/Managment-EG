import { Fragment, useState, useCallback, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import jwt_decode from "jwt-decode";
import { MdOutlineDeleteForever } from "react-icons/md";
import { BiTransfer } from "react-icons/bi";
import { FiEdit } from "react-icons/fi";
import { AiOutlineFileImage } from "react-icons/ai";
import Paginate from "../UI/pagination/Paginate";
import CreateStoreUI from "../UI/create_store_popup/CreateStoreUi";
import Bar from "../UI/bars/Bar";
import {
  getStores,
  storePagination,
  storeSearch,
  storeSearchPagination,
} from "../../store/create-store-slice";
import DeleteConfirmation from "../UI/delete_confirmation/DeleteConfirmation";
import EditStore from "../UI/edit_store/EditStore";
import Search from "../UI/search/Search";
import LoadingSpinner from "../UI/loading/LoadingSpinner";
import AddInvoice from "../UI/add_invoice/AddInvoice";
import classes from "./Store.module.css";
import SelectImg from "../UI/select_img/SelectImg";

const Store = () => {
  const { token } = useSelector((state) => state.authReducer);
  const dispatch = useDispatch();
  const [forms, setForms] = useState({
    uploadImgs: false,
    showStoreForm: false,
    isDelete: false,
    showEditForm: false,
    showInvoiceForm: false,
  });

  const [storeIdInvoice, setStoreIdInvoice] = useState("");
  //current page
  const [currentPage, setCurrentPage] = useState(1);

  //search
  const [searchValue, setSearchValue] = useState("");

  //create invoice
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
  const { store_data, isLoading } = useSelector((state) => state.storeSlice);

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
        setForms({ isDelete: false });
        dispatch(getStores(token));

        const data = await res.json();
        return data;
      } catch (err) {
        console.log(err.message);
      }
  };

  //show delete mode
  const deleteModelHandler = (id) => {
    setForms({ isDelete: true });
    setStoreId(id);
  };

  //hide delete mode
  const hideDeleteModel = () => {
    setForms({ isDelete: false });
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
    setForms({ showInvoiceForm: true });

    setStoreName(name);
    setStoreIdInvoice(id);
  };

  //hide invoice handler
  const hideInvoiceHandler = () => {
    setForms({ showInvoiceForm: false });
  };
  //edit store form
  const editStore = (id) => {
    setForms({ showEditForm: true });
    setStoreId(id);
  };

  //upload image
  const uploadImageHandler = (id) => {
    setForms({ uploadImgs: true });
    setStoreId(id);
  };

  return (
    <Fragment>
      {/* upload images */}
      {forms.uploadImgs && (
        <SelectImg
          id={storeId}
          hideImageHandler={() => setForms({ uploadImgs: false })}
        />
      )}
      {/* create store */}
      {forms.showStoreForm && (
        <CreateStoreUI
          hideFormHandler={() => setForms({ showStoreForm: false })}
        />
      )}
      {/* edit form  */}
      {forms.showEditForm && (
        <EditStore
          id={storeId}
          showForm={forms.showEditForm}
          hideFormHandler={() => setForms({ showEditForm: false })}
        />
      )}
      {forms.showInvoiceForm && (
        <AddInvoice
          storeId={storeIdInvoice}
          storeName={storeName}
          hideModel={hideInvoiceHandler}
        />
      )}
      {forms.isDelete && (
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
              placeholder=" المخزن أو التاريخ YYYY-DD-MM"
              onChange={searchHandler}
              value={searchValue}
              searchData={fetchSearchHandler}
            />
          )}
          {(permissions.includes("add_store") || is_superuser) && (
            <button
              className={classes.addInventory}
              onClick={() => setForms({ showStoreForm: true })}
            >
              <span>
                <AiOutlineFileImage />
              </span>
              انشاء مخزن جديد
            </button>
          )}
        </div>
      </Bar>
      {isLoading && <LoadingSpinner />}
      {store_data && !isLoading && store_data.length === 0 && (
        <p className={classes.msg_p}> لا يوجد مخازن </p>
      )}
      {store_data && store_data.results.length === 0 && !isLoading && (
        <h1>لا يوجد مخازن</h1>
      )}
      {store_data &&
        !isLoading &&
        store_data.results &&
        store_data.results.length > 0 && (
          <div className={classes["table_content"]}>
            <table>
              <thead>
                <tr>
                  <th>أسم المخزن</th>
                  <th>عنوان المخزن</th>
                  {/* <th>انشيء عن طريق</th> */}
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
                        {/* <td> {store.created_by} </td> */}
                        <td>{new Date(store.created_at).toDateString()} </td>
                        <td> {store.description} </td>
                        <td>
                          {(is_superuser ||
                            permissions.includes("add_invoice")) && (
                            <button
                              className={classes.editBtn}
                              type="button"
                              onClick={() => {
                                showInvoiceHandler(store.name, store.id);
                              }}
                            >
                              <BiTransfer />
                            </button>
                          )}
                          {(permissions.includes("add_image") ||
                            permissions.includes("add_mediapack") ||
                            is_superuser) && (
                            <button
                              className="add-img"
                              type="button"
                              onClick={() => uploadImageHandler(store.id)}
                            >
                              <AiOutlineFileImage />
                            </button>
                          )}
                          {(is_superuser ||
                            permissions.includes("change_store")) && (
                            <button
                              className="editBtn"
                              type="button"
                              onClick={() => editStore(store.id)}
                            >
                              <FiEdit />
                            </button>
                          )}

                          {(is_superuser ||
                            permissions.includes("delete_store")) && (
                            <button
                              className={classes.deleteBtn}
                              type="button"
                              onClick={() => deleteModelHandler(store.id)}
                            >
                              <MdOutlineDeleteForever />
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
