import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Card from "../ui/Card";
import Price from "../Stay/Price";
import Button from "../ui/Button";
import LoadingSpinerChase from "../ui/LoadingSpinerChase";
import styles from "../../styles/Listing.module.css";
import Checkbox from "../ui/Checkbox";
import { useRouter } from "next/router";
import moment from "moment";
import { Icon } from "@iconify/react";

function Listing({ listing, currentOptions, setCurrentOptions, setOpenPopup }) {
  const router = useRouter();

  const sortedImages = listing.stay_images.sort((x, y) => y.main - x.main);

  const images = sortedImages.map((image) => {
    return image.image;
  });

  const handleCheck = (event) => {
    var updatedList = [...currentOptions];
    if (event.target.checked) {
      updatedList = [...updatedList, event.target.value];
      const allOptions = updatedList
        .toString()
        .replace("[", "") // remove [
        .replace("]", "") // remove ]
        .trim(); // remove all white space

      if (!router.query.date || !router.query.endDate) {
        console.log("called");
        router.replace(
          {
            query: {
              ...router.query,
              selected: allOptions,
              date: moment().format("YYYY-MM-DD"),
              endDate: moment().add(3, "days").format("YYYY-MM-DD"),
            },
          },
          undefined,
          { shallow: true }
        );
      } else {
        router.replace(
          {
            query: {
              ...router.query,
              selected: allOptions,
            },
          },
          undefined,
          { shallow: true }
        );
      }
    } else {
      updatedList.splice(currentOptions.indexOf(event.target.value), 1);

      const allOptions = updatedList
        .toString()
        .replace("[", "") // remove [
        .replace("]", "") // remove ]
        .trim(); // remove all white space

      router.replace(
        {
          query: {
            ...router.query,
            selected: allOptions,
          },
        },
        undefined,
        { shallow: true }
      );
    }
    setCurrentOptions(updatedList);
  };

  useEffect(() => {
    if (router.query.selected) {
      setCurrentOptions(router.query.selected.split(","));
    } else {
      setCurrentOptions([]);
    }
  }, [router.query.selected]);

  const containsOption = (option) => {
    return currentOptions.includes(option);
  };

  return (
    <div className="w-[325px] relative">
      <Card
        imagePaths={images}
        carouselClassName="h-44"
        subCarouselClassName="hidden"
        className={styles.card + " "}
      >
        <div className="flex flex-col gap-1">
          <h1 className="text-gray-500 truncate">
            {listing.property_name || listing.name}
          </h1>
        </div>
        <div className="text-gray-500 flex gap-1 text-sm truncate mt-1 flex-wrap">
          {listing.capacity && (
            <div className="flex items-center gap-0.5">
              <svg
                className="w-3 h-3"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
                role="img"
                width="1em"
                height="1em"
                preserveAspectRatio="xMidYMid meet"
                viewBox="0 0 36 36"
              >
                <path
                  fill="currentColor"
                  d="M12 16.14h-.87a8.67 8.67 0 0 0-6.43 2.52l-.24.28v8.28h4.08v-4.7l.55-.62l.25-.29a11 11 0 0 1 4.71-2.86A6.59 6.59 0 0 1 12 16.14Z"
                />
                <path
                  fill="currentColor"
                  d="M31.34 18.63a8.67 8.67 0 0 0-6.43-2.52a10.47 10.47 0 0 0-1.09.06a6.59 6.59 0 0 1-2 2.45a10.91 10.91 0 0 1 5 3l.25.28l.54.62v4.71h3.94v-8.32Z"
                />
                <path
                  fill="currentColor"
                  d="M11.1 14.19h.31a6.45 6.45 0 0 1 3.11-6.29a4.09 4.09 0 1 0-3.42 6.33Z"
                />
                <path
                  fill="currentColor"
                  d="M24.43 13.44a6.54 6.54 0 0 1 0 .69a4.09 4.09 0 0 0 .58.05h.19A4.09 4.09 0 1 0 21.47 8a6.53 6.53 0 0 1 2.96 5.44Z"
                />
                <circle cx="17.87" cy="13.45" r="4.47" fill="currentColor" />
                <path
                  fill="currentColor"
                  d="M18.11 20.3A9.69 9.69 0 0 0 11 23l-.25.28v6.33a1.57 1.57 0 0 0 1.6 1.54h11.49a1.57 1.57 0 0 0 1.6-1.54V23.3l-.24-.3a9.58 9.58 0 0 0-7.09-2.7Z"
                />
                <path fill="none" d="M0 0h36v36H0z" />
              </svg>
              <span>{listing.capacity} Guests</span>
            </div>
          )}
          {listing.rooms && (
            <div className="flex items-center gap-0.5">
              <svg
                className="w-3 h-3"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
                role="img"
                width="1em"
                height="1em"
                preserveAspectRatio="xMidYMid meet"
                viewBox="0 0 24 24"
              >
                <path
                  fill="currentColor"
                  d="M5 5v14a1 1 0 0 0 1 1h3v-2H7V6h2V4H6a1 1 0 0 0-1 1zm14.242-.97l-8-2A1 1 0 0 0 10 3v18a.998.998 0 0 0 1.242.97l8-2A1 1 0 0 0 20 19V5a1 1 0 0 0-.758-.97zM15 12.188a1.001 1.001 0 0 1-2 0v-.377a1 1 0 1 1 2 .001v.376z"
                />
              </svg>

              <span>{listing.rooms} rm</span>
            </div>
          )}
        </div>
        <div className="font-bold text-sm truncate mt-1">
          {listing.location}
        </div>

        <div className="mt-2">
          <label
            htmlFor={"btn" + listing.id}
            onClick={() => {
              setOpenPopup(true);
            }}
            className="button-expand btn-gradient-2 absolute top-[45%] cursor-pointer"
          >
            <>
              <span className="button-expand-icon">+</span>
              <span className="button-expand-text font-bold mr-2">
                Check availability
              </span>
            </>
          </label>

          <input
            type="checkbox"
            value={listing.id}
            onChange={handleCheck}
            checked={containsOption(listing.id)}
            className="hidden"
            id={"btn" + listing.id}
            readOnly
          />
        </div>
      </Card>
    </div>
  );
}

Listing.propTypes = {};

export default Listing;
