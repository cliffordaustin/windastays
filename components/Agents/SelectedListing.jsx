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
import Switch from "../ui/Switch";
import pricing from "../../lib/pricingCalc";
import Input from "../ui/Input";
import Checkbox from "../ui/Checkbox";
import Price from "../Stay/Price";
import ReactJoyride from "react-joyride";

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

  useEffect(() => {
    if (router.query.date && router.query.endDate) {
      setRoomTypesLoading(true);
      axios
        .get(
          `${process.env.NEXT_PUBLIC_baseURL}/stays/${
            listing.slug
          }/room-types/?start_date=${router.query.date}&end_date=${moment(
            router.query.endDate
          )
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

  const [residentNumberOfRooms, setResidentNumberOfRooms] = React.useState(0);
  const [nonResidentNumberOfRooms, setNonResidentNumberOfRooms] =
    React.useState(0);

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

  const formikFees = useFormik({
    initialValues: {
      commision: 0,
      fees: [],
    },

    validationSchema: Yup.object({
      rooms: Yup.array().of(
        Yup.object().shape({
          name: Yup.string("Please enter a valid text of name"),
          price: Yup.number("Please enter a valid number of price"),
        })
      ),
      commision: Yup.number("Please enter a valid number of commision"),
    }),

    onSubmit: (values) => {
      setGuestOptionChanged(true);
      setOpenGuestModal(false);
    },
  });

  const residentFees = listing.other_fees_resident;
  const nonResidentFees = listing.other_fees_non_resident;

  const [residentFeesOptions, setResidentFeesOptions] = React.useState([]);
  const [nonResidentFeesOptions, setNonResidentFeesOptions] = React.useState(
    []
  );

  const handleResidentCheck = (event, fee) => {
    var updatedList = [...residentFeesOptions];
    if (event.target.checked) {
      updatedList = [...updatedList, fee];
    } else {
      updatedList.splice(residentFeesOptions.indexOf(fee), 1);
    }
    setResidentFeesOptions(updatedList);
  };

  const handleNonResidentCheck = (event, fee) => {
    var updatedList = [...nonResidentFeesOptions];
    if (event.target.checked) {
      updatedList = [...updatedList, fee];
    } else {
      updatedList.splice(nonResidentFeesOptions.indexOf(fee), 1);
    }
    setNonResidentFeesOptions(updatedList);
  };

  const containsResidentOption = (option) => {
    return residentFeesOptions.some((item) => item.id === option.id);
  };

  const containsNonResidentOption = (option) => {
    return nonResidentFeesOptions.some((item) => item.id === option.id);
  };

  const steps = [
    {
      target: "#step1",
      content:
        "Name of the lodge selected and you can click on the arrow to collapse or expand the section. You can also click on the trash icon to remove the selected lodge",
      title: "Help",
    },
    {
      target: "#step2",
      title: "Help",
      content: "This is the date you selected",
    },
    {
      target: "#step3",
      title: "Help",
      content: "Available rooms for the selected date are displayed here.",
    },
    {
      target: "#step4",
      title: "Help",
      content: "Click on add guest to the selected room to calculate the price",
    },
  ];

  return (
    <div className="px-4 py-2 bg-gray-100 rounded-md">
      <GlobalStyle />
      <div id="step1" className="flex justify-between items-center">
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

      {/* <Dialogue
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
      </Dialogue> */}

      <ReactJoyride
        continuous
        hideCloseButton
        scrollToFirstStep
        showProgress
        showSkipButton
        steps={steps}
      />

      <div
        id="step2"
        className="mt-4 flex gap-4 items-center justify-self-start"
      >
        <h1 className="text-2xl font-SourceSans text-gray-600 font-semibold">
          {moment(router.query.date).format("MMM Do")}
        </h1>

        <div className="w-fit flex items-center">
          <div className="w-[5px] h-[5px] rounded-full bg-gray-300"></div>
          <div className="h-[2px] w-[30px] bg-gray-200"></div>
          <div className="w-[5px] h-[5px] rounded-full bg-gray-300"></div>
        </div>

        <h1 className="text-2xl font-SourceSans font-semibold text-gray-600">
          {moment(router.query.endDate).format("MMM Do")}
        </h1>
      </div>

      <div
        id="step3"
        className="py-2 flex h-[190px] w-full rounded-xl bg-white mt-2"
      >
        <div className="flex gap-4 w-full h-full px-4">
          {!roomTypesLoading &&
            roomTypes.map((item, index) => {
              return (
                <SelectedListingCard
                  steps={steps}
                  key={index}
                  room={item}
                  residentFeesOptions={residentFeesOptions}
                  nonResidentFeesOptions={nonResidentFeesOptions}
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

      <div className="w-fit mt-4 bg-white px-4 py-2 rounded-lg flex flex-col justify-around">
        <h1 className="font-black mb-2 font-SourceSans text-sm">
          Add fee to pricing
        </h1>
        <div className="flex gap-4">
          <PopoverBox
            panelClassName="bg-white rounded-lg after:!left-[30%] tooltip shadow-md mt-2 border w-[500px] -left-[0px] !p-0"
            btnClassName=""
            btnPopover={
              <div className="px-3 cursor-pointer py-1 flex items-center gap-4 mx-auto rounded-lg w-[350px] border">
                <Icon
                  className="w-6 h-6 text-gray-500"
                  icon="material-symbols:group-rounded"
                />

                <div className="flex flex-col gap-0.5">
                  <h1 className="font-bold text-sm self-start font-SourceSans">
                    Extra fees from lodge
                  </h1>
                  <h1 className="font-normal self-start font-SourceSans">
                    2 selected
                  </h1>
                </div>
              </div>
            }
            popoverClassName=""
          >
            <div className="w-full bg-gray-200 rounded-t-lg px-3 py-2">
              <h1 className="font-semibold font-SourceSans text-base">
                Add extra fees
              </h1>
            </div>
            <div className="flex flex-col">
              {residentFees.map((fee, index) => (
                <div key={index} className="px-2 py-2">
                  <div className="flex justify-between items-center">
                    <h1 className="text-sm">
                      {fee.name}{" "}
                      <span className="font-normal">(For resident)</span>
                      <span className="font-normal">
                        {" "}
                        ={" "}
                        <Price
                          stayPrice={fee.price}
                          autoCurrency={false}
                          currency="KES"
                          className="!text-sm !font-SourceSans inline !font-semibold !text-gray-600"
                        ></Price>{" "}
                        pp
                      </span>
                    </h1>

                    <Checkbox
                      checked={containsResidentOption(fee)}
                      value={fee}
                      onChange={(event) => handleResidentCheck(event, fee)}
                    ></Checkbox>
                  </div>
                </div>
              ))}

              <hr />

              {nonResidentFees.map((fee, index) => (
                <div key={index} className="px-2 py-2">
                  <div className="flex justify-between items-center">
                    <h1 className="text-sm">
                      {fee.name}{" "}
                      <span className="font-normal">(For non-resident)</span>
                      <span className="font-normal">
                        {" "}
                        ={" "}
                        <Price
                          stayPrice={fee.price}
                          autoCurrency={false}
                          className="!text-sm !font-SourceSans inline !font-semibold !text-gray-600"
                        ></Price>{" "}
                        pp
                      </span>
                    </h1>

                    <Checkbox
                      checked={containsNonResidentOption(fee)}
                      value={fee}
                      onChange={(event) => handleNonResidentCheck(event, fee)}
                    ></Checkbox>
                  </div>
                </div>
              ))}
            </div>
          </PopoverBox>

          <div className="flex justify-between">
            {/* <PopoverBox
                panelClassName="bg-white rounded-md after:!left-[27%] after:!border-b-gray-200 tooltip left-[0px] border shadow-md mt-2 w-[280px] p-1"
                btnClassName="w-full"
                btnPopover={
                  <div className="px-3 cursor-pointer py-1 flex items-center gap-4 mx-auto rounded-lg w-full border">
                    <Icon
                      className="w-6 h-6 text-gray-500"
                      icon="material-symbols:group-rounded"
                    />

                    <div className="flex flex-col items-start gap-0.5">
                      <h1 className="font-bold text-sm font-SourceSans">
                        Extras
                      </h1>
                      <h1 className="font-normal font-SourceSans">
                        Select fees
                      </h1>
                    </div>
                  </div>
                }
                popoverClassName="w-[48%]"
              >
                <div className="flex flex-col gap-1 font-SourceSans">
                  <div className="flex bg-gray-100 px-2 py-2 justify-between items-center">
                    <h1 className="font-semibold text-sm">Park fees - $20</h1>
                    <Switch
                      switchButton={parkFees}
                      changeSwitchButtonState={() => {
                        setParkFees(!parkFees);
                      }}
                      switchButtonCircle="w-5 h-5"
                      switchButtonContainer="!w-[52px] !h-6"
                    ></Switch>
                  </div>

                  <div className="flex px-2 py-2 justify-between items-center">
                    <h1 className="font-semibold text-sm">
                      Conservancy fees - $10
                    </h1>
                    <Switch
                      switchButton={conservancyFees}
                      changeSwitchButtonState={() => {
                        setConservancyFees(!conservancyFees);
                      }}
                      switchButtonCircle="w-5 h-5"
                      switchButtonContainer="!w-[52px] !h-6"
                    ></Switch>
                  </div>

                  <div className="flex bg-gray-100 px-2 py-2 justify-between items-center">
                    <h1 className="font-semibold text-sm">Game Drives - $30</h1>
                    <Switch
                      switchButton={gameDriveFees}
                      changeSwitchButtonState={() => {
                        setGameDriveFees(!gameDriveFees);
                      }}
                      switchButtonCircle="w-5 h-5"
                      switchButtonContainer="!w-[52px] !h-6"
                    ></Switch>
                  </div>
                </div>
              </PopoverBox> */}

            <PopoverBox
              panelClassName="bg-white rounded-md after:!left-[27%] after:!border-b-gray-200 tooltip -left-[0px] border shadow-md mt-2 w-[320px] p-0"
              btnClassName="w-[350px]"
              btnPopover={
                <div className="px-3 w-full cursor-pointer py-1 flex items-center gap-4 mx-auto rounded-lg border">
                  <Icon
                    className="w-6 h-7 text-gray-500"
                    icon="material-symbols:feed"
                  />

                  <div className="flex flex-col gap-0.5">
                    <h1 className="font-bold self-start text-sm font-SourceSans">
                      Other fees from you
                    </h1>
                    <h1 className="font-normal self-start font-SourceSans">
                      Add yout fees
                    </h1>
                  </div>
                </div>
              }
              popoverClassName="w-[48%]"
            >
              <div className="w-full bg-gray-200 rounded-t-md px-3 py-2">
                <h1 className="font-semibold font-SourceSans text-base">
                  Add your fees
                </h1>
              </div>
              <div className="flex flex-col gap-0.5 mb-2 font-SourceSans">
                <div className="flex px-2 py-2 justify-between items-center">
                  <h1 className="font-semibold text-sm">Your commission</h1>

                  <div className="flex items-center w-[50%]">
                    <Input
                      name="commision"
                      type="number"
                      value={formikFees.values.commision}
                      placeholder="0"
                      onChange={(e) => {
                        formikFees.handleChange(e);
                      }}
                      className={
                        "w-full !pl-1 !pr-[1px] !py-0.5 border placeholder:text-gray-500 !rounded-md !h-full placeholder:text-sm "
                      }
                      inputClassName="!text-sm !border-none "
                    ></Input>
                    <h1 className="font-semibold text-sm">%</h1>
                  </div>
                </div>
                {/* <div className="h-[1px] w-full bg-gray-100"></div> */}
                {formikFees.values.fees.map((item, index) => {
                  return (
                    <div
                      key={item}
                      className="flex px-2 py-2 justify-between items-center"
                    >
                      {/* <h1 className="font-semibold text-sm">{item.name}</h1> */}

                      <div className="flex items-center w-[48%]">
                        <Input
                          name="name"
                          type="text"
                          value={item.name}
                          placeholder="Name"
                          onChange={(e) => {
                            formikFees.setFieldValue(
                              `fees[${index}].name`,
                              e.target.value
                            );
                          }}
                          className={
                            "w-full !pl-1 !pr-[1px] !py-0.5 border placeholder:text-gray-500 placeholder:font-semibold !rounded-md !h-full placeholder:text-xs "
                          }
                          inputClassName="!text-sm !border-none "
                        ></Input>
                      </div>

                      <div className="flex justify-between items-center w-[50%]">
                        <Input
                          name="price"
                          type="number"
                          value={item.price}
                          placeholder="Price"
                          onChange={(e) => {
                            formikFees.setFieldValue(
                              `fees[${index}].price`,
                              e.target.value
                            );
                          }}
                          className={
                            "w-full !pl-1 !pr-[1px] !py-0.5 border placeholder:text-gray-500 placeholder:font-semibold !rounded-md !h-full placeholder:text-xs "
                          }
                          inputClassName="!text-sm !border-none "
                        ></Input>

                        <div className="px-1 flex items-center gap-2">
                          <div
                            onClick={() => {
                              formikFees.setFieldValue(
                                "fees",
                                formikFees.values.fees.filter(
                                  (item, i) => i !== index
                                )
                              );
                            }}
                            className="w-[18px] cursor-pointer h-[18px] bg-red-500 rounded-full flex items-center justify-center"
                          >
                            <Icon
                              className="text-white text-lg"
                              icon="octicon:dash-16"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div
                  onClick={() => {
                    formikFees.setFieldValue("fees", [
                      ...formikFees.values.fees,
                      { name: "", price: "" },
                    ]);
                  }}
                  className="px-1 cursor-pointer py-0.5 rounded-sm ml-2 text-blue-600 w-fit text-sm font-semibold hover:bg-blue-600 hover:bg-opacity-20"
                >
                  Add a fee
                </div>
              </div>
            </PopoverBox>
          </div>
        </div>
      </div>
    </div>
  );
}

SelectedListing.propTypes = {};

export default SelectedListing;
