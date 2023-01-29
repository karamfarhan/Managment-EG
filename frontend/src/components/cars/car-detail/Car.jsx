import React from "react";

const Car = ({ car }) => {
  return (
    <div>
      <p>
        أسم السائق : <span> {car.driver_name} </span>{" "}
      </p>
      <p>
        رقم السيارة : <span> {car.car_number} </span>{" "}
      </p>
      <p>
        نوع السيارة : <span> {car.car_type} </span>{" "}
      </p>
      <p>
        طراز السيارة : <span> {car.car_model} </span>{" "}
      </p>
      <p>
        أخر صيانة : <span> {car.last_maintain} </span>{" "}
      </p>
      <p>
        مكان الصيانة :
        <span>
          {car.maintain_place === "" ? "لم يحدد" : car.maintain_place}
        </span>
      </p>
    </div>
  );
};

export default Car;
