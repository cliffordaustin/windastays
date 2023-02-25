import React from "react";
import getToken from "../../../lib/getToken";
import axios from "axios";
import Search from "../../../components/Agents/Search";
import { useFormik } from "formik";
import * as Yup from "yup";
import Listing from "../../../components/Agents/Listing";
import { Icon } from "@iconify/react";
import { Transition } from "@headlessui/react";
import { useRouter } from "next/router";
import SelectedListings from "../../../components/Agents/SelectedListings";
import moment from "moment";
import ReactJoyride from "react-joyride";

function Agents({ userProfile, stays }) {
  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      location: router.query.location || "",
      date: {
        from: router.query.date ? new Date(router.query.date) : "",
        to: router.query.endDate ? new Date(router.query.endDate) : "",
      },
      residentAdult: Number(router.query.residentAdult) || 1,
      nonResidentAdult: Number(router.query.nonResidentAdult) || 0,
      residentChild: Number(router.query.residentChild) || 0,
      nonResidentChild: Number(router.query.nonResidentChild) || 0,
      infantResident: Number(router.query.infantResident) || 0,
      infantNonResident: Number(router.query.infantNonResident) || 0,
    },
    validationSchema: Yup.object({
      location: Yup.string(),
      date: Yup.object(),
      residentAdult: Yup.number(),
      nonResidentAdult: Yup.number(),
      residentChild: Yup.number(),
      nonResidentChild: Yup.number(),
      infantResident: Yup.number(),
      infantNonResident: Yup.number(),
    }),
    onSubmit: async (values) => {
      router.replace(
        {
          query: {
            ...router.query,
            ...values,
            date: moment(values.date.from).format("YYYY-MM-DD"),
            endDate: moment(values.date.to).format("YYYY-MM-DD"),
          },
        },
        undefined,
        { shallow: true }
      );
    },
  });

  const [currentOptions, setCurrentOptions] = React.useState([]);

  const [showPopup, setShowPopup] = React.useState(false);

  const listings = stays.filter((listing) => {
    return router.query.selected
      ? router.query.selected.includes(listing.id)
      : null;
  });

  const [showTour, setShowTour] = React.useState(true);

  const steps = [
    {
      target: "#step1",
      content:
        "Name of the lodge selected and you can click on the arrow to collapse or expand the section. You can also click on the trash icon to remove the selected lodge",
      title: "Help",
    },
    {
      target: "#step2",
      title: "Help",
      content: "This is the date you selected",
    },
    {
      target: "#step3",
      title: "Help",
      content: "Available rooms for the selected date are displayed here.",
    },
    {
      target: "#step4",
      title: "Help",
      content: "Click on add guest to the selected room to calculate the price",
    },
  ];

  return (
    <div>
      <Search formik={formik}></Search>

      <h1 className="font-bold mt-4 mb-2 ml-4 text-2xl font-SourceSans">
        Showing results for {stays.length}{" "}
        {stays.length > 1 ? "lodges" : "lodge"}
      </h1>
      <div className="px-4 py-2 flex gap-4">
        {stays.map((stay, index) => {
          return (
            <Listing
              key={index}
              currentOptions={currentOptions}
              setCurrentOptions={setCurrentOptions}
              listing={stay}
            ></Listing>
          );
        })}
      </div>
      <Transition
        enter="transition-all duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-all duration-300"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
        run={showTour}
        show={showPopup}
      >
        <div
          onClick={() => {
            setShowPopup(false);
          }}
          className="fixed top-0 !overflow-y-scroll left-0 right-0 bottom-0 bg-black bg-opacity-40"
        ></div>
      </Transition>
      <div className="w-full fixed h-fit !overflow-y-scroll bg-gray-100 bottom-0 px-4 border border-gray-300 rounded-t-3xl shadow-top">
        {!showPopup && (
          <div className="flex justify-between items-center">
            <div></div>
            {listings.length === 0 && (
              <h1 className="font-bold font-SourceSans">
                No lodge selected yet
              </h1>
            )}
            {listings.length > 0 && (
              <div className="font-bold font-SourceSans">
                {listings.length} {listings.length > 1 ? "lodges" : "lodge"}{" "}
                selected
              </div>
            )}
            <div
              onClick={() => {
                setShowPopup(!showPopup);
              }}
              className="w-[40px] btn-gradient-2 cursor-pointer mt-2 mb-1 h-[40px] rounded-full flex items-center justify-center"
            >
              <Icon className="w-8 h-8 text-white" icon="mdi:chevron-up" />
            </div>
          </div>
        )}
        <Transition
          enter="transition-all duration-300 opacity-1"
          enterFrom="h-0 opacity-0"
          enterTo="opacity-100 h-[90vh]"
          leave="transition-all duration-300"
          leaveFrom="opacity-100 h-[55px]"
          leaveTo="h-0 opacity-0"
          show={showPopup}
        >
          <ReactJoyride
            continuous
            scrollToFirstStep
            showProgress
            showSkipButton
            steps={steps}
            // beaconComponent={() => (
            //   <div
            //     onClick={() => {
            //       setShowTour(true);
            //     }}
            //     className="flex cursor-pointer animate-pulse justify-center items-center absolute bottom-10 right-6 w-[40px] h-[40px] rounded-full bg-blue-700"
            //   >
            //     <Icon
            //       className="w-8 h-8 text-white"
            //       icon="ic:baseline-question-mark"
            //     />
            //   </div>
            // )}
            beaconComponent={() => null}
          />
          <SelectedListings listings={listings}></SelectedListings>

          <div
            onClick={() => {
              setShowPopup(!showPopup);
            }}
            className="w-[40px] absolute top-2 right-4 btn-gradient-2 cursor-pointer mt-2 h-[40px] rounded-full flex items-center justify-center"
          >
            <Icon className="w-8 h-8 text-white" icon="mdi:chevron-down" />
          </div>
        </Transition>
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  try {
    const token = getToken(context);

    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_baseURL}/user/`,
      {
        headers: {
          Authorization: "Token " + token,
        },
      }
    );

    const stays = await axios.get(
      `${process.env.NEXT_PUBLIC_baseURL}/partner-stays/`,
      {
        headers: {
          Authorization: "Token " + token,
        },
      }
    );

    return {
      props: {
        userProfile: response.data[0],
        stays: stays.data.results,
      },
    };
  } catch (error) {
    if (error.response.status === 401) {
      return {
        redirect: {
          permanent: false,
          destination: `/login?redirect=/partner/agent`,
        },
      };
    } else {
      return {
        props: {
          userProfile: "",
          stays: [],
        },
      };
    }
  }
}

export default Agents;
