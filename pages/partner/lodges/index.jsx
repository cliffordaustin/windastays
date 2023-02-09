import React from "react";
import PropTypes from "prop-types";
import Link from "next/link";
import Image from "next/image";
import { Icon } from "@iconify/react";
import getToken from "../../../lib/getToken";
import axios from "axios";
import { useRouter } from "next/router";

import Calendar from "../../../components/Partner/Calendar";
import Events from "../../../components/Partner/Events";
import Analytics from "../../../components/Partner/Analytics";
import SelectOptions from "../../../components/Partner/SelectOptions";
import Accommodation from "../../../components/Partner/Accommodation";
import Button from "../../../components/ui/Button";
import LoadingSpinerChase from "../../../components/ui/LoadingSpinerChase";
import Cookies from "js-cookie";
import ClientOnly from "../../../components/ClientOnly";

function PartnerLodges({ stays }) {
  const router = useRouter();

  const tableData = {
    id: 1,
    name: "Mara Serena Lodge",

    rooms: [
      {
        id: 1,
        name: "Standard Room",
        dates: [
          {
            id: 1,
            price: 100,
            available: 2,
            date: "2023-02-01",
          },
          {
            id: 2,
            price: 130,
            available: 1,
            date: "2023-02-02",
          },
          {
            id: 3,
            price: 150,
            available: 0,
            date: "2023-02-03",
          },
          {
            id: 4,
            price: 120,
            available: 1,
            date: "2023-02-04",
          },
          {
            id: 5,
            price: 100,
            available: 2,
            date: "2023-02-06",
          },
        ],
      },
      {
        id: 2,
        name: "Deluxe Room",

        dates: [
          {
            id: 1,
            price: 100,
            available: 2,
            date: "2023-02-01",
          },
          {
            id: 2,
            price: 130,
            available: 1,
            date: "2023-02-02",
          },
          {
            id: 3,
            price: 150,
            available: 0,
            date: "2023-02-03",
          },
          {
            id: 4,
            price: 120,
            available: 1,
            date: "2023-02-04",
          },
          {
            id: 5,
            price: 100,
            available: 2,
            date: "2023-02-05",
          },
        ],
      },
      {
        id: 3,
        name: "Family Room",

        dates: [
          {
            id: 1,
            price: 100,
            available: 2,
            date: "2023-02-01",
          },
          {
            id: 2,
            price: 130,
            available: 1,
            date: "2023-02-02",
          },
          {
            id: 3,
            price: 150,
            available: 0,
            date: "2023-02-03",
          },
          {
            id: 4,
            price: 120,
            available: 1,
            date: "2023-02-04",
          },
          {
            id: 5,
            price: 100,
            available: 2,
            date: "2023-02-05",
          },
        ],
      },
    ],
  };

  const [loading, setLoading] = React.useState(false);

  const requestListing = async () => {
    const token = Cookies.get("token");
    setLoading(true);
    await axios.post(
      `${process.env.NEXT_PUBLIC_baseURL}/send-request-mail/`,
      {},
      {
        headers: {
          Authorization: "Token " + token,
        },
      }
    );

    Cookies.set("requestListing", "true", { expires: 3 });
    setLoading(false);
    router.reload();
  };

  return (
    <div>
      {stays.length === 0 && (
        <div>
          <ClientOnly>
            {Cookies.get("requestListing") === "true" && (
              <div className="w-full bg-blue-600 py-2 px-4 flex items-center justify-center bg-opacity-30">
                <h1 className="font-bold">
                  Your request has been sent. We will notify you once your
                  listing is available to be managed.
                </h1>
              </div>
            )}
          </ClientOnly>
          <div className="px-3 py-2 w-full h-[70px] border-b flex items-center justify-center">
            <div className="flex gap-4 items-center justify-center">
              <div className="relative w-28 h-9 z-40">
                <Image
                  layout="fill"
                  alt="Logo"
                  src="/images/winda_logo/horizontal-blue-font.png"
                  priority
                ></Image>
              </div>

              <div className="h-[25px] w-[1px] mt-4 z-40 bg-gray-400"></div>

              <h1 className="uppercase font-OpenSans mt-3 text-lg text-gray-700 tracking-widest z-40">
                partner
              </h1>
            </div>
          </div>

          <div className="flex flex-col w-full items-center justify-center absolute top-[40%]">
            <div className="flex flex-col items-center gap-3">
              <h1 className="text-2xl font-bold font-SourceSans">
                You have no listings added yet
              </h1>

              <ClientOnly>
                {Cookies.get("requestListing") === "true" ? (
                  <div className="!w-fit rounded-lg !py-2 !bg-gray-400 text-white flex gap-2 !cursor-default !px-4 font-bold">
                    Your request has been sent
                    <Icon
                      className="w-6 h-6"
                      icon="material-symbols:check-small"
                    />
                  </div>
                ) : (
                  <Button
                    onClick={() => {
                      requestListing();
                    }}
                    className="!w-fit flex gap-2 !px-4 font-bold btn-gradient"
                  >
                    Request for your lising to be added
                    {loading && (
                      <LoadingSpinerChase
                        width={15}
                        height={15}
                      ></LoadingSpinerChase>
                    )}
                  </Button>
                )}
              </ClientOnly>
            </div>
          </div>
        </div>
      )}
      {stays.length > 0 && (
        <div className="flex">
          <div className="w-[350px] relative">
            <div className="px-3 py-2 h-[70px] border-b flex items-center justify-center">
              <div className="flex gap-4 items-center justify-center">
                <div className="relative w-28 h-9 z-40">
                  <Image
                    layout="fill"
                    alt="Logo"
                    src="/images/winda_logo/horizontal-blue-font.png"
                    priority
                  ></Image>
                </div>

                <div className="h-[25px] w-[1px] mt-4 z-40 bg-gray-400"></div>

                <h1 className="uppercase font-OpenSans mt-3 text-lg text-gray-700 tracking-widest z-40">
                  partner
                </h1>
              </div>
            </div>

            <h1 className="mt-4 font-bold ml-3 text-xl font-SourceSans">
              Your Accommodation
            </h1>

            <div className="px-4 mt-5 relative flex flex-col gap-5">
              {stays.map((stay, index) => (
                <Accommodation
                  listing={stay}
                  key={index}
                  index={index}
                ></Accommodation>
              ))}
            </div>

            {/* <div className="absolute bottom-2 left-0 right-0">
              Not here?
            </div> */}
          </div>

          <div className="flex-grow px-4 border-l relative flex flex-col gap-6 overflow-x-scroll pt-8">
            <Events
              tableData={{
                name:
                  stays.length > 0
                    ? stays[router.query.index ? Number(router.query.index) : 0]
                        .property_name ||
                      stays[router.query.index ? Number(router.query.index) : 0]
                        .name
                    : "",

                rooms:
                  stays.length > 0
                    ? stays[router.query.index ? Number(router.query.index) : 0]
                        .room_types
                    : [],
              }}
            ></Events>
          </div>
        </div>
      )}
    </div>
  );
}

PartnerLodges.propTypes = {};

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

    if (response.data[0].is_partner) {
      const stays = await axios.get(
        `${process.env.NEXT_PUBLIC_baseURL}/user-stays-email/`,
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
    } else {
      return {
        notFound: true,
      };
    }
  } catch (error) {
    if (error.response.status === 401) {
      return {
        redirect: {
          permanent: false,
          destination: `/partner/signup?redirect=/partner/lodges`,
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

export default PartnerLodges;
