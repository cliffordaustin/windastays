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
import OtherFees from "../../../../../components/Partner/OtherFees";
import SelectInput from "../../../../../components/ui/SelectInput";
import Activity from "../../../../../components/Partner/Activity";
import Dialogue from "../../../../../components/Home/Dialogue";

function AddAvailability({ stay }) {
  const router = useRouter();
  const [createRoomLoading, setCreateRoomLoading] = React.useState(false);

  const packages = [
    { value: "ALL INCLUSIVE", label: "All Inclusive" },
    { value: "GAME PACKAGE", label: "Game Package" },
    { value: "FULL BOARD", label: "Full Board" },
    { value: "HALF BOARD", label: "Half Board" },
    { value: "BED AND BREAKFAST", label: "Bed and Breakfast" },
  ];

  const formikCreate = useFormik({
    initialValues: {
      name: "",
      capacity: "",
      childCapacity: "",
      infantCapacity: "",
      package: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Please enter a name for the room"),
      capacity: Yup.number("Please enter a valid number"),
      childCapacity: Yup.number("Please enter a valid number"),
      infantCapacity: Yup.number("Please enter a valid number"),
      package: Yup.object().required("Please select a package"),
    }),
    onSubmit: (values) => {
      setCreateRoomLoading(true);
      axios
        .post(
          `${process.env.NEXT_PUBLIC_baseURL}/stays/${router.query.slug}/add-room-type/`,
          {
            name: values.name,
            capacity: values.capacity,
            child_capacity: values.childCapacity,
            infant_capacity: values.infantCapacity,
            package: values.package.value,
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

  const [openModal, setOpenModal] = React.useState(false);

  const [activityFees, setActivityFees] = React.useState(
    stay.activity_fees || []
  );

  const [activityLoading, setActivityLoading] = React.useState(false);

  const options = [
    { value: "PER PERSON", label: "Per Person" },
    { value: "PER PERSON PER NIGHT", label: "Per Person Per Night" },
    { value: "WHOLE GROUP", label: "Whole Group" },
  ];

  const formikActivityFees = useFormik({
    initialValues: {
      name: "",
      description: "",
      nonResidentPrice: "",
      residentPrice: "",
      priceType: "PER PERSON",
    },

    validationSchema: Yup.object({
      name: Yup.string("Please enter a valid text of name").required(
        "Name is required"
      ),
      description: Yup.string("Please enter a valid text of description"),
      nonResidentPrice: Yup.number("Please enter a valid number"),
      residentPrice: Yup.number("Please enter a valid number"),
      priceType: Yup.string("Please enter a valid text of price type"),
    }),

    onSubmit: async (values) => {
      setActivityLoading(true);

      await axios
        .post(
          `${process.env.NEXT_PUBLIC_baseURL}/partner-stays/${router.query.slug}/activities/`,
          {
            name: values.name,
            description: values.description,
            price: values.nonResidentPrice,
            resident_price: values.residentPrice,
            price_type: values.priceType,
          },
          {
            headers: {
              Authorization: "Token " + Cookies.get("token"),
            },
          }
        )
        .then((res) => {
          setActivityLoading(false);
          setOpenModal(false);
          setActivityFees((prev) => [...prev, res.data]);
        })
        .catch((err) => {
          setActivityLoading(false);
        });
    },
  });

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
              <button className="gradient-blue flex items-center gap-1 text-white text-sm font-bold mt-2 px-6 py-1.5 rounded-md">
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
                  <h1 className="text-sm font-bold mb-1">
                    Enter a room package
                  </h1>

                  <SelectInput
                    options={packages}
                    selectedOption={formikCreate.values.package}
                    instanceId="package"
                    setSelectedOption={(selected) => {
                      formikCreate.setFieldValue("package", selected);
                    }}
                    className={
                      "!w-full !border !rounded-md !text-sm py-1 pl-1 " +
                      (formikCreate.touched.package &&
                      formikCreate.errors.package
                        ? "border-red-500"
                        : "")
                    }
                    placeholder="Select a package"
                    isSearchable={false}
                  ></SelectInput>

                  {formikCreate.touched.package &&
                  formikCreate.errors.package ? (
                    <span className="text-sm font-bold text-red-400">
                      {formikCreate.errors.package}
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
                    label="Adult capacity"
                  ></Input>
                  {formikCreate.touched.capacity &&
                  formikCreate.errors.capacity ? (
                    <span className="text-sm font-bold text-red-400">
                      {formikCreate.errors.capacity}
                    </span>
                  ) : null}
                </div>

                <div className="flex items-center gap-4">
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
                </div>

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
          <Dialogue
            isOpen={openModal}
            closeModal={() => {
              setOpenModal(false);
            }}
            dialogueTitleClassName="!font-bold !ml-4 !text-xl md:!text-2xl"
            outsideDialogueClass="!p-0"
            dialoguePanelClassName={
              "md:!rounded-md !rounded-none !p-0 !overflow-visible remove-scroll !max-w-2xl screen-height-safari md:!min-h-0 md:!max-h-[650px] "
            }
          >
            <div className="w-full bg-gray-200 px-3 py-2">
              <h1 className="font-semibold font-SourceSans">Add Activity</h1>
            </div>

            <div className="px-2 mb-2 mt-2">
              <div>
                <Input
                  name="name"
                  type="text"
                  value={formikActivityFees.values.name}
                  placeholder="Enter the name of the activity"
                  errorStyle={
                    formikActivityFees.touched.name &&
                    formikActivityFees.errors.name
                      ? true
                      : false
                  }
                  onChange={(e) => {
                    formikActivityFees.handleChange(e);
                  }}
                  className={"w-full placeholder:text-sm "}
                  inputClassName="!text-sm "
                  label="Activity name"
                ></Input>
                {formikActivityFees.touched.name &&
                formikActivityFees.errors.name ? (
                  <span className="text-sm font-bold text-red-400">
                    {formikActivityFees.errors.name}
                  </span>
                ) : null}
              </div>

              <div className="mt-2">
                <Input
                  name="description"
                  type="text"
                  value={formikActivityFees.values.description}
                  placeholder="Enter the description of the activity"
                  errorStyle={
                    formikActivityFees.touched.description &&
                    formikActivityFees.errors.description
                      ? true
                      : false
                  }
                  onChange={(e) => {
                    formikActivityFees.handleChange(e);
                  }}
                  className={"w-full placeholder:text-sm "}
                  inputClassName="!text-sm "
                  label="Activity description"
                ></Input>
                {formikActivityFees.touched.description &&
                formikActivityFees.errors.description ? (
                  <span className="text-sm font-bold text-red-400">
                    {formikActivityFees.errors.description}
                  </span>
                ) : null}
              </div>

              <div className="mt-2 flex flex-col gap-1">
                <h1 className="text-sm font-bold">
                  Select the price type for the activity
                </h1>

                <SelectInput
                  options={options}
                  instanceId="price_type"
                  setSelectedOption={(selected) => {
                    formikActivityFees.setFieldValue(
                      `priceType`,
                      selected.value
                    );
                  }}
                  className={
                    "!w-full !border !rounded-md !text-sm py-1 pl-1 " +
                    (formikActivityFees.touched.priceType &&
                    formikActivityFees.errors.priceType
                      ? "border-red-500"
                      : "")
                  }
                  placeholder="Select a price type"
                  isSearchable={false}
                ></SelectInput>
              </div>

              <div className="mt-2">
                <Input
                  name="nonResidentPrice"
                  type="number"
                  value={formikActivityFees.values.nonResidentPrice}
                  placeholder="Enter the price of this activity."
                  errorStyle={
                    formikActivityFees.touched.nonResidentPrice &&
                    formikActivityFees.errors.nonResidentPrice
                      ? true
                      : false
                  }
                  onChange={(e) => {
                    formikActivityFees.handleChange(e);
                  }}
                  className={"w-full placeholder:text-sm "}
                  inputClassName="!text-sm "
                  label="Activity price($)"
                ></Input>
                {formikActivityFees.touched.nonResidentPrice &&
                formikActivityFees.errors.nonResidentPrice ? (
                  <span className="text-sm font-bold text-red-400">
                    {formikActivityFees.errors.nonResidentPrice}
                  </span>
                ) : null}
              </div>

              <div className="mt-2">
                <Input
                  name="residentPrice"
                  type="number"
                  value={formikActivityFees.values.residentPrice}
                  placeholder="Enter the price of this activity."
                  errorStyle={
                    formikActivityFees.touched.residentPrice &&
                    formikActivityFees.errors.residentPrice
                      ? true
                      : false
                  }
                  onChange={(e) => {
                    formikActivityFees.handleChange(e);
                  }}
                  className={"w-full placeholder:text-sm "}
                  inputClassName="!text-sm "
                  label="Activity price (KES)"
                ></Input>
                {formikActivityFees.touched.residentPrice &&
                formikActivityFees.errors.residentPrice ? (
                  <span className="text-sm font-bold text-red-400">
                    {formikActivityFees.errors.residentPrice}
                  </span>
                ) : null}
              </div>
            </div>

            <div className="flex justify-end mt-4 mb-3 mr-2">
              <button
                onClick={() => {
                  setOpenModal(false);
                }}
                className="bg-gray-200 text-sm font-bold px-6 py-1.5 rounded-md"
              >
                Cancel
              </button>

              <button
                onClick={() => {
                  formikActivityFees.handleSubmit();
                }}
                className="bg-blue-500 flex justify-center items-center gap-2 text-white text-sm font-bold ml-2 px-6 py-1.5 rounded-md"
              >
                Post{" "}
                {activityLoading && (
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
          </Dialogue>
          <div className="flex justify-between items-center">
            <h1 className="text-lg font-black">Activities</h1>

            <button
              onClick={() => {
                setOpenModal(true);
              }}
              className="bg-blue-500 flex justify-center items-center gap-2 text-white text-sm font-bold ml-2 px-2 py-1.5 rounded-md"
            >
              Add an activity
            </button>
          </div>
          {activityFees.map((activity, index) => (
            <Activity
              setActivityFees={setActivityFees}
              key={index}
              activity={activity}
            ></Activity>
          ))}
          {activityFees.length === 0 && (
            <h1 className="font-bold text-gray-600 text-center">
              You have no activities added yet. Click the button above to add.
            </h1>
          )}
          <OtherFees
            nonResidentFees={stay.other_fees_non_resident}
            residentFees={stay.other_fees_resident}
          ></OtherFees>
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
