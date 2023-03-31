import { Fragment, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import SubstancesView from "./substances_view/SubstancesView";

import InstrumentsView from "./instruments_view/InstrumentsView";
import { getInstruments } from "../../store/create-instruments";
import CreateSubsModel from "../UI/create_substances/CreateSubsModel";
import classes from "./CreateSubs.module.css";
import CategoryForm from "../UI/add_category/CategoryForm";
import { getCategories } from "../../store/category-slice";
import Category from "./category/Category";
import axios from "axios";

const CreateSubs = () => {
  const [t, i18n] = useTranslation();
  //create category
  const [createCategory, setCreateCategory] = useState(false);
  //for add matters
  const [showModel, setShowModel] = useState(false);
  //for add instruments
  const [showInstrumentsForm, setShowInstrumentsForm] = useState(false);
  //show matters
  const [showMatters, setShowMatters] = useState(false);
  const [substanceData, setSubstanceData] = useState([]);
  //show instruments
  const [showInstrumentsPage, setShowInstrumentsPage] = useState(false);
  //current page
  const [currentPage, setCurrentPage] = useState(1);
  //search value
  const [searchVal, setSearchVal] = useState("");
  const [activeIndex, setActiveIndex] = useState(-1);
  const [isLoading, setIsLoading] = useState(-1);

  const [showAccordion, setShowAccordion] = useState(false);
  const handleClick = async (index, id) => {
    setShowAccordion((curState) => !curState);
    if (showAccordion === true) return;
    setActiveIndex(index);
    setIsLoading(true);
    try {
      const response = await axios.get(`${window.domain}category/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = response.data.data.category.substances.substances;
      setSubstanceData(data);
      setIsLoading(false);
    } catch (err) {
      console.log(err);
      setIsLoading(false);
    }
  };
  const { token } = useSelector((state) => state.authReducer);
  const { category } = useSelector((state) => state.categoryReducer);
  // const decoded = jwt_decode(token);
  // const { is_superuser, permissions } = decoded;
  const dispatch = useDispatch();

  useEffect(() => {
    if (showMatters) {
      dispatch(getCategories(token));
    }
  }, [showMatters]);

  useEffect(() => {
    if (
      showInstrumentsPage === true &&
      currentPage === 1 &&
      showInstrumentsForm === false &&
      showMatters === false &&
      searchVal === ""
    ) {
      dispatch(getInstruments(token));
    }
  }, [
    currentPage,
    dispatch,
    searchVal,
    showInstrumentsForm,
    showInstrumentsPage,
    showMatters,
  ]);

  //fetch matters
  const fetchMatters = () => {
    setShowMatters(true);
    setShowInstrumentsPage(false);
    setCurrentPage(1);
    setSearchVal("");
  };

  //fetch instruments
  const fetchInstruments = () => {
    setShowInstrumentsPage(true);
    setShowMatters(false);
    setCurrentPage(1);
    setSearchVal("");
  };
  const hideSubstancesHandler = () => {
    setShowModel(false);
    setShowInstrumentsForm(false);
  };

  return (
    <Fragment>
      {createCategory && (
        <CategoryForm hideModel={() => setCreateCategory(false)} />
      )}
      {(showModel || showInstrumentsForm) && (
        <CreateSubsModel
          hideSubstancesHandler={hideSubstancesHandler}
          showMattersForm={showModel}
          instrumentsPage={showInstrumentsPage}
          showMattersPage={showMatters}
          showInstrumentsForm={showInstrumentsForm}
        />
      )}
      {/* المخزن الرئيسي*/}

      <div className={classes["main_inventory"]}></div>
      <button
        className={classes["create-category"]}
        onClick={() => setCreateCategory(true)}>
        {" "}
        {t("create_category")}
      </button>

      <div className={classes.buttons}>
        <div className={classes.show}>
          <div>
            <button type="button" onClick={() => setShowModel(true)}>
              {t("addSubstance")}
            </button>
            <button
              id="substances"
              type="button"
              name="substances"
              onClick={fetchMatters}>
              {t("viewSubs")}
            </button>
          </div>
          <div>
            <button
              id="instruments"
              type="button"
              name="instruments"
              onClick={fetchInstruments}>
              {t("viewInst")}
            </button>

            <button type="button" onClick={() => setShowInstrumentsForm(true)}>
              {t("addInstruments")}
            </button>
          </div>
        </div>
      </div>
      {category &&
        showMatters === true &&
        category.data &&
        category.data.categories.map((category, i) => (
          <Category
            key={category._id}
            id={category._id}
            index={i}
            activeIndex={activeIndex}
            categoryName={category.category_name}
            categoryCode={category.category_code}
            isLoading={isLoading}
            setSubstanceData={setSubstanceData}
            substanceData={substanceData}
            fetchSubstances={handleClick}
            showAccordion={showAccordion}
            showMatters={showMatters}
          />
        ))}

      {showInstrumentsPage && (
        <InstrumentsView
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          setSearchVal={setSearchVal}
          searchVal={searchVal}
        />
      )}
    </Fragment>
  );
};

export default CreateSubs;
