import { Fragment, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { SiHomeassistantcommunitystore } from "react-icons/si";
import classes from "./Store.module.css";
import CreateStoreUi from "../UI/create_store_popup/CreateStoreUi";
import Bar from "../UI/bars/Bar";
import { useEffect } from "react";
import { getStores } from "../../store/create-store-slice";
import AuthContext from "../../context/Auth-ctx";
import DeleteConfirmation from "../UI/delete_confirmation/DeleteConfirmation";
const Store = () => {
  const dispatch = useDispatch();
  const [showForm, setShowForm] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [storeId, setStoreId] = useState("");

  const authCtx = useContext(AuthContext);
  const { token } = authCtx;

  //store data
  const { store_data } = useSelector((state) => state.storeSlice);
  //get stores
  useEffect(() => {
    dispatch(getStores(token));
  }, [dispatch, token]);
  //hide form handler
  const hideFormHandler = () => {
    setShowForm(false);
  };
  //show form handler
  const showFormHandler = () => {
    setShowForm(true);
  };

  //delete handler
  const deleteHandler = async (id) => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/stores/${id}`, {
        method: "DELETE",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      setIsDelete(false);

      const data = await res.json();
      dispatch(getStores(token));
    } catch (err) {}
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
  return (
    <Fragment>
      {showForm && <CreateStoreUi hideFormHandler={hideFormHandler} />}
      {isDelete && (
        <DeleteConfirmation
          hideModel={hideDeleteModel}
          deleteHandler={deleteHandler}
          id={storeId}
        />
      )}
      <Bar>
        <button
          onClick={showFormHandler}
          type="button"
          className={classes.addInventory}>
          <SiHomeassistantcommunitystore /> انشاء مخزن
        </button>
      </Bar>

      {store_data && store_data.length === 0 && (
        <p className={classes.msg_p}> لا يوجد مخازن </p>
      )}
      {store_data && store_data.length > 0 && (
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
                store_data.map((store) => {
                  return (
                    <tr key = {store.id}>
                      <td>
                        {" "}
                        <Link to={`/store/${store.id}`}>{store.name}</Link>{" "}
                      </td>
                      <td> {store.address} </td>
                      <td> {store.created_by.username} </td>
                      <td>{new Date(store.created_at).toDateString()} </td>
                      <td> {store.description} </td>
                      <td>
                        <button
                          type="button"
                          onClick={() => deleteModelHandler(store.id)}>
                          حذف
                        </button>{" "}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      )}
    </Fragment>
  );
};
export default Store;
