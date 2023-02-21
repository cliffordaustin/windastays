import React, { useEffect } from "react";
import PropTypes from "prop-types";
import Table from "../Partner/Table";
import { createGlobalStyle } from "styled-components";
import moment from "moment";
import { Icon } from "@iconify/react";
import Cookies from "js-cookie";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { DayPicker } from "react-day-picker";
import { useRouter } from "next/router";
import PopoverBox from "../ui/Popover";
import axios from "axios";
import SelectedListingCard from "./SelectedListingCard";
import Dialogue from "../Home/Dialogue";
import { useFormik } from "formik";
import * as Yup from "yup";
import Button from "../ui/Button";
import pricing from "../../lib/pricingCalc";

function SelectedListing({ listing, index }) {
  const router = useRouter();

  const [startDates, setStartDate] = React.useState();
  const [endDates, setEndDate] = React.useState();

  const [roomTypes, setRoomTypes] = React.useState([]);

  const [roomTypesLoading, setRoomTypesLoading] = React.useState(false);

  const [guestOptionChanged, setGuestOptionChanged] = React.useState(false);

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
          return roomTypes[row.row.index].name;
        },
      },
      ...dates.map((date) => {
        return {
          Header: moment(date).format("MMM Do"),
          Cell: (row) => {
            const room = roomTypes[row.row.index];
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

  const formik = useFormik({
    initialValues: {
      rooms: [
        {
          residentAdult: 1,
          nonResidentAdult: 0,
          residentChild: 0,
          nonResidentChild: 0,
          infantResident: 0,
          infantNonResident: 0,
        },
      ],
    },

    validationSchema: Yup.object({
      rooms: Yup.array().of(
        Yup.object().shape({
          residentAdult: Yup.number(
            "Please enter a valid number of resident adults"
          ),
          nonResidentAdult: Yup.number(
            "Please enter a valid number of non-resident adults"
          ),
          residentChild: Yup.number(
            "Please enter a valid number of resident children"
          ),
          nonResidentChild: Yup.number(
            "Please enter a valid number of non-resident children"
          ),
          infantResident: Yup.number(
            "Please enter a valid number of resident infants"
          ),
          infantNonResident: Yup.number(
            "Please enter a valid number of non-resident infants"
          ),
        })
      ),
    }),

    onSubmit: (values) => {
      setGuestOptionChanged(true);
      setOpenGuestModal(false);
    },
  });

  const [residentNumberOfRooms, setResidentNumberOfRooms] = React.useState(0);
  const [nonResidentNumberOfRooms, setNonResidentNumberOfRooms] =
    React.useState(0);

  React.useMemo(
    () =>
      formik.values.rooms.forEach((room) => {
        if (room.residentAdult > 0) {
          setResidentNumberOfRooms(formik.values.rooms.length);
        } else if (room.residentAdult === 0) {
          setResidentNumberOfRooms(0);
        }
        if (room.nonResidentAdult > 0) {
          setNonResidentNumberOfRooms(formik.values.rooms.length);
        } else if (room.nonResidentAdult === 0) {
          setNonResidentNumberOfRooms(0);
        }
      }),
    [formik.values.rooms]
  );

  useEffect(() => {
    if (router.query.date && router.query.endDate) {
      setRoomTypesLoading(true);
      axios
        .get(
          `${process.env.NEXT_PUBLIC_baseURL}/stays/${
            listing.slug
          }/room-types/?num_of_rooms_resident=${residentNumberOfRooms}&num_of_rooms_non_resident=${nonResidentNumberOfRooms}&start_date=${
            router.query.date
          }&end_date=${moment(router.query.endDate)
            .subtract(1, "days")
            .format("YYYY-MM-DD")}`,
          {
            headers: {
              Authorization: "Token " + Cookies.get("token"),
            },
          }
        )
        .then((res) => {
          setRoomTypes(res.data.results);
          setRoomTypesLoading(false);
          setGuestOptionChanged(false);
        });
    }
  }, [guestOptionChanged]);

  const adultAgeGroup = React.useMemo(
    () => pricing.adultAgeGroup(roomTypes),
    [roomTypes]
  );

  const childAgeGroup = React.useMemo(
    () => pricing.childAgeGroup(roomTypes),
    [roomTypes]
  );

  const infantAgeGroup = React.useMemo(
    () => pricing.infantAgeGroup(roomTypes),
    [roomTypes]
  );

  const [isOpen, setIsOpen] = React.useState(index === 0 ? true : false);

  const data = React.useMemo(() => roomTypes, [listing]);

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

  const totalNumberOfGuests = formik.values.rooms.reduce((acc, curr) => {
    return (
      acc +
      curr.residentAdult +
      curr.nonResidentAdult +
      curr.residentChild +
      curr.nonResidentChild +
      curr.infantResident +
      curr.infantNonResident
    );
  }, 0);

  const isResidentAdultAvailable = React.useMemo(
    () => pricing.isResidentAdultAvailable(roomTypes),
    [roomTypes]
  );

  const isResidentChildAvailable = React.useMemo(
    () => pricing.isResidentChildAvailable(roomTypes),
    [roomTypes]
  );

  const isNonResidentAdultAvailable = React.useMemo(
    () => pricing.isNonResidentAdultAvailable(roomTypes),
    [roomTypes]
  );

  const isNonResidentChildAvailable = React.useMemo(
    () => pricing.isNonResidentChildAvailable(roomTypes),
    [roomTypes]
  );

  const isResidentInfantAvailable = React.useMemo(
    () => pricing.isResidentInfantAvailable(roomTypes),
    [roomTypes]
  );

  const isNonResidentInfantAvailable = React.useMemo(
    () => pricing.isNonResidentInfantAvailable(roomTypes),
    [roomTypes]
  );

  const [openGuestModal, setOpenGuestModal] = React.useState(false);
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

      <Dialogue
        isOpen={openGuestModal}
        closeModal={() => {
          setOpenGuestModal(false);
        }}
        dialogueTitleClassName="!font-bold !ml-4 !text-xl md:!text-2xl"
        outsideDialogueClass="!p-0"
        dialoguePanelClassName={
          "md:!rounded-md !rounded-none !p-0 overflow-y-scroll remove-scroll !max-w-2xl screen-height-safari md:!min-h-0 md:!max-h-[500px] "
        }
      >
        <div
          onClick={() => {
            setOpenGuestModal(false);
          }}
          className="border-b px-4 py-2 flex items-center gap-4"
        >
          <div className="w-[30px] h-[30px] cursor-pointer rounded-full border flex items-center justify-center">
            <Icon className="w-6 h-6" icon="iconoir:cancel" />
          </div>
          <h1 className="font-bold font-SourceSans">Add guests</h1>
        </div>

        <div className="px-4 my-2 gap-2 flex flex-col">
          {formik.values.rooms.map((room, index) => {
            return (
              <div key={index} className="flex flex-col font-SourceSans gap-2">
                <h1 className="font-bold">Room {index + 1}</h1>
                <div
                  className={
                    "flex items-center justify-between mt-2 " +
                    (isResidentAdultAvailable ? "" : "opacity-40")
                  }
                >
                  <h1>
                    Resident adult{" "}
                    {adultAgeGroup && <span>({adultAgeGroup})</span>}
                  </h1>

                  <div className="flex gap-2 items-center">
                    <div
                      onClick={() => {
                        if (isResidentAdultAvailable) {
                          formik.setFieldValue(
                            `rooms[${index}].residentAdult`,
                            formik.values.rooms[index].residentAdult > 0
                              ? formik.values.rooms[index].residentAdult - 1
                              : 0
                          );
                        }
                      }}
                      className={
                        "w-[32px] font-bold text-lg h-[32px] rounded-full border flex items-center justify-center " +
                        (isResidentAdultAvailable
                          ? "cursor-pointer"
                          : "cursor-not-allowed")
                      }
                    >
                      {" "}
                      -{" "}
                    </div>
                    <h1 className="font-bold text-sm">{room.residentAdult}</h1>
                    <div
                      onClick={() => {
                        if (isResidentAdultAvailable) {
                          formik.setFieldValue(
                            `rooms[${index}].residentAdult`,
                            formik.values.rooms[index].residentAdult + 1
                          );
                        }
                      }}
                      className={
                        "w-[32px] font-bold text-lg h-[32px] rounded-full border flex items-center justify-center " +
                        (isResidentAdultAvailable
                          ? "cursor-pointer"
                          : "cursor-not-allowed")
                      }
                    >
                      {" "}
                      +{" "}
                    </div>
                  </div>
                </div>

                <div
                  className={
                    "flex items-center justify-between mt-2 " +
                    (isResidentChildAvailable ? "" : "opacity-40")
                  }
                >
                  <h1>
                    Resident child{" "}
                    {childAgeGroup && <span>({childAgeGroup})</span>}
                  </h1>

                  <div className="flex gap-2 items-center">
                    <div
                      onClick={() => {
                        if (isResidentChildAvailable) {
                          formik.setFieldValue(
                            `rooms[${index}].residentChild`,
                            formik.values.rooms[index].residentChild > 0
                              ? formik.values.rooms[index].residentChild - 1
                              : 0
                          );
                        }
                      }}
                      className={
                        "w-[32px] font-bold text-lg h-[32px] rounded-full border flex items-center justify-center " +
                        (isResidentChildAvailable
                          ? "cursor-pointer"
                          : "cursor-not-allowed")
                      }
                    >
                      {" "}
                      -{" "}
                    </div>
                    <h1 className="font-bold text-sm">{room.residentChild}</h1>
                    <div
                      onClick={() => {
                        if (isResidentChildAvailable) {
                          formik.setFieldValue(
                            `rooms[${index}].residentChild`,
                            formik.values.rooms[index].residentChild + 1
                          );
                        }
                      }}
                      className={
                        "w-[32px] font-bold text-lg h-[32px] rounded-full border flex items-center justify-center " +
                        (isResidentChildAvailable
                          ? "cursor-pointer"
                          : "cursor-not-allowed")
                      }
                    >
                      {" "}
                      +{" "}
                    </div>
                  </div>
                </div>

                <div
                  className={
                    "flex items-center justify-between mt-2 " +
                    (isNonResidentAdultAvailable ? "" : "opacity-40")
                  }
                >
                  <h1>
                    Non-resident adult{" "}
                    {adultAgeGroup && <span>({adultAgeGroup})</span>}
                  </h1>

                  <div className="flex gap-2 items-center">
                    <div
                      onClick={() => {
                        if (isNonResidentAdultAvailable) {
                          formik.setFieldValue(
                            `rooms[${index}].nonResidentAdult`,
                            formik.values.rooms[index].nonResidentAdult > 0
                              ? formik.values.rooms[index].nonResidentAdult - 1
                              : 0
                          );
                        }
                      }}
                      className={
                        "w-[32px] font-bold text-lg h-[32px] rounded-full border flex items-center justify-center " +
                        (isNonResidentAdultAvailable
                          ? "cursor-pointer"
                          : "cursor-not-allowed")
                      }
                    >
                      {" "}
                      -{" "}
                    </div>
                    <h1 className="font-bold text-sm">
                      {room.nonResidentAdult}
                    </h1>
                    <div
                      onClick={() => {
                        if (isNonResidentAdultAvailable) {
                          formik.setFieldValue(
                            `rooms[${index}].nonResidentAdult`,
                            formik.values.rooms[index].nonResidentAdult + 1
                          );
                        }
                      }}
                      className={
                        "w-[32px] font-bold text-lg h-[32px] rounded-full border flex items-center justify-center " +
                        (isNonResidentAdultAvailable
                          ? "cursor-pointer"
                          : "cursor-not-allowed")
                      }
                    >
                      {" "}
                      +{" "}
                    </div>
                  </div>
                </div>

                <div
                  className={
                    "flex items-center justify-between mt-2 " +
                    (isNonResidentChildAvailable ? "" : "opacity-40")
                  }
                >
                  <h1>
                    Non-resident child{" "}
                    {childAgeGroup && <span>({childAgeGroup})</span>}
                  </h1>

                  <div className="flex gap-2 items-center">
                    <div
                      onClick={() => {
                        if (isNonResidentChildAvailable) {
                          formik.setFieldValue(
                            `rooms[${index}].nonResidentChild`,
                            formik.values.rooms[index].nonResidentChild > 0
                              ? formik.values.rooms[index].nonResidentChild - 1
                              : 0
                          );
                        }
                      }}
                      className={
                        "w-[32px] font-bold text-lg h-[32px] rounded-full border flex items-center justify-center " +
                        (isNonResidentChildAvailable
                          ? "cursor-pointer"
                          : "cursor-not-allowed")
                      }
                    >
                      {" "}
                      -{" "}
                    </div>
                    <h1 className="font-bold text-sm">
                      {room.nonResidentChild}
                    </h1>
                    <div
                      onClick={() => {
                        if (isNonResidentChildAvailable) {
                          formik.setFieldValue(
                            `rooms[${index}].nonResidentChild`,
                            formik.values.rooms[index].nonResidentChild + 1
                          );
                        }
                      }}
                      className={
                        "w-[32px] font-bold text-lg h-[32px] rounded-full border flex items-center justify-center " +
                        (isNonResidentChildAvailable
                          ? "cursor-pointer"
                          : "cursor-not-allowed")
                      }
                    >
                      {" "}
                      +{" "}
                    </div>
                  </div>
                </div>

                <div
                  className={
                    "flex items-center justify-between mt-2 " +
                    (isResidentInfantAvailable ? "" : "opacity-40")
                  }
                >
                  <h1>
                    Resident infant{" "}
                    {infantAgeGroup && <span>({infantAgeGroup})</span>}
                  </h1>

                  <div className="flex gap-2 items-center">
                    <div
                      onClick={() => {
                        if (isResidentInfantAvailable) {
                          formik.setFieldValue(
                            `rooms[${index}].infantResident`,
                            formik.values.rooms[index].infantResident > 0
                              ? formik.values.rooms[index].infantResident - 1
                              : 0
                          );
                        }
                      }}
                      className={
                        "w-[32px] font-bold text-lg h-[32px] rounded-full border flex items-center justify-center " +
                        (isResidentInfantAvailable
                          ? "cursor-pointer"
                          : "cursor-not-allowed")
                      }
                    >
                      {" "}
                      -{" "}
                    </div>
                    <h1 className="font-bold text-sm">{room.infantResident}</h1>
                    <div
                      onClick={() => {
                        if (isResidentInfantAvailable) {
                          formik.setFieldValue(
                            `rooms[${index}].infantResident`,
                            formik.values.rooms[index].infantResident + 1
                          );
                        }
                      }}
                      className={
                        "w-[32px] font-bold text-lg h-[32px] rounded-full border flex items-center justify-center " +
                        (isResidentInfantAvailable
                          ? "cursor-pointer"
                          : "cursor-not-allowed")
                      }
                    >
                      {" "}
                      +{" "}
                    </div>
                  </div>
                </div>

                <div
                  className={
                    "flex items-center justify-between mt-2 " +
                    (isNonResidentInfantAvailable ? "" : "opacity-40")
                  }
                >
                  <h1>
                    Non-resident infant{" "}
                    {infantAgeGroup && <span>({infantAgeGroup})</span>}
                  </h1>

                  <div className="flex gap-2 items-center">
                    <div
                      onClick={() => {
                        if (isNonResidentInfantAvailable) {
                          formik.setFieldValue(
                            `rooms[${index}].infantNonResident`,
                            formik.values.rooms[index].infantNonResident > 0
                              ? formik.values.rooms[index].infantNonResident - 1
                              : 0
                          );
                        }
                      }}
                      className={
                        "w-[32px] font-bold text-lg h-[32px] rounded-full border flex items-center justify-center " +
                        (isNonResidentInfantAvailable
                          ? "cursor-pointer"
                          : "cursor-not-allowed")
                      }
                    >
                      {" "}
                      -{" "}
                    </div>
                    <h1 className="font-bold text-sm">
                      {room.infantNonResident}
                    </h1>
                    <div
                      onClick={() => {
                        if (isNonResidentInfantAvailable) {
                          formik.setFieldValue(
                            `rooms[${index}].infantNonResident`,
                            formik.values.rooms[index].infantNonResident + 1
                          );
                        }
                      }}
                      className={
                        "w-[32px] font-bold text-lg h-[32px] rounded-full border flex items-center justify-center " +
                        (isNonResidentInfantAvailable
                          ? "cursor-pointer"
                          : "cursor-not-allowed")
                      }
                    >
                      {" "}
                      +{" "}
                    </div>
                  </div>
                </div>

                {index > 0 && (
                  <div
                    onClick={() => {
                      formik.setFieldValue(
                        "rooms",
                        formik.values.rooms.filter((_, i) => i !== index)
                      );
                    }}
                    className="cursor-pointer font-bold w-fit ml-auto font-SourceSans text-red-500 mt-2"
                  >
                    Remove room
                  </div>
                )}

                <div className="mt-2 h-[1px] w-full bg-gray-200"></div>
              </div>
            );
          })}

          <h1
            onClick={() => {
              formik.setFieldValue("rooms", [
                ...formik.values.rooms,
                {
                  residentAdult: 1,
                  nonResidentAdult: 0,
                  residentChild: 0,
                  nonResidentChild: 0,
                  infantResident: 0,
                  infantNonResident: 0,
                },
              ]);
            }}
            className="font-bold text-blue-600 font-SourceSans mt-2 cursor-pointer w-fit"
          >
            Add another room
          </h1>

          <Button
            onClick={() => {
              formik.handleSubmit();
            }}
            type={"submit"}
            className="!w-full mt-4 btn-gradient-2 !h-full !rounded-3xl font-bold"
          >
            Done
          </Button>
        </div>
      </Dialogue>

      <div className="px-2 py-2 flex h-[160px] w-full rounded-xl bg-white mt-2">
        <div className="w-fit flex flex-col justify-around">
          <div>
            {/* <div className="flex items-center gap-1 px-2 py-1 text-gray-500 bg-gray-100 rounded-md border w-fit">
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
            </div> */}

            <div
              onClick={() => {
                setOpenGuestModal(true);
              }}
              className="px-3 cursor-pointer py-1 flex items-center gap-4 mx-auto rounded-3xl w-[350px] border shadow-lg"
            >
              <Icon
                className="w-6 h-6 text-gray-500"
                icon="material-symbols:group-rounded"
              />

              <div className="flex flex-col gap-0.5">
                <h1 className="font-bold text-sm font-SourceSans">Guests</h1>
                <h1 className="font-normal font-SourceSans">
                  {totalNumberOfGuests} Guests, {formik.values.rooms.length}{" "}
                  rooms
                </h1>
              </div>
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
          {!roomTypesLoading &&
            roomTypes.map((item, index) => {
              return (
                <SelectedListingCard
                  key={index}
                  room={item}
                  addedRooms={formik.values.rooms}
                ></SelectedListingCard>
              );
            })}

          {roomTypesLoading &&
            [...Array(2)].map((_, index) => {
              return (
                <div key={index} className="w-[250px]">
                  <Skeleton count={1} className="h-[100px]"></Skeleton>
                  <Skeleton
                    count={1}
                    className="!w-[40%] !rounded-3xl mt-2 h-[24px]"
                  ></Skeleton>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}

SelectedListing.propTypes = {};

export default SelectedListing;
