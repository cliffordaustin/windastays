import React, { useEffect } from "react";
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

function OtherFees({ residentFees, nonResidentFees }) {
  const router = useRouter();
  const [nonResidentFeesLoading, setNonResidentFeesLoading] =
    React.useState(false);

  const [residentFeesLoading, setResidentFeesLoading] = React.useState(false);

  const formikNonResidentFees = useFormik({
    initialValues: {
      name: "",
      price: "",
      fees: [],
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
    }),

    onSubmit: async (values) => {
      setNonResidentFeesLoading(true);
      await axios
        .post(
          `${process.env.NEXT_PUBLIC_baseURL}/stays/${router.query.slug}/nonresident-other-fees/`,
          {
            name: values.name,
            price: values.price,
          },
          {
            headers: {
              Authorization: "Token " + Cookies.get("token"),
            },
          }
        )
        .then((res) => {
          values.fees.push({
            name: values.name,
            price: values.price,
          });
          setNonResidentFeesLoading(false);
          formikNonResidentFees.resetForm();
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
    }),

    onSubmit: async (values) => {
      setResidentFeesLoading(true);
      await axios
        .post(
          `${process.env.NEXT_PUBLIC_baseURL}/stays/${router.query.slug}/resident-other-fees/`,
          {
            name: values.name,
            price: values.price,
          },
          {
            headers: {
              Authorization: "Token " + Cookies.get("token"),
            },
          }
        )
        .then((res) => {
          values.fees.push({
            name: values.name,
            price: values.price,
          });
          setResidentFeesLoading(false);
          formikResidentFees.resetForm();
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
            name: fee.name,
            price: fee.price,
          };
        })
      );
    }

    if (nonResidentFees.length > 0) {
      formikNonResidentFees.setFieldValue(
        "fees",
        nonResidentFees.map((fee) => {
          return {
            name: fee.name,
            price: fee.price,
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
                  <div className="px-4 min-w-[150px] h-[120px] relative flex flex-col gap-4 justify-around py-2 border rounded-lg">
                    <div className="text-sm text-gray-600 font-bold">
                      {fee.name}
                    </div>

                    <div className="flex gap-1">
                      <Price
                        stayPrice={fee.price}
                        autoCurrency={false}
                        currency="KES"
                        className="!text-3xl !font-SourceSans !font-semibold !text-gray-600"
                      ></Price>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          <div className="bg-blue-600 w-[150px] bg-opacity-30 px-1 py-2 border-2 border-blue-600 border-dashed rounded-lg flex gap-2 flex-col items-center justify-center">
            <h1 className="font-SourceSans text-sm font-bold text-center">
              Add your fee(for resdient)
            </h1>

            <Popover className="relative z-20 ">
              <Popover.Button className="outline-none ">
                <div className="w-[32px] h-[32px] cursor-pointer flex items-center justify-center rounded-full bg-blue-600">
                  <Icon
                    className="w-6 h-6 text-white"
                    icon="material-symbols:add"
                  />
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
                    "absolute z-[30] bg-white rounded-md after:!left-[27%] bottom-[100%] mb-2 after:!border-b-transparent after:!border-t-white tooltip after:!top-[100%] -left-[100px] border shadow-md mt-2 w-[400px] !p-0"
                  }
                >
                  <div className="w-full bg-gray-200 px-3 py-2">
                    <h1 className="font-semibold font-SourceSans">Add fees</h1>
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
                  </div>

                  <div className="flex justify-end mt-4 mb-3 mr-2">
                    <Popover.Button className="bg-gray-200 text-sm font-bold px-6 py-1.5 rounded-md">
                      Cancel
                    </Popover.Button>

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
                </Popover.Panel>
              </Transition>
            </Popover>
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
                  <div className="px-4 min-w-[150px] h-[120px] relative flex flex-col gap-4 justify-around py-2 border rounded-lg">
                    <div className="text-sm text-gray-600 font-bold">
                      {fee.name}
                    </div>

                    <div className="flex gap-1">
                      <Price
                        stayPrice={fee.price}
                        autoCurrency={false}
                        className="!text-3xl !font-SourceSans !font-semibold !text-gray-600"
                      ></Price>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          <div className="bg-blue-600 w-[150px] bg-opacity-30 px-1 py-2 border-2 border-blue-600 border-dashed rounded-lg flex gap-2 flex-col items-center justify-center">
            <h1 className="font-SourceSans text-sm font-bold text-center">
              Add your fee(for non-resdient)
            </h1>

            <Popover className="relative z-20 ">
              <Popover.Button className="outline-none ">
                <div className="w-[32px] h-[32px] cursor-pointer flex items-center justify-center rounded-full bg-blue-600">
                  <Icon
                    className="w-6 h-6 text-white"
                    icon="material-symbols:add"
                  />
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
                    "absolute z-[30] bg-white rounded-md after:!left-[27%] bottom-[100%] mb-2 after:!border-b-transparent after:!border-t-white tooltip after:!top-[100%] -left-[100px] border shadow-md mt-2 w-[400px] !p-0"
                  }
                >
                  <div className="w-full bg-gray-200 px-3 py-2">
                    <h1 className="font-semibold font-SourceSans">Add fees</h1>
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
                  </div>

                  <div className="flex justify-end mt-4 mb-3 mr-2">
                    <Popover.Button className="bg-gray-200 text-sm font-bold px-6 py-1.5 rounded-md">
                      Cancel
                    </Popover.Button>

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
                </Popover.Panel>
              </Transition>
            </Popover>
          </div>
        </div>
      </div>
    </div>
  );
}

OtherFees.propTypes = {};

export default OtherFees;
