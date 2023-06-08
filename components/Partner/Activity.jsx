import { Icon } from "@iconify/react";
import React from "react";
import Dialogue from "../Home/Dialogue";
import Input from "../ui/Input";
import LoadingSpinerChase from "../ui/LoadingSpinerChase";
import { useFormik } from "formik";
import * as Yup from "yup";
import Cookies from "js-cookie";
import axios from "axios";
import { useRouter } from "next/router";
import SelectInput from "../ui/SelectInput";

function Activity({ activity, setActivityFees }) {
  const [openModal, setOpenModal] = React.useState(false);

  const [activityEditLoading, setActivityEditLoading] = React.useState(false);

  const router = useRouter();

  const options = [
    { value: "PER PERSON", label: "Per Person" },
    { value: "PER PERSON PER NIGHT", label: "Per Person Per Night" },
    { value: "WHOLE GROUP", label: "Whole Group" },
  ];

  const formikActivityEditFees = useFormik({
    initialValues: {
      name: activity.name,
      description: activity.description,
      nonResidentPrice: activity.price,
      residentPrice: activity.resident_price,
      priceType: activity.price_type,
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
      setActivityEditLoading(true);

      await axios
        .patch(
          `${process.env.NEXT_PUBLIC_baseURL}/partner-stays/${router.query.slug}/activities/${activity.id}/`,
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
          setActivityEditLoading(false);
          setOpenModal(false);
          setActivityFees((prevState) => {
            return prevState.map((activity) => {
              if (activity.id === res.data.id) {
                return res.data;
              } else {
                return activity;
              }
            });
          });
        })
        .catch((err) => {});
    },
  });

  const deleteActivity = async (id) => {
    await axios
      .delete(
        `${process.env.NEXT_PUBLIC_baseURL}/partner-stays/${router.query.slug}/activities/${id}/`,
        {
          headers: {
            Authorization: "Token " + Cookies.get("token"),
          },
        }
      )
      .then((res) => {
        setActivityFees((prevState) => {
          return prevState.filter((activity) => activity.id !== id);
        });
      })
      .catch((err) => {});
  };
  return (
    <div className="p-4 relative shadow-lg border">
      <h1 className="font-bold">{activity.name}</h1>
      <p className="mt-2">{activity.description}</p>
      <hr className="my-2" />
      <div className="flex gap-2 items-center">
        <span className="font-bold text-lg">${activity.price}</span>
        <div className="w-[1px] h-[19px] bg-gray-300"></div>
        <span className="font-bold text-lg">KES{activity.resident_price}</span>
        <div className="font-bold mb-2">.</div>
        <span className="lowercase text-gray-600">({activity.price_type})</span>
      </div>

      <div className="flex absolute top-2 right-4 items-center gap-2">
        <button
          onClick={() => {
            setOpenModal(true);
          }}
          className="bg-white border shadow-lg flex items-center justify-center text-lg font-bold text-black w-8 h-8 rounded-full"
        >
          <Icon
            className="text-blue-500"
            icon="material-symbols:edit-rounded"
          />
        </button>
        <button
          onClick={() => {
            deleteActivity(activity.id);
          }}
          className="bg-white border shadow-lg flex items-center justify-center text-lg font-bold text-black w-8 h-8 rounded-full"
        >
          <Icon
            className="text-red-500"
            icon="material-symbols:delete-outline-rounded"
          />
        </button>
      </div>

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
          <h1 className="font-semibold font-SourceSans">Edit Activity</h1>
        </div>

        <div className="px-2 mb-2 mt-2">
          <div>
            <Input
              name="name"
              type="text"
              value={formikActivityEditFees.values.name}
              placeholder="Enter the name of the activity"
              errorStyle={
                formikActivityEditFees.touched.name &&
                formikActivityEditFees.errors.name
                  ? true
                  : false
              }
              onChange={(e) => {
                formikActivityEditFees.handleChange(e);
              }}
              className={"w-full placeholder:text-sm "}
              inputClassName="!text-sm "
              label="Activity name"
            ></Input>
            {formikActivityEditFees.touched.name &&
            formikActivityEditFees.errors.name ? (
              <span className="text-sm font-bold text-red-400">
                {formikActivityEditFees.errors.name}
              </span>
            ) : null}
          </div>

          <div className="mt-2">
            <Input
              name="description"
              type="text"
              value={formikActivityEditFees.values.description}
              placeholder="Enter the description of the activity"
              errorStyle={
                formikActivityEditFees.touched.description &&
                formikActivityEditFees.errors.description
                  ? true
                  : false
              }
              onChange={(e) => {
                formikActivityEditFees.handleChange(e);
              }}
              className={"w-full placeholder:text-sm "}
              inputClassName="!text-sm "
              label="Activity description"
            ></Input>
            {formikActivityEditFees.touched.description &&
            formikActivityEditFees.errors.description ? (
              <span className="text-sm font-bold text-red-400">
                {formikActivityEditFees.errors.description}
              </span>
            ) : null}
          </div>

          <div className="mt-2 flex flex-col gap-1">
            <h1 className="text-sm font-bold">
              Select the price type for the activity
            </h1>

            <SelectInput
              options={options}
              selectedOption={options.find(
                (option) => option.value === activity.price_type
              )}
              instanceId="price_type"
              setSelectedOption={(selected) => {
                formikActivityEditFees.setFieldValue(
                  `priceType`,
                  selected.value
                );
              }}
              className={
                "!w-full !border !rounded-md !text-sm py-1 pl-1 " +
                (formikActivityEditFees.touched.priceType &&
                formikActivityEditFees.errors.priceType
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
              value={formikActivityEditFees.values.nonResidentPrice}
              placeholder="Enter the price of this activity."
              errorStyle={
                formikActivityEditFees.touched.nonResidentPrice &&
                formikActivityEditFees.errors.nonResidentPrice
                  ? true
                  : false
              }
              onChange={(e) => {
                formikActivityEditFees.handleChange(e);
              }}
              className={"w-full placeholder:text-sm "}
              inputClassName="!text-sm "
              label="Activity price($)"
            ></Input>
            {formikActivityEditFees.touched.nonResidentPrice &&
            formikActivityEditFees.errors.nonResidentPrice ? (
              <span className="text-sm font-bold text-red-400">
                {formikActivityEditFees.errors.nonResidentPrice}
              </span>
            ) : null}
          </div>

          <div className="mt-2">
            <Input
              name="residentPrice"
              type="number"
              value={formikActivityEditFees.values.residentPrice}
              placeholder="Enter the price of this activity."
              errorStyle={
                formikActivityEditFees.touched.residentPrice &&
                formikActivityEditFees.errors.residentPrice
                  ? true
                  : false
              }
              onChange={(e) => {
                formikActivityEditFees.handleChange(e);
              }}
              className={"w-full placeholder:text-sm "}
              inputClassName="!text-sm "
              label="Activity price (KES)"
            ></Input>
            {formikActivityEditFees.touched.residentPrice &&
            formikActivityEditFees.errors.residentPrice ? (
              <span className="text-sm font-bold text-red-400">
                {formikActivityEditFees.errors.residentPrice}
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
              formikActivityEditFees.handleSubmit();
            }}
            className="bg-blue-500 flex justify-center items-center gap-2 text-white text-sm font-bold ml-2 px-6 py-1.5 rounded-md"
          >
            Post{" "}
            {activityEditLoading && (
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
  );
}

export default Activity;
