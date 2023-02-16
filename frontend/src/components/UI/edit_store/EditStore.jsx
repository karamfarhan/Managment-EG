import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { AiOutlineClose } from "react-icons/ai";
import Backdrop from "../backdrop/Backdrop";
import Inputs from "../inputs/Inputs";
import classes from "./EditStore.module.css";
import { getStores } from "../../../store/create-store-slice";
const EditStore = ({ id, hideFormHandler, showForm }) => {
  const [storeData, setStoreData] = useState({
    name: "",
    address: "",
    description: "",
  });
  const { token } = useSelector((state) => state.authReducer);
  const dispatch = useDispatch();
  //store data
  //form validation
  let formIsValid = false;
  console.log(showForm);
  if (storeData.address.trim() !== "" && storeData.name.trim() !== "") {
    formIsValid = true;
  }
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${window.domain}/stores/${id}/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) {
          throw new Error(res.statusText);
        }
        const data = await res.json();

        setStoreData({
          name: data.name,
          address: data.address,
          description: data.description,
        });
      } catch (err) {
        console.error(err);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  //edit store
  const editStore = async () => {
    try {
      const res = await fetch(`${window.domain}/stores/${id}/`, {
        method: "PATCH",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: storeData.name,
          address: storeData.address,
          description: storeData.description,
        }),
      });
      if (!res.ok) {
        throw new Error(res.statusText);
      }
      hideFormHandler();
      dispatch(getStores(token));
      await res.json();
    } catch (err) {
      console.error(err);
    }
  };

  const submitHandler = (e) => {
    e.preventDefault();
    editStore();
  };

  return (
    <Backdrop hideModel={hideFormHandler}>
      <div className={classes.formContent} dir="rtl">
        <span onClick={hideFormHandler}>
          <AiOutlineClose />
        </span>
        <form onSubmit={submitHandler}>
          <div>
            <Inputs
              type="text"
              placeholder="أسم المخزن"
              value={storeData.name}
              onChange={(e) =>
                setStoreData({ ...storeData, name: e.target.value })
              }
            />
            <Inputs
              type="text"
              placeholder="أسم الموقع"
              value={storeData.address}
              onChange={(e) =>
                setStoreData({ ...storeData, address: e.target.value })
              }
            />
            <Inputs
              type="text"
              placeholder=" معلومات اضافية (وصف - ملاحظات- الخ..)"
              value={storeData.description}
              onChange={(e) =>
                setStoreData({ ...storeData, description: e.target.value })
              }
            />
          </div>

          {/* محتويات المخزن */}

          <button disabled={!formIsValid} type="submit">
            اضافة
          </button>
        </form>
      </div>
    </Backdrop>
  );
};

export default EditStore;
