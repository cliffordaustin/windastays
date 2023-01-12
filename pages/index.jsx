import { useState, useEffect, useRef } from "react";
import Image from "next/image";

import Head from "next/head";
import axios from "axios";
import getToken from "../lib/getToken";
import { useRouter } from "next/router";
import { Mixpanel } from "../lib/mixpanelconfig";
import { useInView } from "react-intersection-observer";

import Navbar from "../components/ui/Navbar";
import Main from "../components/Home/Main";
import Footer from "../components/Home/Footer";
import Button from "../components/ui/Button";

import CookiesMessage from "../components/Home/CookiesMessage";

import Dialogue from "../components/Home/Dialogue";

import Cookies from "js-cookie";
import Review from "../components/Reviews/Review";
import { Link as ScrollLink } from "react-scroll";

export default function Home({ userProfile, specialLodges }) {
  const router = useRouter();

  const [state, setState] = useState({
    showDropdown: false,
    activityDate: "",
    travelers: 0,
    passengers: 0,
    checkin: "",
    checkout: "",
    transportDate: "",
    showTransportDate: false,
    showCheckInDate: false,
    showCheckOutDate: false,
    showActivityDate: false,
    numOfAdults: 0,
    numOfChildren: 0,
    numOfInfants: 0,
    showPopup: false,
    showPassengerPopup: false,
    currentNavState: 1,
    showNeedADriver: false,
    needADriver: false,
    showTravelersPopup: false,
    selectedSearchItem: 0,
    selectedTransportSearchItem: 0,
    selectedActivitiesSearchItem: 0,
    showSearchModal: false,
    windowSize: 0,
  });

  const [scrollRef, inView, entry] = useInView({
    rootMargin: "-70px 0px",
  });

  useEffect(() => {
    if (process.browser) {
      setState({
        ...state,
        windowSize: window.innerWidth,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (process.browser) {
      window.onresize = function () {
        setState({ ...state, windowSize: window.innerWidth });
      };
    }
  }, []);

  useEffect(() => {
    if (state.windowSize >= 768) {
      setState({
        ...state,
        showSearchModal: false,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.windowSize]);

  const variants = {
    hide: {
      opacity: 0.2,
      y: -15,
      transition: {},
    },
    show: {
      y: 0,
      opacity: 1,
      transition: {},
    },
  };

  const [showBookServiceDropdown, setShowBookServiceDropdown] = useState(false);

  const [location, setLocation] = useState("");

  const checkSearch = (location) => {
    Mixpanel.track("User interated with the search to the stays");
    router.push({
      pathname: "/stays",
      query: {
        search: location,
        page: "",
      },
    });
  };

  const search = (location) => {
    checkSearch((location = location));
  };

  const keyDownSearch = (event) => {
    if (event.key === "Enter") {
      if (location !== "") {
        checkSearch((location = location));
      }
    }
  };

  const [showLocation, setShowLocation] = useState(false);

  useEffect(() => {
    if (process.browser) {
      window.Beacon("init", process.env.NEXT_PUBLIC_BEACON_ID);
    }
  }, []);

  const [screenWidth, setScreenWidth] = useState(0);

  useEffect(() => {
    if (process.browser) {
      setScreenWidth(window.innerWidth);
      window.onresize = () => {
        setScreenWidth(window.innerWidth);
      };
    }
  }, []);

  useEffect(() => {
    if (process.browser) {
      let iteration = 1;
      const video = document.getElementsByTagName("video")[0];
      video.addEventListener(
        "ended",
        function () {
          if (iteration < 5) {
            this.currentTime = 0;
            this.play();
            iteration++;
          }
        },
        false
      );
    }
  }, []);

  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (Cookies.get("tripWizardModal") !== "true") {
      setTimeout(() => {
        Cookies.set("tripWizardModal", "true", { expires: 5 });
        setShowModal(true);
      }, 5000);
    }
  }, []);

  const [showReviewsModal, setShowReviewsModal] = useState(false);

  return (
    <div
      className="relative"
      onClick={() => {
        setState({
          ...state,
          showDropdown: false,
          showCheckInDate: false,
          showCheckOutDate: false,
          showPopup: false,
          showTransportDate: false,
          showPassengerPopup: false,
          showActivityDate: false,
          showTravelersPopup: false,
          selectedSearchItem: 0,
          selectedTransportSearchItem: 0,
          selectedActivitiesSearchItem: 0,
          showNeedADriver: false,
          showSearchModal: false,
        });
        setShowBookServiceDropdown(false);
        setShowLocation(false);
      }}
    >
      <div className="">
        <Head>
          <title>Winda.guide | book travel essentials in Kenya</title>
          <meta
            name="description"
            content="Search, discover, and book your travel needs in Kenya, all in one place. Try it now."
          ></meta>
          <meta
            name="viewport"
            content="initial-scale=1.0, width=device-width"
          />
        </Head>
      </div>

      <div className="sticky bg-white top-0 left-0 right-0 z-50">
        <Navbar
          userProfile={userProfile}
          showTripWizard={!inView ? true : false}
        ></Navbar>
      </div>

      <div className="select-none relative">
        <div className="w-full text-red-600 flex flex-col items-center h-[500px] md:h-[600px] relative before:absolute before:h-full before:w-full before:bg-black before:z-20 before:opacity-40">
          <video
            autoPlay
            muted
            playsInline
            className="w-full h-full absolute inset-0 object-cover object-center"
            id="video"
          >
            <source src="videos/winda.mp4" type="video/mp4"></source>
            <Image
              className={"w-full "}
              layout="fill"
              objectFit="cover"
              src="/images/image-header.jpg"
              objectPosition={"bottom"}
              sizes="380"
              alt="Image of samburu man looking at a vast landscape"
              unoptimized={true}
              priority
            />
          </video>

          <div className="flex flex-col items-center justify-center absolute w-[90%] text-center top-[30%] md:top-[30%] z-20 px-6 md:px-0">
            <div className="flex flex-col items-center">
              <h1 className="font-black font-SourceSans mb-2 text-3xl sm:text-3xl md:text-5xl xl:text-6xl text-white text-center">
                Quality, Tasteful and Affordable Lodges Across Africa
              </h1>
              <h3 className="font-bold mb-8 mt-3 text-base sm:text-2xl italic text-white text-center">
                You deserve memorable travel experiences without breaking the
                bank.
              </h3>
            </div>

            <ScrollLink
              to="stays"
              spy={true}
              smooth={true}
              offset={-50}
              duration={500}
            >
              <Button className="w-[160px] btn-gradient !text-lg h-[45px] uppercase !font-bold !rounded-3xl">
                Book Now
              </Button>
            </ScrollLink>
          </div>
        </div>
      </div>

      <Dialogue
        isOpen={showModal}
        closeModal={() => {
          setShowModal(false);
        }}
        dialoguePanelClassName="max-h-[600px] !p-0 max-w-lg overflow-y-scroll remove-scroll"
      >
        <div className="w-full relative">
          <div className="relative w-full h-[250px]">
            <Image
              className=""
              layout="fill"
              src={"/images/home/group-of-travelers.jpg"}
              objectFit="cover"
              unoptimized={true}
              alt="Image of group of travellers"
            />
          </div>

          <div className="px-4 py-4">
            <h1 className="font-black text-xl xl:text-2xl">
              Are you thinking of going on a trip?
            </h1>
            <p className="mt-4 text-gray-600 lg:text-lg">
              Try out our trip wizard to find your perfect trip
            </p>

            <div
              onClick={() => {
                router.push("/trip-wizard");
                Mixpanel.track("Clicked on trip wizard from modal");
              }}
              className="flex items-center gap-0.5 w-fit mt-4 px-4 py-3 cursor-pointer !rounded-3xl !bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500"
            >
              <span className="text-white text-sm font-black">
                Tell us about your trip
              </span>
            </div>

            <div
              onClick={(e) => {
                e.stopPropagation();
                setShowModal(false);
              }}
              className="flex cursor-pointer items-center absolute top-4 right-4 justify-center w-7 h-7 rounded-full bg-white shadow-lg"
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
        </div>
      </Dialogue>

      <Dialogue
        isOpen={showReviewsModal}
        closeModal={() => {
          setShowReviewsModal(false);
        }}
        dialoguePanelClassName="max-h-[500px] !p-0 !max-w-xl overflow-y-scroll remove-scroll"
      >
        <div className="w-full relative px-5 py-3">
          <h1 className="text-2xl font-black mb-8">Customer Reviews</h1>

          <div className="mt-4 flex flex-col gap-4">
            <Review
              userName={"Kai"}
              rate={5}
              review="The service and the booking system were great. Great communications and the campsite was excellent!"
              subText="Australia"
            ></Review>

            <Review
              userName={"Thea"}
              rate={5}
              review="Winda provided several amazing options that fit all of our needs, including pricing for the trip end to end, took care of booking, helped us arrange transport, and even contacted the lodge"
              subText="United States"
            ></Review>

            <Review
              userName={"Sue"}
              rate={5}
              review="Winda’s service communication and support with bookings was excellent!"
              subText="Kenya"
            ></Review>
            <Review
              userName={"Caroline"}
              rate={5}
              review="It was our first time planning such a trip. It was difficult to find a french travel agency that were affordable and flexible. We managed to find winda which planned a trip in our budget and they were very flexible."
              subText="France"
            ></Review>
          </div>

          <div
            onClick={(e) => {
              e.stopPropagation();
              setShowReviewsModal(false);
            }}
            className="flex cursor-pointer items-center absolute top-4 right-4 justify-center w-7 h-7 rounded-full bg-white shadow-lg"
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

      <div className="bg-white md:pb-14">
        <div className="2xl:w-4/6 2xl:mx-auto">
          <Main specialLodges={specialLodges}></Main>
        </div>
      </div>

      <div className="">
        <Footer></Footer>
      </div>

      <CookiesMessage></CookiesMessage>
    </div>
  );
}

export async function getServerSideProps(context) {
  try {
    const token = getToken(context);

    const specialLodges = await axios.get(
      `${process.env.NEXT_PUBLIC_baseURL}/stays/?in_homepage=true&has_options=true`
    );

    if (token) {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_baseURL}/user/`,
        {
          headers: {
            Authorization: "Token " + token,
          },
        }
      );

      return {
        props: {
          userProfile: response.data[0],
          specialLodges: specialLodges.data.results,
        },
      };
    }

    return {
      props: {
        specialLodges: specialLodges.data.results,
        userProfile: "",
      },
      // statusCode: error.response.statusCode,
    };
  } catch (error) {
    if (error.response.status === 401) {
      return {
        redirect: {
          permanent: false,
          destination: "/logout",
        },
      };
    } else {
      return {
        props: {
          userProfile: "",
          specialLodges: [],
        },
        // statusCode: error.response.statusCode,
      };
    }
  }
}
