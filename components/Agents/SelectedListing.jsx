import React, { useEffect } from "react";
import PropTypes from "prop-types";
import Table from "../Partner/Table";
import { createGlobalStyle } from "styled-components";
import moment from "moment";
import { Icon } from "@iconify/react";
import Cookies from "js-cookie";
import { DayPicker } from "react-day-picker";
import { useRouter } from "next/router";

function SelectedListing({ listing, index }) {
  const router = useRouter();

  const [startDates, setStartDate] = React.useState();
  const [endDates, setEndDate] = React.useState();

  const [dates, setDate] = React.useState([]);

  useEffect(() => {
    let startDate = new Date();

    const endDate = new Date(startDate).setDate(startDate.getDate() + 7);
    const allDates = [];

    if (startDates && endDates) {
      var currentDate = moment(startDates);
      var stopDate = moment(endDates);
      while (currentDate <= stopDate) {
        allDates.push(moment(currentDate).format("YYYY-MM-DD"));
        currentDate = moment(currentDate).add(1, "days");
      }
    } else {
      while (startDate <= endDate) {
        allDates.push(new Date(startDate));
        startDate.setDate(startDate.getDate() + 1);
      }
    }

    setDate(allDates);
  }, [startDates, endDates]);

  const columns = React.useMemo(
    () => [
      {
        Header: listing.name,
        Cell: (row) => {
          return listing.room_types[row.row.index].name;
        },
      },
      ...dates.map((date) => {
        return {
          Header: moment(date).format("MMM Do"),
          Cell: (row) => {
            const room = listing.room_types[row.row.index];
            const dateData = room.room_availabilities.find((roomDate) => {
              return (
                moment(roomDate.date).format("YYYY-MM-DD") ===
                moment(date).format("YYYY-MM-DD")
              );
            });

            return (
              <div onClick={() => {}} className="cursor-pointer">
                {dateData && (
                  <div className="flex flex-col">
                    <div className="text-xs font-bold text-gray-600">
                      ${dateData.price}
                    </div>
                    <div className="text-xs text-gray-600">
                      {dateData.num_of_available_rooms} Available
                    </div>
                  </div>
                )}

                {!dateData && (
                  <div className="text-xs text-gray-600">
                    <h1 className="font-black"> -- </h1>
                  </div>
                )}
              </div>
            );
          },
        };
      }),
    ],
    [dates]
  );

  const [isOpen, setIsOpen] = React.useState(index === 0 ? true : false);

  const data = React.useMemo(() => listing.room_types, [listing]);

  const GlobalStyle = createGlobalStyle`
    table {
      border-spacing: 0;


      tr {
        :last-child {
          td {
            border-bottom: 0;
          }
        }
      }

      th,
      td {
        margin: 4;
        padding: 0.5rem;

        :last-child {
          border-right: 0;
        }
      }
    }
  `;
  return (
    <div className="px-4 py-2 bg-gray-100 rounded-md">
      <GlobalStyle />
      <div className="flex justify-between items-center">
        <div className="flex gap-2 items-center">
          <div
            onClick={() => setIsOpen(!isOpen)}
            className="w-5 h-5 rounded-md transition-colors duration-300 cursor-pointer hover:bg-gray-300 flex items-center justify-center text-gray-600 text-xs font-bold"
          >
            <Icon
              className={
                "w-4 h-4 transition-all duration-200 " +
                (isOpen ? " rotate-0" : " rotate-[270deg]")
              }
              icon="tabler:chevron-down"
            />
          </div>
          <h1 className="font-bold">{listing.name}</h1>
          <div className="w-5 h-5 rounded-md bg-gray-300 flex items-center justify-center text-gray-600 text-xs font-bold">
            {listing.room_types.length}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              //   setOpenDeleteRoomModal(true);
            }}
            className="bg-white shadow-lg flex items-center justify-center text-lg font-bold text-black w-8 h-8 rounded-full"
          >
            <Icon
              className="text-red-500"
              icon="material-symbols:delete-outline-rounded"
            />
          </button>
        </div>
      </div>
      {isOpen && (
        <div className="w-full mt-2 bg-white">
          {data.length > 0 && <Table columns={columns} data={data}></Table>}
        </div>
      )}
    </div>
  );
}

SelectedListing.propTypes = {};

export default SelectedListing;
