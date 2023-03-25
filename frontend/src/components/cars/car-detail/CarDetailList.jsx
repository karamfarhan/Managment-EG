const CarDetailList = ({ data }) => {
  return (
    <tr>
      {/* <td> {data.driver.} </td> */}
      <td>{new Date(data.activity_date).toLocaleDateString()} </td>
      <td> {data.distance}كم </td>
      <td>
        {" "}
        {data.destination.map((ride) => {
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
      <td> {data.notes} </td>
    </tr>
  );
};

export default CarDetailList;
