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

function SelectedListingCard({ room, addedRooms }) {
  const router = useRouter();

  const [roomAvailabilities, setRoomAvailabilities] = React.useState([]);

  const [roomAvailabilitiesNonResident, setRoomAvailabilitiesNonResident] =
    React.useState([]);

  useEffect(() => {
    if (router.query.date && router.query.endDate) {
      axios
        .get(
          `${process.env.NEXT_PUBLIC_baseURL}/room-types/${
            room.slug
          }/resident-availabilities/?start_date=${
            router.query.date
          }&end_date=${moment(router.query.endDate)
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
          }/nonresident-availabilities/?start_date=${
            router.query.date
          }&end_date=${moment(router.query.endDate)
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
  }, [router.query.date, router.query.endDate]);

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

  const nights = moment
    .duration(moment(router.query.endDate).diff(moment(router.query.date)))
    .asDays();

  const numberOfResidentAdult = React.useMemo(
    () =>
      addedRooms.reduce((acc, cur) => {
        return acc + cur.residentAdult;
      }, 0),
    [addedRooms]
  );

  const numberOfNonResidentAdult = React.useMemo(
    () => addedRooms.reduce((acc, cur) => acc + cur.nonResidentAdult, 0),
    [addedRooms]
  );

  const numberOfResidentChild = React.useMemo(
    () => addedRooms.reduce((acc, cur) => acc + cur.residentChild, 0),
    [addedRooms]
  );

  const numberOfNonResidentChild = React.useMemo(
    () => addedRooms.reduce((acc, cur) => acc + cur.nonResidentChild, 0),
    [addedRooms]
  );

  const numberOfInfantResident = React.useMemo(
    () => addedRooms.reduce((acc, cur) => acc + cur.infantResident, 0),
    [addedRooms]
  );

  const numberOfInfantNonResident = React.useMemo(
    () => addedRooms.reduce((acc, cur) => acc + cur.infantNonResident, 0),
    [addedRooms]
  );

  const singleResidentAdultPriceCalc = singleResidentAdultPrice;

  const doubleResidentAdultPriceCalc = doubleResidentAdultPrice
    ? doubleResidentAdultPrice
    : singleResidentAdultPriceCalc * 2;

  const tripleResidentAdultPriceCalc = tripleResidentAdultPrice
    ? tripleResidentAdultPrice
    : singleResidentAdultPriceCalc && doubleResidentAdultPriceCalc
    ? doubleResidentAdultPriceCalc + singleResidentAdultPriceCalc
    : singleResidentAdultPriceCalc * 3;

  const singleNonResidentAdultPriceCalc = singleNonResidentAdultPrice;

  const doubleNonResidentAdultPriceCalc = doubleNonResidentAdultPrice
    ? doubleNonResidentAdultPrice
    : singleNonResidentAdultPriceCalc * 2;

  const tripleNonResidentAdultPriceCalc = tripleNonResidentAdultPrice
    ? tripleNonResidentAdultPrice
    : singleNonResidentAdultPriceCalc && doubleNonResidentAdultPriceCalc
    ? doubleNonResidentAdultPriceCalc + singleNonResidentAdultPriceCalc
    : singleNonResidentAdultPriceCalc * 3;

  const singleResidentChildPriceCalc = singleResidentChildPrice;

  const doubleResidentChildPriceCalc = doubleResidentChildPrice
    ? doubleResidentChildPrice
    : singleResidentChildPriceCalc * 2;

  const tripleResidentChildPriceCalc = tripleResidentChildPrice
    ? tripleResidentChildPrice
    : singleResidentChildPriceCalc && doubleResidentChildPriceCalc
    ? doubleResidentChildPriceCalc + singleResidentChildPriceCalc
    : singleResidentChildPriceCalc * 3;

  const singleNonResidentChildPriceCalc = singleNonResidentChildPrice;

  const doubleNonResidentChildPriceCalc = doubleNonResidentChildPrice
    ? doubleNonResidentChildPrice
    : singleNonResidentChildPriceCalc * 2;

  const tripleNonResidentChildPriceCalc = tripleNonResidentChildPrice
    ? tripleNonResidentChildPrice
    : singleNonResidentChildPriceCalc && doubleNonResidentChildPriceCalc
    ? doubleNonResidentChildPriceCalc + singleNonResidentChildPriceCalc
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

    if (numberOfResidentAdult === 1) {
      total += singleResidentAdultPriceCalc;
    }
    if (numberOfResidentAdult === 2) {
      total += doubleResidentAdultPriceCalc;
    }
    if (numberOfResidentAdult === 3) {
      total += tripleResidentAdultPriceCalc;
    }
    if (numberOfResidentAdult > 3) {
      total += totalResidentAdultMoreThanThree;
    }
    if (numberOfResidentChild === 1) {
      total += singleResidentChildPriceCalc;
    }
    if (numberOfResidentChild === 2) {
      total += doubleResidentChildPriceCalc;
    }
    if (numberOfResidentChild === 3) {
      total += tripleResidentChildPriceCalc;
    }
    if (numberOfResidentChild > 3) {
      total += totalResidentChildMoreThanThree;
    }
    if (numberOfInfantResident > 0) {
      total += infantResidentPriceCalc * numberOfInfantResident;
    }

    return total;
  };

  const getNonResidentTotalPrice = () => {
    let total = 0;

    if (numberOfNonResidentAdult === 1) {
      total += singleNonResidentAdultPriceCalc;
    }
    if (numberOfNonResidentAdult === 2) {
      total += doubleNonResidentAdultPriceCalc;
    }
    if (numberOfNonResidentAdult === 3) {
      total += tripleNonResidentAdultPriceCalc;
    }
    if (numberOfNonResidentAdult > 3) {
      total += totalNonResidentAdultMoreThanThree;
    }

    if (numberOfNonResidentChild === 1) {
      total += singleNonResidentChildPriceCalc;
    }
    if (numberOfNonResidentChild === 2) {
      total += doubleNonResidentChildPriceCalc;
    }
    if (numberOfNonResidentChild === 3) {
      total += tripleNonResidentChildPriceCalc;
    }
    if (numberOfNonResidentChild > 3) {
      total += totalNonResidentChildMoreThanThree;
    }
    if (numberOfInfantResident > 0) {
      total += infantResidentPriceCalc * numberOfInfantResident;
    }

    return total;
  };

  return (
    <div className="min-w-[250px] h-[full] px-4 relative flex flex-col justify-around py-3 border rounded-lg">
      <div className="text-sm absolute top-4 text-gray-600 font-bold">
        {room.name}
      </div>

      <div className="flex gap-1">
        {getResidentTotalPrice() ? (
          <div className="flex gap-1">
            <Price
              stayPrice={getResidentTotalPrice()}
              autoCurrency={false}
              className="!text-3xl !font-SourceSans !font-semibold !text-gray-600"
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
          <h1 className="!text-3xl !font-SourceSans !font-semibold !text-gray-600">
            /
          </h1>
        ) : (
          ""
        )}

        {getNonResidentTotalPrice() ? (
          <div className="flex gap-1">
            <Price
              stayPrice={getNonResidentTotalPrice()}
              currency="KES"
              autoCurrency={false}
              className="!text-3xl !font-SourceSans !font-semibold !text-gray-600"
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
      </div>

      <PopoverBox
        panelClassName="bg-white rounded-xl after:!left-[40%] tooltip shadow-md mt-2 border w-[400px] -left-[100px] p-2"
        btnClassName=""
        btnPopover={
          <div className="bg-gray-100 flex items-center justify-center px-2 py-1 text-xs font-bold cursor-pointer rounded-full">
            Price breakdown
            <Icon
              className="w-6 h-6"
              icon="material-symbols:arrow-drop-down-rounded"
            />
          </div>
        }
        popoverClassName="!absolute bottom-2"
      >
        <h1 className="font-bold mb-2 font-SourceSans">Price breakdown</h1>
        <div className="flex flex-col gap-2">
          {numberOfResidentAdult === 1 && (
            <div className="px-3 flex bg-gray-100 font-SourceSans justify-between items-center py-1 w-full">
              <h1 className="text-sm font-semibold">
                Single resident adult ({nights} nights)
              </h1>

              <Price
                stayPrice={singleResidentAdultPriceCalc}
                autoCurrency={false}
                className="!font-normal !text-sm !font-SourceSans"
              ></Price>
            </div>
          )}

          {numberOfResidentAdult === 2 && (
            <div className="px-3 flex bg-gray-100 font-SourceSans justify-between items-center py-1 w-full">
              <h1 className="text-sm font-semibold">
                Double resident adult ({nights} nights)
              </h1>

              <Price
                stayPrice={doubleResidentAdultPriceCalc}
                autoCurrency={false}
                className="!font-normal !text-sm !font-SourceSans"
              ></Price>
            </div>
          )}

          {numberOfResidentAdult === 3 && (
            <div className="px-3 flex bg-gray-100 font-SourceSans justify-between items-center py-1 w-full">
              <h1 className="text-sm font-semibold">
                Triple resident adult ({nights} nights)
              </h1>

              <Price
                autoCurrency={false}
                stayPrice={tripleResidentAdultPriceCalc}
                className="!font-normal !text-sm !font-SourceSans"
              ></Price>
            </div>
          )}

          {numberOfResidentAdult > 3 && (
            <div className="px-3 flex bg-gray-100 font-SourceSans justify-between items-center py-1 w-full">
              <h1 className="text-sm font-semibold">
                Resident adult ({nights} nights) x {numberOfResidentAdult}
              </h1>

              <Price
                autoCurrency={false}
                stayPrice={totalResidentAdultMoreThanThree}
                className="!font-normal !text-sm !font-SourceSans"
              ></Price>
            </div>
          )}

          {numberOfNonResidentAdult === 1 && (
            <div className="px-3 flex bg-gray-100 font-SourceSans justify-between items-center py-1 w-full">
              <h1 className="text-sm font-semibold">
                Single non-resident adult ({nights} nights)
              </h1>

              <Price
                autoCurrency={false}
                currency="KES"
                stayPrice={singleNonResidentAdultPriceCalc}
                className="!font-normal !text-sm !font-SourceSans"
              ></Price>
            </div>
          )}

          {numberOfNonResidentAdult === 2 && (
            <div className="px-3 flex bg-gray-100 font-SourceSans justify-between items-center py-1 w-full">
              <h1 className="text-sm font-semibold">
                Double non-resident adult ({nights} nights)
              </h1>

              <Price
                autoCurrency={false}
                currency="KES"
                stayPrice={doubleNonResidentAdultPriceCalc}
                className="!font-normal !text-sm !font-SourceSans"
              ></Price>
            </div>
          )}

          {numberOfNonResidentAdult === 3 && (
            <div className="px-3 flex bg-gray-100 font-SourceSans justify-between items-center py-1 w-full">
              <h1 className="text-sm font-semibold">
                Triple non-resident adult ({nights} nights)
              </h1>

              <Price
                autoCurrency={false}
                currency="KES"
                stayPrice={tripleNonResidentAdultPriceCalc}
                className="!font-normal !text-sm !font-SourceSans"
              ></Price>
            </div>
          )}

          {numberOfNonResidentAdult > 3 && (
            <div className="px-3 flex bg-gray-100 font-SourceSans justify-between items-center py-1 w-full">
              <h1 className="text-sm font-semibold">
                Non-resident adult ({nights} nights) x{" "}
                {numberOfNonResidentAdult}
              </h1>

              <Price
                autoCurrency={false}
                currency="KES"
                stayPrice={totalNonResidentAdultMoreThanThree}
                className="!font-normal !text-sm !font-SourceSans"
              ></Price>
            </div>
          )}

          {numberOfResidentChild === 1 && (
            <div className="px-3 flex bg-gray-100 font-SourceSans justify-between items-center py-1 w-full">
              <h1 className="text-sm font-semibold">
                Single resident child ({nights} nights)
              </h1>

              <Price
                autoCurrency={false}
                stayPrice={singleResidentChildPriceCalc}
                className="!font-normal !text-sm !font-SourceSans"
              ></Price>
            </div>
          )}

          {numberOfResidentChild === 2 && (
            <div className="px-3 flex bg-gray-100 font-SourceSans justify-between items-center py-1 w-full">
              <h1 className="text-sm font-semibold">
                Double resident child ({nights} nights)
              </h1>

              <Price
                autoCurrency={false}
                stayPrice={doubleResidentChildPriceCalc}
                className="!font-normal !text-sm !font-SourceSans"
              ></Price>
            </div>
          )}

          {numberOfResidentChild === 3 && (
            <div className="px-3 flex bg-gray-100 font-SourceSans justify-between items-center py-1 w-full">
              <h1 className="text-sm font-semibold">
                Triple resident child ({nights} nights)
              </h1>

              <Price
                autoCurrency={false}
                stayPrice={tripleResidentChildPriceCalc}
                className="!font-normal !text-sm !font-SourceSans"
              ></Price>
            </div>
          )}

          {numberOfResidentChild > 3 && (
            <div className="px-3 flex bg-gray-100 font-SourceSans justify-between items-center py-1 w-full">
              <h1 className="text-sm font-semibold">
                Resident child ({nights} nights) x {numberOfResidentChild}
              </h1>

              <Price
                autoCurrency={false}
                stayPrice={totalResidentChildMoreThanThree}
                className="!font-normal !text-sm !font-SourceSans"
              ></Price>
            </div>
          )}

          {numberOfNonResidentChild === 1 && (
            <div className="px-3 flex bg-gray-100 font-SourceSans justify-between items-center py-1 w-full">
              <h1 className="text-sm font-semibold">
                Single non-resident child ({nights} nights)
              </h1>

              <Price
                autoCurrency={false}
                currency="KES"
                stayPrice={singleNonResidentChildPriceCalc}
                className="!font-normal !text-sm !font-SourceSans"
              ></Price>
            </div>
          )}

          {numberOfNonResidentChild === 2 && (
            <div className="px-3 flex bg-gray-100 font-SourceSans justify-between items-center py-1 w-full">
              <h1 className="text-sm font-semibold">
                Double resident child ({nights} nights)
              </h1>

              <Price
                autoCurrency={false}
                currency="KES"
                stayPrice={doubleNonResidentChildPriceCalc}
                className="!font-normal !text-sm !font-SourceSans"
              ></Price>
            </div>
          )}

          {numberOfNonResidentChild === 3 && (
            <div className="px-3 flex bg-gray-100 font-SourceSans justify-between items-center py-1 w-full">
              <h1 className="text-sm font-semibold">
                Triple resident child ({nights} nights)
              </h1>

              <Price
                autoCurrency={false}
                currency="KES"
                stayPrice={tripleNonResidentChildPriceCalc}
                className="!font-normal !text-sm !font-SourceSans"
              ></Price>
            </div>
          )}

          {numberOfNonResidentChild > 3 && (
            <div className="px-3 flex bg-gray-100 font-SourceSans justify-between items-center py-1 w-full">
              <h1 className="text-sm font-semibold">
                Resident child ({nights} nights) x {numberOfNonResidentChild}
              </h1>

              <Price
                autoCurrency={false}
                currency="KES"
                stayPrice={totalNonResidentChildMoreThanThree}
                className="!font-normal !text-sm !font-SourceSans"
              ></Price>
            </div>
          )}

          {numberOfInfantResident > 0 && (
            <div className="px-3 flex bg-gray-100 font-SourceSans justify-between items-center py-1 w-full">
              <h1 className="text-sm font-semibold">
                Resident infant ({nights} nights)
              </h1>

              <Price
                autoCurrency={false}
                stayPrice={infantResidentPriceCalc * numberOfInfantResident}
                className="!font-normal !text-sm !font-SourceSans"
              ></Price>
            </div>
          )}

          {numberOfInfantNonResident > 0 && (
            <div className="px-3 flex bg-gray-100 font-SourceSans justify-between items-center py-1 w-full">
              <h1 className="text-sm font-semibold">
                Resident infant ({nights} nights)
              </h1>

              <Price
                autoCurrency={false}
                currency="KES"
                stayPrice={
                  infantNonResidentPriceCalc * numberOfInfantNonResident
                }
                className="!font-normal !text-sm !font-SourceSans"
              ></Price>
            </div>
          )}

          {/* <div className="px-3 flex font-SourceSans bg-gray-100 justify-between items-center py-1 w-full">
            <h1 className="text-sm font-semibold">Total</h1>

            <Price
              autoCurrency={false}
              className="!font-normal !text-sm !font-SourceSans"
              stayPrice={getResidentTotalPrice()}
            ></Price>
          </div> */}
        </div>
      </PopoverBox>
    </div>
  );
}

SelectedListingCard.propTypes = {};

export default SelectedListingCard;
