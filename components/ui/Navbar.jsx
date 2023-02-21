import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Link from "next/link";
import Image from "next/image";
import { useSelector } from "react-redux";
import { Popover, Transition, Dialog } from "@headlessui/react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper";
import styles from "../../styles/StyledLink.module.css";
import UserDropdown from "../Home/UserDropdown";
import Button from "./Button";
import PopoverBox from "./Popover";
import { Icon } from "@iconify/react";
import Burger from "./Burger";
import Dialogue from "../Home/Dialogue";
import { Mixpanel } from "../../lib/mixpanelconfig";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { InlineWidget } from "react-calendly";
import NavbarCurrency from "./NavbarCurrency";
import { Link as ScrollLink } from "react-scroll";

function Navbar({ userProfile, showBookNowBtn = false }) {
  const [curatedTripsHover, setCuratedTripsHover] = useState(true);
  const [showLocationsHover, setShowLocationsHover] = useState(false);
  const [showBeachLocationsHover, setShowBeachLocationsHover] = useState(false);
  const [staysHover, setStaysHover] = useState(false);
  const [activitiesHover, setActivitiesHover] = useState(false);

  const [isShowingExplore, setIsShowingExplore] = useState(false);
  const [isShowingLocations, setIsShowingLocations] = useState(false);
  const [isShowingLocationsBeach, setIsShowingLocationsBeach] = useState(false);
  const [openBurger, setOpenBurger] = useState(false);

  const router = useRouter();

  function Item({ title, subText, icon, href, safariAndBeach = false }) {
    const [showIcon, setShowIcon] = useState(false);

    return (
      <Link href={href}>
        <a
          className={
            "hover:bg-gray-100 transition-colors duration-500 rounded-lg " +
            (safariAndBeach ? "w-full md:w-[46%]" : "w-full md:w-[46%]")
          }
        >
          <div
            onClick={() => {
              if (safariAndBeach) {
                Mixpanel.track("Safari and beach selected", {
                  location: title,
                });
              } else {
                Mixpanel.track(
                  "Selected a tag for travel theme from homepage",
                  {
                    tag: title,
                  }
                );
              }
            }}
            onMouseEnter={() => {
              setShowIcon(true);
            }}
            onMouseLeave={() => {
              setShowIcon(false);
            }}
            className="flex w-full py-2 px-2 gap-2 items-center cursor-pointer"
          >
            <div
              className={
                "w-12 h-10 flex items-center justify-center rounded-lg bg-opacity-30 " +
                (safariAndBeach ? "bg-red-600" : "bg-red-600")
              }
            >
              <Icon
                icon={icon}
                className={
                  "w-7 h-7 " +
                  (safariAndBeach ? "text-red-700" : "text-red-700")
                }
              />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1">
                <h1 className="font-bold">{title}</h1>
                <Transition
                  enter="transition-all duration-300"
                  enterFrom="opacity-0 scale-0"
                  enterTo="opacity-100 scale-100"
                  leave="transition-all duration-300"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-0"
                  show={showIcon}
                >
                  <Icon icon="bx:right-arrow-alt" className="mt-0.5" />
                </Transition>
              </div>
              <p className="text-sm text-gray-500 hover:text-gray-700 transition-all duration-300">
                {subText}
              </p>
            </div>
          </div>
        </a>
      </Link>
    );
  }

  const handleCheck = (event) => {
    if (event.target.checked) {
      setOpenBurger(true);
    } else {
      setOpenBurger(false);
    }
  };

  const settings = {
    spaceBetween: 10,
    slidesPerView: 1,
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
  };

  const [swiper, setSwiper] = useState(null);

  const slideto = (index) => {
    if (swiper) {
      swiper.slideToLoop(index);
    }
  };

  const [showCalendly, setShowCalendly] = useState(false);

  return (
    <div>
      <div className="flex items-center border-b justify-between sm:px-8 px-6 md:px-6 lg:px-12 py-5">
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
        <div className="flex items-center">
          <div className="flex items-center gap-4 mr-8">
            <Link href="/about-us">
              <a className="hidden md:block">
                <div
                  className={
                    "font-bold mr-2 cursor-pointertransition-all duration-300 cursor-pointer ease-linear rounded-3xl py-2 !text-base flex items-center gap-1 " +
                    styles.link
                  }
                >
                  About us
                </div>
              </a>
            </Link>

            <Link href="/blogs">
              <a className="hidden md:block">
                <div
                  className={
                    "font-bold cursor-pointertransition-all duration-300 cursor-pointer ease-linear rounded-3xl py-2 !text-base flex items-center gap-1 " +
                    styles.link
                  }
                >
                  Blog
                </div>
              </a>
            </Link>
          </div>

          <Dialogue
            isOpen={showCalendly}
            closeModal={() => {
              setShowCalendly(false);
            }}
            title="Contact Us"
            dialogueTitleClassName="!font-bold !ml-4 !text-xl md:!text-2xl"
            outsideDialogueClass="!p-0"
            dialoguePanelClassName="screen-height-safari !rounded-none md:!rounded-md md:!min-h-0 md:max-h-[700px] !px-0 !max-w-6xl overflow-y-scroll remove-scroll"
          >
            <div className="">
              <InlineWidget url="https://calendly.com/ndiko/winda-guide-custom-trip" />
            </div>

            <div className="fixed top-3 right-4 flex flex-col">
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  setShowCalendly(false);
                }}
                className="flex cursor-pointer items-center justify-center w-7 h-7 rounded-full bg-white shadow-lg"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
            </div>
          </Dialogue>

          <UserDropdown userProfile={userProfile}></UserDropdown>
          {showBookNowBtn && (
            <ScrollLink
              to="stays"
              spy={true}
              smooth={true}
              offset={-50}
              duration={500}
            >
              <div className="hidden md:flex items-center gap-2 ml-4 lg:gap-4">
                <div className="flex items-center gap-0.5 px-2 lg:px-4 py-3 cursor-pointer btn-gradient !rounded-3xl">
                  <span className="text-white text-sm font-bold uppercase">
                    Book now
                  </span>
                </div>

                <div></div>
              </div>
            </ScrollLink>
          )}
        </div>
      </div>
    </div>
  );
}

Navbar.propTypes = {};

export default Navbar;
