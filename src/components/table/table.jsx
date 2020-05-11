import React, { useEffect, useState } from "react";
import "./table.css";
import Card from "../card/card";
import Loader from "../loader/loader";

export default (Table) => {
  const [data, setData] = useState({});
  const [ids, setIds] = useState([]);
  const [orderBy, setOrderBy] = useState("name");
  const [order, setOrder] = useState(false);
  const [openCard, setOpenCard] = useState(false);
  const [shouldSort, setShouldSort] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [rowClicked, setRowClicked] = useState();
  const [selectedCellData, setSelectedCellData] = useState();
  const [loading, setLoading] = useState(false);

  const getData = async function (pageNo) {
    let apiURL =
      "https://api.openbrewerydb.org/breweries?page=" + pageNo + "&per_page=50";
    const apiResult = fetch(apiURL).then((response) => {
      return response.json();
    });
    return apiResult;
  };

  const getFullData = async function (pageNo) {
    const result = await getData(pageNo);
    if (result.length > 0) {
      return result.concat(await getFullData(pageNo + 1));
    } else return result;
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      const fullData = await getFullData(1);
      const myData = fullData.map((item) => ({
        id: item.id,
        brewery_type: item.brewery_type,
        city: item.city,
        country: item.country,
        name: item.name,
        state: item.state,
      }));
      const result = myData.reduce((hashMap, item) => {
        return { ...hashMap, [item.id]: item };
      });
      setData(result);
      const ids = fullData.map((item) => item.id);
      setIds(ids);
      setLoading(false);
    })();
  }, []);

  const handleNextPage = () => {
    setPage(page + 1);
  };

  const handlePrevPage = () => {
    if (page > 0) setPage(page - 1);
  };
  const handlePageChange = (event) => {
    const value = parseInt(event.target.value);
    if (typeof value === "number" && value > 0) {
      setPage(value - 1);
    }
  };

  const handleCellClick = (content) => {
    setSelectedCellData(content);
    setOpenCard(!openCard);
  };

  const handleSort = (ref) => {
    setShouldSort(true);
    setOrderBy(ref);
    setOrder(!order);
  };

  const handleRowsPerPageSelect = (event) => {
    setRowsPerPage(parseInt(event.target.value));
  };

  const handleRowClick = (row) => {
    if (!openCard) setRowClicked(row);
  };

  function sortRows(array, orderBy, order, hashMap) {
    if (shouldSort) {
      if (order)
        return array
          .map((id) => hashMap[id])
          .filter((x) => x)
          .sort((a, b) => (a[orderBy] > b[orderBy] ? 1 : -1));
      else
        return array
          .map((id) => {
            return hashMap[id];
          })
          .filter((x) => x)
          .sort((a, b) => (a[orderBy] > b[orderBy] ? -1 : 1));
    } else
      return array
        .map((id) => {
          return hashMap[id];
        })
        .filter((x) => x);
  }

  const perPageOptions = [
    { label: "10", value: 10 },
    { label: "25", value: 25 },
    { label: "50", value: 50 },
    { label: "All", value: -1 },
  ];

  const headCells = [
    { ref: "brewery_type", label: "Brewery Type" },
    { ref: "city", label: "City" },
    { ref: "country", label: "Country" },
    { ref: "name", label: "Brewery Name" },
    { ref: "state", label: "State" },
  ];
  const hCells = headCells.map((item) => {
    return (
      <th key={item.ref} onClick={() => handleSort(item.ref)}>
        {item.label}
      </th>
    );
  });

  const rows = sortRows(ids, orderBy, order, data, shouldSort);

  return (
    <div className="container">
      <h1>Breweries of United States</h1>
      {openCard ? (
        <Card clicked={handleCellClick} text={selectedCellData} />
      ) : null}
      {!loading ? (
        <>
          <table className="table">
            <thead>
              <tr>{hCells}</tr>
            </thead>
            <tbody>
              {(rowsPerPage > 0
                ? rows.slice(
                    page * rowsPerPage,
                    page * rowsPerPage + rowsPerPage
                  )
                : rows
              ).map((item) => {
                return (
                  <tr
                    key={item.id}
                    onClick={() => handleRowClick(item.name)}
                    className={rowClicked === item.name ? "clickedRow" : ""}
                  >
                    <td onClick={() => handleCellClick(item.brewery_type)}>
                      {item.brewery_type}
                    </td>
                    <td onClick={() => handleCellClick(item.city)}>
                      {item.city}
                    </td>
                    <td onClick={() => handleCellClick(item.country)}>
                      {item.country}
                    </td>
                    <td onClick={() => handleCellClick(item.name)}>
                      {item.name}
                    </td>
                    <td onClick={() => handleCellClick(item.state)}>
                      {item.state}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="footer">
            <span className="selectLabel">Rows per page:</span>
            <select onChange={(event) => handleRowsPerPageSelect(event)}>
              {perPageOptions.map((option) => {
                if (option.value === rowsPerPage)
                  return (
                    <option key={option.value} value={option.value} selected>
                      {option.label}
                    </option>
                  );
                else
                  return (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  );
              })}
            </select>
            <span className="rowCount">
              {page * rowsPerPage +
                1 +
                " - " +
                (page * rowsPerPage + rowsPerPage) + " of " + ids.length}
            </span>
            <button onClick={handlePrevPage}>Previous page</button>
            <input
              type="text"
              placeholder={page + 1}
              onBlur={(event) => handlePageChange(event)}
            ></input>
            <button onClick={handleNextPage}>Next page</button>
          </div>
        </>
      ) : (
        <Loader />
      )}
    </div>
  );
};
