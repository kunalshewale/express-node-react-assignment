import React, { useMemo } from "react";
import { useTable, useFilters, useSortBy } from "react-table";
import MaUTable from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";

const Table = ({ columns, data }) => {
  // Use the state and functions returned from useTable to build your UI
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable(
    {
      columns,
      data,
      initialState: {
        sortBy: [
          {
            id: "date",
            desc: true,
          },
        ],
      },
    },
    useFilters,
    useSortBy
  );

  // Render the UI for your table
  return (
    <>
      <MaUTable {...getTableProps()}>
        <TableHead>
          {headerGroups.map((headerGroup) => (
            <TableRow
              {...headerGroup.getHeaderGroupProps()}
              style={{ border: "1px solid rgba(224, 224, 224, 1)" }}
            >
              {headerGroup.headers.map((column) => (
                <TableCell
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  style={{
                    borderLeft: "1px solid rgba(224, 224, 224, 1)",
                    textAlign: "center",
                    cursor: "pointer",
                  }}
                >
                  {column.render("Header")}
                  {column.id !== "selection" ? (
                    <TableSortLabel
                      active={column.isSorted}
                      direction={column.isSortedDesc ? "desc" : "asc"}
                    />
                  ) : null}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableHead>
        <TableBody {...getTableBodyProps()}>
          {rows.map((row, i) => {
            prepareRow(row);
            return (
              <TableRow
                {...row.getRowProps()}
                style={{
                  border: "1px solid rgba(224, 224, 224, 1)",
                }}
              >
                {row.cells.map((cell) => {
                  return (
                    <TableCell
                      {...cell.getCellProps()}
                      style={{
                        borderLeft: "1px solid rgba(224, 224, 224, 1)",
                        textAlign: "center",
                      }}
                    >
                      {cell.render("Cell")}
                    </TableCell>
                  );
                })}
              </TableRow>
            );
          })}
        </TableBody>
      </MaUTable>
    </>
  );
};

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
