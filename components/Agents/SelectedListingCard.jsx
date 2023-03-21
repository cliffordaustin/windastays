import React, { useEffect } from "react";
import PropTypes from "prop-types";
import PopoverBox from "../ui/Popover";
import { Icon } from "@iconify/react";
import { useRouter } from "next/router";
import axios from "axios";
import Cookies from "js-cookie";
import pricing from "../../lib/pricingCalc";
import Price from "../Stay/Price";
import moment from "moment";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Switch } from "@headlessui/react";
import Checkbox from "../ui/Checkbox";
import Dialogue from "../Home/Dialogue";
import Button from "../ui/Button";
import ReactJoyride from "react-joyride";

function SelectedListingCard({
  room,
  residentFeesOptions,
  nonResidentFeesOptions,
  residentCommision,
  nonResidentCommision,
  fees,
  date,
}) {
  const router = useRouter();

  const [roomAvailabilities, setRoomAvailabilities] = React.useState([]);

  const [roomAvailabilitiesNonResident, setRoomAvailabilitiesNonResident] =
    React.useState([]);

  const startDate =
    date && date.from
      ? moment(date.from).format("YYYY-MM-DD")
      : router.query.date;

  const endDate =
    date && date.to
      ? moment(date.to).format("YYYY-MM-DD")
      : router.query.endDate;

  useEffect(() => {
    if (startDate && endDate) {
      axios
        .get(
          `${process.env.NEXT_PUBLIC_baseURL}/room-types/${
            room.slug
          }/resident-availabilities/?start_date=${startDate}&end_date=${moment(
            endDate
          )
            .subtract(1, "days")
            .format("YYYY-MM-DD")}`,
          {
            headers: {
              Authorization: "Token " + Cookies.get("token"),
            },
          }
        )
        .then((res) => {
          setRoomAvailabilities(res.data.results);
        });

      axios
        .get(
          `${process.env.NEXT_PUBLIC_baseURL}/room-types/${
            room.slug
          }/nonresident-availabilities/?start_date=${startDate}&end_date=${moment(
            endDate
          )
            .subtract(1, "days")
            .format("YYYY-MM-DD")}`,
          {
            headers: {
              Authorization: "Token " + Cookies.get("token"),
            },
          }
        )
        .then((res) => {
          setRoomAvailabilitiesNonResident(res.data.results);
        });
    }
  }, [startDate, endDate]);

  const singleResidentAdultPrice = React.useMemo(
    () => pricing.singleResidentAdultPrice(roomAvailabilities),
    [roomAvailabilities]
  );

  const singleNonResidentAdultPrice = React.useMemo(
    () => pricing.singleNonResidentAdultPrice(roomAvailabilitiesNonResident),
    [roomAvailabilitiesNonResident]
  );

  const singleResidentChildPrice = React.useMemo(
    () => pricing.singleResidentChildPrice(roomAvailabilities),
    [roomAvailabilities]
  );

  const singleNonResidentChildPrice = React.useMemo(
    () => pricing.singleNonResidentChildPrice(roomAvailabilitiesNonResident),
    [roomAvailabilitiesNonResident]
  );

  const doubleResidentAdultPrice = React.useMemo(
    () => pricing.doubleResidentAdultPrice(roomAvailabilities),
    [roomAvailabilities]
  );

  const doubleNonResidentAdultPrice = React.useMemo(
    () => pricing.doubleNonResidentAdultPrice(roomAvailabilitiesNonResident),
    [roomAvailabilitiesNonResident]
  );

  const doubleResidentChildPrice = React.useMemo(
    () => pricing.doubleResidentChildPrice(roomAvailabilities),
    [roomAvailabilities]
  );

  const doubleNonResidentChildPrice = React.useMemo(
    () => pricing.doubleNonResidentChildPrice(roomAvailabilitiesNonResident),
    [roomAvailabilitiesNonResident]
  );

  const tripleResidentAdultPrice = React.useMemo(
    () => pricing.tripleResidentAdultPrice(roomAvailabilities),
    [roomAvailabilities]
  );

  const tripleNonResidentAdultPrice = React.useMemo(
    () => pricing.tripleNonResidentAdultPrice(roomAvailabilitiesNonResident),
    [roomAvailabilitiesNonResident]
  );

  const tripleResidentChildPrice = React.useMemo(
    () => pricing.tripleResidentChildPrice(roomAvailabilities),
    [roomAvailabilities]
  );

  const tripleNonResidentChildPrice = React.useMemo(
    () => pricing.tripleNonResidentChildPrice(roomAvailabilitiesNonResident),
    [roomAvailabilitiesNonResident]
  );

  const infantResidentPrice = React.useMemo(
    () => pricing.infantResidentPrice(roomAvailabilities),
    [roomAvailabilities]
  );

  const infantNonResidentPrice = React.useMemo(
    () => pricing.infantNonResidentPrice(roomAvailabilitiesNonResident),
    [roomAvailabilitiesNonResident]
  );

  const formik = useFormik({
    initialValues: {
      rooms: [
        {
          residentAdult: 0,
          nonResidentAdult: 0,
          residentChild: 0,
          nonResidentChild: 0,
          infantResident: 0,
          infantNonResident: 0,
        },
      ],
    },

    validationSchema: Yup.object({
      rooms: Yup.array().of(
        Yup.object().shape({
          residentAdult: Yup.number(
            "Please enter a valid number of resident adults"
          ),
          nonResidentAdult: Yup.number(
            "Please enter a valid number of non-resident adults"
          ),
          residentChild: Yup.number(
            "Please enter a valid number of resident children"
          ),
          nonResidentChild: Yup.number(
            "Please enter a valid number of non-resident children"
          ),
          infantResident: Yup.number(
            "Please enter a valid number of resident infants"
          ),
          infantNonResident: Yup.number(
            "Please enter a valid number of non-resident infants"
          ),
        })
      ),
    }),

    onSubmit: (values) => {
      setOpenGuestModal(false);
    },
  });

  const nights = moment
    .duration(moment(endDate).diff(moment(startDate)))
    .asDays();

  const numberOfResidentAdult = React.useMemo(
    () =>
      formik.values.rooms.reduce((acc, cur) => {
        return acc + cur.residentAdult;
      }, 0),
    [formik.values.rooms]
  );

  const numberOfNonResidentAdult = React.useMemo(
    () =>
      formik.values.rooms.reduce((acc, cur) => acc + cur.nonResidentAdult, 0),
    [formik.values.rooms]
  );

  const numberOfResidentChild = React.useMemo(
    () => formik.values.rooms.reduce((acc, cur) => acc + cur.residentChild, 0),
    [formik.values.rooms]
  );

  const numberOfNonResidentChild = React.useMemo(
    () =>
      formik.values.rooms.reduce((acc, cur) => acc + cur.nonResidentChild, 0),
    [formik.values.rooms]
  );

  const numberOfInfantResident = React.useMemo(
    () => formik.values.rooms.reduce((acc, cur) => acc + cur.infantResident, 0),
    [formik.values.rooms]
  );

  const numberOfInfantNonResident = React.useMemo(
    () =>
      formik.values.rooms.reduce((acc, cur) => acc + cur.infantNonResident, 0),
    [formik.values.rooms]
  );

  const totalNumberOfGuests = React.useMemo(
    () =>
      numberOfResidentAdult +
      numberOfNonResidentAdult +
      numberOfResidentChild +
      numberOfNonResidentChild,
    [
      numberOfResidentAdult,
      numberOfNonResidentAdult,
      numberOfResidentChild,
      numberOfNonResidentChild,
    ]
  );

  const singleResidentAdultPriceCalc = singleResidentAdultPrice;

  const doubleResidentAdultPriceCalc = doubleResidentAdultPrice
    ? doubleResidentAdultPrice
    : singleResidentAdultPriceCalc * 2;

  const tripleResidentAdultPriceCalc = tripleResidentAdultPrice
    ? tripleResidentAdultPrice
    : doubleResidentAdultPriceCalc
    ? doubleResidentAdultPriceCalc * 3
    : singleResidentAdultPriceCalc * 3;

  const singleNonResidentAdultPriceCalc = singleNonResidentAdultPrice;

  const doubleNonResidentAdultPriceCalc = doubleNonResidentAdultPrice
    ? doubleNonResidentAdultPrice
    : singleNonResidentAdultPriceCalc * 2;

  const tripleNonResidentAdultPriceCalc = tripleNonResidentAdultPrice
    ? tripleNonResidentAdultPrice
    : doubleNonResidentAdultPriceCalc
    ? doubleNonResidentAdultPriceCalc * 3
    : singleNonResidentAdultPriceCalc * 3;

  const singleResidentChildPriceCalc = singleResidentChildPrice;

  const doubleResidentChildPriceCalc = doubleResidentChildPrice
    ? doubleResidentChildPrice
    : singleResidentChildPriceCalc * 2;

  const tripleResidentChildPriceCalc = tripleResidentChildPrice
    ? tripleResidentChildPrice
    : doubleResidentChildPriceCalc
    ? doubleResidentChildPriceCalc * 3
    : singleResidentChildPriceCalc * 3;

  const singleNonResidentChildPriceCalc = singleNonResidentChildPrice;

  const doubleNonResidentChildPriceCalc = doubleNonResidentChildPrice
    ? doubleNonResidentChildPrice
    : singleNonResidentChildPriceCalc * 2;

  const tripleNonResidentChildPriceCalc = tripleNonResidentChildPrice
    ? tripleNonResidentChildPrice
    : doubleNonResidentChildPriceCalc
    ? doubleNonResidentChildPriceCalc * 3
    : singleNonResidentChildPriceCalc * 3;

  const infantResidentPriceCalc = infantResidentPrice;

  const infantNonResidentPriceCalc = infantNonResidentPrice;

  function bestPricing(numGuests) {
    if (numGuests <= 0) {
      return []; // No guests, so return empty array
    } else if (numGuests === 1) {
      return ["single"]; // Only one guest, so use single room
    } else if (numGuests === 2) {
      return ["double"]; // Two guests, so use double room
    } else if (numGuests === 3) {
      return ["triple"]; // Three guests, so use triple room
    } else if (numGuests % 3 === 0) {
      return Array(numGuests / 3).fill("triple"); // Use all triple rooms
    } else if (numGuests % 3 === 1) {
      // Use one single room and the rest as triple rooms
      return ["single"].concat(Array((numGuests - 1) / 3).fill("triple"));
    } else {
      // Use one double room and the rest as triple rooms
      return ["double"].concat(Array((numGuests - 2) / 3).fill("triple"));
    }
  }

  function calculateCost(numGuests, singlePrice, doublePrice, triplePrice) {
    const roomTypes = bestPricing(
      numGuests,
      singlePrice,
      doublePrice,
      triplePrice
    );
    let totalCost = 0;
    for (let i = 0; i < roomTypes.length; i++) {
      if (roomTypes[i] === "single") {
        totalCost += singlePrice;
      } else if (roomTypes[i] === "double") {
        totalCost += doublePrice;
      } else {
        totalCost += triplePrice;
      }
    }
    return totalCost;
  }

  const totalResidentAdultMoreThanThree = calculateCost(
    numberOfResidentAdult,
    singleResidentAdultPriceCalc,
    doubleResidentAdultPriceCalc,
    tripleResidentAdultPriceCalc
  );

  const totalNonResidentAdultMoreThanThree = calculateCost(
    numberOfNonResidentAdult,
    singleNonResidentAdultPriceCalc,
    doubleNonResidentAdultPriceCalc,
    tripleNonResidentAdultPriceCalc
  );

  const totalResidentChildMoreThanThree = calculateCost(
    numberOfResidentChild,
    singleResidentChildPriceCalc,
    doubleResidentChildPriceCalc,
    tripleResidentChildPriceCalc
  );

  const totalNonResidentChildMoreThanThree = calculateCost(
    numberOfNonResidentChild,
    singleNonResidentChildPriceCalc,
    doubleNonResidentChildPriceCalc,
    tripleNonResidentChildPriceCalc
  );

  const getResidentTotalPrice = () => {
    let total = 0;

    formik.values.rooms.forEach((room) => {
      const sumOfGuests =
        room.residentAdult +
        room.nonResidentAdult +
        room.residentChild +
        room.nonResidentChild +
        room.infantResident +
        room.infantNonResident;

      if (sumOfGuests === 1) {
        if (room.residentAdult > 0) {
          total += singleResidentAdultPriceCalc;
        }
        if (room.residentChild > 0) {
          total += singleResidentChildPriceCalc;
        }
      } else if (sumOfGuests === 2) {
        if (room.residentAdult > 0) {
          total += doubleResidentAdultPriceCalc * room.residentAdult;
        }
        if (room.residentChild > 0) {
          total += doubleResidentChildPriceCalc * room.residentChild;
        }
      } else if (sumOfGuests === 3) {
        if (room.residentAdult > 0) {
          total += tripleResidentAdultPriceCalc * room.residentAdult;
        }
        if (room.residentChild > 0) {
          total += tripleResidentChildPriceCalc * room.residentChild;
        }
      }
    });

    residentFeesOptions.forEach((fee) => {
      if (fee.resident_fee_type === "WHOLE GROUP" && total > 0) {
        total += fee.price;
      } else if (
        fee.resident_fee_type === "PER PERSON PER NIGHT" &&
        fee.guest_type === "ADULT"
      ) {
        total += fee.price * numberOfResidentAdult * nights;
      } else if (
        fee.resident_fee_type === "PER PERSON PER NIGHT" &&
        fee.guest_type === "CHILD"
      ) {
        total += fee.price * numberOfResidentChild * nights;
      } else if (
        fee.resident_fee_type === "PER PERSON PER NIGHT" &&
        fee.guest_type === "INFANT"
      ) {
        total += fee.price * numberOfInfantResident * nights;
      } else if (fee.guest_type === "CHILD") {
        total += fee.price * numberOfResidentChild;
      } else if (fee.guest_type === "INFANT") {
        total += fee.price * numberOfInfantResident;
      } else {
        total += fee.price * numberOfResidentAdult;
      }
    });

    fees.forEach((fee) => {
      if (
        fee.name &&
        fee.price &&
        fee?.feeType?.value === "PER PERSON PER NIGHT" &&
        fee?.residentType?.value === "RESIDENT"
      ) {
        total += fee.price * numberOfResidentAdult * nights;
      } else if (
        fee.name &&
        fee.price &&
        fee?.feeType?.value === "WHOLE GROUP" &&
        fee?.residentType?.value === "RESIDENT"
      ) {
        total = total + Number(fee.price);
      } else if (
        fee.name &&
        fee.price &&
        fee?.feeType?.value === "PER PERSON" &&
        fee?.residentType?.value === "RESIDENT"
      ) {
        total += fee.price * numberOfResidentAdult;
      }
    });

    total += total * (residentCommision / 100);

    return total;
  };

  const getNonResidentTotalPrice = () => {
    let total = 0;

    formik.values.rooms.forEach((room) => {
      const sumOfGuests =
        room.residentAdult +
        room.nonResidentAdult +
        room.residentChild +
        room.nonResidentChild +
        room.infantResident +
        room.infantNonResident;

      if (sumOfGuests === 1) {
        if (room.nonResidentAdult > 0) {
          total += singleNonResidentAdultPriceCalc;
        }
        if (room.nonResidentChild > 0) {
          total += singleNonResidentChildPriceCalc;
        }
      } else if (sumOfGuests === 2) {
        if (room.nonResidentAdult > 0) {
          total += doubleNonResidentAdultPriceCalc * room.nonResidentAdult;
        }
        if (room.nonResidentChild > 0) {
          total += doubleNonResidentChildPriceCalc * room.nonResidentChild;
        }
      } else if (sumOfGuests === 3) {
        if (room.nonResidentAdult > 0) {
          total += tripleNonResidentAdultPriceCalc * room.nonResidentAdult;
        }
        if (room.nonResidentChild > 0) {
          total += tripleNonResidentChildPriceCalc * room.nonResidentChild;
        }
      }
    });

    nonResidentFeesOptions.forEach((fee) => {
      if (fee.nonresident_fee_type === "WHOLE GROUP" && total > 0) {
        total += fee.price;
      } else if (
        fee.nonresident_fee_type === "PER PERSON PER NIGHT" &&
        fee.guest_type === "ADULT"
      ) {
        total += fee.price * numberOfNonResidentAdult * nights;
      } else if (
        fee.nonresident_fee_type === "PER PERSON PER NIGHT" &&
        fee.guest_type === "CHILD"
      ) {
        total += fee.price * numberOfNonResidentChild * nights;
      } else if (
        fee.nonresident_fee_type === "PER PERSON PER NIGHT" &&
        fee.guest_type === "INFANT"
      ) {
        total += fee.price * numberOfInfantNonResident * nights;
      } else if (fee.guest_type === "CHILD") {
        total += fee.price * numberOfNonResidentChild;
      } else if (fee.guest_type === "INFANT") {
        total += fee.price * numberOfInfantNonResident;
      } else {
        total += fee.price * numberOfNonResidentAdult;
      }
    });

    fees.forEach((fee) => {
      if (
        fee.name &&
        fee.price &&
        fee?.feeType?.value === "PER PERSON PER NIGHT" &&
        fee?.residentType?.value === "NON-RESIDENT"
      ) {
        total += fee.price * numberOfNonResidentAdult * nights;
      } else if (
        fee.name &&
        fee.price &&
        fee?.feeType?.value === "WHOLE GROUP"
      ) {
        total += fee.price;
      } else if (
        fee.name &&
        fee.price &&
        fee?.feeType?.value === "PER PERSON"
      ) {
        total += fee.price * numberOfNonResidentAdult;
      }
    });

    total += total * (nonResidentCommision / 100);

    return total;
  };

  const [openGuestModal, setOpenGuestModal] = React.useState(false);

  const isResidentAdultAvailable = React.useMemo(
    () => pricing.isResidentAdultAvailable(room),
    [room]
  );

  const isResidentChildAvailable = React.useMemo(
    () => pricing.isResidentChildAvailable(room),
    [room]
  );

  const isNonResidentAdultAvailable = React.useMemo(
    () => pricing.isNonResidentAdultAvailable(room),
    [room]
  );

  const isNonResidentChildAvailable = React.useMemo(
    () => pricing.isNonResidentChildAvailable(room),
    [room]
  );

  const isResidentInfantAvailable = React.useMemo(
    () => pricing.isResidentInfantAvailable(room),
    [room]
  );

  const isNonResidentInfantAvailable = React.useMemo(
    () => pricing.isNonResidentInfantAvailable(room),
    [room]
  );

  const adultAgeGroup = React.useMemo(
    () => pricing.adultAgeGroup(room),
    [room]
  );

  const childAgeGroup = React.useMemo(
    () => pricing.childAgeGroup(room),
    [room]
  );

  const infantAgeGroup = React.useMemo(
    () => pricing.infantAgeGroup(room),
    [room]
  );

  return (
    <div className="min-w-[250px] h-[full] px-4 relative flex flex-col justify-around py-3 shadow-lg selected-card-gradient rounded-lg">
      <div className="text-sm text-black flex w-full flex-col gap-1 font-bold absolute left-0 right-0 top-2">
        <div className="px-2">
          <div
            onClick={() => {
              setOpenGuestModal(true);
            }}
            id="step4"
            className="bg-white border text-xs flex gap-1 items-center justify-center px-2 py-2 font-bold cursor-pointer rounded-md"
          >
            <Icon className="w-4 h-4" icon="material-symbols:calculate" />
            Add guest to calculate
          </div>
        </div>
        {/* <div className="w-full h-[1px] bg-white"></div> */}
        <div className="px-3">{room.name}</div>
      </div>

      <div className="flex gap-1 mt-4">
        {getResidentTotalPrice() ? (
          <div className="flex gap-1">
            <Price
              stayPrice={getResidentTotalPrice()}
              currency="KES"
              autoCurrency={false}
              className="!text-3xl !font-SourceSans !font-semibold !text-black"
            ></Price>

            <PopoverBox
              panelClassName="bg-white rounded-md after:!left-[27%] after:!border-b-gray-200 tooltip -left-[50px] border shadow-md mt-2 w-[200px] p-1"
              btnClassName=""
              btnPopover={
                <div className="mt-4">
                  <Icon
                    className="text-gray-400 text-sm"
                    icon="bi:info-circle-fill"
                  />
                </div>
              }
              popoverClassName=""
            >
              <div className="text-sm">Resident pricing</div>
            </PopoverBox>
          </div>
        ) : (
          ""
        )}

        {getNonResidentTotalPrice() && getResidentTotalPrice() ? (
          <h1 className="!text-3xl !font-SourceSans !font-semibold !text-black">
            /
          </h1>
        ) : (
          ""
        )}

        {getNonResidentTotalPrice() ? (
          <div className="flex gap-1">
            <Price
              stayPrice={getNonResidentTotalPrice()}
              autoCurrency={false}
              className="!text-3xl !font-SourceSans !font-semibold !text-black"
            ></Price>

            <PopoverBox
              panelClassName="bg-white rounded-md after:!left-[27%] after:!border-b-gray-200 tooltip -left-[50px] border shadow-md mt-2 w-[200px] p-1"
              btnClassName=""
              btnPopover={
                <div className="mt-4">
                  <Icon
                    className="text-gray-400 text-sm"
                    icon="bi:info-circle-fill"
                  />
                </div>
              }
              popoverClassName=""
            >
              <div className="text-sm">Non-resident pricing</div>
            </PopoverBox>
          </div>
        ) : (
          ""
        )}

        {!getNonResidentTotalPrice() && !getResidentTotalPrice() ? (
          <div className="!text-3xl !font-SourceSans !font-semibold !text-black">
            $0
          </div>
        ) : (
          ""
        )}
      </div>

      <div className="flex flex-col items-center gap-2 absolute left-0 right-0 w-full bottom-2">
        {/* <div className="w-full h-[1px] bg-gray-200"></div> */}
        <PopoverBox
          panelClassName="bg-white rounded-xl after:!left-[30%] tooltip shadow-md mt-2 border w-[500px] max-h-[300px] overflow-y-scroll -left-[0px]"
          btnClassName="w-full"
          btnPopover={
            <div className="bg-white border !w-full flex items-center justify-center px-2 py-1 text-xs font-bold cursor-pointer rounded-md">
              Price breakdown
              <Icon
                className="w-6 h-6"
                icon="material-symbols:arrow-drop-down-rounded"
              />
            </div>
          }
          popoverClassName="w-full px-2"
        >
          {/* <h1 className="font-bold mb-2 font-SourceSans">Price breakdown</h1> */}

          <div className="w-full bg-gray-200 rounded-t-lg px-3 py-2">
            <h1 className="font-semibold font-SourceSans text-base">
              Price breakdown
            </h1>
          </div>

          <div className="mb-2 mt-2 w-fit px-2">
            <h1 className="text-gray-600 text-sm border-b border-b-gray-400 border-dashed">
              (PP = Per Person)
            </h1>
          </div>
          {formik.values.rooms.map((room, index) => {
            const sumOfGuests =
              room.residentAdult +
              room.nonResidentAdult +
              room.residentChild +
              room.nonResidentChild +
              room.infantResident +
              room.infantNonResident;

            return (
              <div key={index} className="flex flex-col gap-2 px-2 mb-3">
                <h1 className="font-semibold font-SourceSans text-sm">
                  Room {index + 1} :{" "}
                  <span className="font-medium">
                    {room.residentAdult > 0
                      ? `${room.residentAdult} resident adult`
                      : ""}
                  </span>
                </h1>
                {sumOfGuests === 1 && (
                  <div className="flex flex-col pl-3 gap-2">
                    {room.residentAdult > 0 && (
                      <div className="px-3 flex bg-gray-100 font-SourceSans justify-between items-center py-1 w-full">
                        <h1 className="text-sm font-semibold">
                          Single resident adult ({nights} nights)
                        </h1>
                        <div className="flex gap-1 items-center">
                          <Price
                            currency="KES"
                            stayPrice={singleResidentAdultPriceCalc}
                            autoCurrency={false}
                            className="!font-normal !text-sm !font-SourceSans"
                          ></Price>{" "}
                          <span className="font-semibold mb-1">pp</span>
                        </div>
                      </div>
                    )}

                    {room.nonResidentAdult > 0 && (
                      <div className="px-3 flex bg-gray-100 font-SourceSans justify-between items-center py-1 w-full">
                        <h1 className="text-sm font-semibold">
                          Single non-resident adult ({nights} nights)
                        </h1>

                        <div className="flex gap-1 items-center">
                          <Price
                            autoCurrency={false}
                            stayPrice={singleNonResidentAdultPriceCalc}
                            className="!font-normal !text-sm !font-SourceSans"
                          ></Price>
                          <span className="font-semibold mb-1">pp</span>
                        </div>
                      </div>
                    )}

                    {room.residentChild > 0 && (
                      <div className="px-3 flex bg-gray-100 font-SourceSans justify-between items-center py-1 w-full">
                        <h1 className="text-sm font-semibold">
                          Single resident child ({nights} nights)
                        </h1>

                        <div className="flex gap-1 items-center">
                          <Price
                            currency="KES"
                            autoCurrency={false}
                            stayPrice={singleResidentChildPriceCalc}
                            className="!font-normal !text-sm !font-SourceSans"
                          ></Price>

                          <span className="font-semibold mb-1">pp</span>
                        </div>
                      </div>
                    )}

                    {room.nonResidentChild > 0 && (
                      <div className="px-3 flex bg-gray-100 font-SourceSans justify-between items-center py-1 w-full">
                        <h1 className="text-sm font-semibold">
                          Single non-resident child ({nights} nights)
                        </h1>

                        <div className="flex gap-1 items-center">
                          <Price
                            autoCurrency={false}
                            stayPrice={singleNonResidentChildPriceCalc}
                            className="!font-normal !text-sm !font-SourceSans"
                          ></Price>

                          <span className="font-semibold mb-1">pp</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {sumOfGuests === 2 && (
                  <div className="flex flex-col pl-3 gap-2">
                    {room.residentAdult > 0 && (
                      <div className="px-3 flex bg-gray-100 font-SourceSans justify-between items-center py-1 w-full">
                        <h1 className="text-sm font-semibold">
                          Double resident adult ({nights} nights)
                        </h1>

                        <div className="flex gap-1 items-center">
                          <Price
                            currency="KES"
                            stayPrice={doubleResidentAdultPriceCalc}
                            autoCurrency={false}
                            className="!font-normal !text-sm !font-SourceSans"
                          ></Price>{" "}
                          <span className="font-semibold mb-1">pp</span>
                        </div>
                      </div>
                    )}

                    {room.nonResidentAdult > 0 && (
                      <div className="px-3 flex bg-gray-100 font-SourceSans justify-between items-center py-1 w-full">
                        <h1 className="text-sm font-semibold">
                          Double non-resident adult ({nights} nights)
                        </h1>

                        <div className="flex gap-1 items-center">
                          <Price
                            autoCurrency={false}
                            stayPrice={doubleNonResidentAdultPriceCalc}
                            className="!font-normal !text-sm !font-SourceSans"
                          ></Price>

                          <span className="font-semibold mb-1">pp</span>
                        </div>
                      </div>
                    )}

                    {room.residentChild > 0 && (
                      <div className="px-3 flex bg-gray-100 font-SourceSans justify-between items-center py-1 w-full">
                        <h1 className="text-sm font-semibold">
                          Double resident child ({nights} nights)
                        </h1>

                        <div className="flex gap-1 items-center">
                          <Price
                            currency="KES"
                            autoCurrency={false}
                            stayPrice={doubleResidentChildPriceCalc}
                            className="!font-normal !text-sm !font-SourceSans"
                          ></Price>

                          <span className="font-semibold mb-1">pp</span>
                        </div>
                      </div>
                    )}

                    {room.nonResidentChild > 0 && (
                      <div className="px-3 flex bg-gray-100 font-SourceSans justify-between items-center py-1 w-full">
                        <h1 className="text-sm font-semibold">
                          Double resident child ({nights} nights)
                        </h1>

                        <div className="flex gap-1 items-center">
                          <Price
                            autoCurrency={false}
                            stayPrice={doubleNonResidentChildPriceCalc}
                            className="!font-normal !text-sm !font-SourceSans"
                          ></Price>

                          <span className="font-semibold mb-1">pp</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {sumOfGuests === 3 && (
                  <div className="flex flex-col pl-3 gap-2">
                    {room.residentAdult > 0 && (
                      <div className="px-3 flex bg-gray-100 font-SourceSans justify-between items-center py-1 w-full">
                        <h1 className="text-sm font-semibold">
                          Triple resident adult ({nights} nights)
                        </h1>

                        <div className="flex gap-1 items-center">
                          <Price
                            currency="KES"
                            autoCurrency={false}
                            stayPrice={tripleResidentAdultPriceCalc}
                            className="!font-normal !text-sm !font-SourceSans"
                          ></Price>
                          <span className="font-semibold mb-1">pp</span>
                        </div>
                      </div>
                    )}

                    {room.nonResidentAdult > 0 && (
                      <div className="px-3 flex bg-gray-100 font-SourceSans justify-between items-center py-1 w-full">
                        <h1 className="text-sm font-semibold">
                          Triple non-resident adult ({nights} nights)
                        </h1>

                        <div className="flex gap-1 items-center">
                          <Price
                            autoCurrency={false}
                            stayPrice={tripleNonResidentAdultPriceCalc}
                            className="!font-normal !text-sm !font-SourceSans"
                          ></Price>

                          <span className="font-semibold mb-1">pp</span>
                        </div>
                      </div>
                    )}

                    {room.residentChild > 0 && (
                      <div className="px-3 flex bg-gray-100 font-SourceSans justify-between items-center py-1 w-full">
                        <h1 className="text-sm font-semibold">
                          Triple resident child ({nights} nights)
                        </h1>

                        <div className="flex gap-1 items-center">
                          <Price
                            currency="KES"
                            autoCurrency={false}
                            stayPrice={tripleResidentChildPriceCalc}
                            className="!font-normal !text-sm !font-SourceSans"
                          ></Price>

                          <span className="font-semibold mb-1">pp</span>
                        </div>
                      </div>
                    )}

                    {room.nonResidentChild > 0 && (
                      <div className="px-3 flex bg-gray-100 font-SourceSans justify-between items-center py-1 w-full">
                        <h1 className="text-sm font-semibold">
                          Triple resident child ({nights} nights)
                        </h1>

                        <div className="flex gap-1 items-center">
                          <Price
                            autoCurrency={false}
                            stayPrice={tripleNonResidentChildPriceCalc}
                            className="!font-normal !text-sm !font-SourceSans"
                          ></Price>

                          <span className="font-semibold mb-1">pp</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
          <div className="flex flex-col gap-2 px-2 mb-3">
            {residentFeesOptions.length > 0 && (
              <div className="flex flex-col gap-4 mt-2">
                <div className="w-full h-[1px] bg-gray-200"></div>
                <h1 className="font-semibold text-sm font-SourceSans">
                  Resident Fees
                </h1>
              </div>
            )}
            {residentFeesOptions.map((fee, index) => {
              return (
                <div key={index} className="flex flex-col gap-2 px-2">
                  <div className="px-3 flex bg-gray-100 font-SourceSans justify-between items-center py-1 w-full">
                    <h1 className="text-sm font-semibold">
                      {fee.name} (
                      {fee.resident_fee_type === "WHOLE GROUP"
                        ? "Whole group"
                        : fee.resident_fee_type === "PER PERSON PER NIGHT"
                        ? "Per person per night"
                        : "Per person"}{" "}
                      -{" "}
                      {fee.guest_type === "CHILD"
                        ? "Child"
                        : fee.guest_type === "INFANT"
                        ? "Infant"
                        : "Adult"}
                      )
                    </h1>
                    <div className="flex gap-1 items-center">
                      <Price
                        currency="KES"
                        stayPrice={fee.price}
                        autoCurrency={false}
                        className="!font-normal !text-sm !font-SourceSans"
                      ></Price>{" "}
                    </div>
                  </div>
                </div>
              );
            })}

            {nonResidentFeesOptions.length > 0 && (
              <h1 className="font-semibold text-sm font-SourceSans">
                Non-resident Fees
              </h1>
            )}
            {nonResidentFeesOptions.map((fee, index) => {
              return (
                <div key={index} className="flex flex-col gap-2 px-2">
                  <div className="px-3 flex bg-gray-100 font-SourceSans justify-between items-center py-1 w-full">
                    <h1 className="text-sm font-semibold">
                      {fee.name} (
                      {fee.nonresident_fee_type === "WHOLE GROUP"
                        ? "Whole group"
                        : fee.nonresident_fee_type === "PER PERSON PER NIGHT"
                        ? "Per person per night"
                        : "Per person"}{" "}
                      -{" "}
                      {fee.guest_type === "CHILD"
                        ? "Child"
                        : fee.guest_type === "INFANT"
                        ? "Infant"
                        : "Adult"}
                      )
                    </h1>
                    <div className="flex gap-1 items-center">
                      <Price
                        stayPrice={fee.price}
                        autoCurrency={false}
                        className="!font-normal !text-sm !font-SourceSans"
                      ></Price>{" "}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex flex-col gap-2 px-2 mb-3">
            {fees.length > 0 && (
              <div className="flex flex-col gap-4 mt-2">
                <div className="w-full h-[1px] bg-gray-200"></div>
                <h1 className="font-semibold text-sm font-SourceSans">
                  Extra Fees
                </h1>
              </div>
            )}

            {fees.map((fee, index) => {
              return (
                <div key={index} className="flex flex-col gap-2 px-2">
                  <div className="px-3 flex bg-gray-100 font-SourceSans justify-between items-center py-1 w-full">
                    <h1 className="text-sm font-semibold">
                      {fee.name}(
                      {fee.fee_type === "WHOLE GROUP"
                        ? "Whole group"
                        : fee.fee_type === "PER PERSON PER NIGHT"
                        ? "Per person per night"
                        : "Per person"}
                      )
                    </h1>
                    <div className="flex gap-1 items-center">
                      <Price
                        stayPrice={fee.price}
                        autoCurrency={false}
                        className="!font-normal !text-sm !font-SourceSans"
                      ></Price>{" "}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </PopoverBox>

        {/* {(residentFees.length > 0 || nonResidentFees.length > 0) && (
          <PopoverBox
            panelClassName="bg-white rounded-lg after:!left-[30%] tooltip shadow-md mt-2 border w-[500px] -left-[100px] !p-0"
            btnClassName=""
            btnPopover={
              <div className="bg-red-200 flex items-center justify-center px-2 py-1 text-xs font-bold cursor-pointer rounded-full">
                Extra fees
                <Icon
                  className="w-6 h-6"
                  icon="material-symbols:arrow-drop-down-rounded"
                />
              </div>
            }
            popoverClassName=""
          >
            <div className="w-full bg-gray-200 rounded-t-lg px-3 py-2">
              <h1 className="font-semibold font-SourceSans text-base">
                Add extra fees
              </h1>
            </div>
            <div className="flex flex-col">
              {residentFees.map((fee, index) => (
                <div key={index} className="px-2 py-2">
                  <div className="flex justify-between items-center">
                    <h1 className="text-sm">
                      {fee.name}{" "}
                      <span className="font-normal">(For resident)</span>
                      <span className="font-normal">
                        {" "}
                        ={" "}
                        <Price
                          stayPrice={fee.price}
                          autoCurrency={false}
                          currency="KES"
                          className="!text-sm !font-SourceSans inline !font-semibold !text-gray-600"
                        ></Price>{" "}
                        pp
                      </span>
                    </h1>

                    <Checkbox
                      checked={containsResidentOption(fee)}
                      value={fee}
                      onChange={(event) => handleResidentCheck(event, fee)}
                    ></Checkbox>
                  </div>
                </div>
              ))}

              <hr />

              {nonResidentFees.map((fee, index) => (
                <div key={index} className="px-2 py-2">
                  <div className="flex justify-between items-center">
                    <h1 className="text-sm">
                      {fee.name}{" "}
                      <span className="font-normal">(For non-resident)</span>
                      <span className="font-normal">
                        {" "}
                        ={" "}
                        <Price
                          stayPrice={fee.price}
                          autoCurrency={false}
                          className="!text-sm !font-SourceSans inline !font-semibold !text-gray-600"
                        ></Price>{" "}
                        pp
                      </span>
                    </h1>

                    <Checkbox
                      checked={containsNonResidentOption(fee)}
                      value={fee}
                      onChange={(event) => handleNonResidentCheck(event, fee)}
                    ></Checkbox>
                  </div>
                </div>
              ))}
            </div>
          </PopoverBox>
        )} */}

        <Dialogue
          isOpen={openGuestModal}
          closeModal={() => {
            setOpenGuestModal(false);
          }}
          dialogueTitleClassName="!font-bold !ml-4 !text-xl md:!text-2xl"
          outsideDialogueClass="!p-0"
          dialoguePanelClassName={
            "md:!rounded-md !rounded-none !p-0 overflow-y-scroll remove-scroll !max-w-2xl screen-height-safari md:!min-h-0 md:!max-h-[550px] "
          }
        >
          <div
            onClick={() => {
              setOpenGuestModal(false);
            }}
            className="border-b px-4 py-2 bg-gray-200 flex items-center gap-4"
          >
            <div className="w-[30px] h-[30px] cursor-pointer rounded-full border border-gray-400 flex items-center justify-center">
              <Icon className="w-6 h-6" icon="iconoir:cancel" />
            </div>
            <h1 className="font-bold font-SourceSans">
              Add guests to {room.name}
            </h1>
          </div>

          <div className="py-0.5 border-b border-gray-400 border-dashed my-2 text-sm flex gap-1 w-fit mx-4">
            <Icon
              className="w-5 h-5 text-gray-500"
              icon="material-symbols:group-rounded"
            />
            <span>Room has adult capacity of {room.capacity}</span>
          </div>

          <div className="px-4 my-2 gap-2 flex flex-col">
            {formik.values.rooms.map((item, index) => {
              const sumOfGuests =
                item.residentAdult +
                item.nonResidentAdult +
                item.residentChild +
                item.nonResidentChild;

              const sumChildGuests = item.residentChild + item.nonResidentChild;

              const sumInfantGuests =
                item.infantNonResident + item.infantResident;
              return (
                <div
                  key={index}
                  className="flex flex-col font-SourceSans gap-2"
                >
                  <h1 className="font-bold">Room {index + 1}</h1>
                  <div
                    className={
                      "flex items-center justify-between mt-2 " +
                      (isResidentAdultAvailable ? "" : "opacity-40")
                    }
                  >
                    <h1>
                      Resident adult{" "}
                      {adultAgeGroup && <span>({adultAgeGroup})</span>}
                    </h1>

                    <div className="flex gap-2 items-center">
                      <div
                        onClick={() => {
                          if (isResidentAdultAvailable) {
                            formik.setFieldValue(
                              `rooms[${index}].residentAdult`,
                              formik.values.rooms[index].residentAdult > 0
                                ? formik.values.rooms[index].residentAdult - 1
                                : 0
                            );
                          }
                        }}
                        className={
                          "w-[32px] font-bold text-lg h-[32px] rounded-full border flex items-center justify-center " +
                          (isResidentAdultAvailable
                            ? "cursor-pointer"
                            : "cursor-not-allowed")
                        }
                      >
                        {" "}
                        -{" "}
                      </div>
                      <h1 className="font-bold text-sm">
                        {item.residentAdult}
                      </h1>
                      <div
                        onClick={() => {
                          if (
                            isResidentAdultAvailable &&
                            sumOfGuests < room.capacity
                          ) {
                            formik.setFieldValue(
                              `rooms[${index}].residentAdult`,
                              formik.values.rooms[index].residentAdult + 1
                            );
                          }
                        }}
                        className={
                          "w-[32px] font-bold text-lg h-[32px] rounded-full border flex items-center justify-center " +
                          (isResidentAdultAvailable
                            ? "cursor-pointer"
                            : "cursor-not-allowed")
                        }
                      >
                        {" "}
                        +{" "}
                      </div>
                    </div>
                  </div>

                  <div
                    className={
                      "flex items-center justify-between mt-2 " +
                      (isResidentChildAvailable ? "" : "opacity-40")
                    }
                  >
                    <h1>
                      Resident child{" "}
                      {childAgeGroup && <span>({childAgeGroup})</span>}
                    </h1>

                    <div className="flex gap-2 items-center">
                      <div
                        onClick={() => {
                          if (isResidentChildAvailable) {
                            formik.setFieldValue(
                              `rooms[${index}].residentChild`,
                              formik.values.rooms[index].residentChild > 0
                                ? formik.values.rooms[index].residentChild - 1
                                : 0
                            );
                          }
                        }}
                        className={
                          "w-[32px] font-bold text-lg h-[32px] rounded-full border flex items-center justify-center " +
                          (isResidentChildAvailable
                            ? "cursor-pointer"
                            : "cursor-not-allowed")
                        }
                      >
                        {" "}
                        -{" "}
                      </div>
                      <h1 className="font-bold text-sm">
                        {item.residentChild}
                      </h1>
                      <div
                        onClick={() => {
                          if (
                            isResidentChildAvailable &&
                            (sumChildGuests < room.child_capacity ||
                              sumOfGuests < room.capacity)
                          ) {
                            formik.setFieldValue(
                              `rooms[${index}].residentChild`,
                              formik.values.rooms[index].residentChild + 1
                            );
                          }
                        }}
                        className={
                          "w-[32px] font-bold text-lg h-[32px] rounded-full border flex items-center justify-center " +
                          (isResidentChildAvailable
                            ? "cursor-pointer"
                            : "cursor-not-allowed")
                        }
                      >
                        {" "}
                        +{" "}
                      </div>
                    </div>
                  </div>

                  <div
                    className={
                      "flex items-center justify-between mt-2 " +
                      (isNonResidentAdultAvailable ? "" : "opacity-40")
                    }
                  >
                    <h1>
                      Non-resident adult{" "}
                      {adultAgeGroup && <span>({adultAgeGroup})</span>}
                    </h1>

                    <div className="flex gap-2 items-center">
                      <div
                        onClick={() => {
                          if (isNonResidentAdultAvailable) {
                            formik.setFieldValue(
                              `rooms[${index}].nonResidentAdult`,
                              formik.values.rooms[index].nonResidentAdult > 0
                                ? formik.values.rooms[index].nonResidentAdult -
                                    1
                                : 0
                            );
                          }
                        }}
                        className={
                          "w-[32px] font-bold text-lg h-[32px] rounded-full border flex items-center justify-center " +
                          (isNonResidentAdultAvailable
                            ? "cursor-pointer"
                            : "cursor-not-allowed")
                        }
                      >
                        {" "}
                        -{" "}
                      </div>
                      <h1 className="font-bold text-sm">
                        {item.nonResidentAdult}
                      </h1>
                      <div
                        onClick={() => {
                          if (
                            isNonResidentAdultAvailable &&
                            sumOfGuests < room.capacity
                          ) {
                            formik.setFieldValue(
                              `rooms[${index}].nonResidentAdult`,
                              formik.values.rooms[index].nonResidentAdult + 1
                            );
                          }
                        }}
                        className={
                          "w-[32px] font-bold text-lg h-[32px] rounded-full border flex items-center justify-center " +
                          (isNonResidentAdultAvailable
                            ? "cursor-pointer"
                            : "cursor-not-allowed")
                        }
                      >
                        {" "}
                        +{" "}
                      </div>
                    </div>
                  </div>

                  <div
                    className={
                      "flex items-center justify-between mt-2 " +
                      (isNonResidentChildAvailable ? "" : "opacity-40")
                    }
                  >
                    <h1>
                      Non-resident child{" "}
                      {childAgeGroup && <span>({childAgeGroup})</span>}
                    </h1>

                    <div className="flex gap-2 items-center">
                      <div
                        onClick={() => {
                          if (isNonResidentChildAvailable) {
                            formik.setFieldValue(
                              `rooms[${index}].nonResidentChild`,
                              formik.values.rooms[index].nonResidentChild > 0
                                ? formik.values.rooms[index].nonResidentChild -
                                    1
                                : 0
                            );
                          }
                        }}
                        className={
                          "w-[32px] font-bold text-lg h-[32px] rounded-full border flex items-center justify-center " +
                          (isNonResidentChildAvailable
                            ? "cursor-pointer"
                            : "cursor-not-allowed")
                        }
                      >
                        {" "}
                        -{" "}
                      </div>
                      <h1 className="font-bold text-sm">
                        {item.nonResidentChild}
                      </h1>
                      <div
                        onClick={() => {
                          if (
                            isNonResidentChildAvailable &&
                            (sumChildGuests < room.child_capacity ||
                              sumOfGuests < room.capacity)
                          ) {
                            formik.setFieldValue(
                              `rooms[${index}].nonResidentChild`,
                              formik.values.rooms[index].nonResidentChild + 1
                            );
                          }
                        }}
                        className={
                          "w-[32px] font-bold text-lg h-[32px] rounded-full border flex items-center justify-center " +
                          (isNonResidentChildAvailable
                            ? "cursor-pointer"
                            : "cursor-not-allowed")
                        }
                      >
                        {" "}
                        +{" "}
                      </div>
                    </div>
                  </div>

                  <div
                    className={
                      "flex items-center justify-between mt-2 " +
                      (isResidentInfantAvailable ? "" : "opacity-40")
                    }
                  >
                    <h1>
                      Resident infant{" "}
                      {infantAgeGroup && <span>({infantAgeGroup})</span>}
                    </h1>

                    <div className="flex gap-2 items-center">
                      <div
                        onClick={() => {
                          if (isResidentInfantAvailable) {
                            formik.setFieldValue(
                              `rooms[${index}].infantResident`,
                              formik.values.rooms[index].infantResident > 0
                                ? formik.values.rooms[index].infantResident - 1
                                : 0
                            );
                          }
                        }}
                        className={
                          "w-[32px] font-bold text-lg h-[32px] rounded-full border flex items-center justify-center " +
                          (isResidentInfantAvailable
                            ? "cursor-pointer"
                            : "cursor-not-allowed")
                        }
                      >
                        {" "}
                        -{" "}
                      </div>
                      <h1 className="font-bold text-sm">
                        {item.infantResident}
                      </h1>
                      <div
                        onClick={() => {
                          if (
                            isResidentInfantAvailable &&
                            sumInfantGuests < room.infant_capacity
                          ) {
                            formik.setFieldValue(
                              `rooms[${index}].infantResident`,
                              formik.values.rooms[index].infantResident + 1
                            );
                          }
                        }}
                        className={
                          "w-[32px] font-bold text-lg h-[32px] rounded-full border flex items-center justify-center " +
                          (isResidentInfantAvailable
                            ? "cursor-pointer"
                            : "cursor-not-allowed")
                        }
                      >
                        {" "}
                        +{" "}
                      </div>
                    </div>
                  </div>

                  <div
                    className={
                      "flex items-center justify-between mt-2 " +
                      (isNonResidentInfantAvailable ? "" : "opacity-40")
                    }
                  >
                    <h1>
                      Non-resident infant{" "}
                      {infantAgeGroup && <span>({infantAgeGroup})</span>}
                    </h1>

                    <div className="flex gap-2 items-center">
                      <div
                        onClick={() => {
                          if (isNonResidentInfantAvailable) {
                            formik.setFieldValue(
                              `rooms[${index}].infantNonResident`,
                              formik.values.rooms[index].infantNonResident > 0
                                ? formik.values.rooms[index].infantNonResident -
                                    1
                                : 0
                            );
                          }
                        }}
                        className={
                          "w-[32px] font-bold text-lg h-[32px] rounded-full border flex items-center justify-center " +
                          (isNonResidentInfantAvailable
                            ? "cursor-pointer"
                            : "cursor-not-allowed")
                        }
                      >
                        {" "}
                        -{" "}
                      </div>
                      <h1 className="font-bold text-sm">
                        {item.infantNonResident}
                      </h1>
                      <div
                        onClick={() => {
                          if (
                            isNonResidentInfantAvailable &&
                            sumInfantGuests < room.infant_capacity
                          ) {
                            formik.setFieldValue(
                              `rooms[${index}].infantNonResident`,
                              formik.values.rooms[index].infantNonResident + 1
                            );
                          }
                        }}
                        className={
                          "w-[32px] font-bold text-lg h-[32px] rounded-full border flex items-center justify-center " +
                          (isNonResidentInfantAvailable
                            ? "cursor-pointer"
                            : "cursor-not-allowed")
                        }
                      >
                        {" "}
                        +{" "}
                      </div>
                    </div>
                  </div>

                  {index > 0 && (
                    <div
                      onClick={() => {
                        formik.setFieldValue(
                          "rooms",
                          formik.values.rooms.filter((_, i) => i !== index)
                        );
                      }}
                      className="cursor-pointer font-semibold w-fit ml-auto font-SourceSans text-red-500 mt-2"
                    >
                      Remove room
                    </div>
                  )}

                  <div className="mt-2 h-[1px] w-full bg-gray-200"></div>
                </div>
              );
            })}

            <h1
              onClick={() => {
                formik.setFieldValue("rooms", [
                  ...formik.values.rooms,
                  {
                    residentAdult: 0,
                    nonResidentAdult: 0,
                    residentChild: 0,
                    nonResidentChild: 0,
                    infantResident: 0,
                    infantNonResident: 0,
                  },
                ]);
              }}
              className="font-semibold text-blue-600 font-SourceSans mt-2 cursor-pointer w-fit"
            >
              Add another room
            </h1>

            <Button
              onClick={() => {
                formik.handleSubmit();
              }}
              type={"submit"}
              className="!w-full mt-4 btn-gradient-2 !h-full !rounded-3xl font-bold"
            >
              Done
            </Button>
          </div>
        </Dialogue>
      </div>
    </div>
  );
}

SelectedListingCard.propTypes = {};

export default SelectedListingCard;
