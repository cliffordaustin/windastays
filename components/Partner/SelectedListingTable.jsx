import { Icon } from "@iconify/react";
import React from "react";
import { useTable, useSortBy } from "react-table";

function Table({ columns, data }) {
  // Use the state and functions returned from useTable to build your UI
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable(
      {
        columns,
        data,
      },
      useSortBy
    );

  // Render the UI for your table
  return (
    <table className="!w-full" {...getTableProps()}>
      <thead>
        {headerGroups.map((headerGroup, index) => (
          <tr
            className="bg-gray-100 border text-gray-500 text-sm font-medium"
            key={index}
            {...headerGroup.getHeaderGroupProps()}
          >
            {headerGroup.headers.map((column, index) => (
              <th
                key={index}
                {...column.getHeaderProps(column.getSortByToggleProps())}
                className="text-gray-600 border-r py-2 px-2"
              >
                <div className="flex items-center">
                  {column.render("Header")}

                  <div className="w-6 h-7 flex items-center justify-center">
                    {column.isSorted ? (
                      column.isSortedDesc ? (
                        <Icon
                          className={
                            "w-6 h-6 " + (column.isSorted ? "" : "hidden")
                          }
                          icon="ic:round-arrow-drop-down"
                        />
                      ) : (
                        <Icon
                          className="w-6 h-6"
                          icon="ic:round-arrow-drop-up"
                        />
                      )
                    ) : (
                      ""
                    )}
                  </div>
                </div>
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody className="text-sm text-gray-600" {...getTableBodyProps()}>
        {rows.map((row, index) => {
          prepareRow(row);
          return (
            <tr
              className="border-l border-b"
              key={index}
              {...row.getRowProps()}
            >
              {row.cells.map((cell, index) => {
                return (
                  <td
                    className="border-r hover:bg-gray-100 transition-colors duration-200 ease-linear"
                    key={index}
                    {...cell.getCellProps()}
                  >
                    {cell.render("Cell")}
                  </td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

Table.propTypes = {};

export default Table;
