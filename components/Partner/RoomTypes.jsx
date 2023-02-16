import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { Icon } from "@iconify/react";
import RoomAvailability from "./RoomAvailability";
import Link from "next/link";
import { useRouter } from "next/router";
import Dialogue from "../Home/Dialogue";
import { useFormik } from "formik";
import * as Yup from "yup";
import Input from "../ui/Input";
import PopoverBox from "../ui/Popover";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { createGlobalStyle } from "styled-components";
import moment from "moment";
import axios from "axios";
import LoadingSpinerChase from "../ui/LoadingSpinerChase";
import ListItem from "../ui/ListItem";
import Cookies from "js-cookie";
import SelectInput from "../ui/SelectInput";

function RoomTypes({ room, index, inPartnerHomepage = false, staySlug = "" }) {
  const router = useRouter();

  const [isOpen, setIsOpen] = React.useState(index === 0 ? true : false);

  const [openAddAvailabilityModal, setOpenAddAvailabilityModal] =
    React.useState(false);

  const [openDeleteRoomModal, setOpenDeleteRoomModal] = React.useState(false);

  const [addAvailabilityLoading, setAddAvailabilityLoading] =
    React.useState(false);

  const [deleteRoomLoading, setDeleteRoomLoading] = React.useState(false);

  let startDate = moment(new Date(router.query.startDate));
  let endDate = moment(new Date(router.query.endDate));

  // get all data between start and end date
  const allDates = [];
  while (startDate <= endDate) {
    allDates.push(moment(startDate).format("YYYY-MM-DD"));
    startDate = moment(startDate).add(1, "days");
  }

  const [roomAvailabilities, setRoomAvailabilities] = React.useState([]);

  const [roomAvailabilitiesNonResident, setRoomAvailabilitiesNonResident] =
    React.useState([]);

  useEffect(() => {
    if (router.query.startDate && router.query.endDate) {
      axios
        .get(
          `${process.env.NEXT_PUBLIC_baseURL}/room-types/${room.slug}/resident-availabilities/?start_date=${router.query.startDate}&end_date=${router.query.endDate}`,
          {
            headers: {
              Authorization: "Token " + Cookies.get("token"),
            },
          }
        )
        .then((res) => {
          setRoomAvailabilities(res.data.results);
        });

      axios
        .get(
          `${process.env.NEXT_PUBLIC_baseURL}/room-types/${room.slug}/nonresident-availabilities/?start_date=${router.query.startDate}&end_date=${router.query.endDate}`,
          {
            headers: {
              Authorization: "Token " + Cookies.get("token"),
            },
          }
        )
        .then((res) => {
          setRoomAvailabilitiesNonResident(res.data.results);
        });
    }
  }, [router.query.startDate, router.query.endDate]);

  const [residentIsOpen, setResidentIsOpen] = React.useState(true);

  const [nonResidentIsOpen, setNonResidentIsOpen] = React.useState(false);

  const guestOptions = [
    { value: "ADULT SINGLE", label: "Adult single (12+ years)" },
    { value: "ADULT DOUBLE", label: "Adult double (12+ years)" },
    { value: "ADULT TRIPLE", label: "Adult triple (12+ years)" },
    { value: "CHILD SINGLE", label: "Child single (2 - 11 years)" },
    { value: "CHILD DOUBLE", label: "Child double (2 - 11 years)" },
    { value: "CHILD TRIPLE", label: "Child triple (2 - 11 years)" },
    { value: "INFANT", label: "Infant (Under 2 years)" },
  ];

  const formikAdd = useFormik({
    initialValues: {
      number_of_available_rooms: "",
      residency: "",
      dates: [
        {
          startDate: "",
          endDate: "",
        },
      ],

      guestTypes: [
        {
          name: "",
          price: "",
        },
      ],
    },
    validationSchema: Yup.object({
      number_of_available_rooms: Yup.number().required(
        "Number of available rooms is required"
      ),
      dates: Yup.array().of(
        Yup.object().shape({
          startDate: Yup.date().required("Start date is required"),
          endDate: Yup.date().required("End date is required"),
        })
      ),
      residency: Yup.object().required("Please select a residency").nullable(),
      guestTypes: Yup.array().of(
        Yup.object().shape({
          name: Yup.string().required("Guest type is required"),
          price: Yup.number().required("Price is required"),
        })
      ),
    }),
    onSubmit: async (values) => {
      setAddAvailabilityLoading(true);
      const allDates = [];
      const data = [];

      if (values.residency.value === "Resident") {
        values.dates.map((date) => {
          const currentDate = moment(date.startDate);
          const stopDate = moment(date.endDate);

          while (currentDate <= stopDate) {
            allDates.push(moment(currentDate).format("YYYY-MM-DD"));
            currentDate = moment(currentDate).add(1, "days");
          }
        });

        allDates.map((date) => {
          const obj = {
            num_of_available_rooms: values.number_of_available_rooms,
            date: date,
            room_resident_guest_availabilities: values.guestTypes,
          };

          data.push(obj);
        });

        await axios
          .post(
            `${process.env.NEXT_PUBLIC_baseURL}/room-types/${room.slug}/resident-availabilities/`,
            data,
            {
              headers: {
                Authorization: "Token " + Cookies.get("token"),
              },
            }
          )
          .then((res) => {
            router.reload();
          })
          .catch((err) => {
            setAddAvailabilityLoading(false);
          });
      } else if (values.residency.value === "Non-resident") {
        values.dates.map((date) => {
          const currentDate = moment(date.startDate);
          const stopDate = moment(date.endDate);

          while (currentDate <= stopDate) {
            allDates.push(moment(currentDate).format("YYYY-MM-DD"));
            currentDate = moment(currentDate).add(1, "days");
          }
        });

        allDates.map((date) => {
          const obj = {
            num_of_available_rooms: values.number_of_available_rooms,
            date: date,
            room_non_resident_guest_availabilities: values.guestTypes,
          };

          data.push(obj);
        });

        await axios
          .post(
            `${process.env.NEXT_PUBLIC_baseURL}/room-types/${room.slug}/nonresident-availabilities/`,
            data,
            {
              headers: {
                Authorization: "Token " + Cookies.get("token"),
              },
            }
          )
          .then((res) => {
            router.reload();
          })
          .catch((err) => {
            setAddAvailabilityLoading(false);
          });
      }
    },
  });

  const deleteRoom = () => {
    setOpenDeleteRoomModal(true);
    axios
      .delete(
        `${process.env.NEXT_PUBLIC_baseURL}/stays/${router.query.slug}/room-types/${room.slug}/`,
        {
          headers: {
            Authorization: "Token " + Cookies.get("token"),
          },
        }
      )
      .then((res) => {
        setOpenDeleteRoomModal(false);

        router.reload();
      })
      .catch((err) => {
        setOpenDeleteRoomModal(false);
      });
  };

  return (
    <div className="">
      <div
        className={
          "flex z-10 top-[81px] bg-white justify-between shadow-md px-2 py-2 border items-center " +
          (inPartnerHomepage ? "" : "sticky")
        }
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
          <h1 className="font-bold">{room.name}</h1>
        </div>

        {!inPartnerHomepage && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setOpenAddAvailabilityModal(true);
              }}
              className="bg-white shadow-lg flex items-center justify-center text-lg font-bold text-black w-8 h-8 rounded-full"
            >
              <span> + </span>
            </button>

            <button
              onClick={() => {
                setOpenDeleteRoomModal(true);
              }}
              className="bg-white shadow-lg flex items-center justify-center text-lg font-bold text-black w-8 h-8 rounded-full"
            >
              <Icon
                className="text-red-500"
                icon="material-symbols:delete-outline-rounded"
              />
            </button>
          </div>
        )}

        <Dialogue
          isOpen={openAddAvailabilityModal}
          closeModal={() => {
            setOpenAddAvailabilityModal(false);
          }}
          dialogueTitleClassName="!font-bold !ml-4 !text-xl md:!text-2xl"
          outsideDialogueClass="!p-0"
          dialoguePanelClassName={
            "md:!rounded-md !rounded-none !p-0 overflow-y-scroll remove-scroll !max-w-4xl screen-height-safari md:!min-h-0 md:!h-[570px] "
          }
        >
          <div className="px-4 py-2">
            <h1 className="font-bold font-SourceSans text-lg truncate">
              <span className="text-gray-600">Add availability to </span>
              {room.name}
            </h1>

            <div className="mt-4 flex gap-3 flex-col">
              <div className="flex flex-col gap-2">
                {formikAdd.values.dates.map((date, index) => {
                  return (
                    <div
                      key={index}
                      className="flex justify-between items-center"
                    >
                      <div className="w-[47%]">
                        <h1 className="text-sm font-bold">Start date</h1>
                        <PopoverBox
                          panelClassName="bg-white rounded-xl shadow-md mt-2 border w-[400px]"
                          btnClassName="w-full"
                          btnPopover={
                            <div
                              className={
                                "!w-full rounded-md px-2 py-5 flex items-center cursor-pointer justify-between text-sm text-gray-500 h-[35px] border border-gray-300 " +
                                (formikAdd.touched.dates &&
                                formikAdd.errors.dates
                                  ? "border-red-500"
                                  : "")
                              }
                            >
                              {!date.startDate && (
                                <h1 className="font-bold text-gray-400">
                                  Availability date
                                </h1>
                              )}
                              {date.startDate && (
                                <h1>
                                  {moment(date.startDate).format("MMM Do YYYY")}
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
                            selected={date.startDate}
                            onSelect={(date) => {
                              formikAdd.setFieldValue(
                                `dates[${index}].startDate`,
                                date
                              );
                            }}
                          />
                        </PopoverBox>

                        {formikAdd.touched.dates && formikAdd.errors.dates ? (
                          <span className="text-sm font-bold text-red-400">
                            {formikAdd.errors.dates[index].startDate}
                          </span>
                        ) : null}
                      </div>

                      <div className="w-[47%] gap-2 flex items-center">
                        <div className={index > 0 ? "w-[94%]" : "w-[99%]"}>
                          <h1 className="text-sm font-bold">End date</h1>
                          <PopoverBox
                            panelClassName="bg-white rounded-xl shadow-md mt-2 right-0 border w-[400px]"
                            btnClassName="w-full"
                            btnPopover={
                              <div
                                className={
                                  "!w-full rounded-md px-2 py-5 flex items-center cursor-pointer justify-between text-sm text-gray-500 h-[35px] border border-gray-300 " +
                                  (formikAdd.touched.dates &&
                                  formikAdd.errors.dates
                                    ? "border-red-500"
                                    : "")
                                }
                              >
                                {!date.endDate && (
                                  <h1 className="font-bold text-gray-400">
                                    Availability date
                                  </h1>
                                )}
                                {date.endDate && (
                                  <h1>
                                    {moment(date.endDate).format("MMM Do YYYY")}
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
                              selected={date.endDate}
                              onSelect={(date) => {
                                formikAdd.setFieldValue(
                                  `dates[${index}].endDate`,
                                  date
                                );
                              }}
                            />
                          </PopoverBox>

                          {formikAdd.touched.dates && formikAdd.errors.dates ? (
                            <span className="text-sm font-bold text-red-400">
                              {formikAdd.errors.dates[index].endDate}
                            </span>
                          ) : null}
                        </div>

                        {index > 0 && (
                          <div
                            onClick={() => {
                              formikAdd.setFieldValue(
                                "dates",
                                formikAdd.values.dates.filter(
                                  (_, i) => i !== index
                                )
                              );
                            }}
                            className="w-[24px] cursor-pointer h-[24px] bg-red-500 mt-4 rounded-full flex items-center justify-center"
                          >
                            <Icon
                              className="text-white text-lg"
                              icon="octicon:dash-16"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}

                <div
                  onClick={() => {
                    formikAdd.setFieldValue("dates", [
                      ...formikAdd.values.dates,
                      { startDate: "", endDate: "" },
                    ]);
                  }}
                  className="font-bold w-fit text-sm text-blue-500 cursor-pointer"
                >
                  Add more
                </div>
              </div>

              <div className="flex flex-col gap-3 mt-3">
                {formikAdd.values.guestTypes.map((guest, index) => {
                  return (
                    <div key={index} className="flex justify-between">
                      <div className="w-[47%] flex flex-col gap-1.5">
                        <h1 className="text-sm font-bold">
                          Add the type of guest. eg &quot;Adult single&quot;
                        </h1>
                        <SelectInput
                          options={guestOptions}
                          selectedOption={guestOptions.find(
                            (option) => option.value === guest.name
                          )}
                          instanceId="rooms"
                          setSelectedOption={(selected) => {
                            formikAdd.setFieldValue(
                              `guestTypes[${index}].name`,
                              selected.value
                            );
                          }}
                          className={
                            "!w-full !border !rounded-md !text-sm py-1 pl-1 " +
                            (formikAdd.touched.guestTypes &&
                            formikAdd.errors.guestTypes
                              ? "border-red-500"
                              : "")
                          }
                          placeholder="Select a type of guest"
                          isSearchable={false}
                        ></SelectInput>

                        {formikAdd.touched.guestTypes &&
                        formikAdd.errors.guestTypes ? (
                          <span className="text-sm font-bold text-red-400">
                            {formikAdd.errors.guestTypes[index].name}
                          </span>
                        ) : null}
                      </div>

                      <div className="w-[47%] gap-2 flex items-center">
                        <div className={index > 0 ? "w-[94%]" : "w-[99%]"}>
                          <Input
                            name="price"
                            type="number"
                            value={guest.price}
                            placeholder="Price"
                            errorStyle={
                              formikAdd.touched.guestTypes &&
                              formikAdd.errors.guestTypes
                                ? true
                                : false
                            }
                            onChange={(e) => {
                              formikAdd.setFieldValue(
                                `guestTypes[${index}].price`,
                                e.target.value
                              );
                            }}
                            className={"w-full placeholder:text-sm "}
                            inputClassName="!text-sm "
                            label="Add the agent price of the guest type"
                          ></Input>

                          {formikAdd.touched.guestTypes &&
                          formikAdd.errors.guestTypes ? (
                            <span className="text-sm font-bold text-red-400">
                              {formikAdd.errors.guestTypes[index].price}
                            </span>
                          ) : null}
                        </div>

                        {index > 0 && (
                          <div
                            onClick={() => {
                              formikAdd.setFieldValue(
                                "guestTypes",
                                formikAdd.values.guestTypes.filter(
                                  (_, i) => i !== index
                                )
                              );
                            }}
                            className="w-[24px] cursor-pointer h-[24px] bg-red-500 mt-6 rounded-full flex items-center justify-center"
                          >
                            <Icon
                              className="text-white text-lg"
                              icon="octicon:dash-16"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}

                <div
                  onClick={() => {
                    formikAdd.setFieldValue("guestTypes", [
                      ...formikAdd.values.guestTypes,
                      { name: "", price: "" },
                    ]);
                  }}
                  className="font-bold w-fit text-sm text-blue-500 cursor-pointer"
                >
                  Add more
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <h1 className="text-sm font-bold">Residency</h1>

                <SelectInput
                  options={[
                    { value: "Resident", label: "Resident" },
                    { value: "Non-resident", label: "Non-resident" },
                  ]}
                  selectedOption={formikAdd.values.residency}
                  instanceId="rooms"
                  setSelectedOption={(selected) => {
                    formikAdd.setFieldValue("residency", selected);
                  }}
                  className={
                    "!w-full !border !rounded-md !text-sm !text-sm py-1 pl-1 " +
                    (formikAdd.touched.residency && formikAdd.errors.residency
                      ? "border-red-500"
                      : "")
                  }
                  placeholder="Select a room"
                  isSearchable={false}
                ></SelectInput>

                {formikAdd.touched.residency && formikAdd.errors.residency ? (
                  <span className="text-sm font-bold text-red-400">
                    {formikAdd.errors.residency}
                  </span>
                ) : null}
              </div>

              <div>
                <Input
                  name="number_of_available_rooms"
                  type="number"
                  value={formikAdd.values.number_of_available_rooms}
                  placeholder="Number of available rooms"
                  errorStyle={
                    formikAdd.touched.number_of_available_rooms &&
                    formikAdd.errors.number_of_available_rooms
                      ? true
                      : false
                  }
                  onChange={(e) => {
                    formikAdd.handleChange(e);
                  }}
                  className={"w-full placeholder:text-sm "}
                  inputClassName="!text-sm "
                  label="Add the number of rooms that is available on the selected date"
                ></Input>
                {formikAdd.touched.number_of_available_rooms &&
                formikAdd.errors.number_of_available_rooms ? (
                  <span className="text-sm font-bold text-red-400">
                    {formikAdd.errors.number_of_available_rooms}
                  </span>
                ) : null}
              </div>
            </div>

            {/* <p className="font-bold mb-2 mt-4 text-sm">Note:</p>
            <div className="mb-3 flex flex-col gap-1">
              <ListItem>
                You can only add availability for 20 days at a time.
              </ListItem>
              <ListItem>If date is already added, it will be updated.</ListItem>
              <ListItem>
                Price and number of available rooms can be changed at anytime.
              </ListItem>
              <ListItem>Price is in USD.</ListItem>
            </div> */}

            <div className="flex items-center gap-4 mt-12">
              <button
                onClick={() => {
                  setOpenAddAvailabilityModal(false);
                }}
                className="bg-gray-200 w-[40%] text-sm font-bold px-6 py-2 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  formikAdd.handleSubmit();
                }}
                type="submit"
                disabled={addAvailabilityLoading}
                className={
                  "bg-blue-500 flex justify-center w-[60%] items-center gap-2 text-white font-bold px-2 py-1.5 rounded-md " +
                  (addAvailabilityLoading
                    ? "cursor-not-allowed opacity-60"
                    : "")
                }
              >
                <span>Post</span>{" "}
                {addAvailabilityLoading && (
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
        </Dialogue>

        <Dialogue
          isOpen={openDeleteRoomModal}
          closeModal={() => {
            setOpenDeleteRoomModal(false);
          }}
          dialogueTitleClassName="!font-bold !ml-4 !text-xl md:!text-2xl"
          outsideDialogueClass="!p-0"
          dialoguePanelClassName={
            "md:!rounded-md !rounded-none !p-0 overflow-y-scroll remove-scroll !max-w-md screen-height-safari md:!min-h-0 md:max-h-[500px] "
          }
        >
          <div className="px-4 py-2">
            <h1 className="font-bold font-SourceSans text-lg truncate">
              <span className="text-gray-600">You are about to delete </span>
              {room.name}
            </h1>

            <p className="text-sm text-gray-500 mt-2">
              Are you sure you want to delete this room? This action cannot be
              undone. This will also delete all the availabilities of this room.
            </p>

            <div className="flex items-center gap-4 mt-6">
              <button
                onClick={() => {
                  setOpenDeleteRoomModal(false);
                }}
                className="bg-gray-200 w-[30%] text-sm font-bold px-6 py-2 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  deleteRoom();
                }}
                disabled={deleteRoomLoading}
                className={
                  "bg-red-500 flex justify-center w-[70%] items-center gap-2 text-white font-bold px-2 py-2 rounded-md " +
                  (deleteRoomLoading ? "cursor-not-allowed opacity-60" : "")
                }
              >
                <span className="text-sm">Delete anyways</span>{" "}
                {deleteRoomLoading && (
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
        </Dialogue>
      </div>

      {isOpen && (
        <div className="w-full -z-10 flex flex-col gap-4 pl-4 mt-4 bg-white">
          <div>
            <div className="flex justify-between shadow-md px-2 py-2 border items-center">
              <div className="flex gap-2 items-center">
                <div
                  onClick={() => setResidentIsOpen(!residentIsOpen)}
                  className="w-5 h-5 rounded-md transition-colors duration-300 cursor-pointer hover:bg-gray-300 flex items-center justify-center text-gray-600 text-xs font-bold"
                >
                  <Icon
                    className={
                      "w-4 h-4 transition-all duration-200 " +
                      (residentIsOpen ? " rotate-0" : " rotate-[270deg]")
                    }
                    icon="tabler:chevron-down"
                  />
                </div>
                <h1 className="font-bold">Resident guests calendar</h1>
              </div>
            </div>
            {residentIsOpen && (
              <RoomAvailability
                availability={roomAvailabilities}
                inPartnerHomepage={inPartnerHomepage}
                roomName={room.name}
                roomSlug={room.slug}
                setOpenAddAvailabilityModal={() => {
                  formikAdd.setFieldValue("residency", {
                    value: "Resident",
                    label: "Resident",
                  });
                  setOpenAddAvailabilityModal(true);
                }}
                isNonResident={false}
                setRoomAvailabilities={setRoomAvailabilities}
              ></RoomAvailability>
            )}
          </div>

          <div>
            <div className="flex justify-between shadow-md px-2 py-2 border items-center">
              <div className="flex gap-2 items-center">
                <div
                  onClick={() => setNonResidentIsOpen(!nonResidentIsOpen)}
                  className="w-5 h-5 rounded-md transition-colors duration-300 cursor-pointer hover:bg-gray-300 flex items-center justify-center text-gray-600 text-xs font-bold"
                >
                  <Icon
                    className={
                      "w-4 h-4 transition-all duration-200 " +
                      (nonResidentIsOpen ? " rotate-0" : " rotate-[270deg]")
                    }
                    icon="tabler:chevron-down"
                  />
                </div>
                <h1 className="font-bold">Non-resident guests calendar</h1>
              </div>
            </div>
            {nonResidentIsOpen && (
              <RoomAvailability
                availability={roomAvailabilitiesNonResident}
                roomName={room.name}
                roomSlug={room.slug}
                inPartnerHomepage={inPartnerHomepage}
                setOpenAddAvailabilityModal={() => {
                  if (inPartnerHomepage) {
                    router.push(`/partner/lodges/${staySlug}/actions`);
                  } else {
                    formikAdd.setFieldValue("residency", {
                      value: "Non-resident",
                      label: "Non-resident",
                    });
                    setOpenAddAvailabilityModal(true);
                  }
                }}
                isNonResident={true}
                setRoomAvailabilities={setRoomAvailabilitiesNonResident}
              ></RoomAvailability>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

RoomTypes.propTypes = {};

export default RoomTypes;
