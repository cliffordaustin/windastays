import React, { useEffect } from "react";
import PropTypes from "prop-types";
import getToken from "../../../../../lib/getToken";
import axios from "axios";
import { Icon } from "@iconify/react";
import { useRouter } from "next/router";
import RoomTypes from "../../../../../components/Partner/RoomTypes";
import PopoverBox from "../../../../../components/ui/Popover";
import { useFormik } from "formik";
import * as Yup from "yup";
import Input from "../../../../../components/ui/Input";
import { Popover, Transition } from "@headlessui/react";
import LoadingSpinerChase from "../../../../../components/ui/LoadingSpinerChase";
import Cookies from "js-cookie";
import { DayPicker } from "react-day-picker";
import moment from "moment";
import Dropdown from "../../../../../components/ui/Dropdown";

function AddAvailability({ stay }) {
  const router = useRouter();
  const [createRoomLoading, setCreateRoomLoading] = React.useState(false);

  const formikCreate = useFormik({
    initialValues: {
      name: "",
      capacity: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Please enter a name for the room"),
      capacity: Yup.number().required("Please enter a capacity for the room"),
    }),
    onSubmit: (values) => {
      setCreateRoomLoading(true);
      axios
        .post(
          `${process.env.NEXT_PUBLIC_baseURL}/stays/${router.query.slug}/add-room-type/`,
          {
            name: values.name,
            capacity: values.capacity,
          },
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
          setCreateRoomLoading(false);
        });
    },
  });

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

  return (
    <div className="mb-20">
      <div className="flex sticky z-30 bg-white shadow-sm left-0 right-0 top-0 border-b items-center mb-4 px-6 h-[80px] justify-between">
        <div
          onClick={() => {
            router.back();
          }}
          className="flex gap-1 font-bold cursor-pointer items-center text-blue-600"
        >
          <Icon className="w-6 h-6" icon="bx:chevron-left" />
          <span>Back</span>
        </div>

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
        <div></div>
      </div>
      <div className="max-w-[1100px] mt-6 mx-auto px-6 xl:px-0">
        <div className="flex items-center justify-between">
          <h1 className="font-bold font-SourceSans text-2xl truncate">
            <span className="text-gray-600">Add/edit</span>{" "}
            {stay.property_name || stay.name}{" "}
            <span className="text-gray-600">rooms</span>
          </h1>

          <Popover className="relative z-20 ">
            <Popover.Button className="outline-none ">
              <button
                onClick={() => {}}
                className="gradient-blue flex items-center gap-1 text-white text-sm font-bold mt-2 px-6 py-1.5 rounded-md"
              >
                Add a room
                <Icon className="text-xl" icon="material-symbols:add" />
              </button>
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
                  "absolute z-[30] bg-white rounded-xl !right-0 shadow-md mt-2 border w-[500px] px-3 py-3"
                }
              >
                <div>
                  <Input
                    name="name"
                    type="text"
                    value={formikCreate.values.name}
                    placeholder="Enter the name of the room. eg. Standard Room"
                    errorStyle={
                      formikCreate.touched.name && formikCreate.errors.name
                        ? true
                        : false
                    }
                    onChange={(e) => {
                      formikCreate.handleChange(e);
                    }}
                    className={"w-full placeholder:text-sm "}
                    inputClassName="!text-sm "
                    label="Room name"
                  ></Input>
                  {formikCreate.touched.name && formikCreate.errors.name ? (
                    <span className="text-sm font-bold text-red-400">
                      {formikCreate.errors.name}
                    </span>
                  ) : null}
                </div>

                <div className="mt-2">
                  <Input
                    name="capacity"
                    type="number"
                    value={formikCreate.values.capacity}
                    placeholder="Enter the capacity of the room. eg. 2"
                    errorStyle={
                      formikCreate.touched.capacity &&
                      formikCreate.errors.capacity
                        ? true
                        : false
                    }
                    onChange={(e) => {
                      formikCreate.handleChange(e);
                    }}
                    className={"w-full placeholder:text-sm "}
                    inputClassName="!text-sm "
                    label="Room capacity"
                  ></Input>
                  {formikCreate.touched.capacity &&
                  formikCreate.errors.capacity ? (
                    <span className="text-sm font-bold text-red-400">
                      {formikCreate.errors.capacity}
                    </span>
                  ) : null}
                </div>

                {/* <div className="flex items-center gap-4">
                  <div className="mt-2 w-[50%]">
                    <Input
                      name="childCapacity"
                      type="number"
                      value={formikCreate.values.childCapacity}
                      placeholder="Enter the capacity of the room. eg. 2"
                      errorStyle={
                        formikCreate.touched.childCapacity &&
                        formikCreate.errors.childCapacity
                          ? true
                          : false
                      }
                      onChange={(e) => {
                        formikCreate.handleChange(e);
                      }}
                      className={"w-full placeholder:text-sm "}
                      inputClassName="!text-sm "
                      label="Child capacity"
                    ></Input>
                    {formikCreate.touched.childCapacity &&
                    formikCreate.errors.childCapacity ? (
                      <span className="text-sm font-bold text-red-400">
                        {formikCreate.errors.childCapacity}
                      </span>
                    ) : null}
                  </div>

                  <div className="mt-2 w-[50%]">
                    <Input
                      name="infantCapacity"
                      type="number"
                      value={formikCreate.values.infantCapacity}
                      placeholder="Enter the capacity of the room. eg. 2"
                      errorStyle={
                        formikCreate.touched.infantCapacity &&
                        formikCreate.errors.infantCapacity
                          ? true
                          : false
                      }
                      onChange={(e) => {
                        formikCreate.handleChange(e);
                      }}
                      className={"w-full placeholder:text-sm "}
                      inputClassName="!text-sm "
                      label="Infant capacity"
                    ></Input>
                    {formikCreate.touched.infantCapacity &&
                    formikCreate.errors.infantCapacity ? (
                      <span className="text-sm font-bold text-red-400">
                        {formikCreate.errors.infantCapacity}
                      </span>
                    ) : null}
                  </div>
                </div> */}

                <div className="flex justify-end mt-4">
                  <Popover.Button className="bg-gray-200 text-sm font-bold px-6 py-1.5 rounded-md">
                    Cancel
                  </Popover.Button>

                  <button
                    onClick={() => {
                      formikCreate.handleSubmit();
                    }}
                    className="bg-blue-500 flex justify-center items-center gap-2 text-white text-sm font-bold ml-2 px-6 py-1.5 rounded-md"
                  >
                    Post{" "}
                    {createRoomLoading && (
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
              </Popover.Panel>
            </Transition>
          </Popover>
        </div>

        <div className="flex-col flex gap-4 mt-10 mb-6">
          {stay.room_types.length > 0 &&
            stay.room_types.map((room, index) => (
              <RoomTypes key={index} room={room} index={index}></RoomTypes>
            ))}

          {stay.room_types.length === 0 && (
            <div className="absolute flex flex-col items-center gap-2 top-[40%] left-[50%] -translate-x-[50%]">
              <div className="w-[100px] h-[70px] flex items-center justify-center bg-gray-200 rounded-lg">
                <Icon className="w-10 h-10" icon="material-symbols:search" />
              </div>
              <div className="flex flex-col items-center gap-1">
                <h1 className="font-black text-2xl font-SourceSans">
                  You have no room added yet
                </h1>
                <p className="text-gray-600 font-SourceSans">
                  Get started by adding a room
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

AddAvailability.propTypes = {};

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
      const stay = await axios.get(
        `${process.env.NEXT_PUBLIC_baseURL}/user-stays-email/${context.params.slug}`,
        {
          headers: {
            Authorization: "Token " + token,
          },
        }
      );

      return {
        props: {
          userProfile: response.data[0],
          stay: stay.data,
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
          destination: `/partner/signup?redirect=/partner/lodges/${context.params.slug}/actions`,
        },
      };
    } else {
      return {
        props: {
          userProfile: "",
          stay: null,
        },
      };
    }
  }
}

export default AddAvailability;
