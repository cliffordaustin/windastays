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
    { value: "INFANT", label: "Infant" },
  ];

  const [residentOpenModal, setResidentOpenModal] = useState(false);

  const [nonResidentOpenModal, setNonResidentOpenModal] = useState(false);

  const formikNonResidentFees = useFormik({
    initialValues: {
      name: "",
      price: "",
      fees: [],
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
      price: Yup.number("Please enter a valid number of price").required(
        "Price is required"
      ),
      fee_option: Yup.object().required("Fee option is required"),
      guest_type: Yup.object().required("Guest type is required"),
    }),

    onSubmit: async (values) => {
      setNonResidentFeesLoading(true);
      await axios
        .post(
          `${process.env.NEXT_PUBLIC_baseURL}/stays/${router.query.slug}/nonresident-other-fees/`,
          {
            name: values.name,
            price: values.price,
            nonresident_fee_type: values.fee_option.value,
            guest_type: values.guest_type.value,
          },
          {
            headers: {
              Authorization: "Token " + Cookies.get("token"),
            },
          }
        )
        .then((res) => {
          formikNonResidentFees.setFieldValue("fees", [
            ...values.fees,
            {
              id: res.data.id,
              name: values.name,
              price: values.price,
              resident_fee_type: values.fee_option.value,
              guest_type: values.guest_type.value,
            },
          ]);
          setNonResidentFeesLoading(false);
          setNonResidentOpenModal(false);
        })
        .catch((err) => {
          setNonResidentFeesLoading(false);
        });
    },
  });

  const formikResidentFees = useFormik({
    initialValues: {
      name: "",
      price: "",
      fees: [],
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
      price: Yup.number("Please enter a valid number of price").required(
        "Price is required"
      ),
      fee_option: Yup.object().required("Fee option is required"),
      guest_type: Yup.object().required("Guest type is required"),
    }),

    onSubmit: async (values) => {
      setResidentFeesLoading(true);
      await axios
        .post(
          `${process.env.NEXT_PUBLIC_baseURL}/stays/${router.query.slug}/resident-other-fees/`,
          {
            name: values.name,
            price: values.price,
            resident_fee_type: values.fee_option.value,
            guest_type: values.guest_type.value,
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
              price: values.price,
              resident_fee_type: values.fee_option.value,
              guest_type: values.guest_type.value,
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
            price: fee.price,
            resident_fee_type: fee.resident_fee_type,
            guest_type: fee.guest_type,
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
            price: fee.price,
            nonresident_fee_type: fee.nonresident_fee_type,
            guest_type: fee.guest_type,
          };
        })
      );
    }
  }, []);

  return (
    <div className="mt-5 ">
      <div className="flex flex-col">
        <h1 className="font-bold font-SourceSans text-lg">
          Other fees(Resident)
        </h1>

        <div className="flex mt-2 flex-wrap gap-3 px-4">
          {formikResidentFees.values.fees.map((fee, index) => {
            return (
              <div key={index}>
                {fee.name && fee.price && (
                  <ResidentOtherFee
                    fee={fee}
                    formikResidentFees={formikResidentFees}
                  ></ResidentOtherFee>
                )}
              </div>
            );
          })}

          <div className="bg-blue-600 w-[150px] bg-opacity-30 px-1 py-2 border-2 border-blue-600 border-dashed rounded-lg flex gap-2 flex-col items-center justify-center">
            <h1 className="font-SourceSans text-sm font-bold text-center">
              Add your fee(for resdient)
            </h1>

            <div
              onClick={() => {
                setResidentOpenModal(true);
              }}
              className="w-[32px] h-[32px] cursor-pointer flex items-center justify-center rounded-full bg-blue-600"
            >
              <Icon
                className="w-6 h-6 text-white"
                icon="material-symbols:add"
              />
            </div>

            <Dialogue
              isOpen={residentOpenModal}
              closeModal={() => {
                setResidentOpenModal(false);
              }}
              dialogueTitleClassName="!font-bold !ml-4 !text-xl md:!text-2xl"
              outsideDialogueClass="!p-0"
              dialoguePanelClassName={
                "md:!rounded-md !rounded-none !p-0 !overflow-visible remove-scroll !max-w-2xl screen-height-safari md:!min-h-0 md:!max-h-[650px] "
              }
            >
              <div className="w-full bg-gray-200 px-3 py-2">
                <h1 className="font-semibold font-SourceSans">
                  Add your fee(for resdient)
                </h1>
              </div>

              <div className="px-2 mb-2 mt-2">
                <div>
                  <Input
                    name="name"
                    type="text"
                    value={formikResidentFees.values.name}
                    placeholder="Enter the name of the fee. eg. Park fees"
                    errorStyle={
                      formikResidentFees.touched.name &&
                      formikResidentFees.errors.name
                        ? true
                        : false
                    }
                    onChange={(e) => {
                      formikResidentFees.handleChange(e);
                    }}
                    className={"w-full placeholder:text-sm "}
                    inputClassName="!text-sm "
                    label="Fee name"
                  ></Input>
                  {formikResidentFees.touched.name &&
                  formikResidentFees.errors.name ? (
                    <span className="text-sm font-bold text-red-400">
                      {formikResidentFees.errors.name}
                    </span>
                  ) : null}
                </div>

                <div className="mt-2">
                  <Input
                    name="price"
                    type="number"
                    value={formikResidentFees.values.price}
                    placeholder="Enter the price of the fee."
                    errorStyle={
                      formikResidentFees.touched.price &&
                      formikResidentFees.errors.price
                        ? true
                        : false
                    }
                    onChange={(e) => {
                      formikResidentFees.handleChange(e);
                    }}
                    className={"w-full placeholder:text-sm "}
                    inputClassName="!text-sm "
                    label="Fee price (KES)"
                  ></Input>
                  {formikResidentFees.touched.price &&
                  formikResidentFees.errors.price ? (
                    <span className="text-sm font-bold text-red-400">
                      {formikResidentFees.errors.price}
                    </span>
                  ) : null}
                </div>

                <div className="mt-2">
                  <h1 className="text-sm font-bold mb-1">
                    Enter a fee option. eg. Per person
                  </h1>
                  <SelectInput
                    options={feeOptions}
                    selectedOption={formikResidentFees.values.fee_option}
                    instanceId="fee_option"
                    setSelectedOption={(selected) => {
                      formikResidentFees.setFieldValue("fee_option", selected);
                    }}
                    className={
                      "!w-full !border !rounded-md !text-sm py-1 pl-1 " +
                      (formikResidentFees.touched.fee_option &&
                      formikResidentFees.errors.fee_option
                        ? "border-red-500"
                        : "")
                    }
                    placeholder="Select fee option"
                    isSearchable={false}
                  ></SelectInput>
                </div>

                <div className="mt-2">
                  <h1 className="text-sm font-bold mb-1">Guest type</h1>
                  <SelectInput
                    options={guestTypes}
                    selectedOption={formikResidentFees.values.guest_type}
                    instanceId="guest_type"
                    setSelectedOption={(selected) => {
                      formikResidentFees.setFieldValue("guest_type", selected);
                    }}
                    className={
                      "!w-full !border !rounded-md !text-sm py-1 pl-1 " +
                      (formikResidentFees.touched.guest_type &&
                      formikResidentFees.errors.guest_type
                        ? "border-red-500"
                        : "")
                    }
                    placeholder="Select a guest type this fee applies to"
                    isSearchable={false}
                  ></SelectInput>
                </div>
              </div>

              <div className="flex justify-end mt-4 mb-3 mr-2">
                <button
                  onClick={() => {
                    setResidentOpenModal(false);
                  }}
                  className="bg-gray-200 text-sm font-bold px-6 py-1.5 rounded-md"
                >
                  Cancel
                </button>

                <button
                  onClick={() => {
                    formikResidentFees.handleSubmit();
                  }}
                  className="bg-blue-500 flex justify-center items-center gap-2 text-white text-sm font-bold ml-2 px-6 py-1.5 rounded-md"
                >
                  Post{" "}
                  {residentFeesLoading && (
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
          </div>
        </div>
      </div>

      <div className="flex flex-col mt-5">
        <h1 className="font-bold font-SourceSans text-lg">
          Other fees(Non-resident)
        </h1>

        <div className="flex mt-2 flex-wrap gap-3 px-4">
          {formikNonResidentFees.values.fees.map((fee, index) => {
            return (
              <div key={index}>
                {fee.name && fee.price && (
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
              Add your fee(for non-resdient)
            </h1>

            <Dialogue
              isOpen={nonResidentOpenModal}
              closeModal={() => {
                setNonResidentOpenModal(false);
              }}
              dialogueTitleClassName="!font-bold !ml-4 !text-xl md:!text-2xl"
              outsideDialogueClass="!p-0"
              dialoguePanelClassName={
                "md:!rounded-md !rounded-none !p-0 !overflow-visible remove-scroll !max-w-2xl screen-height-safari md:!min-h-0 md:!max-h-[650px] "
              }
            >
              <div className="w-full bg-gray-200 px-3 py-2">
                <h1 className="font-semibold font-SourceSans">
                  Add your fee(for non-resdient)
                </h1>
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
                </div>
                <div className="mt-2">
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
                </div>

                <div className="mt-2">
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
                </div>
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
    </div>
  );
}

OtherFees.propTypes = {};

export default OtherFees;
