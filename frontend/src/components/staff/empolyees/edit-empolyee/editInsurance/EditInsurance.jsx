import Inputs from "../../../../UI/inputs/Inputs";
const EditInsurance = ({
  ins_code,
  ins_company,
  ins_type,
  start_at,
  setInsuranceData,
  insuranceData,
  data,
}) => {
  return (
    <div>
      <h3>بيانات التأمين</h3>
      <Inputs
        type="date"
        placeholder="الرقم التأميني"
        label="بداية التأمين"
        value={start_at}
        required
        onChange={(e) =>
          setInsuranceData({ ...insuranceData, start_at: e.target.value })
        }
      />
      <Inputs
        type="text"
        placeholder="الرقم التأميني"
        value={ins_code}
        required
        onChange={(e) =>
          setInsuranceData({ ...insuranceData, ins_code: e.target.value })
        }
      />
      {data && data.insurance && data.insurance.ins_code && (
        <p className="err-msg"> {data.insurance.ins_code} </p>
      )}
      <Inputs
        type="text"
        placeholder="نوع التأمين"
        value={ins_type}
        required
        onChange={(e) =>
          setInsuranceData({ ...insuranceData, ins_type: e.target.value })
        }
      />
      <Inputs
        type="text"
        placeholder="شركة التأمين"
        value={ins_company}
        required
        onChange={(e) =>
          setInsuranceData({ ...insuranceData, ins_company: e.target.value })
        }
      />
    </div>
  );
};

export default EditInsurance;
