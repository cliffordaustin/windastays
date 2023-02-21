import React from "react";
import PropTypes from "prop-types";
import { Icon } from "@iconify/react";
import Link from "next/link";
import Image from "next/image";
import Input from "../ui/Input";
import Button from "../ui/Button";
import PopoverBox from "../ui/Popover";
import { DayPicker } from "react-day-picker";
import { createGlobalStyle } from "styled-components";
import "react-day-picker/dist/style.css";
import moment from "moment";

function Search({ formik }) {
  const GlobalStyle = createGlobalStyle`
  .rdp-cell {
    width: 50px !important;
    height: 45px !important;
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
  `;

  const totalGuests =
    Number(formik.values.residentAdult) +
    Number(formik.values.nonResidentAdult) +
    Number(formik.values.residentChild) +
    Number(formik.values.nonResidentChild) +
    Number(formik.values.infantResident) +
    Number(formik.values.infantNonResident);

  return (
    <div className="flex justify-between gap-3 py-4 px-10 border-b">
      <GlobalStyle></GlobalStyle>
      <div className="flex items-center md:gap-2 lg:gap-12">
        <Link href="/">
          <a className="relative w-28 h-9 cursor-pointer">
            <Image
              layout="fill"
              alt="Logo"
              src="/images/winda_logo/horizontal-blue-font.png"
              priority
            ></Image>
          </a>
        </Link>
      </div>

      <div className="w-[600px] flex h-[55px] shadow-lg border rounded-full">
        <div className="w-[50%] flex flex-col py-1 justify-center px-2 border-r text-sm font-bold font-SourceSans">
          <div className="flex items-center gap-1">
            <Icon
              icon="ic:round-search"
              className="w-6 h-6 ml-1 text-gray-500"
            />

            <Input
              name="location"
              type="text"
              value={formik.values.location}
              placeholder="Search a location"
              onChange={(e) => {
                formik.handleChange(e);
              }}
              className={
                "w-full !py-2 !px-0 border-none placeholder:text-gray-500 !h-full placeholder:text-sm "
              }
              inputClassName="!text-sm "
            ></Input>
          </div>
        </div>

        <PopoverBox
          panelClassName="bg-white rounded-xl after:!left-[40%] tooltip shadow-md mt-2 border w-fit -left-[150px] p-2"
          btnClassName="w-full h-full"
          btnPopover={
            <div className="w-full h-full flex gap-2 hover:bg-gray-100 cursor-pointer duration-500 transition-all items-center px-2 text-sm font-bold font-SourceSans">
              <Icon
                className="w-6 h-6 text-gray-500"
                icon="material-symbols:date-range-outline-rounded"
              />
              <h1 className="text-gray-500">
                {formik.values.date &&
                formik.values.date.from &&
                formik.values.date.to
                  ? moment(formik.values.date.from).format("MMM DD") +
                    " - " +
                    moment(formik.values.date.to).format("MMM DD")
                  : "Date"}
              </h1>
            </div>
          }
          popoverClassName="w-[35%] "
        >
          <DayPicker
            mode="range"
            disabled={{ before: new Date() }}
            selected={formik.values.date}
            numberOfMonths={2}
            onSelect={(date) => {
              formik.setFieldValue("date", date);
            }}
          />
        </PopoverBox>

        <div className="w-[20%] py-0.5 px-1">
          <Button
            onClick={() => {
              formik.handleSubmit();
            }}
            type={"submit"}
            className="!w-full btn-gradient-2 !h-full !rounded-full font-bold"
          >
            Search
          </Button>
        </div>
      </div>

      <div></div>
    </div>
  );
}

Search.propTypes = {};

export default Search;
