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

function OtherFee({ fee, formikResidentFees }) {
  const router = useRouter();

  const [residentOpenEditModal, setResidentOpenEditModal] = useState(false);

  const [residentEditLoading, setResidentEditLoading] = useState(false);

  const deleteFeeResident = async (id) => {
    await axios
      .delete(
        `${process.env.NEXT_PUBLIC_baseURL}/stays/${router.query.slug}/resident-other-fees/${id}/`,
        {
          headers: {
            Authorization: "Token " + Cookies.get("token"),
          },
        }
      )
      .then((res) => {
        formikResidentFees.setFieldValue(
          "fees",
          formikResidentFees.values.fees.filter((fee) => fee.id !== id)
        );
      })
      .catch((err) => {});
  };

  const feeOptions = [
    { value: "PER PERSON", label: "Per person" },
    { value: "PER PERSON PER NIGHT", label: "Per person per night" },
    { value: "WHOLE GROUP", label: "Whole group" },
  ];

  const guestTypes = [
    { value: "ADULT", label: "Adult" },
    { value: "CHILD", label: "Child" },
  ];

  const formikResidentEditFees = useFormik({
    initialValues: {
      name: fee.name,
      adultPrice: fee.adultPrice,
      childPrice: fee.childPrice,
      teenPrice: fee.teenPrice,

      fees: fee.fees,
      fee_option: {
        value: fee.resident_fee_type,
        label:
          fee.resident_fee_type === "WHOLE GROUP"
            ? "Whole group"
            : fee.resident_fee_type === "PER PERSON PER NIGHT"
            ? "Per person per night"
            : "Per person",
      },
      guest_type: {
        value: fee.guest_type,
        label:
          fee.guest_type === "CHILD"
            ? "Child"
            : fee.guest_type === "INFANT"
            ? "Infant"
            : "Adult",
      },
      is_park_fee: fee.is_park_fee,
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
      setResidentEditLoading(true);

      await axios
        .patch(
          `${process.env.NEXT_PUBLIC_baseURL}/stays/${router.query.slug}/resident-other-fees/${fee.id}/`,
          {
            name: values.name,
            adult_price: values.adultPrice,
            teen_price: values.teenPrice,
            child_price: values.childPrice,
          },
          {
            headers: {
              Authorization: "Token " + Cookies.get("token"),
            },
          }
        )
        .then((res) => {
          setResidentEditLoading(false);
          setResidentOpenEditModal(false);
          formikResidentFees.setFieldValue(
            "fees",
            formikResidentFees.values.fees.map((item) => {
              if (item.id === fee.id) {
                return {
                  ...item,
                  id: res.data.id,
                  name: values.name,
                  adultPrice: values.adultPrice,
                  teenPrice: values.teenPrice,
                  childPrice: values.childPrice,
                };
              } else {
                return item;
              }
            })
          );
        })
        .catch((err) => {});
    },
  });
  return (
    <div className="px-2 min-w-[150px] h-[140px] relative flex flex-col gap-2 justify-around py-2 border rounded-lg">
      <div className="flex items-start gap-7">
        {/* <div className="px-2 py-1 w-fit bg-gray-100 text-sm font-bold rounded-3xl">
          {fee.resident_fee_type === "WHOLE GROUP"
            ? "Whole group"
            : fee.resident_fee_type === "PER PERSON PER NIGHT"
            ? "Per person per night"
            : "Per person"}
        </div> */}

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              deleteFeeResident(fee.id);
            }}
            className="bg-white border shadow-lg flex items-center justify-center text-lg font-bold text-black w-8 h-8 rounded-full"
          >
            <Icon
              className="text-red-500"
              icon="material-symbols:delete-outline-rounded"
            />
          </button>

          <button
            onClick={() => {
              setResidentOpenEditModal(true);
            }}
            className="bg-white border shadow-lg flex items-center justify-center text-lg font-bold text-black w-8 h-8 rounded-full"
          >
            <Icon
              className="text-blue-500"
              icon="material-symbols:edit-rounded"
            />
          </button>
        </div>
      </div>

      <Dialogue
        isOpen={residentOpenEditModal}
        closeModal={() => {
          setResidentOpenEditModal(false);
        }}
        dialogueTitleClassName="!font-bold !ml-4 !text-xl md:!text-2xl"
        outsideDialogueClass="!p-0"
        dialoguePanelClassName={
          "md:!rounded-md !rounded-none !p-0 !overflow-visible remove-scroll !max-w-2xl screen-height-safari md:!min-h-0 md:!max-h-[650px] "
        }
      >
        <div className="w-full bg-gray-200 px-3 py-2">
          <h1 className="font-semibold font-SourceSans">
            Edit fee(for resdient)
          </h1>
        </div>

        <div className="px-2 mb-2 mt-2">
          <div>
            <Input
              name="name"
              type="text"
              value={formikResidentEditFees.values.name}
              placeholder="Enter the name of the fee. eg. Park fees"
              errorStyle={
                formikResidentEditFees.touched.name &&
                formikResidentEditFees.errors.name
                  ? true
                  : false
              }
              onChange={(e) => {
                formikResidentEditFees.handleChange(e);
              }}
              className={"w-full placeholder:text-sm "}
              inputClassName="!text-sm "
              label="Fee name"
            ></Input>
            {formikResidentEditFees.touched.name &&
            formikResidentEditFees.errors.name ? (
              <span className="text-sm font-bold text-red-400">
                {formikResidentEditFees.errors.name}
              </span>
            ) : null}
          </div>

          <div className="mt-2">
            <Input
              name="adultPrice"
              type="number"
              value={formikResidentEditFees.values.adultPrice}
              placeholder="Enter the price of the fee."
              errorStyle={
                formikResidentEditFees.touched.adultPrice &&
                formikResidentEditFees.errors.adultPrice
                  ? true
                  : false
              }
              onChange={(e) => {
                formikResidentEditFees.handleChange(e);
              }}
              className={"w-full placeholder:text-sm "}
              inputClassName="!text-sm "
              label="Adult fee price (KES)"
            ></Input>
            {formikResidentEditFees.touched.adultPrice &&
            formikResidentEditFees.errors.adultPrice ? (
              <span className="text-sm font-bold text-red-400">
                {formikResidentEditFees.errors.adultPrice}
              </span>
            ) : null}
          </div>

          <div className="mt-2">
            <Input
              name="teenPrice"
              type="number"
              value={formikResidentEditFees.values.teenPrice}
              placeholder="Enter the price of the fee."
              errorStyle={
                formikResidentEditFees.touched.teenPrice &&
                formikResidentEditFees.errors.teenPrice
                  ? true
                  : false
              }
              onChange={(e) => {
                formikResidentEditFees.handleChange(e);
              }}
              className={"w-full placeholder:text-sm "}
              inputClassName="!text-sm "
              label="Teen fee price (KES)"
            ></Input>
            {formikResidentEditFees.touched.teenPrice &&
            formikResidentEditFees.errors.teenPrice ? (
              <span className="text-sm font-bold text-red-400">
                {formikResidentEditFees.errors.teenPrice}
              </span>
            ) : null}
          </div>

          <div className="mt-2">
            <Input
              name="childPrice"
              type="number"
              value={formikResidentEditFees.values.childPrice}
              placeholder="Enter the price of the fee."
              errorStyle={
                formikResidentEditFees.touched.childPrice &&
                formikResidentEditFees.errors.childPrice
                  ? true
                  : false
              }
              onChange={(e) => {
                formikResidentEditFees.handleChange(e);
              }}
              className={"w-full placeholder:text-sm "}
              inputClassName="!text-sm "
              label="Child fee price (KES)"
            ></Input>
            {formikResidentEditFees.touched.childPrice &&
            formikResidentEditFees.errors.childPrice ? (
              <span className="text-sm font-bold text-red-400">
                {formikResidentEditFees.errors.childPrice}
              </span>
            ) : null}
          </div>

          {/* <div className="mt-2">
            <Input
              name="price"
              type="number"
              value={formikResidentEditFees.values.price}
              placeholder="Enter the price of the fee."
              errorStyle={
                formikResidentEditFees.touched.price &&
                formikResidentEditFees.errors.price
                  ? true
                  : false
              }
              onChange={(e) => {
                formikResidentEditFees.handleChange(e);
              }}
              className={"w-full placeholder:text-sm "}
              inputClassName="!text-sm "
              label="Fee price (KES)"
            ></Input>
            {formikResidentEditFees.touched.price &&
            formikResidentEditFees.errors.price ? (
              <span className="text-sm font-bold text-red-400">
                {formikResidentEditFees.errors.price}
              </span>
            ) : null}
          </div> */}

          {/* <div className="mt-2">
            <h1 className="text-sm font-bold mb-1">
              Enter a fee option. eg. Per person
            </h1>
            <SelectInput
              options={feeOptions}
              selectedOption={formikResidentEditFees.values.fee_option}
              instanceId="fee_option"
              setSelectedOption={(selected) => {
                formikResidentEditFees.setFieldValue("fee_option", selected);
              }}
              className={
                "!w-full !border !rounded-md !text-sm py-1 pl-1 " +
                (formikResidentEditFees.touched.fee_option &&
                formikResidentEditFees.errors.fee_option
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
              selectedOption={formikResidentEditFees.values.guest_type}
              instanceId="guest_type"
              setSelectedOption={(selected) => {
                formikResidentEditFees.setFieldValue("guest_type", selected);
              }}
              className={
                "!w-full !border !rounded-md !text-sm py-1 pl-1 " +
                (formikResidentEditFees.touched.guest_type &&
                formikResidentEditFees.errors.guest_type
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
              setResidentOpenEditModal(false);
            }}
            className="bg-gray-200 text-sm font-bold px-6 py-1.5 rounded-md"
          >
            Cancel
          </button>

          <button
            onClick={() => {
              formikResidentEditFees.handleSubmit();
            }}
            className="bg-blue-500 flex justify-center items-center gap-2 text-white text-sm font-bold ml-2 px-6 py-1.5 rounded-md"
          >
            Post{" "}
            {residentEditLoading && (
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

      <div className="text-base text-gray-600 font-bold">{fee.name}</div>

      <div className="flex gap-4 items-center">
        <div className="flex flex-col gap-1">
          <div className="text-sm text-gray-600 font-bold">Adult</div>
          {fee.adultPrice ? (
            <Price
              stayPrice={fee.adultPrice}
              autoCurrency={false}
              currency="KES"
              className="!text-xl !font-SourceSans !font-semibold !text-gray-600"
            ></Price>
          ) : (
            <div className="text-xl text-gray-600 font-bold">$0</div>
          )}
        </div>

        <div className="w-[1px] h-[20px] bg-gray-300"></div>

        <div className="flex flex-col gap-1">
          <div className="text-sm text-gray-600 font-bold">Teen</div>
          {fee.teenPrice ? (
            <Price
              stayPrice={fee.teenPrice}
              autoCurrency={false}
              currency="KES"
              className="!text-xl !font-SourceSans !font-semibold !text-gray-600"
            ></Price>
          ) : (
            <div className="text-xl text-gray-600 font-bold">$0</div>
          )}
        </div>

        <div className="w-[1px] h-[20px] bg-gray-300"></div>

        <div className="flex flex-col gap-1">
          <div className="text-sm text-gray-600 font-bold">Child</div>
          {fee.childPrice ? (
            <Price
              stayPrice={fee.childPrice}
              autoCurrency={false}
              currency="KES"
              className="!text-xl !font-SourceSans !font-semibold !text-gray-600"
            ></Price>
          ) : (
            <div className="text-xl text-gray-600 font-bold">$0</div>
          )}
        </div>
      </div>
    </div>
  );
}

OtherFee.propTypes = {};

export default OtherFee;
