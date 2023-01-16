import Inputs from "../../../UI/inputs/Inputs";

const Insurance = ({
  ins_code,
  ins_company,
  ins_type,
  start_at,
  setInsuranceData,
  insuranceData,
}) => {
  return (
    <div>
      <h3>بيانات التأمين</h3>
      <Inputs
        type="date"
        placeholder="الرقم التأميني"
        label="بداية التأمين"
        value={start_at}
        onChange={(e) =>
          setInsuranceData({ ...insuranceData, start_at: e.target.value })
        }
      />
      <Inputs
        type="text"
        placeholder="الرقم التأميني"
        value={ins_code}
        onChange={(e) =>
          setInsuranceData({ ...insuranceData, ins_code: e.target.value })
        }
      />
      <Inputs
        type="text"
        placeholder="نوع التأمين"
        value={ins_type}
        onChange={(e) =>
          setInsuranceData({ ...insuranceData, ins_type: e.target.value })
        }
      />
      <Inputs
        type="text"
        placeholder="شركة التأمين"
        value={ins_company}
        onChange={(e) =>
          setInsuranceData({ ...insuranceData, ins_company: e.target.value })
        }
      />
    </div>
  );
};

export default Insurance;
