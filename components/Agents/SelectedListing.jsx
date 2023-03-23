import React, { useEffect, useMemo, useState } from "react";
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
import SelectInput from "../ui/SelectInput";
import ListItem from "../ui/ListItem";
import { Popover, Transition } from "@headlessui/react";

function SelectedListing({
  listing,
  index,
  setHasRoomTypeData,
  hasRoomTypeData,
  openPopup,
}) {
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
          return row.row.original.name;
        },
      },
      ...dates.map((date) => {
        return {
          Header: moment(date).format("MMM Do"),
          Cell: (row) => {
            const room = row.row.original;
            const dateData = room.room_resident_availabilities.find(
              (roomDate) => {
                return (
                  moment(roomDate.date).format("YYYY-MM-DD") ===
                  moment(date).format("YYYY-MM-DD")
                );
              }
            );

            const dateDataArr = useMemo(() => [dateData], [dateData]);

            const singleResidentAdultPrice = React.useMemo(
              () => pricing.singleResidentAdultPrice(dateDataArr),
              [dateDataArr]
            );

            const singleResidentChildPrice = React.useMemo(
              () => pricing.singleResidentChildPrice(dateDataArr),
              [dateDataArr]
            );

            const doubleResidentAdultPrice = React.useMemo(
              () => pricing.doubleResidentAdultPrice(dateDataArr),
              [dateDataArr]
            );

            const doubleResidentChildPrice = React.useMemo(
              () => pricing.doubleResidentChildPrice(dateDataArr),
              [dateDataArr]
            );

            const tripleResidentAdultPrice = React.useMemo(
              () => pricing.tripleResidentAdultPrice(dateDataArr),
              [dateDataArr]
            );

            const tripleResidentChildPrice = React.useMemo(
              () => pricing.tripleResidentChildPrice(dateDataArr),
              [dateDataArr]
            );

            const infantResidentPrice = React.useMemo(
              () => pricing.infantResidentPrice(dateDataArr),
              [dateDataArr]
            );

            return (
              <Popover className="relative ">
                <Popover.Button className="outline-none ">
                  <div
                    onClick={() => {}}
                    className="cursor-pointer hover:bg-gray-50 px-1 py-1 rounded-md"
                  >
                    {dateData && (
                      <div className="flex flex-col items-start">
                        <div className="text-xs flex items-center gap-1 font-bold text-gray-600">
                          {singleResidentAdultPrice
                            ? `KES${singleResidentAdultPrice} / Adult`
                            : `KES${doubleResidentAdultPrice} / Double Adult`}
                          <Icon
                            className="w-4 h-4 text-gray-400"
                            icon="mdi:information-variant-circle"
                          />
                        </div>

                        <div className="text-xs text-gray-600">
                          {dateData.num_of_available_rooms} Available rooms
                        </div>
                      </div>
                    )}

                    {!dateData && (
                      <div className="text-xs text-gray-600">
                        <h1 className="font-black"> -- </h1>
                      </div>
                    )}
                  </div>
                </Popover.Button>

                <Transition
                  as={React.Fragment}
                  enter="transition ease-out duration-200"
                  enterFrom="opacity-0 translate-y-1"
                  enterTo="opacity-100 translate-y-0"
                  leave="transition ease-in duration-150"
                  leaveFrom="opacity-100 translate-y-0"
                  leaveTo="opacity-0 translate-y-1"
                >
                  <Popover.Panel
                    className={
                      "absolute z-[30] bg-white rounded-xl !right-0 shadow-md mt-2 border w-[400px]"
                    }
                  >
                    <div className="w-full bg-gray-200 rounded-t-lg px-3 py-2">
                      <h1 className="font-semibold font-SourceSans text-base">
                        Price breakdown
                      </h1>
                    </div>

                    <div className="mb-2 mt-2 w-fit px-2">
                      <h1 className="text-gray-600 text-sm border-b border-b-gray-400 border-dashed">
                        (PP = Per Person)
                      </h1>
                    </div>

                    <div className="flex flex-col px-2 gap-2">
                      {singleResidentAdultPrice ? (
                        <div className="px-3 flex bg-gray-100 font-SourceSans justify-between items-center py-1 w-full">
                          <h1 className="text-sm font-semibold">
                            Single resident adult
                          </h1>
                          <div className="flex gap-1 items-center">
                            <Price
                              currency="KES"
                              stayPrice={singleResidentAdultPrice}
                              autoCurrency={false}
                              className="!font-normal !text-sm !font-SourceSans"
                            ></Price>{" "}
                            <span className="font-semibold mb-1">pp</span>
                          </div>
                        </div>
                      ) : (
                        ""
                      )}

                      {singleResidentChildPrice ? (
                        <div className="px-3 flex bg-gray-100 font-SourceSans justify-between items-center py-1 w-full">
                          <h1 className="text-sm font-semibold">
                            Single resident child
                          </h1>
                          <div className="flex gap-1 items-center">
                            <Price
                              currency="KES"
                              stayPrice={singleResidentChildPrice}
                              autoCurrency={false}
                              className="!font-normal !text-sm !font-SourceSans"
                            ></Price>{" "}
                            <span className="font-semibold mb-1">pp</span>
                          </div>
                        </div>
                      ) : (
                        ""
                      )}

                      {doubleResidentAdultPrice ? (
                        <div className="px-3 flex bg-gray-100 font-SourceSans justify-between items-center py-1 w-full">
                          <h1 className="text-sm font-semibold">
                            Double resident adult
                          </h1>
                          <div className="flex gap-1 items-center">
                            <Price
                              currency="KES"
                              stayPrice={doubleResidentAdultPrice}
                              autoCurrency={false}
                              className="!font-normal !text-sm !font-SourceSans"
                            ></Price>{" "}
                            <span className="font-semibold mb-1">pp</span>
                          </div>
                        </div>
                      ) : (
                        ""
                      )}

                      {doubleResidentChildPrice ? (
                        <div className="px-3 flex bg-gray-100 font-SourceSans justify-between items-center py-1 w-full">
                          <h1 className="text-sm font-semibold">
                            Double resident child
                          </h1>
                          <div className="flex gap-1 items-center">
                            <Price
                              currency="KES"
                              stayPrice={doubleResidentChildPrice}
                              autoCurrency={false}
                              className="!font-normal !text-sm !font-SourceSans"
                            ></Price>{" "}
                            <span className="font-semibold mb-1">pp</span>
                          </div>
                        </div>
                      ) : (
                        ""
                      )}

                      {tripleResidentAdultPrice ? (
                        <div className="px-3 flex bg-gray-100 font-SourceSans justify-between items-center py-1 w-full">
                          <h1 className="text-sm font-semibold">
                            Triple resident adult
                          </h1>
                          <div className="flex gap-1 items-center">
                            <Price
                              currency="KES"
                              stayPrice={tripleResidentAdultPrice}
                              autoCurrency={false}
                              className="!font-normal !text-sm !font-SourceSans"
                            ></Price>{" "}
                            <span className="font-semibold mb-1">pp</span>
                          </div>
                        </div>
                      ) : (
                        ""
                      )}

                      {tripleResidentChildPrice ? (
                        <div className="px-3 flex bg-gray-100 font-SourceSans justify-between items-center py-1 w-full">
                          <h1 className="text-sm font-semibold">
                            Triple resident child
                          </h1>
                          <div className="flex gap-1 items-center">
                            <Price
                              currency="KES"
                              stayPrice={tripleResidentChildPrice}
                              autoCurrency={false}
                              className="!font-normal !text-sm !font-SourceSans"
                            ></Price>{" "}
                            <span className="font-semibold mb-1">pp</span>
                          </div>
                        </div>
                      ) : (
                        ""
                      )}

                      {infantResidentPrice ? (
                        <div className="px-3 flex bg-gray-100 font-SourceSans justify-between items-center py-1 w-full">
                          <h1 className="text-sm font-semibold">
                            Resident infant
                          </h1>
                          <div className="flex gap-1 items-center">
                            <Price
                              currency="KES"
                              stayPrice={infantResidentPrice}
                              autoCurrency={false}
                              className="!font-normal !text-sm !font-SourceSans"
                            ></Price>{" "}
                            <span className="font-semibold mb-1">pp</span>
                          </div>
                        </div>
                      ) : (
                        ""
                      )}
                    </div>
                    <div className="flex justify-end mt-4 px-2 py-2">
                      <Popover.Button className="bg-gray-200 text-sm font-bold px-6 py-1.5 rounded-md">
                        Cancel
                      </Popover.Button>
                    </div>
                  </Popover.Panel>
                </Transition>
              </Popover>
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
            .format("YYYY-MM-DD")}`
        )
        .then((res) => {
          setRoomTypes(res.data.results);
          setRoomTypesLoading(false);
          setGuestOptionChanged(false);
        });
    }
  }, [guestOptionChanged]);

  const allRoomTypes = useMemo(() => roomTypes, [roomTypes]);

  const [residentNumberOfRooms, setResidentNumberOfRooms] = React.useState(0);
  const [nonResidentNumberOfRooms, setNonResidentNumberOfRooms] =
    React.useState(0);

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

  const feeOptions = [
    { value: "PER PERSON", label: "Per person" },
    { value: "PER PERSON PER NIGHT", label: "Per person per night" },
    { value: "WHOLE GROUP", label: "Whole group" },
  ];

  const resident = [
    { value: "RESIDENT", label: "Resident" },
    { value: "NON-RESIDENT", label: "Non-resident" },
  ];

  const formikFees = useFormik({
    initialValues: {
      commision: 0,
      nonResidentCommission: 0,
      fees: [
        {
          name: "",
          price: "",
          feeType: { value: "PER PERSON", label: "Per person" },
          residentType: { value: "RESIDENT", label: "Resident" },
        },
      ],
    },

    validationSchema: Yup.object({
      rooms: Yup.array().of(
        Yup.object().shape({
          name: Yup.string("Please enter a valid text of name"),
          price: Yup.number("Please enter a valid number of price"),
        })
      ),
      commision: Yup.number("Please enter a valid number of commision"),
      nonResidentCommission: Yup.number(
        "Please enter a valid number of commision"
      ),
    }),

    onSubmit: (values) => {
      // setGuestOptionChanged(true);
      // setOpenGuestModal(false);
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

  const [openFeesModal, setOpenFeesModal] = React.useState(false);
  const [openOtherFeesModal, setOpenOtherFeesModal] = React.useState(false);

  const [startDate, setDateRange] = React.useState({
    from: router.query.date ? new Date(router.query.date) : new Date(),
    to: router.query.endDate
      ? new Date(router.query.endDate)
      : new Date(new Date().setDate(new Date().getDate() + 3)),
  });

  return (
    <div className="px-4 py-2">
      <GlobalStyle />

      {/* {data.length > 0 && <Table columns={columns} data={data}></Table>} */}

      <div
        id="step1"
        className="flex border-b px-2 py-1 justify-between items-center"
      >
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
          <h1 className="font-bold">{listing.property_name || listing.name}</h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              router.replace(
                {
                  query: {
                    ...router.query,
                    selected: router.query.selected.replaceAll(
                      listing.id.toString(),
                      ""
                    ),
                  },
                },
                undefined,
                { shallow: true }
              );
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
        <>
          <div
            id="step2"
            className="mt-4 flex gap-4 items-center justify-self-start"
          >
            <h1 className="text-xl font-SourceSans text-black font-semibold">
              {startDate && startDate.from
                ? moment(startDate.from).format("MMM Do")
                : moment(router.query.date).format("MMM Do")}
            </h1>

            <div className="w-fit flex items-center">
              {/* <div className="w-[5px] h-[5px] rounded-full bg-black"></div> */}
              <div className="h-[2px] w-[30px] bg-black"></div>
              {/* <div className="w-[5px] h-[5px] rounded-full bg-black"></div> */}
            </div>

            <h1 className="text-xl font-SourceSans font-semibold text-black">
              {startDate && startDate.to
                ? moment(startDate.to).format("MMM Do")
                : moment(router.query.endDate).format("MMM Do")}
            </h1>

            <PopoverBox
              panelClassName="bg-white w-[800px] rounded-xl !z-20 shadow-md mt-2 border w-fit -left-[250px] p-2"
              btnClassName=""
              btnPopover={
                <div className="cursor-pointer mt-1">
                  <Icon
                    className="w-5 h-5 text-red-600"
                    icon="material-symbols:edit"
                  />
                </div>
              }
            >
              <DayPicker
                mode="range"
                disabled={{ before: new Date() }}
                selected={startDate}
                numberOfMonths={2}
                onSelect={(date) => {
                  setDateRange(date);
                }}
              />
            </PopoverBox>
          </div>

          <div
            id="step3"
            className="py-2 flex h-[190px] w-full rounded-xl bg-white mt-2"
          >
            <div className="flex gap-4 w-full h-full">
              {!roomTypesLoading &&
                allRoomTypes?.map((item, index) => {
                  return (
                    <SelectedListingCard
                      key={index}
                      room={item}
                      residentFeesOptions={residentFeesOptions}
                      residentCommision={formikFees.values.commision}
                      nonResidentCommision={
                        formikFees.values.nonResidentCommission
                      }
                      nonResidentFeesOptions={nonResidentFeesOptions}
                      fees={formikFees.values.fees}
                      date={startDate}
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

          {/* <div className="w-full mt-4 h-[1px] bg-gray-200"></div> */}

          <div className="w-full bg-white py-2 rounded-lg flex flex-col justify-around">
            <h1 className="font-black mb-2 font-SourceSans text-sm">
              Add fee to pricing
            </h1>
            <div className="flex gap-4 w-full">
              {/* <PopoverBox
            panelClassName="bg-white !overflow-x-hidden rounded-lg shadow-md mt-3 border w-[500px] max-h-[300px] overflow-y-scroll -left-[0px] !p-0"
            btnClassName="!w-full bg-white !shadow-lg rounded-lg"
            btnPopover={
              <div className="px-3 !w-full border cursor-pointer py-2 flex items-center gap-4 mx-auto rounded-lg">
                <Icon
                  className="w-6 h-7 text-gray-500"
                  icon="material-symbols:feed"
                />

                <div className="flex flex-col gap-0.5">
                  <h1 className="font-bold text-sm self-start font-SourceSans">
                    Other fees from lodge
                  </h1>
                  {residentFeesOptions.length + nonResidentFeesOptions.length >
                    0 && (
                    <h1 className="font-normal self-start font-SourceSans">
                      {residentFeesOptions.length +
                        nonResidentFeesOptions.length}{" "}
                      selected
                    </h1>
                  )}

                  {residentFeesOptions.length +
                    nonResidentFeesOptions.length ===
                    0 && (
                    <h1 className="font-normal self-start font-SourceSans">
                      Select a fee
                    </h1>
                  )}
                </div>
              </div>
            }
            popoverClassName="!w-[32%]"
          >
            <div className="flex flex-col">
              {residentFees.map((fee, index) => (
                <div key={index} className="px-2 py-2">
                  <div className="flex justify-between items-center">
                    <h1 className="text-sm">
                      {fee.name}{" "}
                      <span className="font-normal">
                        (For resident{" "}
                        {fee.guest_type === "CHILD"
                          ? "child"
                          : fee.guest_type === "INFANT"
                          ? "infant"
                          : "adult"}
                        )
                      </span>
                      <span className="font-normal">
                        {" "}
                        ={" "}
                        <Price
                          stayPrice={fee.price}
                          autoCurrency={false}
                          currency="KES"
                          className="!text-sm !font-SourceSans inline !font-semibold !text-gray-600"
                        ></Price>{" "}
                        (
                        {fee.resident_fee_type === "WHOLE GROUP"
                          ? "Whole group"
                          : fee.resident_fee_type === "PER PERSON PER NIGHT"
                          ? "Per person per night"
                          : "Per person"}
                        )
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
                      <span className="font-normal">
                        (For non-resident{" "}
                        {fee.guest_type === "CHILD"
                          ? "child"
                          : fee.guest_type === "INFANT"
                          ? "infant"
                          : "adult"}
                        )
                      </span>
                      <span className="font-normal">
                        {" "}
                        ={" "}
                        <Price
                          stayPrice={fee.price}
                          autoCurrency={false}
                          className="!text-sm !font-SourceSans inline !font-semibold !text-gray-600"
                        ></Price>{" "}
                        (
                        {fee.nonresident_fee_type === "WHOLE GROUP"
                          ? "Whole group"
                          : fee.nonresident_fee_type === "PER PERSON PER NIGHT"
                          ? "Per person per night"
                          : "Per person"}
                        )
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
          </PopoverBox> */}

              <div
                onClick={() => {
                  setOpenOtherFeesModal(true);
                }}
                className="px-3 !w-[32%] bg-white !shadow-lg border cursor-pointer py-2 flex items-center justify-between gap-4 mx-auto rounded-lg"
              >
                <div className="flex gap-4 items-center">
                  <Icon
                    className="w-6 h-7 text-gray-500"
                    icon="material-symbols:feed"
                  />

                  <div className="flex flex-col gap-0.5">
                    <h1 className="font-bold text-sm self-start font-SourceSans">
                      Other fees from lodge
                    </h1>
                    {residentFeesOptions.length +
                      nonResidentFeesOptions.length >
                      0 && (
                      <h1 className="font-normal self-start font-SourceSans">
                        {residentFeesOptions.length +
                          nonResidentFeesOptions.length}{" "}
                        selected
                      </h1>
                    )}

                    {residentFeesOptions.length +
                      nonResidentFeesOptions.length ===
                      0 && (
                      <h1 className="font-normal self-start font-SourceSans">
                        Select a fee
                      </h1>
                    )}
                  </div>
                </div>

                <Icon className="w-6 h-6" icon="ci:external-link" />
              </div>

              <div
                onClick={() => {
                  setOpenFeesModal(true);
                }}
                className="px-3 !w-[32%] !shadow-lg cursor-pointer py-2 flex items-center justify-between gap-4 mx-auto rounded-lg border"
              >
                <div className="flex gap-4 items-center">
                  <Icon
                    className="w-6 h-7 text-gray-500"
                    icon="material-symbols:feed"
                  />

                  <div className="flex flex-col gap-0.5">
                    <h1 className="font-bold self-start text-sm font-SourceSans">
                      Extra fees
                    </h1>
                    <h1 className="font-normal self-start font-SourceSans">
                      Add your extra fees
                    </h1>
                  </div>
                </div>

                <Icon className="w-6 h-6" icon="ci:external-link" />
              </div>

              <PopoverBox
                panelClassName="bg-white rounded-md after:!left-[27%] -left-[40px] border shadow-md mt-2 w-[350px] p-0"
                btnClassName="w-full bg-white !shadow-lg rounded-lg"
                btnPopover={
                  <div className="px-3 w-full cursor-pointer py-2 flex justify-between items-center gap-4 mx-auto rounded-lg border">
                    <div className="flex gap-4 items-center">
                      <Icon
                        className="w-6 h-7 text-gray-500"
                        icon="material-symbols:feed"
                      />

                      <div className="flex flex-col gap-0.5">
                        <h1 className="font-bold self-start text-sm font-SourceSans">
                          Your commission
                        </h1>
                        <h1 className="font-normal self-start font-SourceSans">
                          Add your commission
                        </h1>
                      </div>
                    </div>

                    <Icon
                      className="w-10 h-10"
                      icon="ri:arrow-drop-down-line"
                    />
                  </div>
                }
                popoverClassName="!w-[32%]"
              >
                <div className="w-full border-b rounded-t-md px-3 py-2">
                  <h1 className="font-semibold font-SourceSans text-base">
                    Add your commission
                  </h1>
                </div>
                <div className="flex flex-col gap-0.5 mb-2 font-SourceSans">
                  <div className="flex px-2 py-2 justify-between items-center">
                    <h1 className="font-semibold text-sm font-SourceSans">
                      Non-resident commission
                    </h1>

                    <div className="flex items-center w-[30%]">
                      <Input
                        name="nonResidentCommission"
                        type="number"
                        value={formikFees.values.nonResidentCommission}
                        placeholder="0"
                        onChange={(e) => {
                          formikFees.handleChange(e);
                        }}
                        className={
                          "w-full !pl-1 !pr-[1px] !py-0.5 border placeholder:text-gray-500 !rounded-none !h-full placeholder:text-sm "
                        }
                        inputClassName="!text-sm !border-none "
                      ></Input>
                      <h1 className="font-semibold">%</h1>
                    </div>
                  </div>

                  <div className="flex px-2 py-2 justify-between items-center">
                    <h1 className="font-semibold text-sm font-SourceSans">
                      Resident commission
                    </h1>

                    <div className="flex items-center w-[30%]">
                      <Input
                        name="commision"
                        type="number"
                        value={formikFees.values.commision}
                        placeholder="0"
                        onChange={(e) => {
                          formikFees.handleChange(e);
                        }}
                        className={
                          "w-full !pl-1 !pr-[1px] !py-0.5 border placeholder:text-gray-500 !rounded-none !h-full placeholder:text-sm "
                        }
                        inputClassName="!text-sm !border-none "
                      ></Input>
                      <h1 className="font-semibold">%</h1>
                    </div>
                  </div>
                </div>
              </PopoverBox>

              <Dialogue
                isOpen={openFeesModal}
                closeModal={() => {
                  setOpenFeesModal(false);
                }}
                dialogueTitleClassName="!font-bold !ml-4 !text-xl md:!text-2xl"
                outsideDialogueClass="!p-0"
                dialoguePanelClassName={
                  "md:!rounded-md !rounded-none !p-0 overflow-y-scroll remove-scroll !max-w-2xl screen-height-safari md:!min-h-[300px] md:!max-h-[550px] "
                }
              >
                <div className="px-4 border-b py-2 flex justify-between items-center gap-4">
                  <h1 className="font-bold text-lg font-SourceSans">
                    Add extra fee
                  </h1>

                  <div
                    onClick={() => {
                      setOpenFeesModal(false);
                    }}
                    className="w-[30px] h-[30px] cursor-pointer rounded-full border border-gray-400 flex items-center justify-center"
                  >
                    <Icon className="w-6 h-6" icon="iconoir:cancel" />
                  </div>
                </div>

                <div className="flex flex-col gap-2 mt-2 mb-2 font-SourceSans">
                  {formikFees.values.fees.map((item, index) => {
                    return (
                      <div
                        key={item}
                        className="flex flex-col px-3 py-1 justify-between items-center"
                      >
                        <div className="flex gap-2 mb-2 items-center w-full">
                          <div className="flex items-center w-[50%]">
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
                              label="Name"
                              className={
                                "w-full placeholder:text-gray-500 placeholder:font-normal !h-full placeholder:text-sm "
                              }
                              inputClassName="!text-sm "
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
                              label="Price"
                              className={
                                "w-full placeholder:text-gray-500 placeholder:font-normal !h-full placeholder:text-sm "
                              }
                              inputClassName="!text-sm "
                            ></Input>
                          </div>
                        </div>

                        <div className="w-full flex items-start gap-2">
                          <div className="flex flex-col gap-1 justify-between w-[50%]">
                            <h1 className="text-sm font-bold mb-1">
                              Enter a fee option. eg. Per person
                            </h1>
                            <SelectInput
                              options={feeOptions}
                              selectedOption={item.feeType}
                              instanceId="feeType"
                              setSelectedOption={(selected) => {
                                formikFees.setFieldValue(
                                  `fees[${index}].feeType`,
                                  selected
                                );
                              }}
                              className={
                                "!w-full !border !rounded-md !text-sm py-1 pl-1 " +
                                (formikFees.touched.fee_option &&
                                formikFees.errors.fee_option
                                  ? "border-red-500"
                                  : "")
                              }
                              placeholder="Select fee option"
                              isSearchable={false}
                            ></SelectInput>
                          </div>

                          <div className="flex flex-col gap-1 justify-between w-[50%]">
                            <h1 className="text-sm font-bold mb-1">
                              Resident type
                            </h1>
                            <SelectInput
                              options={resident}
                              selectedOption={item.residentType}
                              instanceId="residentType"
                              setSelectedOption={(selected) => {
                                formikFees.setFieldValue(
                                  `fees[${index}].residentType`,
                                  selected
                                );
                              }}
                              className={
                                "!w-full !border !rounded-md !text-sm py-1 pl-1 " +
                                (formikFees.touched.residentType &&
                                formikFees.errors.residentType
                                  ? "border-red-500"
                                  : "")
                              }
                              placeholder="Select fee option"
                              isSearchable={false}
                            ></SelectInput>
                          </div>
                        </div>

                        {index > 0 && (
                          <div className="px-1 ml-auto flex items-center gap-2">
                            <div
                              onClick={() => {
                                formikFees.setFieldValue(
                                  "fees",
                                  formikFees.values.fees.filter(
                                    (item, i) => i !== index
                                  )
                                );
                              }}
                              className="cursor-pointer font-bold mt-2 text-red-500 rounded-full flex items-center justify-center"
                            >
                              Clear
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}

                  <div
                    onClick={() => {
                      formikFees.setFieldValue("fees", [
                        ...formikFees.values.fees,
                        {
                          name: "",
                          price: "",
                          feeType: { value: "PER PERSON", label: "Per person" },
                          residentType: {
                            value: "RESIDENT",
                            label: "Resident",
                          },
                        },
                      ]);
                    }}
                    className="px-1 cursor-pointer py-0.5 rounded-sm ml-3 text-blue-600 w-fit text-sm font-semibold hover:bg-blue-600 hover:bg-opacity-20"
                  >
                    Add a fee
                  </div>

                  <div className="flex flex-col gap-2 px-4">
                    <span className="font-bold font-SourceSans">Note:</span>
                    <ListItem>
                      <span className="font-bold">Per person</span> - This fee
                      will be charged per person each guest added.
                    </ListItem>

                    <ListItem>
                      <span className="font-bold">Per person per night</span> -
                      This fee will be charged per person per night.
                    </ListItem>

                    <ListItem>
                      <span className="font-bold">Whole group</span> - This fee
                      will be added to the total price.
                    </ListItem>
                  </div>

                  <div className="px-4">
                    <Button
                      onClick={() => {
                        setOpenFeesModal(false);
                      }}
                      type={"submit"}
                      className="!w-full mt-4 btn-gradient-2 !h-full !rounded-lg font-bold"
                    >
                      Done
                    </Button>
                  </div>
                </div>
              </Dialogue>

              <Dialogue
                isOpen={openOtherFeesModal}
                closeModal={() => {
                  setOpenOtherFeesModal(false);
                }}
                dialogueTitleClassName="!font-bold !ml-4 !text-xl md:!text-2xl"
                outsideDialogueClass="!p-0"
                dialoguePanelClassName={
                  "md:!rounded-md !rounded-none !px-1 !py-0 overflow-y-scroll remove-scroll !max-w-2xl screen-height-safari md:!min-h-[300px] md:!max-h-[550px] "
                }
              >
                <div className="px-2 py-2 flex justify-between items-center gap-4">
                  <h1 className="font-bold text-lg font-SourceSans">
                    Add other fees from lodge
                  </h1>

                  <div
                    onClick={() => {
                      setOpenOtherFeesModal(false);
                    }}
                    className="w-[30px] h-[30px] cursor-pointer rounded-full border border-gray-400 flex items-center justify-center"
                  >
                    <Icon className="w-6 h-6" icon="iconoir:cancel" />
                  </div>
                </div>

                <div className="flex px-2 flex-col gap-2 mb-2 font-SourceSans">
                  <div className="flex flex-col gap-2">
                    {residentFees.map((fee, index) => (
                      <div key={index} className="px-2 py-2 bg-gray-100">
                        <div className="flex justify-between items-center">
                          <div className="flex flex-col gap-1">
                            <div className="text-sm font-semibold">
                              {fee.name}{" "}
                              <span className="font-semibold">
                                {" "}
                                ={" "}
                                <Price
                                  stayPrice={fee.price}
                                  autoCurrency={false}
                                  currency="KES"
                                  className="!text-sm !font-SourceSans inline !font-semibold !text-black"
                                ></Price>{" "}
                                (
                                {fee.resident_fee_type === "WHOLE GROUP"
                                  ? "Whole group"
                                  : fee.resident_fee_type ===
                                    "PER PERSON PER NIGHT"
                                  ? "Per person per night"
                                  : "Per person"}
                                )
                              </span>
                            </div>

                            <span className="font-normal text-sm text-gray-700">
                              For resident{" "}
                              {fee.guest_type === "CHILD"
                                ? "child"
                                : fee.guest_type === "INFANT"
                                ? "infant"
                                : "adult"}
                            </span>
                          </div>

                          <div className="">
                            <label
                              htmlFor={"other-fees-resident" + index}
                              className=""
                            >
                              <>
                                <Switch
                                  switchButton={containsResidentOption(fee)}
                                  switchButtonCircle="!w-5 h-5"
                                  switchButtonContainer="!h-7 !w-[47px]"
                                  roundedColorClass="!bg-white"
                                  xVal={20}
                                ></Switch>
                              </>
                            </label>

                            <input
                              type="checkbox"
                              value={fee}
                              onChange={(event) =>
                                handleResidentCheck(event, fee)
                              }
                              checked={containsResidentOption(fee)}
                              className="hidden"
                              id={"other-fees-resident" + index}
                              readOnly
                            />
                          </div>
                        </div>
                      </div>
                    ))}

                    <hr className="my-2" />

                    {nonResidentFees.map((fee, index) => (
                      <div key={index} className="px-2 py-2 bg-gray-100">
                        <div className="flex justify-between items-center">
                          <div className="flex flex-col gap-1">
                            <div className="text-sm font-semibold">
                              {fee.name}{" "}
                              <span className="font-semibold">
                                {" "}
                                ={" "}
                                <Price
                                  stayPrice={fee.price}
                                  autoCurrency={false}
                                  className="!text-sm !font-SourceSans inline !font-semibold !text-black"
                                ></Price>{" "}
                                (
                                {fee.resident_fee_type === "WHOLE GROUP"
                                  ? "Whole group"
                                  : fee.resident_fee_type ===
                                    "PER PERSON PER NIGHT"
                                  ? "Per person per night"
                                  : "Per person"}
                                )
                              </span>
                            </div>

                            <span className="font-normal text-sm text-gray-700">
                              For non-resident{" "}
                              {fee.guest_type === "CHILD"
                                ? "child"
                                : fee.guest_type === "INFANT"
                                ? "infant"
                                : "adult"}
                            </span>
                          </div>

                          <div className="">
                            <label
                              htmlFor={"other-fees-nonresident" + index}
                              className=""
                            >
                              <>
                                <Switch
                                  switchButton={containsNonResidentOption(fee)}
                                  switchButtonCircle="!w-5 h-5"
                                  switchButtonContainer="!h-7 !w-[47px]"
                                  roundedColorClass="!bg-white"
                                  xVal={20}
                                ></Switch>
                              </>
                            </label>

                            <input
                              type="checkbox"
                              value={fee}
                              onChange={(event) =>
                                handleNonResidentCheck(event, fee)
                              }
                              checked={containsNonResidentOption(fee)}
                              className="hidden"
                              id={"other-fees-nonresident" + index}
                              readOnly
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="">
                    <Button
                      onClick={() => {
                        setOpenOtherFeesModal(false);
                      }}
                      type={"submit"}
                      className="!w-full mt-4 btn-gradient-2 !h-full !rounded-lg font-bold"
                    >
                      Done
                    </Button>
                  </div>
                </div>
              </Dialogue>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

SelectedListing.propTypes = {};

export default SelectedListing;
