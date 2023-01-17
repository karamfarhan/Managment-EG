const AboutSecion = ({ empolyee }) => {
  return (
    <>
      <p>
        تاريخ التوظيف : <span> {empolyee.signin_date} </span>{" "}
      </p>
      <p>
        سنوات الخبرة : <span> {empolyee.years_of_experiance}</span>
      </p>
      <p>
        مقر العمل :
        <span>
          {empolyee.store_address === null
            ? "مقر الشركة"
            : empolyee.store_address}{" "}
        </span>
      </p>
      <p>
        نوع العقد :
        <span>
          {empolyee.is_primary === true ? "موظف دائم" : "موظف بعقد مؤقت"}{" "}
        </span>
      </p>
      <p>
        عدد الأجازات :<span>{empolyee.days_off} </span>
      </p>
    </>
  );
};

export default AboutSecion;
