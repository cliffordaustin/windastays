import React, { useEffect } from "react";
import { createGlobalStyle } from "styled-components";
import PropTypes from "prop-types";
import Table from "./Table";
import moment from "moment";
import { Icon } from "@iconify/react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import PopoverBox from "../ui/Popover";
import Cookies from "js-cookie";
import { DayPicker } from "react-day-picker";
import { useRouter } from "next/router";
import Dialogue from "../Home/Dialogue";
import Input from "../ui/Input";
import SelectInput from "../ui/SelectInput";
import LoadingSpinerChase from "../ui/LoadingSpinerChase";
import Dropdown from "../ui/Dropdown";
import styles from "../../styles/TopTooltip.module.css";

function Events({ tableData }) {
  const router = useRouter();

  const [startDates, setStartDate] = React.useState();
  const [endDates, setEndDate] = React.useState();

  const [dates, setDate] = React.useState([]);

  const [openGuestModal, setOpenGuestModal] = React.useState(false);

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
        Header: tableData.name,
        Cell: (row) => {
          return tableData.rooms[row.row.index].name;
        },
      },
      ...dates.map((date) => {
        return {
          Header: moment(date).format("MMM Do"),
          Cell: (row) => {
            const room = tableData.rooms[row.row.index];
            const dateData = room.room_availabilities.find((roomDate) => {
              return (
                moment(roomDate.date).format("YYYY-MM-DD") ===
                moment(date).format("YYYY-MM-DD")
              );
            });

            return (
              <>
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
              </>
            );
          },
        };
      }),
    ],
    [dates]
  );

  const GlobalStyle = createGlobalStyle`
  .rdp-cell {
    width: 50px !important;
    height: 50px !important;
    border-radius: 100px !important;
  }
  rdp-day {
    border-radius: 100px !important;
  }
  .rdp-months {
    width: 100% !important;
  }
  .rdp-day_range_middle {
    opacity: 0.5 !important;
  }

  .hsds-beacon .eTCLra {
    @media (max-width: 768px) {
      bottom: 70px !important;
    }
  }

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

  const data = React.useMemo(() => tableData.rooms, [tableData]);

  const [addGuestLoading, setAddGuestLoading] = React.useState(false);

  const formik = useFormik({
    initialValues: {
      startDate: "",
      endDate: "",
      numberOfRooms: "",
      numberOfGuests: "",
      roomType: "",
    },
    validationSchema: Yup.object({
      startDate: Yup.date().required("Date is required"),
      endDate: Yup.date().required("Date is required"),
      numberOfRooms: Yup.number().required("Number of rooms is required"),
      numberOfGuests: Yup.number().required("Number of guests is required"),
      roomType: Yup.object().required("Please select a room").nullable(),
    }),
    onSubmit: async (values) => {
      const allDates = [];
      setAddGuestLoading(true);
      if (values.startDate && values.endDate) {
        var currentDate = moment(values.startDate);
        var stopDate = moment(values.endDate);
        while (currentDate <= stopDate) {
          allDates.push(moment(currentDate).format("YYYY-MM-DD"));
          currentDate = moment(currentDate).add(1, "days");
        }
      }

      const room = tableData.rooms.find((room) => {
        return room.slug === values.roomType.value;
      });

      for (const date in allDates) {
        setAddGuestLoading(true);
        const dateData = room.room_availabilities.find((roomDate) => {
          return (
            moment(roomDate.date).format("YYYY-MM-DD") ===
            moment(allDates[date]).format("YYYY-MM-DD")
          );
        });

        if (dateData.num_of_available_rooms < values.numberOfRooms) {
          setAddGuestLoading(false);
          formik.setFieldError(
            "numberOfRooms",
            "Only " +
              dateData.num_of_available_rooms +
              " rooms are available" +
              " on " +
              moment(allDates[date]).format("MMM Do")
          );
        } else {
          await axios
            .patch(
              `${process.env.NEXT_PUBLIC_baseURL}/room-types/${room.slug}/availabilities/${dateData.slug}/`,
              {
                num_of_available_rooms:
                  dateData.num_of_available_rooms - values.numberOfRooms,
              },
              {
                headers: {
                  Authorization: "Token " + Cookies.get("token"),
                },
              }
            )
            .then((res) => {})
            .catch((err) => {
              setAddGuestLoading(false);
            });
        }
      }

      router.reload();
    },
  });

  const [showStartDate, setShowStartDate] = React.useState(false);
  const [showEndDate, setShowEndDate] = React.useState(false);
  return (
    <div className="px-2 h-screen overflow-x-scroll">
      <GlobalStyle></GlobalStyle>

      {data.length > 0 && (
        <div className="flex items-center mb-6 justify-between">
          <div></div>
          <div className="flex items-center gap-4 justify-center">
            <div className="relative">
              <div
                onClick={() => {
                  setShowStartDate(!showStartDate);
                  setShowEndDate(false);
                }}
                className="w-[220px] px-2 py-2 flex items-center cursor-pointer justify-between text-sm text-gray-500 h-[35px] border border-gray-300"
              >
                {!startDates && <h1>Arrival date</h1>}
                {startDates && (
                  <h1>{moment(startDates).format("MMM Do YYYY")}</h1>
                )}
                <Icon
                  className="w-6 h-6 text-gray-700"
                  icon="clarity:date-solid"
                />
              </div>

              <Dropdown
                className={
                  "absolute mt-2 left-0 border w-[400px] p-2 after:!left-[20%] tooltip"
                }
                showDropdown={showStartDate}
              >
                <DayPicker
                  mode="single"
                  disabled={{ before: new Date() }}
                  selected={startDates}
                  onSelect={(date) => {
                    setStartDate(date);
                    setShowStartDate(false);
                    setShowEndDate(true);
                    setEndDate(null);
                  }}
                />
              </Dropdown>
            </div>

            <div className="w-[20px] h-[1px] bg-gray-500"></div>

            <div className="relative">
              <div
                onClick={() => {
                  setShowEndDate(!showEndDate);
                  setShowStartDate(false);
                }}
                className="w-[220px] px-2 py-2 flex items-center cursor-pointer justify-between text-sm text-gray-500 h-[35px] border border-gray-300"
              >
                {!endDates && <h1>Depature date</h1>}
                {endDates && <h1>{moment(endDates).format("MMM Do YYYY")}</h1>}
                <Icon
                  className="w-6 h-6 text-gray-700"
                  icon="clarity:date-solid"
                />
              </div>

              <Dropdown
                className="absolute mt-2 right-0 border w-[400px] p-2 after:!left-[80%] tooltip"
                showDropdown={showEndDate}
              >
                <DayPicker
                  mode="single"
                  disabled={{ before: new Date() }}
                  selected={endDates}
                  onSelect={(date) => {
                    setEndDate(date);
                    setShowStartDate(false);
                    setShowEndDate(false);
                  }}
                />
              </Dropdown>
            </div>
          </div>

          <div
            onClick={() => {
              setOpenGuestModal(true);
            }}
            className="px-4 py-2 text-sm cursor-pointer font-bold btn-gradient text-white rounded-lg"
          >
            Add a guest
          </div>

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
            <div className="px-4 py-2">
              <h1 className="font-bold font-SourceSans text-lg truncate">
                <span className="text-gray-600">Add guests</span>
              </h1>

              <div className="mt-4 flex gap-3 flex-col">
                <div className="flex flex-col gap-1">
                  <div className="flex justify-between">
                    <div className="w-[47%]">
                      <h1 className="text-sm font-bold">Start date</h1>
                      <PopoverBox
                        panelClassName="bg-white rounded-xl shadow-md mt-2 border w-[400px]"
                        btnClassName="w-full"
                        btnPopover={
                          <div
                            className={
                              "!w-full rounded-md px-2 py-5 flex items-center cursor-pointer justify-between text-sm text-gray-500 h-[35px] border border-gray-300 " +
                              (formik.touched.startDate &&
                              formik.errors.startDate
                                ? "border-red-500"
                                : "")
                            }
                          >
                            {!formik.values.startDate && (
                              <h1 className="font-bold text-gray-400">
                                Availability date
                              </h1>
                            )}
                            {formik.values.startDate && (
                              <h1>
                                {moment(formik.values.startDate).format(
                                  "MMM Do YYYY"
                                )}
                              </h1>
                            )}
                            <Icon
                              className="w-6 h-6 text-gray-700"
                              icon="clarity:date-solid"
                            />
                          </div>
                        }
                      >
                        <DayPicker
                          mode="single"
                          disabled={{ before: new Date() }}
                          selected={formik.values.startDate}
                          onSelect={(date) => {
                            formik.setFieldValue("startDate", date);
                          }}
                        />
                      </PopoverBox>

                      {formik.touched.startDate && formik.errors.startDate ? (
                        <span className="text-sm font-bold text-red-400">
                          {formik.errors.startDate}
                        </span>
                      ) : null}
                    </div>

                    <div className="w-[47%]">
                      <h1 className="text-sm font-bold">End date</h1>
                      <PopoverBox
                        panelClassName="bg-white rounded-xl shadow-md mt-2 right-0 border w-[400px]"
                        btnClassName="w-full"
                        btnPopover={
                          <div
                            className={
                              "!w-full rounded-md px-2 py-5 flex items-center cursor-pointer justify-between text-sm text-gray-500 h-[35px] border border-gray-300 " +
                              (formik.touched.endDate && formik.errors.endDate
                                ? "border-red-500"
                                : "")
                            }
                          >
                            {!formik.values.endDate && (
                              <h1 className="font-bold text-gray-400">
                                Availability date
                              </h1>
                            )}
                            {formik.values.endDate && (
                              <h1>
                                {moment(formik.values.endDate).format(
                                  "MMM Do YYYY"
                                )}
                              </h1>
                            )}
                            <Icon
                              className="w-6 h-6 text-gray-700"
                              icon="clarity:date-solid"
                            />
                          </div>
                        }
                      >
                        <DayPicker
                          mode="single"
                          disabled={{ before: new Date() }}
                          selected={formik.values.endDate}
                          onSelect={(date) => {
                            formik.setFieldValue("endDate", date);
                          }}
                        />
                      </PopoverBox>

                      {formik.touched.endDate && formik.errors.endDate ? (
                        <span className="text-sm font-bold text-red-400">
                          {formik.errors.endDate}
                        </span>
                      ) : null}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <h1 className="text-sm font-bold">Room type</h1>
                  <SelectInput
                    options={
                      tableData.rooms.map((item) => {
                        return {
                          value: item.slug,
                          label: item.name,
                        };
                      }) || []
                    }
                    selectedOption={formik.values.roomType}
                    instanceId="rooms"
                    setSelectedOption={(selected) => {
                      formik.setFieldValue("roomType", selected);
                    }}
                    className={
                      "!w-full !border !rounded-md !text-sm " +
                      (formik.touched.roomType && formik.errors.roomType
                        ? "border-red-500"
                        : "")
                    }
                    placeholder="Select a room"
                    isSearchable={false}
                  ></SelectInput>

                  {formik.touched.roomType && formik.errors.roomType ? (
                    <span className="text-sm font-bold text-red-400">
                      {formik.errors.roomType}
                    </span>
                  ) : null}
                </div>

                <div>
                  <Input
                    name="numberOfRooms"
                    type="number"
                    value={formik.values.numberOfRooms}
                    placeholder="Number of rooms"
                    errorStyle={
                      formik.touched.numberOfRooms &&
                      formik.errors.numberOfRooms
                        ? true
                        : false
                    }
                    onChange={(e) => {
                      formik.handleChange(e);
                    }}
                    className={"w-full placeholder:text-sm "}
                    inputClassName="!text-sm "
                    label="Add the number of rooms"
                  ></Input>
                  {formik.touched.numberOfRooms &&
                  formik.errors.numberOfRooms ? (
                    <span className="text-sm font-bold text-red-400">
                      {formik.errors.numberOfRooms}
                    </span>
                  ) : null}
                </div>

                <div>
                  <Input
                    name="numberOfGuests"
                    type="number"
                    value={formik.values.numberOfGuests}
                    placeholder="Number of guests"
                    errorStyle={
                      formik.touched.numberOfGuests &&
                      formik.errors.numberOfGuests
                        ? true
                        : false
                    }
                    onChange={(e) => {
                      formik.handleChange(e);
                    }}
                    className={"w-full placeholder:text-sm "}
                    inputClassName="!text-sm "
                    label="Add the number of guests"
                  ></Input>
                  {formik.touched.numberOfGuests &&
                  formik.errors.numberOfGuests ? (
                    <span className="text-sm font-bold text-red-400">
                      {formik.errors.numberOfGuests}
                    </span>
                  ) : null}
                </div>

                <div className="flex items-center gap-4 mt-6">
                  <button
                    onClick={() => {
                      setOpenGuestModal(false);
                    }}
                    className="bg-gray-200 w-[40%] text-sm font-bold px-6 py-2 rounded-md"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      formik.handleSubmit();
                    }}
                    disabled={addGuestLoading}
                    className={
                      "bg-blue-500 flex justify-center w-[60%] items-center gap-2 text-white font-bold px-2 py-1.5 rounded-md " +
                      (addGuestLoading ? "cursor-not-allowed opacity-60" : "")
                    }
                  >
                    <span>Post</span>{" "}
                    {addGuestLoading && (
                      <div>
                        <LoadingSpinerChase
                          color="white"
                          width={12}
                          height={12}
                        ></LoadingSpinerChase>
                      </div>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </Dialogue>
        </div>
      )}

      <div className="w-full">
        {data.length > 0 && <Table columns={columns} data={data}></Table>}
      </div>

      {data.length === 0 && (
        <div className="h-full flex-col gap-2 flex items-center justify-center">
          <Icon
            className="w-[40px] h-[40px] text-gray-500"
            icon="mdi:house-city"
          />
          <h1 className="text-xl font-bold text-gray-500">No data</h1>
        </div>
      )}
    </div>
  );
}

Events.propTypes = {};

export default Events;
