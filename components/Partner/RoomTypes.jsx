import React from "react";
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

function RoomTypes({ room, index }) {
  const router = useRouter();

  const [isOpen, setIsOpen] = React.useState(index === 0 ? true : false);

  const [openAddAvailabilityModal, setOpenAddAvailabilityModal] =
    React.useState(false);

  const [openDeleteRoomModal, setOpenDeleteRoomModal] = React.useState(false);

  const [addAvailabilityLoading, setAddAvailabilityLoading] =
    React.useState(false);

  const [deleteRoomLoading, setDeleteRoomLoading] = React.useState(false);

  const [roomAvailabilities, setRoomAvailabilities] = React.useState([
    ...room.room_availabilities,
  ]);

  const formikAdd = useFormik({
    initialValues: {
      number_of_available_rooms: "",
      price: "",
      date: "",
    },
    validationSchema: Yup.object({
      number_of_available_rooms: Yup.number().required(
        "Number of available rooms is required"
      ),
      price: Yup.number().required("Price is required"),
      date: Yup.date().required("Date is required"),
    }),
    onSubmit: (values) => {
      setAddAvailabilityLoading(true);
      axios
        .post(
          `${process.env.NEXT_PUBLIC_baseURL}/room-types/${room.slug}/add-availability/`,
          {
            num_of_available_rooms: values.number_of_available_rooms,
            price: values.price,
            date: moment(values.date).format("YYYY-MM-DD"),
          },
          {
            headers: {
              Authorization:
                "Token " + "ebfae841806f5f312f304a1e44f367b22b37547d",
            },
          }
        )
        .then((res) => {
          setRoomAvailabilities([...roomAvailabilities, res.data]);
          setAddAvailabilityLoading(false);
          setOpenAddAvailabilityModal(false);
        })
        .catch((err) => {
          setAddAvailabilityLoading(false);
        });
    },
  });

  const deleteRoom = () => {
    setOpenDeleteRoomModal(true);
    axios
      .delete(
        `${process.env.NEXT_PUBLIC_baseURL}/stays/${router.query.slug}/room-types/${room.slug}/`,
        {
          headers: {
            Authorization:
              "Token " + "ebfae841806f5f312f304a1e44f367b22b37547d",
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
    <div className="px-4 py-2 bg-gray-100 rounded-md">
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
          <h1 className="font-bold">{room.name}</h1>
          <div className="w-5 h-5 rounded-md bg-gray-300 flex items-center justify-center text-gray-600 text-xs font-bold">
            {room.room_availabilities.length}
          </div>
        </div>

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

        <Dialogue
          isOpen={openAddAvailabilityModal}
          closeModal={() => {
            setOpenAddAvailabilityModal(false);
          }}
          dialogueTitleClassName="!font-bold !ml-4 !text-xl md:!text-2xl"
          outsideDialogueClass="!p-0"
          dialoguePanelClassName={
            "md:!rounded-md !rounded-none !p-0 overflow-y-scroll remove-scroll !max-w-lg screen-height-safari md:!min-h-0 md:max-h-[500px] "
          }
        >
          <div className="px-4 py-2">
            <h1 className="font-bold font-SourceSans text-lg truncate">
              <span className="text-gray-600">Add availability to </span>
              {room.name}
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
                        (formikAdd.touched.date && formikAdd.errors.date
                          ? "border-red-500"
                          : "")
                      }
                    >
                      {!formikAdd.values.date && (
                        <h1 className="font-bold text-gray-400">
                          Availability date
                        </h1>
                      )}
                      {formikAdd.values.date && (
                        <h1>
                          {moment(formikAdd.values.date).format("MMM Do YYYY")}
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
                    selected={formikAdd.values.date}
                    onSelect={(date) => {
                      formikAdd.setFieldValue("date", date);
                    }}
                  />
                </PopoverBox>

                {formikAdd.touched.date && formikAdd.errors.date ? (
                  <span className="text-sm font-bold text-red-400">
                    {formikAdd.errors.date}
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

              <div>
                <Input
                  name="price"
                  type="number"
                  value={formikAdd.values.price}
                  placeholder="Price on selected date"
                  errorStyle={
                    formikAdd.touched.price && formikAdd.errors.price
                      ? true
                      : false
                  }
                  onChange={(e) => {
                    formikAdd.handleChange(e);
                  }}
                  className={"w-full placeholder:text-sm "}
                  inputClassName="!text-sm "
                  label="Add the price of the room on the selected date"
                ></Input>
                {formikAdd.touched.price && formikAdd.errors.price ? (
                  <span className="text-sm font-bold text-red-400">
                    {formikAdd.errors.price}
                  </span>
                ) : null}
              </div>
            </div>

            <div className="flex items-center gap-4 mt-6">
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
        <div className="w-full mt-2 bg-white">
          <RoomAvailability
            availability={roomAvailabilities}
            roomName={room.name}
            roomSlug={room.slug}
            setOpenAddAvailabilityModal={setOpenAddAvailabilityModal}
            setRoomAvailabilities={setRoomAvailabilities}
          ></RoomAvailability>
        </div>
      )}
    </div>
  );
}

RoomTypes.propTypes = {};

export default RoomTypes;
