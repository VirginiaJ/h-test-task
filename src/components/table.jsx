import React, { useEffect, useState } from "react";
import axios from "axios";

export default (Table) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios
      .get("https://api.openbrewerydb.org/breweries?per_page=50")
      .then((response) => {
        setData(response.data);
      });
  }, []);

//   useEffect(() => {
//     fetch("https://api.openbrewerydb.org/breweries?per_page=50", {
//       method: "GET",
//     })
//       .then((response) => response.json())
//       .then((responseData) => setData(responseData))
//   }, []);

  const rows = data.map((item) => {
    return (
      <tr key={item.id}>
        <td>{item.brewery_type}</td>
        <td>{item.city}</td>
        <td>{item.country}</td>
        <td>{item.name}</td>
        <td>{item.state}</td>
      </tr>
    );
  });

  return (
    <table>
      <thead>
        <tr>
          <th>Brewery Type</th>
          <th>City</th>
          <th>Country</th>
          <th>Name</th>
          <th>State</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  );
};
