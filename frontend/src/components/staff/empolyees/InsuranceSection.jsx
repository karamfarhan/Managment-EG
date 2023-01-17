import React from "react";

const InsuranceSection = ({ empolyee }) => {
  return (
    <>
      {empolyee.insurance === null && <p> ليس مؤمن عليه </p>}
      {empolyee.insurance && (
        <ul>
          <li>
            رقم التأمين : <span> {empolyee.insurance.ins_code} </span>
          </li>
          <li>
            شركة التأمين : <span> {empolyee.insurance.ins_company} </span>
          </li>
          <li>
            نوع التأمين : <span> {empolyee.insurance.ins_type} </span>
          </li>
          <li>
            تاريخ التأمين : <span> {empolyee.insurance.start_at} </span>
          </li>
        </ul>
      )}
    </>
  );
};

export default InsuranceSection;
