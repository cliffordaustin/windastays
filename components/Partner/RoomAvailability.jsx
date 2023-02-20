import React from "react";
import PropTypes from "prop-types";
import moment from "moment";
import Table from "./SecondTable";
import { createGlobalStyle } from "styled-components";
import { useFormik } from "formik";
import * as Yup from "yup";
import Dialogue from "../Home/Dialogue";
import Input from "../ui/Input";
import PopoverBox from "../ui/Popover";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { Icon } from "@iconify/react";
import axios from "axios";
import LoadingSpinerChase from "../ui/LoadingSpinerChase";
import Cookies from "js-cookie";
import SelectInput from "../ui/SelectInput";

function RoomAvailability({
  availability,
  roomName,
  roomSlug,
  setOpenAddAvailabilityModal,
  setRoomAvailabilities,
  isNonResident,
  inPartnerHomepage,
}) {
  const roomAvailability = React.useMemo(() => availability, [availability]);

  const [deleteAvailabilityLoading, setDeleteAvailabilityLoading] =
    React.useState(false);

  const [editAvailabilityLoading, setEditAvailabilityLoading] =
    React.useState(false);

  const [openEditAvailabilityModal, setOpenEditAvailabilityModal] =
    React.useState(false);

  const guestOptions = [
    { value: "ADULT SINGLE", label: "Adult single" },
    { value: "ADULT DOUBLE", label: "Adult double" },
    { value: "ADULT TRIPLE", label: "Adult triple" },
    { value: "CHILD SINGLE", label: "Child single" },
    { value: "CHILD DOUBLE", label: "Child double" },
    { value: "CHILD TRIPLE", label: "Child triple" },
    { value: "INFANT", label: "Infant" },
  ];

  const otherFees = [
    { value: "PARK FEES", label: "Park fees" },
    { value: "CONSERVANCY/BEDNIGHT FEES", label: "Conservancy/bednight fees" },
    { value: "CONTRIBUTION", label: "Contribution" },
  ];

  const formikEdit = useFormik({
    initialValues: {
      number_of_available_rooms: "",
      date: "",
      guestTypes: [
        {
          name: "",
          age_group: "",
          price: "",
        },
      ],
      otherFees: [
        {
          name: "",
          price: "",
        },
      ],
      rowSlug: "",
      id: "",
    },
    validationSchema: Yup.object({
      number_of_available_rooms: Yup.number().required(
        "Number of available rooms is required"
      ),
      date: Yup.date().required("Date is required"),
      guestTypes: Yup.array().of(
        Yup.object().shape({
          name: Yup.string().required("Guest type is required"),
          price: Yup.number().required("Price is required"),
          age_group: Yup.string()
            .required("Age group is required")
            .max(100, "Age group must be less than 100 characters"),
        })
      ),
      otherFees: Yup.array().of(
        Yup.object().shape({
          name: Yup.string().required("Fee name is required"),
          price: Yup.number().required("Price is required"),
        })
      ),
    }),
    onSubmit: async (values) => {
      setEditAvailabilityLoading(true);

      if (isNonResident) {
        const data = [
          {
            id: values.id,
            date: values.date,
            num_of_available_rooms: values.number_of_available_rooms,
            room_non_resident_guest_availabilities: values.guestTypes,
            non_resident_other_fees: values.otherFees,
          },
        ];
        await axios
          .patch(
            `${process.env.NEXT_PUBLIC_baseURL}/room-types/${roomSlug}/nonresident-availabilities/`,
            data,
            {
              headers: {
                Authorization: "Token " + Cookies.get("token"),
              },
            }
          )
          .then((res) => {
            setRoomAvailabilities(
              roomAvailability.map((item) => {
                if (item.id === values.id) {
                  return {
                    ...item,
                    date: values.date,
                    num_of_available_rooms: values.number_of_available_rooms,
                    room_non_resident_guest_availabilities: values.guestTypes,
                  };
                }
                return item;
              })
            );
            setEditAvailabilityLoading(false);
            setOpenEditAvailabilityModal(false);
          })
          .catch((err) => {
            setEditAvailabilityLoading(false);
          });
      } else {
        const data = [
          {
            id: values.id,
            date: values.date,
            num_of_available_rooms: values.number_of_available_rooms,
            room_resident_guest_availabilities: values.guestTypes,
            resident_other_fees: values.otherFees,
          },
        ];
        await axios
          .patch(
            `${process.env.NEXT_PUBLIC_baseURL}/room-types/${roomSlug}/resident-availabilities/`,
            data,
            {
              headers: {
                Authorization: "Token " + Cookies.get("token"),
              },
            }
          )
          .then((res) => {
            setRoomAvailabilities(
              roomAvailability.map((item) => {
                if (item.id === values.id) {
                  return {
                    ...item,
                    date: values.date,
                    num_of_available_rooms: values.number_of_available_rooms,
                    room_resident_guest_availabilities: values.guestTypes,
                  };
                }
                return item;
              })
            );
            setEditAvailabilityLoading(false);
            setOpenEditAvailabilityModal(false);
          })
          .catch((err) => {
            setEditAvailabilityLoading(false);
          });
      }
    },
  });

  const guestTypes = [];

  roomAvailability.forEach((item) => {
    if (isNonResident) {
      item.room_non_resident_guest_availabilities.map((item) => {
        if (!guestTypes.includes(item.name)) {
          guestTypes.push(item.name);
        }
      });
    } else {
      item.room_resident_guest_availabilities.map((item) => {
        if (!guestTypes.includes(item.name)) {
          guestTypes.push(item.name);
        }
      });
    }
  });

  const columns = React.useMemo(
    () => [
      {
        Header: "#",
        Cell: (row) => {
          return row.row.index + 1;
        },
      },
      {
        Header: "Date",
        accessor: "date",
        Cell: (row) => {
          return (
            <h1 className="font-bold">
              {moment(row.row.original.date).format("MMM Do")}
            </h1>
          );
        },
      },
      {
        Header: "Available Rooms",
        accessor: "num_of_available_rooms",
        Cell: (row) => {
          return row.row.original.num_of_available_rooms;
        },
      },
      {
        Header: "Pricing",
        columns: [
          ...guestTypes.map((item) => {
            return {
              Header: item,
              Cell: (row) => {
                const guestType = isNonResident
                  ? row.row.original.room_non_resident_guest_availabilities.find(
                      (item) => item.name == row.column.Header
                    )
                  : row.row.original.room_resident_guest_availabilities.find(
                      (item) => item.name == row.column.Header
                    );

                return (
                  <div className="flex items-center gap-2">
                    <h1 className="font-bold">
                      {guestType ? "$" + guestType.price : "N/A"}
                    </h1>
                    {guestType && <h1 className="text-gray-500">/ night</h1>}
                  </div>
                );
              },
            };
          }),
        ],
      },
      {
        Header: "Actions",
        Cell: (row) => {
          return (
            <div className="flex gap-2">
              <button
                onClick={() => {
                  editAvailability(row.row.original);
                }}
                className="bg-blue-500 text-white px-2 py-1 rounded-md"
              >
                Edit
              </button>
              <button
                onClick={() => {
                  deleteAvailability(row.row.original);
                }}
                className="bg-red-500 flex items-center justify-center gap-1 text-white px-2 py-1 rounded-md"
              >
                Delete{" "}
                {deleteAvailabilityLoading && (
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
          );
        },
      },
    ],
    [roomAvailability]
  );

  const homeColumns = React.useMemo(
    () => [
      {
        Header: "#",
        Cell: (row) => {
          return row.row.index + 1;
        },
      },
      {
        Header: "Date",
        accessor: "date",
        Cell: (row) => {
          return (
            <h1 className="font-bold">
              {moment(row.row.original.date).format("MMM Do")}
            </h1>
          );
        },
      },
      {
        Header: "Available Rooms",
        accessor: "num_of_available_rooms",
        Cell: (row) => {
          return row.row.original.num_of_available_rooms;
        },
      },
      {
        Header: "Pricing",
        columns: [
          ...guestTypes.map((item) => {
            return {
              Header: item,
              Cell: (row) => {
                const guestType = isNonResident
                  ? row.row.original.room_non_resident_guest_availabilities.find(
                      (item) => item.name == row.column.Header
                    )
                  : row.row.original.room_resident_guest_availabilities.find(
                      (item) => item.name == row.column.Header
                    );

                return (
                  <div className="flex items-center gap-2">
                    <h1 className="font-bold">
                      {guestType ? "$" + guestType.price : "N/A"}
                    </h1>
                    {guestType && <h1 className="text-gray-500">/ night</h1>}
                  </div>
                );
              },
            };
          }),
        ],
      },
    ],
    [roomAvailability]
  );

  const editAvailability = (row) => {
    formikEdit.setFieldValue(
      "number_of_available_rooms",
      row.num_of_available_rooms
    );
    formikEdit.setFieldValue("date", row.date);
    formikEdit.setFieldValue(
      "guestTypes",
      isNonResident
        ? row.room_non_resident_guest_availabilities
        : row.room_resident_guest_availabilities
    );
    formikEdit.setFieldValue(
      "otherFees",
      isNonResident ? row.non_resident_other_fees : row.resident_other_fees
    );
    formikEdit.setFieldValue("id", row.id);
    formikEdit.setFieldValue("rowSlug", row.slug);
    setOpenEditAvailabilityModal(true);
  };

  const deleteAvailability = (row) => {
    if (isNonResident) {
      axios
        .delete(
          `${process.env.NEXT_PUBLIC_baseURL}/room-types/${roomSlug}/nonresident-availabilities/${row.slug}/`,
          {
            headers: {
              Authorization: "Token " + Cookies.get("token"),
            },
          }
        )
        .then((res) => {
          setRoomAvailabilities(
            roomAvailability.filter((item) => item.slug !== row.slug)
          );
        })
        .catch((err) => {});
    } else {
      axios
        .delete(
          `${process.env.NEXT_PUBLIC_baseURL}/room-types/${roomSlug}/resident-availabilities/${row.slug}/`,
          {
            headers: {
              Authorization: "Token " + Cookies.get("token"),
            },
          }
        )
        .then((res) => {
          setRoomAvailabilities(
            roomAvailability.filter((item) => item.slug !== row.slug)
          );
        })
        .catch((err) => {});
    }
  };

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

  return (
    <div className="w-full">
      <GlobalStyle></GlobalStyle>
      {roomAvailability.length > 0 && (
        <Table
          columns={inPartnerHomepage ? homeColumns : columns}
          data={roomAvailability}
        ></Table>
      )}

      {roomAvailability.length === 0 && (
        <div className="flex flex-col p-6 items-center justify-center h-full">
          <h1 className="text-base font-bold">
            No Availability added yet for the filter
          </h1>
          <button
            onClick={() => {
              setOpenAddAvailabilityModal();
            }}
            className="bg-blue-500 text-white mt-2 px-6 py-0.5 rounded-md"
          >
            Add
          </button>
        </div>
      )}

      <Dialogue
        isOpen={openEditAvailabilityModal}
        closeModal={() => {
          setOpenEditAvailabilityModal(false);
        }}
        dialogueTitleClassName="!font-bold !ml-4 !text-xl md:!text-2xl"
        outsideDialogueClass="!p-0"
        dialoguePanelClassName={
          "md:!rounded-md !rounded-none !p-0 overflow-y-scroll remove-scroll !max-w-4xl screen-height-safari md:!min-h-0 md:!max-h-[650px] "
        }
      >
        <div className="px-4 py-2">
          <h1 className="font-bold font-SourceSans text-lg truncate">
            <span className="text-gray-600">Add availability to </span>
            {roomName}
          </h1>

          <div className="mt-4 flex gap-3 flex-col">
            <div className="flex flex-col gap-1">
              <h1 className="text-sm font-bold">
                What date is the room available?
              </h1>
              <PopoverBox
                panelClassName="bg-white rounded-xl shadow-md mt-2 border w-[400px] p-2"
                btnClassName="w-full"
                btnPopover={
                  <div
                    className={
                      "!w-full rounded-md px-2 py-5 flex items-center cursor-pointer justify-between text-sm text-gray-500 h-[35px] border border-gray-300 " +
                      (formikEdit.touched.date && formikEdit.errors.date
                        ? "border-red-500"
                        : "")
                    }
                  >
                    {!formikEdit.values.date && (
                      <h1 className="font-bold text-gray-400">
                        Availability date
                      </h1>
                    )}
                    {formikEdit.values.date && (
                      <h1>
                        {moment(formikEdit.values.date).format("MMM Do YYYY")}
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
                  selected={formikEdit.values.date}
                  onSelect={(date) => {
                    formikEdit.setFieldValue("date", date);
                  }}
                />
              </PopoverBox>

              {formikEdit.touched.date && formikEdit.errors.date ? (
                <span className="text-sm font-bold text-red-400">
                  {formikEdit.errors.date}
                </span>
              ) : null}
            </div>

            <div>
              <Input
                name="number_of_available_rooms"
                type="number"
                value={formikEdit.values.number_of_available_rooms}
                placeholder="Number of available rooms"
                errorStyle={
                  formikEdit.touched.number_of_available_rooms &&
                  formikEdit.errors.number_of_available_rooms
                    ? true
                    : false
                }
                onChange={(e) => {
                  formikEdit.handleChange(e);
                }}
                className={"w-full placeholder:text-sm "}
                inputClassName="!text-sm "
                label="Add the number of rooms that is available on the selected date"
              ></Input>
              {formikEdit.touched.number_of_available_rooms &&
              formikEdit.errors.number_of_available_rooms ? (
                <span className="text-sm font-bold text-red-400">
                  {formikEdit.errors.number_of_available_rooms}
                </span>
              ) : null}
            </div>

            <div className="flex flex-col gap-2 mt-3">
              {/* {formikEdit.values.guestTypes.map((guest, index) => {
                return (
                  <div key={index} className="flex justify-between">
                    <div className="w-[47%] flex flex-col gap-1">
                      <Input
                        name="name"
                        type="text"
                        value={guest.name}
                        placeholder="Type of guest"
                        errorStyle={
                          formikEdit.touched.guestTypes &&
                          formikEdit.errors.guestTypes
                            ? true
                            : false
                        }
                        onChange={(e) => {
                          formikEdit.setFieldValue(
                            `guestTypes[${index}].name`,
                            e.target.value
                          );
                        }}
                        className={"w-full placeholder:text-sm "}
                        inputClassName="!text-sm "
                        label="Add the type of guest. eg 'Adult single'"
                      ></Input>

                      {formikEdit.touched.guestTypes &&
                      formikEdit.errors.guestTypes ? (
                        <span className="text-sm font-bold text-red-400">
                          {formikEdit.errors.guestTypes[index].name}
                        </span>
                      ) : null}
                    </div>

                    <div className="w-[47%] gap-2 flex items-center">
                      <Input
                        name="price"
                        type="number"
                        value={guest.price}
                        placeholder="Price"
                        errorStyle={
                          formikEdit.touched.guestTypes &&
                          formikEdit.errors.guestTypes
                            ? true
                            : false
                        }
                        onChange={(e) => {
                          formikEdit.setFieldValue(
                            `guestTypes[${index}].price`,
                            e.target.value
                          );
                        }}
                        className={"w-full placeholder:text-sm "}
                        inputClassName="!text-sm "
                        label="Add the agent price of the guest type"
                      ></Input>

                      {formikEdit.touched.guestTypes &&
                      formikEdit.errors.guestTypes ? (
                        <span className="text-sm font-bold text-red-400">
                          {formikEdit.errors.guestTypes[index].price}
                        </span>
                      ) : null}
                    </div>
                  </div>
                );
              })} */}

              {formikEdit.values.guestTypes.map((guest, index) => {
                return (
                  <div key={index} className="flex justify-between">
                    <div className="w-[31%] flex flex-col gap-1.5">
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
                          formikEdit.setFieldValue(
                            `guestTypes[${index}].name`,
                            selected.value
                          );
                        }}
                        className={
                          "!w-full !border !rounded-md !text-sm py-1 pl-1 " +
                          (formikEdit.touched.guestTypes &&
                          formikEdit.errors.guestTypes
                            ? "border-red-500"
                            : "")
                        }
                        placeholder="Select a type of guest"
                        isSearchable={false}
                      ></SelectInput>

                      {formikEdit.touched.guestTypes &&
                      formikEdit.errors.guestTypes ? (
                        <span className="text-sm font-bold text-red-400">
                          {formikEdit.errors.guestTypes[index].name}
                        </span>
                      ) : null}
                    </div>

                    <div className="w-[31%] flex flex-col gap-1.5">
                      <Input
                        name="age_group"
                        type="text"
                        value={guest.age_group}
                        placeholder="Enter age group."
                        errorStyle={
                          formikEdit.touched.age_group &&
                          formikEdit.errors.age_group
                            ? true
                            : false
                        }
                        onChange={(e) => {
                          formikEdit.setFieldValue(
                            `guestTypes[${index}].age_group`,
                            e.target.value
                          );
                        }}
                        className={"w-full placeholder:text-sm "}
                        inputClassName="!text-sm "
                        label="Age group. eg '12-18 years', '18+ years'"
                      ></Input>
                      {formikEdit.touched.age_group &&
                      formikEdit.errors.age_group ? (
                        <span className="text-sm font-bold text-red-400">
                          {formikEdit.errors.guestTypes[index].age_group}
                        </span>
                      ) : null}
                    </div>

                    <div className="w-[31%] gap-2 flex items-center">
                      <div className={index > 0 ? "w-[94%]" : "w-[99%]"}>
                        <Input
                          name="price"
                          type="number"
                          value={guest.price}
                          placeholder="Price"
                          errorStyle={
                            formikEdit.touched.guestTypes &&
                            formikEdit.errors.guestTypes
                              ? true
                              : false
                          }
                          onChange={(e) => {
                            formikEdit.setFieldValue(
                              `guestTypes[${index}].price`,
                              e.target.value
                            );
                          }}
                          className={"w-full placeholder:text-sm "}
                          inputClassName="!text-sm "
                          label="Add the agent price of the guest type"
                        ></Input>

                        {formikEdit.touched.guestTypes &&
                        formikEdit.errors.guestTypes ? (
                          <span className="text-sm font-bold text-red-400">
                            {formikEdit.errors.guestTypes[index].price}
                          </span>
                        ) : null}
                      </div>

                      {index > 0 && (
                        <div
                          onClick={() => {
                            formikEdit.setFieldValue(
                              "guestTypes",
                              formikEdit.values.guestTypes.filter(
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
                  formikEdit.setFieldValue("guestTypes", [
                    ...formikEdit.values.guestTypes,
                    { name: "", price: "" },
                  ]);
                }}
                className="font-bold w-fit text-sm text-blue-500 cursor-pointer"
              >
                Add more
              </div>
            </div>

            <div className="flex flex-col gap-2 mt-3">
              {formikEdit.values.otherFees.map((fee, index) => {
                return (
                  <div
                    key={index}
                    className="flex justify-between items-center"
                  >
                    <div className="w-[47%] flex flex-col gap-1.5">
                      <Input
                        name="name"
                        type="text"
                        value={fee.name}
                        placeholder="Enter name of fee"
                        errorStyle={
                          formikEdit.touched.otherFees &&
                          formikEdit.errors.otherFees
                            ? true
                            : false
                        }
                        onChange={(e) => {
                          formikEdit.setFieldValue(
                            `otherFees[${index}].name`,
                            e.target.value
                          );
                        }}
                        className={"w-full placeholder:text-sm "}
                        inputClassName="!text-sm "
                        label="Add the type of fee"
                      ></Input>
                      {formikEdit.touched.otherFees &&
                      formikEdit.errors.otherFees ? (
                        <span className="text-sm font-bold text-red-400">
                          {formikEdit.errors.otherFees[index].name}
                        </span>
                      ) : null}
                    </div>

                    <div className="w-[47%] gap-2 flex items-center">
                      <div className={index > 0 ? "w-[94%]" : "w-[99%]"}>
                        <Input
                          name="price"
                          type="number"
                          value={fee.price}
                          placeholder="Price"
                          errorStyle={
                            formikEdit.touched.otherFees &&
                            formikEdit.errors.otherFees
                              ? true
                              : false
                          }
                          onChange={(e) => {
                            formikEdit.setFieldValue(
                              `otherFees[${index}].price`,
                              e.target.value
                            );
                          }}
                          className={"w-full placeholder:text-sm "}
                          inputClassName="!text-sm "
                          label="Add the price of the fee"
                        ></Input>

                        {formikEdit.touched.otherFees &&
                        formikEdit.errors.otherFees ? (
                          <span className="text-sm font-bold text-red-400">
                            {formikEdit.errors.otherFees[index].price}
                          </span>
                        ) : null}
                      </div>

                      {index > 0 && (
                        <div
                          onClick={() => {
                            formikEdit.setFieldValue(
                              "otherFees",
                              formikEdit.values.otherFees.filter(
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
                  formikEdit.setFieldValue(
                    "otherFees",
                    formikEdit.values.otherFees.concat({
                      name: "",
                      price: "",
                    })
                  );
                }}
                className="font-bold w-fit text-sm text-blue-500 cursor-pointer"
              >
                Add more
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 mt-6">
            <button
              onClick={() => {
                setOpenEditAvailabilityModal(false);
              }}
              className="bg-gray-200 w-[40%] text-sm font-bold px-6 py-2 rounded-md"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                formikEdit.handleSubmit();
              }}
              className="bg-blue-500 w-[60%] flex items-center justify-center gap-1 text-white font-bold px-2 py-1.5 rounded-md"
            >
              Update{" "}
              {editAvailabilityLoading && (
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
  );
}

RoomAvailability.propTypes = {};

export default RoomAvailability;
