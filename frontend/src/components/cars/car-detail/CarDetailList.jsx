const CarDetailList = ({ data }) => {
  return (
    <tr>
      <td> {data.driver_name} </td>
      <td>{new Date(data.activity_date).toDateString()} </td>
      <td> {data.distance}كم </td>
      <td>
        {" "}
        {data.rides.map((ride) => {
          return (
            <div key={ride.id}>
              {ride.place_from === null ? (
                "-----"
              ) : (
                <p>
                  من <span>{ride.place_from}</span> الي{" "}
                  <span>{ride.place_to}</span>
                </p>
              )}
            </div>
          );
        })}
      </td>
      <td> {data.description} </td>
    </tr>
  );
};

export default CarDetailList;
