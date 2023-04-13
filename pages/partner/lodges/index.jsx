import React, { useEffect } from "react";
import PropTypes from "prop-types";
import Link from "next/link";
import Image from "next/image";
import { Icon } from "@iconify/react";
import getToken from "../../../lib/getToken";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useRouter } from "next/router";

import Accommodation from "../../../components/Partner/Accommodation";
import Button from "../../../components/ui/Button";
import LoadingSpinerChase from "../../../components/ui/LoadingSpinerChase";
import Cookies from "js-cookie";
import ClientOnly from "../../../components/ClientOnly";
import RoomTypes from "../../../components/Partner/RoomTypes";
import { DayPicker } from "react-day-picker";
import PopoverBox from "../../../components/ui/Popover";
import moment from "moment";
import Dialogue from "../../../components/Home/Dialogue";
import Dropdown from "../../../components/ui/Dropdown";
import SelectInput from "../../../components/ui/SelectInput";
import Input from "../../../components/ui/Input";

function PartnerLodges({ stays }) {
  const router = useRouter();

  const [loading, setLoading] = React.useState(false);

  const requestListing = async () => {
    const token = Cookies.get("token");
    setLoading(true);
    await axios.post(
      `${process.env.NEXT_PUBLIC_baseURL}/send-request-mail/`,
      {},
      {
        headers: {
          Authorization: "Token " + token,
        },
      }
    );

    Cookies.set("requestListing", "true", { expires: 3 });
    setLoading(false);
    router.reload();
  };

  const [startDate, setStartDate] = React.useState({
    from: router.query.startDate
      ? new Date(router.query.startDate)
      : new Date(),
    to: router.query.endDate
      ? new Date(router.query.endDate)
      : new Date(new Date().setDate(new Date().getDate() + 10)),
  });

  useEffect(() => {
    if (startDate && startDate.from && startDate.to) {
      router.replace(
        {
          query: {
            ...router.query,
            startDate: moment(startDate.from).format("YYYY-MM-DD"),
            endDate: moment(startDate.to).format("YYYY-MM-DD"),
          },
        },
        undefined,
        { shallow: true }
      );
    }
  }, [startDate]);

  const [openGuestModal, setOpenGuestModal] = React.useState(false);
  const [addGuestLoading, setAddGuestLoading] = React.useState(false);

  const formik = useFormik({
    initialValues: {
      startDate: "",
      endDate: "",
      numberOfRooms: "",
      numberOfGuests: "",
      roomType: "",
      fullName: "",
    },
    validationSchema: Yup.object({
      startDate: Yup.date().required("Date is required"),
      endDate: Yup.date().required("Date is required"),
      numberOfRooms: Yup.number().required("Number of rooms is required"),
      numberOfGuests: Yup.number().required("Number of guests is required"),
      roomType: Yup.object().required("Please select a room").nullable(),
      fullName: Yup.string().required("Full name is required"),
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
        const dateData = room.room_availabilities.find((roomDate) => {
          return (
            moment(roomDate.date).format("YYYY-MM-DD") ===
            moment(allDates[date]).format("YYYY-MM-DD")
          );
        });
        if (dateData.num_of_available_rooms < values.numberOfRooms) {
          formik.setFieldError(
            "numberOfRooms",
            dateData.num_of_available_rooms > 0
              ? "Only " +
                  dateData.num_of_available_rooms +
                  " rooms are available" +
                  " on " +
                  moment(allDates[date]).format("MMM Do") +
                  ". Please select another date."
              : "No rooms are available on " +
                  moment(allDates[date]).format("MMM Do") +
                  ". Please select another date."
          );
          setAddGuestLoading(false);

          return;
        }
      }

      for (const date in allDates) {
        setAddGuestLoading(true);
        const dateData = room.room_availabilities.find((roomDate) => {
          return (
            moment(roomDate.date).format("YYYY-MM-DD") ===
            moment(allDates[date]).format("YYYY-MM-DD")
          );
        });

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
            console.log(err.response);
            setAddGuestLoading(false);
          });
      }

      await axios
        .post(
          `${process.env.NEXT_PUBLIC_baseURL}/room-types/${room.slug}/add-booking/`,
          {
            check_in_date: moment(values.startDate).format("YYYY-MM-DD"),
            check_out_date: moment(values.endDate).format("YYYY-MM-DD"),
            num_of_rooms: values.numberOfRooms,
            num_of_guests: values.numberOfGuests,
            full_name: values.fullName,
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

      router.reload();
    },
  });

  const [showGuestStartDate, setShowGuestStartDate] = React.useState(false);
  const [showGuestEndDate, setShowGuestEndDate] = React.useState(false);

  return (
    <div className="relative">
      {stays.length === 0 && (
        <div>
          <ClientOnly>
            {Cookies.get("requestListing") === "true" && (
              <div className="w-full bg-blue-600 py-2 px-4 flex items-center justify-center bg-opacity-30">
                <h1 className="font-bold">
                  Your request has been sent. We will notify you once your
                  listing is available to be managed.
                </h1>
              </div>
            )}
          </ClientOnly>
          <div className="px-3 py-2 w-full h-[70px] border-b flex items-center justify-center">
            <div className="flex gap-4 items-center justify-center">
              <div className="relative w-28 h-9 z-40">
                <Image
                  layout="fill"
                  alt="Logo"
                  src="/images/winda_logo/horizontal-blue-font.png"
                  priority
                ></Image>
              </div>

              <div className="h-[25px] w-[1px] mt-4 z-40 bg-gray-400"></div>

              <h1 className="uppercase font-OpenSans mt-3 text-lg text-gray-700 tracking-widest z-40">
                partner
              </h1>
            </div>
          </div>

          <div className="flex flex-col w-full items-center justify-center mt-12">
            <div className="flex flex-col items-center gap-3">
              <h1 className="text-2xl font-bold font-SourceSans">
                You have no listings added yet
              </h1>

              <ClientOnly>
                {Cookies.get("requestListing") === "true" ? (
                  <div className="!w-fit rounded-lg !py-2 !bg-gray-400 text-white flex gap-2 !cursor-default !px-4 font-bold">
                    Your request has been sent
                    <Icon
                      className="w-6 h-6"
                      icon="material-symbols:check-small"
                    />
                  </div>
                ) : (
                  <Button
                    onClick={() => {
                      requestListing();
                    }}
                    className="!w-fit flex gap-2 !px-4 font-bold btn-gradient"
                  >
                    Request for your lising to be added
                    {loading && (
                      <LoadingSpinerChase
                        width={15}
                        height={15}
                      ></LoadingSpinerChase>
                    )}
                  </Button>
                )}
              </ClientOnly>
            </div>
          </div>
        </div>
      )}
      {stays.length > 0 && (
        <div className="w-full flex">
          <div className="w-[480px] overflow-y-scroll sticky left-0 top-0 h-[100vh] bg-white border-r">
            <div className="px-3 py-2 h-[70px] border-b flex items-center justify-center">
              <div className="flex gap-4 items-center justify-center">
                <div className="relative w-28 h-9 z-40">
                  <Image
                    layout="fill"
                    alt="Logo"
                    src="/images/winda_logo/horizontal-blue-font.png"
                    priority
                  ></Image>
                </div>

                <div className="h-[25px] w-[1px] mt-4 z-40 bg-gray-400"></div>

                <h1 className="uppercase font-OpenSans mt-3 text-lg text-gray-700 tracking-widest z-40">
                  partner
                </h1>
              </div>
            </div>

            <h1 className="pt-4 font-bold ml-3 text-xl font-SourceSans">
              Your Accommodation
            </h1>

            <div className="px-4 mt-5 relative flex flex-col gap-5">
              {stays.map((stay, index) => (
                <Accommodation
                  listing={stay}
                  key={index}
                  index={index}
                ></Accommodation>
              ))}
            </div>

            {/* <div className="absolute bottom-2 left-0 right-0">
              Not here?
            </div> */}
          </div>

          <div className="flex-col flex right-0 top-0 mb-6 w-full">
            {stays.length > 0 &&
              stays[router.query.index ? Number(router.query.index) : 0]
                .room_types.length > 0 && (
                <div className="flex z-20 bg-white sticky top-0 left-0 right-0 border-b items-center px-6 h-[70px] justify-between">
                  <div></div>

                  <PopoverBox
                    panelClassName="bg-white w-[800px] rounded-xl after:!left-[50%] !z-20 shadow-md tooltip mt-2 border w-fit -left-[250px] p-2"
                    btnClassName="!rounded-3xl shadow-md"
                    btnPopover={
                      <div className="w-fit shadow-md px-6 cursor-pointer bg-white flex items-center justify-between gap-6 rounded-3xl border h-[45px]">
                        <Icon
                          className="text-2xl text-blue-600"
                          icon="material-symbols:calendar-month-rounded"
                        />
                        <div className="flex items-center justify-center gap-2">
                          {startDate && (
                            <>
                              <h1 className="font-semibold font-SourceSans">
                                {startDate && startDate.from
                                  ? moment(startDate.from).format("MMM Do")
                                  : ""}
                              </h1>
                              <Icon
                                className="text-3xl"
                                icon="material-symbols:arrow-right-alt-rounded"
                              />

                              <h1 className="font-semibold font-SourceSans">
                                {startDate && startDate.to
                                  ? moment(startDate.to).format("MMM Do")
                                  : ""}
                              </h1>
                            </>
                          )}

                          {!startDate && (
                            <h1 className="font-semibold font-SourceSans">
                              Select two dates
                            </h1>
                          )}
                        </div>
                      </div>
                    }
                  >
                    <DayPicker
                      mode="range"
                      disabled={{ before: new Date() }}
                      selected={startDate}
                      numberOfMonths={2}
                      onSelect={(date) => {
                        setStartDate(date);
                        console.log(date);
                      }}
                    />
                  </PopoverBox>

                  {/* <div
                onClick={() => {
                  setOpenGuestModal(true);
                }}
                className="px-4 py-2 text-sm cursor-pointer font-bold gradient-blue text-white rounded-lg"
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
                  "md:!rounded-md !rounded-none !p-0 overflow-y-scroll remove-scroll !max-w-3xl screen-height-safari md:!min-h-0 md:!max-h-[600px] "
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
                          <div
                            onClick={() => {
                              setShowGuestStartDate(!showGuestStartDate);
                              setShowGuestEndDate(false);
                            }}
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

                          <Dropdown
                            className={
                              "absolute mt-2 left-0 border w-[400px] p-2 after:!left-[20%] tooltip"
                            }
                            showDropdown={showGuestStartDate}
                          >
                            <DayPicker
                              mode="single"
                              disabled={{ before: new Date() }}
                              selected={formik.values.startDate}
                              onSelect={(date) => {
                                formik.setFieldValue("startDate", date);
                                setShowGuestStartDate(false);
                                setShowGuestEndDate(true);
                                formik.setFieldValue("endDate", null);
                              }}
                            />
                          </Dropdown>
                        </div>

                        <div className="w-[47%]">
                          <h1 className="text-sm font-bold">End date</h1>
                          <div
                            onClick={() => {
                              setShowGuestEndDate(!showGuestEndDate);
                              setShowGuestStartDate(false);
                            }}
                            className={
                              "!w-full rounded-md px-2 py-5 flex items-center cursor-pointer justify-between text-sm text-gray-500 h-[35px] border border-gray-300 " +
                              (formik.touched.endDate && formik.errors.endDate
                                ? "border-red-500"
                                : "")
                            }
                          >
                            {!formik.values.endDate && (
                              <h1 className="font-bold text-gray-400">
                                Depature date
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

                          <Dropdown
                            className="absolute mt-2 right-0 border w-[400px] p-2 after:!left-[80%] tooltip"
                            showDropdown={showGuestEndDate}
                          >
                            <DayPicker
                              mode="single"
                              disabled={{ before: new Date() }}
                              selected={formik.values.endDate}
                              onSelect={(date) => {
                                formik.setFieldValue("endDate", date);
                                setShowGuestStartDate(false);
                                setShowGuestEndDate(false);
                              }}
                            />
                          </Dropdown>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1">
                      <h1 className="text-sm font-bold">Room type</h1>
                      <SelectInput
                        options={
                          (stays.length > 0 &&
                            stays[
                              router.query.index
                                ? Number(router.query.index)
                                : 0
                            ].room_types.map((item) => {
                              return {
                                value: item.slug,
                                label: item.name,
                              };
                            })) ||
                          []
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

                    <div>
                      <Input
                        name="fullName"
                        type="text"
                        value={formik.values.fullName}
                        placeholder="Name of guest"
                        errorStyle={
                          formik.touched.fullName && formik.errors.fullName
                            ? true
                            : false
                        }
                        onChange={(e) => {
                          formik.handleChange(e);
                        }}
                        className={"w-full placeholder:text-sm "}
                        inputClassName="!text-sm "
                        label="Add the name of a guest"
                      ></Input>
                      {formik.touched.fullName && formik.errors.fullName ? (
                        <span className="text-sm font-bold text-red-400">
                          {formik.errors.fullName}
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
                          (addGuestLoading
                            ? "cursor-not-allowed opacity-60"
                            : "")
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
              </Dialogue> */}

                  <div></div>
                </div>
              )}
            <div className="px-4 pt-8 flex flex-col gap-6">
              {stays.length > 0 &&
                stays[
                  router.query.index ? Number(router.query.index) : 0
                ].room_types.map((room, index) => (
                  <RoomTypes
                    inPartnerHomepage={true}
                    key={index}
                    room={room}
                    staySlug={
                      stays[router.query.index ? Number(router.query.index) : 0]
                        .slug
                    }
                    index={index}
                  ></RoomTypes>
                ))}

              {stays.length > 0 &&
                stays[router.query.index ? Number(router.query.index) : 0]
                  .room_types.length === 0 && (
                  <div className="h-full flex-col gap-2 px-8">
                    <h1 className="text-2xl font-black font-SourceSans">
                      Welcome to winda calendar
                    </h1>
                    <p className="mt-1 text-gray-500 text-sm">
                      Here are 3 steps to get you started
                    </p>

                    <div className="flex flex-col gap-5 mt-8">
                      <div className="flex items-center gap-2">
                        <div className="w-[46px] h-[46px] rounded-lg flex items-center justify-center bg-red-600 bg-opacity-40">
                          <Icon
                            className="w-8 h-8 text-red-600"
                            icon="fluent:cursor-click-24-filled"
                          />
                        </div>

                        <h1 className="font-bold text-gray-600">
                          Click on the three dots on an accommodation
                        </h1>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="w-[46px] h-[46px] rounded-lg flex items-center justify-center bg-blue-600 bg-opacity-40">
                          <Icon
                            className="w-8 h-8 text-blue-600"
                            icon="material-symbols:add"
                          />
                        </div>

                        <h1 className="font-bold text-gray-600">
                          Choose &apos;add rooms&apos;
                        </h1>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="w-[46px] h-[46px] rounded-lg flex items-center justify-center bg-green-600 bg-opacity-40">
                          <Icon
                            className="w-8 h-8 text-green-600"
                            icon="material-symbols:calendar-add-on"
                          />
                        </div>

                        <h1 className="font-bold text-gray-600">
                          Add availability from the calendar
                        </h1>
                      </div>
                    </div>
                  </div>
                )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

PartnerLodges.propTypes = {};

export async function getServerSideProps(context) {
  try {
    const token = getToken(context);

    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_baseURL}/user/`,
      {
        headers: {
          Authorization: "Token " + token,
        },
      }
    );

    if (response.data[0].is_partner) {
      const stays = await axios.get(
        `${process.env.NEXT_PUBLIC_baseURL}/user-stays-email/`,
        {
          headers: {
            Authorization: "Token " + token,
          },
        }
      );

      return {
        props: {
          userProfile: response.data[0],
          stays: stays.data.results,
        },
      };
    } else {
      return {
        notFound: true,
      };
    }
  } catch (error) {
    if (error.response.status === 401) {
      return {
        redirect: {
          permanent: false,
          destination: `/partner/signup?redirect=/partner/lodges`,
        },
      };
    } else {
      return {
        props: {
          userProfile: "",
          stays: [],
        },
      };
    }
  }
}

export default PartnerLodges;
