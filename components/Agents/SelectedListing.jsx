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
import SelectInput from "../ui/SelectInput";
import ListItem from "../ui/ListItem";

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

  const [startDate, setDateRange] = React.useState({
    from: router.query.date ? new Date(router.query.date) : new Date(),
    to: router.query.endDate
      ? new Date(router.query.endDate)
      : new Date(new Date().setDate(new Date().getDate() + 3)),
  });

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
          <h1 className="font-bold">{listing.property_name || listing.name}</h1>
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

      <div
        id="step2"
        className="mt-4 flex gap-4 items-center justify-self-start"
      >
        <h1 className="text-2xl font-SourceSans text-gray-600 font-semibold">
          {startDate && startDate.from
            ? moment(startDate.from).format("MMM Do")
            : ""}
        </h1>

        <div className="w-fit flex items-center">
          <div className="w-[5px] h-[5px] rounded-full bg-gray-300"></div>
          <div className="h-[2px] w-[30px] bg-gray-200"></div>
          <div className="w-[5px] h-[5px] rounded-full bg-gray-300"></div>
        </div>

        <h1 className="text-2xl font-SourceSans font-semibold text-gray-600">
          {startDate && startDate.to
            ? moment(startDate.to).format("MMM Do")
            : ""}
        </h1>

        <PopoverBox
          panelClassName="bg-white w-[800px] rounded-xl !z-20 shadow-md mt-2 border w-fit -left-[250px] p-2"
          btnClassName="!rounded-3xl shadow-md"
          btnPopover={
            <div className="cursor-pointer">
              <Icon
                className="w-5 h-5 text-blue-600"
                icon="material-symbols:edit-square-outline"
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
        <div className="flex gap-4 w-full h-full px-4">
          {!roomTypesLoading &&
            roomTypes.map((item, index) => {
              return (
                <SelectedListingCard
                  key={index}
                  room={item}
                  residentFeesOptions={residentFeesOptions}
                  residentCommision={formikFees.values.commision}
                  nonResidentCommision={formikFees.values.nonResidentCommission}
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

      <div className="w-full mt-4 bg-white px-4 py-2 rounded-lg flex flex-col justify-around">
        <h1 className="font-black mb-2 font-SourceSans text-sm">
          Add fee to pricing
        </h1>
        <div className="flex gap-4 w-full">
          <PopoverBox
            panelClassName="bg-white rounded-lg after:!left-[30%] tooltip shadow-md mt-2 border w-[500px] max-h-[300px] overflow-y-scroll -left-[0px] !p-0"
            btnClassName="!w-full"
            btnPopover={
              <div className="px-3 !w-full cursor-pointer py-1 flex items-center gap-4 mx-auto rounded-lg border">
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
            <div className="w-full bg-gray-200 rounded-t-lg px-3 py-2">
              <h1 className="font-semibold font-SourceSans text-base">
                Add other fees
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
                      <span className="font-normal">(For non-resident)</span>
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
          </PopoverBox>

          <div
            onClick={() => {
              setOpenFeesModal(true);
            }}
            className="px-3 !w-[32%] cursor-pointer py-1 flex items-center gap-4 mx-auto rounded-lg border"
          >
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

          <PopoverBox
            panelClassName="bg-white rounded-md after:!left-[27%] after:!border-b-gray-200 tooltip -left-[0px] border shadow-md mt-2 w-[320px] p-0"
            btnClassName="w-full"
            btnPopover={
              <div className="px-3 w-full cursor-pointer py-1 flex items-center gap-4 mx-auto rounded-lg border">
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
            }
            popoverClassName="!w-[32%]"
          >
            <div className="w-full bg-gray-200 rounded-t-md px-3 py-2">
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
              {/* <div className="h-[1px] w-full bg-gray-100"></div> */}
              {/* {formikFees.values.fees.map((item, index) => {
                  return (
                    <div
                      key={item}
                      className="flex px-2 py-2 justify-between items-center"
                    >

                      <div className="flex items-center w-[28%]">
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
                })} */}
              {/* <div
                  onClick={() => {
                    formikFees.setFieldValue("fees", [
                      ...formikFees.values.fees,
                      { name: "", price: "" },
                    ]);
                  }}
                  className="px-1 cursor-pointer py-0.5 rounded-sm ml-2 text-blue-600 w-fit text-sm font-semibold hover:bg-blue-600 hover:bg-opacity-20"
                >
                  Add a fee
                </div> */}
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
            <div
              onClick={() => {
                setOpenFeesModal(false);
              }}
              className="border-b px-4 py-2 bg-gray-200 flex items-center gap-4"
            >
              <div className="w-[30px] h-[30px] cursor-pointer rounded-full border border-gray-400 flex items-center justify-center">
                <Icon className="w-6 h-6" icon="iconoir:cancel" />
              </div>
              <h1 className="font-bold font-SourceSans">Add extra fee</h1>
            </div>

            <div className="flex flex-col gap-2 mb-2 font-SourceSans">
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
                            "w-full !pr-[1px] placeholder:text-gray-500 placeholder:font-semibold !h-full placeholder:text-sm "
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
                            "w-full placeholder:text-gray-500 placeholder:font-semibold !h-full placeholder:text-sm "
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
                    { name: "", price: "" },
                  ]);
                }}
                className="px-1 cursor-pointer py-0.5 rounded-sm ml-3 text-blue-600 w-fit text-sm font-semibold hover:bg-blue-600 hover:bg-opacity-20"
              >
                Add a fee
              </div>

              <div className="flex flex-col gap-2 px-4">
                <span className="font-bold font-SourceSans">Note:</span>
                <ListItem>
                  <span className="font-bold">Per person</span> - This fee will
                  be charged per person each guest added.
                </ListItem>

                <ListItem>
                  <span className="font-bold">Per person per night</span> - This
                  fee will be charged per person per night.
                </ListItem>

                <ListItem>
                  <span className="font-bold">Whole group</span> - This fee will
                  be added to the total price.
                </ListItem>
              </div>
            </div>
          </Dialogue>
        </div>
      </div>
    </div>
  );
}

SelectedListing.propTypes = {};

export default SelectedListing;
