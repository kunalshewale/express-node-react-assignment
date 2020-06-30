import React, { useMemo } from "react";
import Table from "./Table";

const CovidDataTable = ({ data }) => {
  const columns = useMemo(
    () => [
      {
        Header: "Timeline",
        columns: [{ Header: "Dates", accessor: "date", sortType: "basic" }],
      },
      {
        Header: "Details",
        columns: [
          {
            Header: "Cases",
            accessor: "cases",
            sortType: "basic",
          },
          {
            Header: "Recovered",
            accessor: "recovered",
            sortType: "basic",
          },
          {
            Header: "Deaths",
            accessor: "deaths",
            sortType: "basic",
          },
        ],
      },
    ],
    []
  );

  return <Table columns={columns} data={data} />;
};

export default CovidDataTable;
