import React, { useEffect, useState } from "react";
import "./table.css";
import Card from "../card/card";
// import axios from "axios";

export default (Table) => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [orderBy, setOrderBy] = useState("name");
  const [order, setOrder] = useState(false);
  const [openCard, setOpenCard] = useState(false);
  const [rowClicked, setRowClicked] = useState();

  //   useEffect(() => {
  //     axios
  //       .get("https://api.openbrewerydb.org/breweries?per_page=50")
  //       .then((response) => {
  //         setData(response.data);
  //       });
  //   }, []);

  useEffect(() => {
    fetch("https://api.openbrewerydb.org/breweries?page=1&per_page=50", {
      method: "GET",
    })
      .then((response) => response.json())
      .then((responseData) => setData(responseData));
  }, []);

  const handleNextPage = () => {
    setCurrentPage(currentPage + 1);
    fetch(
      "https://api.openbrewerydb.org/breweries?page=" +
        currentPage +
        "&per_page=50",
      {
        method: "GET",
      }
    )
      .then((response) => response.json())
      .then((responseData) => setData(responseData));
  };

  const handlePrevPage = () => {
    setCurrentPage(currentPage - 1);
  };
  const handlePageChange = (event) => {
    setCurrentPage(event.target.value);
    fetch(
      "https://api.openbrewerydb.org/breweries?page=" +
        currentPage +
        "&per_page=50",
      {
        method: "GET",
      }
    )
      .then((response) => response.json())
      .then((responseData) => setData(responseData));
  };

  const handleCellClick = () => {
    setOpenCard(!openCard);
  };

  const handleSort = (ref) => {
    setOrderBy(ref);
    setOrder(!order);
  };

  const handleRowClick = (row) => {
    setRowClicked(row);
  };

  function sortRows(array, orderBy, order) {
    if (order) return array.sort((a, b) => (a[orderBy] > b[orderBy] ? 1 : -1));
    else return array.sort((a, b) => (a[orderBy] > b[orderBy] ? -1 : 1));
  }

  function createData(brewery_type, city, country, name, state) {
    return { brewery_type, city, country, name, state };
  }

  const rows = [];
  data.map((item) => {
    rows.push(
      createData(
        item.brewery_type,
        item.city,
        item.country,
        item.name,
        item.state
      )
    );
  });

  const headCells = [
    { ref: "brewery_type", label: "Brewery Type" },
    { ref: "city", label: "City" },
    { ref: "country", label: "Country" },
    { ref: "name", label: "Name" },
    { ref: "state", label: "State" },
  ];
  const hCells = headCells.map((item) => {
    return (
      <th key={item.ref} onClick={() => handleSort(item.ref)}>
        {item.label}
      </th>
    );
  });

  return (
    <div className="container">
      {openCard ? <Card clicked={handleCellClick} /> : null}
      <table className="table">
        <thead>
          <tr>{hCells}</tr>
        </thead>
        <tbody>
          {sortRows(rows, orderBy, order).map((item) => {
            return (
              <tr key={item.name} onClick={() => handleRowClick(item.name)}>
                <td onClick={handleCellClick}>{item.brewery_type}</td>
                <td onClick={handleCellClick}>{item.city}</td>
                <td onClick={handleCellClick}>{item.country}</td>
                <td onClick={handleCellClick}>{item.name}</td>
                <td onClick={handleCellClick}>{item.state}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="footer">
        <span>{currentPage}</span>
        <input
          type="number"
          onChange={(event) => handlePageChange(event)}
        ></input>
        <button onClick={handlePrevPage}>Previous page</button>
        <button onClick={handleNextPage}>Next page</button>
      </div>
    </div>
  );
};
