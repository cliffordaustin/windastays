import React from "react";
import moment from "moment";

import Input from "../ui/Input";
import Button from "../ui/Button";
import styles from "../../styles/Search.module.css";
import DatePicker from "../ui/DatePicker";
import Popup from "../ui/Popup";
import SelectInput from "../ui/SelectInput";
import SearchButtonClose from "./SearchButtonClose";
import Guest from "./Guest";
import Switch from "../ui/Switch";
import LoadingSpinerChase from "../ui/LoadingSpinerChase";

function TransportSearch({
  typeOfCar,
  setTypeOfCar,
  transportDate,
  passengers,
  changeShowTransportDate,
  setTransportDate,
  showTransportDate,
  showPassengerPopup,
  changeShowPassengerPopup,
  showNeedADriver,
  changeShowNeedADriver,
  selectedTransportSearchItem,
  clearTransportDate,
  clearPassengers,
  clearNeedADriver,
  addPassenger,
  removePassenger,
  needADriver,
  changeNeedADriver,
  showSearchModal,
  apiTransportSearchResult,

  pickupLocation,
  onKeyDown,
  clearLocationInput,
  autoCompleteFromPickupLocationSearch,
  locationFromPickupLocationSearch,
  onPickupLocationChange,

  clearDestinationLocationInput,
  onDestinationSearchKeyDown,
  autoCompleteFromDestinationLocationSearch,
  destinationLocation,
  locationFromDestinationLocationSearch,
  onDestinationLocationChange,

  locationLoader,
}) {
  const options = [
    { value: "Car 1", label: "Car 1" },
    { value: "Car 2", label: "Car 2" },
    { value: "Car 3", label: "Car 3" },
    { value: "Car 4", label: "Car 4" },
  ];
  return (
    <div className="flex flex-col md:flex-row rounded-xl py-4 px-2 md:py-0 md:px-0 md:rounded-xl bg-white w-full shadow-md">
      <div
        onClick={(event) => {
          event.stopPropagation();
        }}
        className={
          "md:w-[40%] w-full !py-2 !justify-between relative " +
          styles.searchInput
        }
      >
        <div className="font-bold text-sm">Pickup location</div>
        <Input
          placeholder="Where to?"
          type="text"
          name="pickupLocation"
          value={pickupLocation}
          className={styles.input}
          autoComplete="off"
          onChange={(event) => {
            onPickupLocationChange(event);
          }}
          onKeyPress={onKeyDown}
        ></Input>
        <div
          className={
            "absolute top-2/4 right-3 -translate-y-2/4 " +
            (pickupLocation ? "block" : "hidden")
          }
        >
          <SearchButtonClose onClick={clearLocationInput}></SearchButtonClose>
        </div>

        {autoCompleteFromPickupLocationSearch.length > 0 && (
          <div className="absolute shadow-lg top-full left-0 z-30 rounded-b-xl w-full md:w-[350px] py-2 bg-white">
            {autoCompleteFromPickupLocationSearch.map((item, index) => (
              <div
                key={index}
                onClick={() => locationFromPickupLocationSearch(item)}
                className="flex items-center gap-6 hover:bg-gray-100 transition-all duration-300 ease-linear cursor-pointer px-4 py-3"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="truncate">{item.place_name}</span>
              </div>
            ))}
          </div>
        )}
      </div>
      <div
        onClick={(event) => {
          event.stopPropagation();
        }}
        className={
          "md:w-[40%] w-full !py-2 !justify-between relative " +
          styles.searchInput
        }
      >
        <div className="font-bold text-sm">Where to?</div>
        <Input
          placeholder="Where to?"
          type="text"
          name="destinationLocation"
          value={destinationLocation}
          className={styles.input}
          autoComplete="off"
          onChange={(event) => {
            onDestinationLocationChange(event);
          }}
          onKeyPress={onDestinationSearchKeyDown}
        ></Input>
        <div
          className={
            "absolute top-2/4 right-3 -translate-y-2/4 " +
            (destinationLocation ? "block" : "hidden")
          }
        >
          <SearchButtonClose
            onClick={clearDestinationLocationInput}
          ></SearchButtonClose>
        </div>

        {autoCompleteFromDestinationLocationSearch.length > 0 && (
          <div className="absolute top-full shadow-lg left-0 z-30 rounded-b-xl w-full md:w-[350px] py-2 bg-white">
            {autoCompleteFromDestinationLocationSearch.map((item, index) => (
              <div
                key={index}
                onClick={() => locationFromDestinationLocationSearch(item)}
                className="flex items-center gap-6 hover:bg-gray-100 transition-all duration-300 ease-linear cursor-pointer px-4 py-3"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="truncate">{item.place_name}</span>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="flex gap-4 md:gap-0 md:w-[20%] md:flex-none">
        <div
          onClick={(e) => {
            e.stopPropagation();
            changeShowPassengerPopup();
          }}
          className={"relative w-full " + styles.searchInput}
        >
          <div className="font-bold text-sm">Passengers</div>
          <div className="text-sm text-gray-400 truncate">
            {passengers === 0 ? "Add Passengers" : passengers + " Passengers"}
          </div>
          <div
            className={
              "absolute top-2/4 right-3 -translate-y-2/4 " +
              (selectedTransportSearchItem === 4 ? "block" : "hidden")
            }
          >
            <SearchButtonClose onClick={clearPassengers}></SearchButtonClose>
          </div>
          <div
            className={
              "mt-4 absolute !top-10 md:!top-14 !-left-32 sm:!-left-2 md:!-left-16 w-72 z-30 " +
              (showSearchModal ? "hidden" : "")
            }
          >
            <Popup
              showPopup={showPassengerPopup}
              className="bg-white px-4 py-4 !rounded-2xl shadow-xl border border-gray-200"
            >
              <div className="">
                <Guest
                  add={addPassenger}
                  remove={removePassenger}
                  guests={passengers}
                  type="Passengers"
                ></Guest>
              </div>
            </Popup>
          </div>
        </div>
      </div>
      <div className="flex-grow md:pr-4 flex mt-4 md:mt-0 items-center">
        <Button
          onClick={apiTransportSearchResult}
          className="!rounded-lg h-[65%] !flex gap-1 !px-1 !bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 items-center justify-center w-[100px]"
        >
          <span className="font-bold">Search</span>
          {!locationLoader && (
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M18.319 14.4326C20.7628 11.2941 20.542 6.75347 17.6569 3.86829C14.5327 0.744098 9.46734 0.744098 6.34315 3.86829C3.21895 6.99249 3.21895 12.0578 6.34315 15.182C9.22833 18.0672 13.769 18.2879 16.9075 15.8442C16.921 15.8595 16.9351 15.8745 16.9497 15.8891L21.1924 20.1317C21.5829 20.5223 22.2161 20.5223 22.6066 20.1317C22.9971 19.7412 22.9971 19.1081 22.6066 18.7175L18.364 14.4749C18.3493 14.4603 18.3343 14.4462 18.319 14.4326ZM16.2426 5.28251C18.5858 7.62565 18.5858 11.4246 16.2426 13.7678C13.8995 16.1109 10.1005 16.1109 7.75736 13.7678C5.41421 11.4246 5.41421 7.62565 7.75736 5.28251C10.1005 2.93936 13.8995 2.93936 16.2426 5.28251Z"
                fill="currentColor"
              />
            </svg>
          )}
          {locationLoader && (
            <LoadingSpinerChase width={16} height={16}></LoadingSpinerChase>
          )}
        </Button>
      </div>
    </div>
  );
}

export default TransportSearch;
