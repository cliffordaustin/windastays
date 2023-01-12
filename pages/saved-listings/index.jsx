import React, { useState } from "react";

import { useRouter } from "next/router";
import axios from "axios";

import "rc-steps/assets/index.css";

import getToken from "../../lib/getToken";

import Navbar from "../../components/ui/Navbar";

import Footer from "../../components/Home/Footer";
import Listing from "../../components/SavedListings/Listing";
import Head from "next/head";
import Button from "../../components/ui/Button";

function SavedListings({ userProfile, savedStays }) {
  const [state, setState] = useState({
    showDropdown: false,
    currentNavState: 0,
    showCheckOutDate: false,
    showCheckInDate: false,
    showPopup: false,
    showSearchModal: false,
  });

  const router = useRouter();

  return (
    <div className="relative">
      <Head>
        <title>Winda.guide | Your saved listings</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <div className="mb-24">
        <div>
          {savedStays.length === 0 && (
            <div>
              <Navbar userProfile={userProfile} showBookNowBtn={false}></Navbar>
              <div className="px-4 xl:w-[1100px] mx-auto sm:px-16 md:px-12 lg:px-16">
                <div className="mb-8 mt-4 ml-4 text-xl font-bold">
                  Your saved listings
                </div>
                <div className="flex flex-col items-center mb-12">
                  <div className="text-center mt-4 font-bold">
                    No item in here. Don&apos;t worry.
                  </div>
                  <Button
                    onClick={() => {
                      router.push("/");
                    }}
                    className="flex w-fit mt-3 mb-3 items-center gap-1 !px-4 !py-3 font-bold btn-gradient !text-white"
                  >
                    <span>Explore on winda</span>
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div>
          {savedStays.length > 0 && (
            <div>
              <Navbar userProfile={userProfile} showBookNowBtn={false}></Navbar>

              <div className="px-2 xl:w-[1100px] mx-auto sm:px-16 md:px-12 lg:px-16">
                {savedStays.length > 0 && (
                  <div className="mb-4 mt-2 ml-4 text-lg font-bold">
                    Stays - Your saved stays({savedStays.length})
                  </div>
                )}
                <div className="flex flex-wrap mb-5 gap-4">
                  {savedStays.map((item, index) => {
                    return (
                      <div
                        key={index}
                        onClick={() => {
                          router.push(`/stays/${item.stay.slug}`);
                        }}
                        className="md:w-[31%] w-full"
                      >
                        <Listing
                          stayPage={true}
                          stay={item.stay}
                          stayId={item.id}
                        ></Listing>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="fixed left-0 right-0 bottom-0">
        <Footer></Footer>
      </div>
    </div>
  );
}

SavedListings.propTypes = {};

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

    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_baseURL}/user-saved-stays/`,
      {
        headers: {
          Authorization: "Token " + token,
        },
      }
    );

    return {
      props: {
        userProfile: response.data[0],
        savedStays: data.results,
      },
    };
  } catch (error) {
    console.log(error.response.data);
    if (error.response.status === 401) {
      return {
        redirect: {
          permanent: false,
          destination: "/login",
        },
      };
    } else {
      return {
        props: {
          userProfile: "",
          savedStays: [],
        },
      };
    }
  }
}

export default SavedListings;
