const AboutSecion = ({ empolyee }) => {
  return (
    <>
      <p>
        تاريخ التوظيف : <span> {empolyee.signin_date} </span>{" "}
      </p>
      <p>
        التأمين :{" "}
        <span>
          {" "}
          {empolyee.insurance === true ? "مؤمن عليه" : "ليس مؤمن عليه"}{" "}
        </span>{" "}
      </p>
      <p>
        سنوات الخبرة : <span> {empolyee.experience}</span>
      </p>
      <p>
        مقر العمل :
        <span>
          {empolyee.location.store_address === null
            ? "مقر الشركة"
            : empolyee.location.store_address}{" "}
        </span>
      </p>

      <p>
        عدد الأجازات :<span>{empolyee.days_off} </span>
      </p>
      <p>
        ملاحظات :<span>{empolyee.note} </span>
      </p>
    </>
  );
};

export default AboutSecion;
