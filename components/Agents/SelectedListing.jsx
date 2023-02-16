import React, { useEffect } from "react";
import PropTypes from "prop-types";
import Table from "../Partner/Table";
import { createGlobalStyle } from "styled-components";
import moment from "moment";
import { Icon } from "@iconify/react";
import Cookies from "js-cookie";
import { DayPicker } from "react-day-picker";
import { useRouter } from "next/router";
import PopoverBox from "../ui/Popover";
import axios from "axios";
import SelectedListingCard from "./SelectedListingCard";

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
      {/* {isOpen && (
        <div className="w-full mt-2 bg-white">
          {data.length > 0 && <Table columns={columns} data={data}></Table>}
        </div>
      )} */}

      <div className="px-2 py-2 flex h-[160px] w-full rounded-xl bg-white mt-2">
        <div className="w-fit flex flex-col justify-around">
          <div>
            <div className="flex items-center gap-1 px-2 py-1 text-gray-500 bg-gray-100 rounded-md border w-fit">
              {router.query.residentAdult && (
                <h1 className="font-bold text-sm">
                  {router.query.residentAdult}{" "}
                  {router.query.residentAdult > 1
                    ? "Resident adults"
                    : "Resident adult"}
                </h1>
              )}

              <h1> | </h1>

              {router.query.residentChild && (
                <h1 className="font-bold text-sm">
                  {router.query.residentChild}{" "}
                  {router.query.residentChild > 1
                    ? "Resident children"
                    : "Resident child"}
                </h1>
              )}

              <h1> | </h1>

              {router.query.nonResidentAdult && (
                <h1 className="font-bold text-sm">
                  {router.query.nonResidentAdult}{" "}
                  {router.query.nonResidentAdult > 1
                    ? "Non-resident adults"
                    : "Non-resident adult"}
                </h1>
              )}

              <h1> | </h1>

              {router.query.nonResidentChild && (
                <h1 className="font-bold text-sm">
                  {router.query.nonResidentChild}{" "}
                  {router.query.nonResidentChild > 1
                    ? "Non-resident children"
                    : "Non-resident child"}
                </h1>
              )}

              {/* <h1> | </h1>

              {router.query.infantResident && (
                <h1 className="font-bold text-sm">
                  {router.query.infantResident}{" "}
                  {router.query.infantResident > 1
                    ? "Resident infants"
                    : "Resident infant"}
                </h1>
              )}

              <h1> | </h1>

              {router.query.infantNonResident && (
                <h1 className="font-bold text-sm">
                  {router.query.infantNonResident}{" "}
                  {router.query.infantNonResident > 1
                    ? "Non-resident infants"
                    : "Non-resident infant"}
                </h1>
              )} */}
            </div>

            <div className="mt-2 ml-1">
              {router.query.agentCommission && (
                <h1 className="underline underline-offset-2 text-sm decoration-dashed">
                  Based on{" "}
                  <span className="font-black">
                    {router.query.agentCommission}%
                  </span>{" "}
                  commission
                </h1>
              )}
            </div>
          </div>

          <div className="mt-4 flex gap-4 items-center justify-self-start">
            <h1 className="text-4xl font-SourceSans text-gray-600 font-semibold">
              {moment(router.query.date).format("MMM Do")}
            </h1>

            <div className="w-fit flex items-center">
              <div className="w-[15px] h-[15px] rounded-full bg-gray-300"></div>
              <div className="h-[2px] w-[70px] bg-gray-200"></div>
              <div className="w-[15px] h-[15px] rounded-full bg-gray-300"></div>
            </div>

            <h1 className="text-4xl font-SourceSans font-semibold text-gray-600">
              {moment(router.query.endDate).format("MMM Do")}
            </h1>
          </div>
        </div>

        <div className="bg-gray-200 w-[1px] h-full ml-6"></div>

        <div className="flex gap-4 w-[60%] h-full px-6">
          {listing.room_types.map((item, index) => {
            return (
              <SelectedListingCard
                key={index}
                room={item}
              ></SelectedListingCard>
            );
          })}
        </div>
      </div>
    </div>
  );
}

SelectedListing.propTypes = {};

export default SelectedListing;
