import React, { useState, useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import moment from "moment";
import Table from "../Partner/SelectedListingTable";

function Selected({ listing, index }) {
  const [data, setData] = useState([]);

  const [dates, setDate] = useState([]);

  useEffect(() => {
    let startDate = new Date();

    const endDate = new Date(startDate).setDate(startDate.getDate() + 7);
    const allDates = [];

    while (startDate <= endDate) {
      allDates.push(new Date(startDate));
      startDate.setDate(startDate.getDate() + 1);
    }

    setDate(allDates);
  }, []);

  useEffect(() => {
    axios.get(`${listing.sheety_url}`).then((res) => {
      setData(res.data.rooms);
    });
  }, []);

  const [currentOptions, setCurrentOptions] = useState([]);

  const handleCheck = (event, data) => {
    var updatedList = [...currentOptions];
    console.log(data);
    if (event.target.checked) {
      updatedList = [...updatedList, event.target.value];
    } else {
      updatedList.splice(currentOptions.indexOf(event.target.value), 1);
    }
    setCurrentOptions(updatedList);
  };

  const containsOption = (option) => {
    return currentOptions.includes(option);
  };

  const columns = useMemo(
    () => [
      {
        Header: "Rooms",
        accessor: "name",
        Cell: ({ row }) => {
          return (
            <div className="px-2 font-bold !py-3 ">{row.original.name}</div>
          );
        },
      },

      ...dates.map((date, index) => {
        return {
          Header: moment(date).format("Do MMMM"),
          accessor: moment(date).format("D/M/YYYY"),
          Cell: ({ row }) => {
            return (
              <div className="">
                {row.original[moment(date).format("D/M/YYYY")] ? (
                  <label
                    htmlFor={"date" + index}
                    className="cursor-pointer px-2 py-3 relative flex items-center gap-2"
                  >
                    <>
                      <div
                        className={
                          "w-[10px] h-[10px] absolute top-1 right-1 rounded-full " +
                          (row.original[moment(date).format("D/M/YYYY")] > 2
                            ? "bg-green-500"
                            : row.original[moment(date).format("D/M/YYYY")] <= 2
                            ? "bg-yellow-500"
                            : "bg-red-500")
                        }
                      ></div>
                      <div className="">
                        {row.original[moment(date).format("D/M/YYYY")]
                          ? row.original[moment(date).format("D/M/YYYY")]
                          : "Not Available"}
                      </div>
                    </>
                  </label>
                ) : (
                  <div className="px-2 py-3 relative">
                    <span>Not Available</span>
                    <div
                      className={
                        "w-[10px] h-[10px] absolute top-1 right-1 rounded-full bg-red-500 "
                      }
                    ></div>
                  </div>
                )}

                <input
                  type="checkbox"
                  value={row.original.id}
                  onChange={(event) =>
                    handleCheck(event, {
                      id: row.original.id,
                      date: moment(date).format("D/M/YYYY"),
                      available: row.original[moment(date).format("D/M/YYYY")],
                    })
                  }
                  checked={containsOption(row.original.id)}
                  className="hidden"
                  id={"date" + index}
                  readOnly
                />
              </div>
            );
          },
        };
      }),
    ],
    [dates]
  );

  const calendar = useMemo(() => data, [data]);
  return (
    <div className="px-4">
      {data.length > 0 && <Table columns={columns} data={calendar}></Table>}
    </div>
  );
}

Selected.propTypes = {};

export default Selected;
