import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useFormik } from "formik";
import * as Yup from "yup";
import Input from "../ui/Input";
import Price from "../Stay/Price";
import { Popover, Transition } from "@headlessui/react";
import axios from "axios";
import LoadingSpinerChase from "../ui/LoadingSpinerChase";
import { Icon } from "@iconify/react";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import SelectInput from "../ui/SelectInput";
import Dialogue from "../Home/Dialogue";
import ResidentOtherFee from "./ResidentOtherFee";
import NonResidentOtherFee from "./NonResidentOtherFee";

function OtherFees({ residentFees, nonResidentFees }) {
  const router = useRouter();
  const [nonResidentFeesLoading, setNonResidentFeesLoading] =
    React.useState(false);

  const [residentFeesLoading, setResidentFeesLoading] = React.useState(false);

  const feeOptions = [
    { value: "PER PERSON", label: "Per person" },
    { value: "PER PERSON PER NIGHT", label: "Per person per night" },
    { value: "WHOLE GROUP", label: "Whole group" },
  ];

  const guestTypes = [
    { value: "ADULT", label: "Adult" },
    { value: "CHILD", label: "Child" },
  ];

  const [residentOpenModal, setResidentOpenModal] = useState(false);

  const [nonResidentOpenModal, setNonResidentOpenModal] = useState(false);

  const formikNonResidentFees = useFormik({
    initialValues: {
      name: "",
      adultPrice: "",
      childPrice: "",
      teenPrice: "",
      nonResidentAdultPrice: "",
      nonResidentChildPrice: "",
      nonResidentTeenPrice: "",
      fees: [],
      fee_option: { value: "PER PERSON", label: "Per person" },
      guest_type: { value: "ADULT", label: "Adult" },
      is_park_fee: false,
    },

    validationSchema: Yup.object({
      rooms: Yup.array().of(
        Yup.object().shape({
          name: Yup.string("Please enter a valid text of name"),
          price: Yup.number("Please enter a valid number of price"),
        })
      ),
      name: Yup.string("Please enter a valid text of name").required(
        "Name is required"
      ),
      adultPrice: Yup.number("Please enter a valid number of price").required(
        "Price is required"
      ),
      childPrice: Yup.number("Please enter a valid number of price").required(
        "Price is required"
      ),
      teenPrice: Yup.number("Please enter a valid number of price").required(
        "Price is required"
      ),
      nonResidentAdultPrice: Yup.number(
        "Please enter a valid number of price"
      ).required("Price is required"),
      nonResidentChildPrice: Yup.number(
        "Please enter a valid number of price"
      ).required("Price is required"),
      nonResidentTeenPrice: Yup.number(
        "Please enter a valid number of price"
      ).required("Price is required"),
      fee_option: Yup.object().required("Fee option is required"),
      guest_type: Yup.object().required("Guest type is required"),
      is_park_fee: Yup.boolean(),
    }),

    onSubmit: async (values) => {
      setNonResidentFeesLoading(true);
      await axios.post(
        `${process.env.NEXT_PUBLIC_baseURL}/stays/${router.query.slug}/nonresident-other-fees/`,
        {
          name: values.name,
          adult_price: values.nonResidentAdultPrice,
          child_price: values.nonResidentChildPrice,
          teen_price: values.nonResidentTeenPrice,
        },
        {
          headers: {
            Authorization: "Token " + Cookies.get("token"),
          },
        }
      );

      await axios.post(
        `${process.env.NEXT_PUBLIC_baseURL}/stays/${router.query.slug}/resident-other-fees/`,
        {
          name: values.name,
          adult_price: values.adultPrice,
          child_price: values.childPrice,
          teen_price: values.teenPrice,
        },
        {
          headers: {
            Authorization: "Token " + Cookies.get("token"),
          },
        }
      );

      formikNonResidentFees.setFieldValue("fees", [
        ...values.fees,
        {
          id: res.data.id,
          name: values.name,
          adultPrice: values.nonResidentAdultPrice,
          childPrice: values.nonResidentChildPrice,
          teenPrice: values.nonResidentTeenPrice,
        },
      ]);

      formikResidentFees.setFieldValue("fees", [
        ...values.fees,
        {
          id: res.data.id,
          name: values.name,
          adultPrice: values.adultPrice,
          childPrice: values.childPrice,
          teenPrice: values.teenPrice,
        },
      ]);

      setNonResidentFeesLoading(false);
      setNonResidentOpenModal(false);
    },
  });

  const formikResidentFees = useFormik({
    initialValues: {
      name: "",
      adultPrice: "",
      childPrice: "",
      teenPrice: "",
      fees: [],
      is_park_fee: false,
      fee_option: { value: "PER PERSON", label: "Per person" },
      guest_type: { value: "ADULT", label: "Adult" },
    },

    validationSchema: Yup.object({
      rooms: Yup.array().of(
        Yup.object().shape({
          name: Yup.string("Please enter a valid text of name"),
          price: Yup.number("Please enter a valid number of price"),
        })
      ),
      name: Yup.string("Please enter a valid text of name").required(
        "Name is required"
      ),
      adultPrice: Yup.number("Please enter a valid number of price").required(
        "Price is required"
      ),
      childPrice: Yup.number("Please enter a valid number of price").required(
        "Price is required"
      ),
      teenPrice: Yup.number("Please enter a valid number of price").required(
        "Price is required"
      ),
      fee_option: Yup.object().required("Fee option is required"),
      guest_type: Yup.object().required("Guest type is required"),
      is_park_fee: Yup.boolean(),
    }),

    onSubmit: async (values) => {
      setResidentFeesLoading(true);
      await axios
        .post(
          `${process.env.NEXT_PUBLIC_baseURL}/stays/${router.query.slug}/resident-other-fees/`,
          {
            name: values.name,
            adult_price: values.adultPrice,
            child_price: values.childPrice,
            teen_price: values.teenPrice,
          },
          {
            headers: {
              Authorization: "Token " + Cookies.get("token"),
            },
          }
        )
        .then((res) => {
          formikResidentFees.setFieldValue("fees", [
            ...values.fees,
            {
              id: res.data.id,
              name: values.name,
              adultPrice: values.adultPrice,
              childPrice: values.childPrice,
              teenPrice: values.teenPrice,
            },
          ]);
          setResidentFeesLoading(false);
          setResidentOpenModal(false);
        })
        .catch((err) => {
          setResidentFeesLoading(false);
        });
    },
  });

  useEffect(() => {
    if (residentFees.length > 0) {
      formikResidentFees.setFieldValue(
        "fees",
        residentFees.map((fee) => {
          return {
            id: fee.id,
            name: fee.name,
            adultPrice: fee.adult_price,
            childPrice: fee.child_price,
            teenPrice: fee.teen_price,
          };
        })
      );
    }

    if (nonResidentFees.length > 0) {
      formikNonResidentFees.setFieldValue(
        "fees",
        nonResidentFees.map((fee) => {
          return {
            id: fee.id,
            name: fee.name,
            adultPrice: fee.adult_price,
            childPrice: fee.child_price,
            teenPrice: fee.teen_price,
          };
        })
      );
    }
  }, []);

  return (
    <div className="mt-5 ">
      <div className="flex flex-col mt-5">
        <h1 className="font-bold font-SourceSans text-lg">
          Park/Conservancy fees(Non-resident)
        </h1>

        <div className="flex mt-2 flex-wrap gap-3 px-4">
          {formikNonResidentFees.values.fees.map((fee, index) => {
            return (
              <div key={index}>
                {fee.name &&
                  !!(fee.adultPrice || fee.childPrice || fee.teenPrice) && (
                    <NonResidentOtherFee
                      fee={fee}
                      formikNonResidentFees={formikNonResidentFees}
                    ></NonResidentOtherFee>
                  )}
              </div>
            );
          })}

          <div className="bg-blue-600 w-[150px] bg-opacity-30 px-1 py-2 border-2 border-blue-600 border-dashed rounded-lg flex gap-2 flex-col items-center justify-center">
            <h1 className="font-SourceSans text-sm font-bold text-center">
              Add your fee
            </h1>

            <Dialogue
              isOpen={nonResidentOpenModal}
              closeModal={() => {
                setNonResidentOpenModal(false);
              }}
              dialogueTitleClassName="!font-bold !ml-4 !text-xl md:!text-2xl"
              outsideDialogueClass="!p-0"
              dialoguePanelClassName={
                "md:!rounded-md !rounded-none !p-0 !overflow-scroll remove-scroll !max-w-2xl screen-height-safari md:!min-h-0 md:!max-h-[500px] "
              }
            >
              <div className="w-full bg-gray-200 px-3 py-2">
                <h1 className="font-semibold font-SourceSans">Add your fee</h1>
              </div>

              <div className="px-2 mb-2 mt-2">
                <div>
                  <Input
                    name="name"
                    type="text"
                    value={formikNonResidentFees.values.name}
                    placeholder="Enter the name of the fee. eg. Park fees"
                    errorStyle={
                      formikNonResidentFees.touched.name &&
                      formikNonResidentFees.errors.name
                        ? true
                        : false
                    }
                    onChange={(e) => {
                      formikNonResidentFees.handleChange(e);
                    }}
                    className={"w-full placeholder:text-sm "}
                    inputClassName="!text-sm "
                    label="Fee name"
                  ></Input>
                  {formikNonResidentFees.touched.name &&
                  formikNonResidentFees.errors.name ? (
                    <span className="text-sm font-bold text-red-400">
                      {formikNonResidentFees.errors.name}
                    </span>
                  ) : null}
                </div>

                <div className="mt-2">
                  <Input
                    name="adultPrice"
                    type="number"
                    value={formikNonResidentFees.values.adultPrice}
                    placeholder="Enter the price of the fee."
                    errorStyle={
                      formikNonResidentFees.touched.adultPrice &&
                      formikNonResidentFees.errors.adultPrice
                        ? true
                        : false
                    }
                    onChange={(e) => {
                      formikNonResidentFees.handleChange(e);
                    }}
                    className={"w-full placeholder:text-sm "}
                    inputClassName="!text-sm "
                    label="Resident Adult fee price (KES)"
                  ></Input>
                  {formikNonResidentFees.touched.adultPrice &&
                  formikNonResidentFees.errors.adultPrice ? (
                    <span className="text-sm font-bold text-red-400">
                      {formikNonResidentFees.errors.adultPrice}
                    </span>
                  ) : null}
                </div>

                <div className="mt-2">
                  <Input
                    name="teenPrice"
                    type="number"
                    value={formikNonResidentFees.values.teenPrice}
                    placeholder="Enter the price of the fee."
                    errorStyle={
                      formikNonResidentFees.touched.teenPrice &&
                      formikNonResidentFees.errors.teenPrice
                        ? true
                        : false
                    }
                    onChange={(e) => {
                      formikNonResidentFees.handleChange(e);
                    }}
                    className={"w-full placeholder:text-sm "}
                    inputClassName="!text-sm "
                    label="Resident Teen fee price (KES)"
                  ></Input>
                  {formikNonResidentFees.touched.teenPrice &&
                  formikNonResidentFees.errors.teenPrice ? (
                    <span className="text-sm font-bold text-red-400">
                      {formikNonResidentFees.errors.teenPrice}
                    </span>
                  ) : null}
                </div>

                <div className="mt-2">
                  <Input
                    name="childPrice"
                    type="number"
                    value={formikNonResidentFees.values.childPrice}
                    placeholder="Enter the price of the fee."
                    errorStyle={
                      formikNonResidentFees.touched.childPrice &&
                      formikNonResidentFees.errors.childPrice
                        ? true
                        : false
                    }
                    onChange={(e) => {
                      formikNonResidentFees.handleChange(e);
                    }}
                    className={"w-full placeholder:text-sm "}
                    inputClassName="!text-sm "
                    label="Resident Child fee price (KES)"
                  ></Input>
                  {formikNonResidentFees.touched.childPrice &&
                  formikNonResidentFees.errors.childPrice ? (
                    <span className="text-sm font-bold text-red-400">
                      {formikNonResidentFees.errors.childPrice}
                    </span>
                  ) : null}
                </div>

                <div className="mt-2">
                  <Input
                    name="nonResidentAdultPrice"
                    type="number"
                    value={formikNonResidentFees.values.nonResidentAdultPrice}
                    placeholder="Enter the price of the fee."
                    errorStyle={
                      formikNonResidentFees.touched.nonResidentAdultPrice &&
                      formikNonResidentFees.errors.nonResidentAdultPrice
                        ? true
                        : false
                    }
                    onChange={(e) => {
                      formikNonResidentFees.handleChange(e);
                    }}
                    className={"w-full placeholder:text-sm "}
                    inputClassName="!text-sm "
                    label="Non-resident Adult fee price ($)"
                  ></Input>
                  {formikNonResidentFees.touched.nonResidentAdultPrice &&
                  formikNonResidentFees.errors.nonResidentAdultPrice ? (
                    <span className="text-sm font-bold text-red-400">
                      {formikNonResidentFees.errors.nonResidentAdultPrice}
                    </span>
                  ) : null}
                </div>

                <div className="mt-2">
                  <Input
                    name="nonResidentTeenPrice"
                    type="number"
                    value={formikNonResidentFees.values.nonResidentTeenPrice}
                    placeholder="Enter the price of the fee."
                    errorStyle={
                      formikNonResidentFees.touched.nonResidentTeenPrice &&
                      formikNonResidentFees.errors.nonResidentTeenPrice
                        ? true
                        : false
                    }
                    onChange={(e) => {
                      formikNonResidentFees.handleChange(e);
                    }}
                    className={"w-full placeholder:text-sm "}
                    inputClassName="!text-sm "
                    label="Non-resident Teen fee price ($)"
                  ></Input>
                  {formikNonResidentFees.touched.nonResidentTeenPrice &&
                  formikNonResidentFees.errors.nonResidentTeenPrice ? (
                    <span className="text-sm font-bold text-red-400">
                      {formikNonResidentFees.errors.nonResidentTeenPrice}
                    </span>
                  ) : null}
                </div>

                <div className="mt-2">
                  <Input
                    name="nonResidentChildPrice"
                    type="number"
                    value={formikNonResidentFees.values.nonResidentChildPrice}
                    placeholder="Enter the price of the fee."
                    errorStyle={
                      formikNonResidentFees.touched.nonResidentChildPrice &&
                      formikNonResidentFees.errors.nonResidentChildPrice
                        ? true
                        : false
                    }
                    onChange={(e) => {
                      formikNonResidentFees.handleChange(e);
                    }}
                    className={"w-full placeholder:text-sm "}
                    inputClassName="!text-sm "
                    label="Non-resident Child fee price ($)"
                  ></Input>
                  {formikNonResidentFees.touched.nonResidentChildPrice &&
                  formikNonResidentFees.errors.nonResidentChildPrice ? (
                    <span className="text-sm font-bold text-red-400">
                      {formikNonResidentFees.errors.nonResidentChildPrice}
                    </span>
                  ) : null}
                </div>

                {/* <div className="mt-2">
                  <Input
                    name="price"
                    type="number"
                    value={formikNonResidentFees.values.price}
                    placeholder="Enter the price of the fee."
                    errorStyle={
                      formikNonResidentFees.touched.price &&
                      formikNonResidentFees.errors.price
                        ? true
                        : false
                    }
                    onChange={(e) => {
                      formikNonResidentFees.handleChange(e);
                    }}
                    className={"w-full placeholder:text-sm "}
                    inputClassName="!text-sm "
                    label="Fee price (USD)"
                  ></Input>
                  {formikNonResidentFees.touched.price &&
                  formikNonResidentFees.errors.price ? (
                    <span className="text-sm font-bold text-red-400">
                      {formikNonResidentFees.errors.price}
                    </span>
                  ) : null}
                </div> */}
                {/* <div className="mt-2">
                  <h1 className="text-sm font-bold mb-1">
                    Enter a fee option. eg. Per person
                  </h1>
                  <SelectInput
                    options={feeOptions}
                    selectedOption={formikNonResidentFees.values.fee_option}
                    instanceId="fee_option"
                    setSelectedOption={(selected) => {
                      formikNonResidentFees.setFieldValue(
                        "fee_option",
                        selected
                      );
                    }}
                    className={
                      "!w-full !border !rounded-md !text-sm py-1 pl-1 " +
                      (formikNonResidentFees.touched.fee_option &&
                      formikNonResidentFees.errors.fee_option
                        ? "border-red-500"
                        : "")
                    }
                    placeholder="Select fee option"
                    isSearchable={false}
                  ></SelectInput>
                </div> */}

                {/* <div className="mt-2">
                  <h1 className="text-sm font-bold mb-1">Guest type</h1>
                  <SelectInput
                    options={guestTypes}
                    selectedOption={formikNonResidentFees.values.guest_type}
                    instanceId="guest_type"
                    setSelectedOption={(selected) => {
                      formikNonResidentFees.setFieldValue(
                        "guest_type",
                        selected
                      );
                    }}
                    className={
                      "!w-full !border !rounded-md !text-sm py-1 pl-1 " +
                      (formikNonResidentFees.touched.guest_type &&
                      formikNonResidentFees.errors.guest_type
                        ? "border-red-500"
                        : "")
                    }
                    placeholder="Select a guest type this fee applies to"
                    isSearchable={false}
                  ></SelectInput>
                </div> */}
              </div>

              <div className="flex justify-end mt-4 mb-3 mr-2">
                <button
                  onClick={() => {
                    setNonResidentOpenModal(false);
                  }}
                  className="bg-gray-200 text-sm font-bold px-6 py-1.5 rounded-md"
                >
                  Cancel
                </button>

                <button
                  onClick={() => {
                    formikNonResidentFees.handleSubmit();
                  }}
                  className="bg-blue-500 flex justify-center items-center gap-2 text-white text-sm font-bold ml-2 px-6 py-1.5 rounded-md"
                >
                  Post{" "}
                  {nonResidentFeesLoading && (
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

            <div
              onClick={() => {
                setNonResidentOpenModal(true);
              }}
              className="w-[32px] h-[32px] cursor-pointer flex items-center justify-center rounded-full bg-blue-600"
            >
              <Icon
                className="w-6 h-6 text-white"
                icon="material-symbols:add"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col">
        <h1 className="font-bold font-SourceSans text-lg">
          Park/Conservancy fees(Resident)
        </h1>

        <div className="flex mt-2 flex-wrap gap-3 px-4">
          {formikResidentFees.values.fees.map((fee, index) => {
            return (
              <div key={index}>
                {fee.name &&
                  !!(fee.adultPrice || fee.childPrice || fee.teenPrice) && (
                    <ResidentOtherFee
                      fee={fee}
                      formikResidentFees={formikResidentFees}
                    ></ResidentOtherFee>
                  )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

OtherFees.propTypes = {};

export default OtherFees;
