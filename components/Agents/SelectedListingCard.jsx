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

function SelectedListingCard({ room }) {
  const router = useRouter();

  const [roomAvailabilities, setRoomAvailabilities] = React.useState([]);

  const [roomAvailabilitiesNonResident, setRoomAvailabilitiesNonResident] =
    React.useState([]);

  useEffect(() => {
    if (router.query.date && router.query.endDate) {
      axios
        .get(
          `${process.env.NEXT_PUBLIC_baseURL}/room-types/${room.slug}/resident-availabilities/?start_date=${router.query.date}&end_date=${router.query.endDate}`,
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
          `${process.env.NEXT_PUBLIC_baseURL}/room-types/${room.slug}/nonresident-availabilities/?start_date=${router.query.date}&end_date=${router.query.endDate}`,
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

  const singleResidentAdultPrice =
    pricing.singleResidentAdultPrice(roomAvailabilities);

  const singleNonResidentAdultPrice = pricing.singleNonResidentAdultPrice(
    roomAvailabilitiesNonResident
  );

  const singleResidentChildPrice =
    pricing.singleResidentChildPrice(roomAvailabilities);

  const singleNonResidentChildPrice = pricing.singleNonResidentChildPrice(
    roomAvailabilitiesNonResident
  );

  const doubleResidentAdultPrice =
    pricing.doubleResidentAdultPrice(roomAvailabilities);

  const doubleNonResidentAdultPrice = pricing.doubleNonResidentAdultPrice(
    roomAvailabilitiesNonResident
  );

  const doubleResidentChildPrice =
    pricing.doubleResidentChildPrice(roomAvailabilities);

  const doubleNonResidentChildPrice = pricing.doubleNonResidentChildPrice(
    roomAvailabilitiesNonResident
  );

  const tripleResidentAdultPrice =
    pricing.tripleResidentAdultPrice(roomAvailabilities);

  const tripleNonResidentAdultPrice = pricing.tripleNonResidentAdultPrice(
    roomAvailabilitiesNonResident
  );

  const tripleResidentChildPrice =
    pricing.tripleResidentChildPrice(roomAvailabilities);

  const tripleNonResidentChildPrice = pricing.tripleNonResidentChildPrice(
    roomAvailabilitiesNonResident
  );

  const infantResidentPrice = pricing.infantResidentPrice(roomAvailabilities);

  const infantNonResidentPrice = pricing.infantNonResidentPrice(
    roomAvailabilitiesNonResident
  );

  const nights = moment
    .duration(moment(router.query.endDate).diff(moment(router.query.date)))
    .asDays();

  const getTotalPrice = () => {
    let total = 0;

    if (Number(router.query.residentAdult) === 1) {
      total += singleResidentAdultPrice;
    }
    if (Number(router.query.residentAdult) === 2) {
      total += doubleResidentAdultPrice;
    }
    if (Number(router.query.residentAdult) === 3) {
      total += tripleResidentAdultPrice;
    }
    if (Number(router.query.nonResidentAdult) === 1) {
      total += singleNonResidentAdultPrice;
    }
    if (Number(router.query.nonResidentAdult) === 2) {
      total += doubleNonResidentAdultPrice;
    }
    if (Number(router.query.nonResidentAdult) === 3) {
      total += tripleNonResidentAdultPrice;
    }
    if (Number(router.query.residentChild) === 1) {
      total += singleResidentChildPrice;
    }
    if (Number(router.query.residentChild) === 2) {
      total += doubleResidentChildPrice;
    }
    if (Number(router.query.residentChild) === 3) {
      total += tripleResidentChildPrice;
    }
    if (Number(router.query.nonResidentChild) === 1) {
      total += singleNonResidentChildPrice;
    }
    if (Number(router.query.nonResidentChild) === 2) {
      total += doubleNonResidentChildPrice;
    }
    if (Number(router.query.nonResidentChild) === 3) {
      total += tripleNonResidentChildPrice;
    }
    if (Number(router.query.infantResident) > 0) {
      total += infantResidentPrice * Number(router.query.infantResident);
    }
    if (Number(router.query.infantNonResident) > 0) {
      total += infantNonResidentPrice * Number(router.query.infantNonResident);
    }

    return total;
  };

  return (
    <div className="w-[250px] h-[full] px-4 relative flex flex-col justify-around py-3 border rounded-lg">
      <div className="text-sm absolute top-4 text-gray-600 font-bold">
        {room.name}
      </div>

      <Price
        stayPrice={getTotalPrice()}
        className="!text-5xl !font-SourceSans !font-semibold !text-gray-600"
      ></Price>

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
          {Number(router.query.residentAdult) === 1 && (
            <div className="px-3 flex bg-gray-100 font-SourceSans justify-between items-center py-1 w-full">
              <h1 className="text-sm font-semibold">
                Single resident adult ({nights} nights)
              </h1>

              <Price
                stayPrice={singleResidentAdultPrice}
                className="!font-normal !text-sm !font-SourceSans"
              ></Price>
            </div>
          )}

          {Number(router.query.residentAdult) === 2 && (
            <div className="px-3 flex bg-gray-100 font-SourceSans justify-between items-center py-1 w-full">
              <h1 className="text-sm font-semibold">
                Double resident adult ({nights} nights)
              </h1>

              <Price
                stayPrice={doubleResidentAdultPrice}
                className="!font-normal !text-sm !font-SourceSans"
              ></Price>
            </div>
          )}

          {Number(router.query.residentAdult) === 3 && (
            <div className="px-3 flex bg-gray-100 font-SourceSans justify-between items-center py-1 w-full">
              <h1 className="text-sm font-semibold">
                Triple resident adult ({nights} nights)
              </h1>

              <Price
                stayPrice={tripleResidentAdultPrice}
                className="!font-normal !text-sm !font-SourceSans"
              ></Price>
            </div>
          )}

          {Number(router.query.nonResidentAdult) === 1 && (
            <div className="px-3 flex bg-gray-100 font-SourceSans justify-between items-center py-1 w-full">
              <h1 className="text-sm font-semibold">
                Single non-resident adult ({nights} nights)
              </h1>

              <Price
                stayPrice={singleNonResidentAdultPrice}
                className="!font-normal !text-sm !font-SourceSans"
              ></Price>
            </div>
          )}

          {Number(router.query.nonResidentAdult) === 2 && (
            <div className="px-3 flex bg-gray-100 font-SourceSans justify-between items-center py-1 w-full">
              <h1 className="text-sm font-semibold">
                Double non-resident adult ({nights} nights)
              </h1>

              <Price
                stayPrice={doubleNonResidentAdultPrice}
                className="!font-normal !text-sm !font-SourceSans"
              ></Price>
            </div>
          )}

          {Number(router.query.nonResidentAdult) === 3 && (
            <div className="px-3 flex bg-gray-100 font-SourceSans justify-between items-center py-1 w-full">
              <h1 className="text-sm font-semibold">
                Triple non-resident adult ({nights} nights)
              </h1>

              <Price
                stayPrice={tripleNonResidentAdultPrice}
                className="!font-normal !text-sm !font-SourceSans"
              ></Price>
            </div>
          )}

          {Number(router.query.residentChild) === 1 && (
            <div className="px-3 flex bg-gray-100 font-SourceSans justify-between items-center py-1 w-full">
              <h1 className="text-sm font-semibold">
                Single resident child ({nights} nights)
              </h1>

              <Price
                stayPrice={singleResidentChildPrice}
                className="!font-normal !text-sm !font-SourceSans"
              ></Price>
            </div>
          )}

          {Number(router.query.residentChild) === 2 && (
            <div className="px-3 flex bg-gray-100 font-SourceSans justify-between items-center py-1 w-full">
              <h1 className="text-sm font-semibold">
                Double resident child ({nights} nights)
              </h1>

              <Price
                stayPrice={doubleResidentChildPrice}
                className="!font-normal !text-sm !font-SourceSans"
              ></Price>
            </div>
          )}

          {Number(router.query.residentChild) === 3 && (
            <div className="px-3 flex bg-gray-100 font-SourceSans justify-between items-center py-1 w-full">
              <h1 className="text-sm font-semibold">
                Triple resident child ({nights} nights)
              </h1>

              <Price
                stayPrice={tripleResidentChildPrice}
                className="!font-normal !text-sm !font-SourceSans"
              ></Price>
            </div>
          )}

          {Number(router.query.nonResidentChild) === 1 && (
            <div className="px-3 flex bg-gray-100 font-SourceSans justify-between items-center py-1 w-full">
              <h1 className="text-sm font-semibold">
                Single non-resident child ({nights} nights)
              </h1>

              <Price
                stayPrice={singleNonResidentChildPrice}
                className="!font-normal !text-sm !font-SourceSans"
              ></Price>
            </div>
          )}

          {Number(router.query.nonResidentChild) === 2 && (
            <div className="px-3 flex bg-gray-100 font-SourceSans justify-between items-center py-1 w-full">
              <h1 className="text-sm font-semibold">
                Double resident child ({nights} nights)
              </h1>

              <Price
                stayPrice={doubleNonResidentChildPrice}
                className="!font-normal !text-sm !font-SourceSans"
              ></Price>
            </div>
          )}

          {Number(router.query.nonResidentChild) === 3 && (
            <div className="px-3 flex bg-gray-100 font-SourceSans justify-between items-center py-1 w-full">
              <h1 className="text-sm font-semibold">
                Triple resident child ({nights} nights)
              </h1>

              <Price
                stayPrice={tripleNonResidentChildPrice}
                className="!font-normal !text-sm !font-SourceSans"
              ></Price>
            </div>
          )}

          {Number(router.query.infantResident) > 0 && (
            <div className="px-3 flex bg-gray-100 font-SourceSans justify-between items-center py-1 w-full">
              <h1 className="text-sm font-semibold">
                Resident infant ({nights} nights)
              </h1>

              <Price
                stayPrice={
                  infantResidentPrice * Number(router.query.infantResident)
                }
                className="!font-normal !text-sm !font-SourceSans"
              ></Price>
            </div>
          )}

          {Number(router.query.infantNonResident) > 0 && (
            <div className="px-3 flex bg-gray-100 font-SourceSans justify-between items-center py-1 w-full">
              <h1 className="text-sm font-semibold">
                Resident infant ({nights} nights)
              </h1>

              <Price
                stayPrice={
                  infantNonResidentPrice *
                  Number(router.query.infantNonResident)
                }
                className="!font-normal !text-sm !font-SourceSans"
              ></Price>
            </div>
          )}

          <div className="px-3 flex font-SourceSans bg-gray-100 justify-between items-center py-1 w-full">
            <h1 className="text-sm font-semibold">Total</h1>

            <Price
              className="!font-normal !text-sm !font-SourceSans"
              stayPrice={getTotalPrice()}
            ></Price>
          </div>
        </div>
      </PopoverBox>
    </div>
  );
}

SelectedListingCard.propTypes = {};

export default SelectedListingCard;
