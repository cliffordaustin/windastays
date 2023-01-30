import React, { useState } from "react";
import Card from "../ui/Card";
import styles from "../../styles/Main.module.css";

import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Navigation, Thumbs, Autoplay } from "swiper";
import SwiperCore from "swiper";
import { useSelector } from "react-redux";

import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";

import { createGlobalStyle } from "styled-components";

import Image from "next/image";

import { useRouter } from "next/router";
import { Mixpanel } from "../../lib/mixpanelconfig";
import Link from "next/link";
import Button from "../ui/Button";
import { Icon } from "@iconify/react";
import StyledLink from "../ui/Link";
import { Element } from "react-scroll";
import { Link as ScrollLink } from "react-scroll";

SwiperCore.use([Navigation]);

function Main({ specialLodges }) {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);

  const GlobalStyle = createGlobalStyle`
  .swiper {
    width: 100%;
    height: 100%;
  }
  
  .swiper-slide {
    text-align: center;
    font-size: 18px;
    background: #fff;
  
    /* Center slide text vertically */
    display: -webkit-box;
    display: -ms-flexbox;
    display: -webkit-flex;
    display: flex;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    -webkit-justify-content: center;
    justify-content: center;
    -webkit-box-align: center;
    -ms-flex-align: center;
    -webkit-align-items: center;
    align-items: center;
  }
  
  .swiper-slide img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .swiper {
    width: 100%;
    height: 300px;
    margin-left: auto;
    margin-right: auto;
  }
  
  .swiper-slide {
    background-size: cover;
    background-position: center;
  }
  
  .mySwiper2 {
    height: 80%;
    width: 100%;
  }
  
  .mySwiper {
    height: 20%;
    box-sizing: border-box;
    padding: 10px 0;
  }
  
  .mySwiper .swiper-slide {
    height: 100%;
    opacity: 0.4;
  }
  
  .mySwiper .swiper-slide-thumb-active {
    opacity: 1;
  }
  
  .swiper-slide img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  #progress {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    background-color: red;
    height: 10px;
    z-index: 100;
}
`;
  const router = useRouter();

  const [progress, setProgress] = useState(0);

  const [state, setState] = useState({
    swiperIndex: 0,
    allowSlideNext: false,
    endOfSlide: false,
    swiperTravelIndex: 0,
    allowTravelSlideNext: false,
    endOfTravelSlide: false,
    swiperExploreLocationIndex: 0,
    allowExploreLocationSlideNext: false,
    endOfExploreLocationSlide: false,

    isEndOfSlide: false,
    isBeginningOfSlide: false,
    isEndOfExploreSlide: false,
    isBeginningOfExploreSlide: false,
    isEndOfTripSlide: false,
    isBeginningOfTripSlide: false,
  });

  let autoplay = 5000;

  function move() {
    var elem = document.getElementById("progress");
    var width = 1;
    var autoplayTime = autoplay / 100;
    var id = setInterval(frame, autoplayTime);
    function frame() {
      if (width >= 100) {
        clearInterval(id);
      } else {
        width++;
        elem.style.width = width + "%";
      }
    }
  }

  return (
    <div className="w-full">
      <GlobalStyle></GlobalStyle>
      <div className="lg:px-12 md:px-6 pt-20">
        <div className="w-[100%] h-full flex-col md:flex-row md:h-[500px] lg:h-[450px] xl:h-[400px] flex">
          <div className="md:w-[55%] px-6 md:px-0 flex md:mr-8 flex-col order-2 md:order-1 gap-8 justify-center">
            <h1 className="font-bold font-SourceSans items-start text-2xl lg:text-2xl xl:text-4xl">
              Expensive isn&apos;t luxury
            </h1>
            <p className="text-lg md:text-lg">
              So much energy is spent on planning a great safari or getaway, and
              you want to make sure you have the best time. When browsing
              through the lodge options and talking to travel agents, it can
              feel as though the only way to have a fantastic safari is to pay
              an arm and a leg for it, but that&apos;s just not the case. In
              fact, more often than not, you end up feeling short-changed when
              the standard of service at a lodge doesn&apos;t live up to what
              you paid for. We&apos;ve done the heavy lifting for you, having
              checked each of our lodges for quality service and amenities, so
              that you can focus on relaxing and enjoying your well-deserved
              holiday.
            </p>
          </div>

          <div className="w-full h-[300px] md:mb-0 mb-8 md:order-2 order-1 md:h-full md:w-[45%] relative">
            <Image
              className="w-full h-full md:rounded-3xl"
              layout="fill"
              src="/images/home/nairobi-activity.webp"
              objectFit="cover"
              alt="Image"
            />
          </div>
        </div>

        <div className="w-[100%] h-full mt-24 flex-col md:flex-row md:h-[450px] xl:h-[400px] flex">
          <div className="w-full h-[300px] md:mb-0 mb-8 md:h-full md:w-[45%] relative">
            <Image
              className="w-full h-full md:rounded-3xl"
              layout="fill"
              src="/images/home/group-of-travelers.jpg"
              objectFit="cover"
              alt="Image"
            />
          </div>
          <div className="md:w-[55%] px-6 md:px-0 md:ml-8 flex flex-col gap-8 justify-center">
            <h1 className="font-bold font-SourceSans items-start text-2xl lg:text-2xl xl:text-4xl">
              Hakuna Matata
            </h1>
            <p className="text-lg md:text-lg">
              It means no worries because winda&apos;s got you covered. We get
              it, safari is a once-in-a-lifetime chance for many of us and we
              want to have the best one, but that doesn&apos;t mean you&apos;ve
              gotta break the bank. You&apos;ll still see Simba and Timon and
              even Pumba! We want to put your mind at ease, we&apos;re local
              travel experts who&apos;ve helped over 300 clients book good
              quality, and most importantly; value-for-money lodges. And you can
              book them too.
            </p>
          </div>
        </div>

        <ScrollLink
          to="stays"
          spy={true}
          smooth={true}
          offset={-50}
          duration={500}
        >
          <Button className="w-[160px] mx-auto mt-8 uppercase !text-lg btn-gradient h-[45px] !font-bold !rounded-3xl !py-6">
            Book now
          </Button>
        </ScrollLink>
      </div>

      <div className="w-[100%] mt-12 md:mt-16 pb-8 items-center gap-6 justify-center md:h-fit bg-[#edede9] flex flex-col">
        <h1 className="font-bold w-[70%] font-SourceSans text-center text-2xl mt-6 lg:text-2xl xl:text-4xl">
          You can have an amazing safari without breaking the bank
        </h1>

        <div className="flex flex-wrap items-center justify-center gap-12 mt-12">
          <div className="flex w-[90%] md:w-[300px] flex-col gap-4 items-center">
            <h1 className="font-black text-xl">1</h1>
            <div className="w-[80px] h-[80px] rounded-full bg-slate-800 flex items-center justify-center">
              <Icon
                icon="fluent:cursor-click-24-regular"
                className="text-white w-[50px] h-[50px]"
              />
            </div>
            <p className="text-center text-xl">
              Click on the &quot;Book now button&quot;
            </p>
          </div>
          <div className="flex w-[90%] md:w-[300px] flex-col gap-4 items-center">
            <h1 className="font-black text-xl">2</h1>
            <div className="w-[80px] h-[80px] rounded-full bg-slate-800 flex items-center justify-center">
              <Icon icon="uiw:date" className="text-white w-[35px] h-[35px]" />
            </div>
            <p className="text-center text-xl">
              Browse through our lodges and pick your travel date
            </p>
          </div>
          <div className="flex w-[90%] md:w-[300px] flex-col gap-4 items-center">
            <h1 className="font-black text-xl">3</h1>
            <div className="w-[80px] h-[80px] rounded-full bg-slate-800 flex items-center justify-center">
              <Icon className="text-white w-[35px] h-[35px]" icon="ph:house" />
            </div>
            <p className="text-center text-xl">Book your lodge of choice!</p>
          </div>
        </div>

        <ScrollLink
          to="stays"
          spy={true}
          smooth={true}
          offset={-50}
          duration={500}
        >
          <Button className="w-[160px] mx-auto mt-8 uppercase !text-lg btn-gradient h-[45px] !font-bold !rounded-3xl !py-6">
            Book now
          </Button>
        </ScrollLink>
      </div>

      <div className="w-[100%] md:mt-16 p-6 flex flex-col items-center justify-center">
        <div className="mx-auto flex flex-col md:w-[80%]">
          <div className="flex md:flex-row flex-col">
            <div className="mt-6 md:w-[40%] md:mt-0 flex flex-col py-6 justify-center">
              <h1 className="font-bold font-SourceSans md:items-start text-2xl lg:text-3xl xl:text-4xl">
                Avoid the disappointment
              </h1>
            </div>
            <div className="md:p-8 flex-col mb-5 md:mb-5 md:w-[60%] flex items-center justify-center">
              <p className="text-lg md:text-xl">
                There&apos;s nothing worse than spending your hard-earned money
                on a subpar experience.
              </p>

              <div className="mt-2 font-bold text-lg md:text-xl">
                You can now book affordable lodges whose quality you can trust.
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2 border-t-2 px-6 border-black py-2 mt-6 md:hidden">
        <h1 className="font-bold font-SourceSans md:items-start text-2xl lg:text-3xl xl:text-4xl">
          Our Lodges
        </h1>
        <p className="text-lg md:text-xl">
          We vet affordable lodges in East Africa for high-quality service,
          amenities, and food to ensure a predictable and superior experience
          for our guests.
        </p>
      </div>

      <Element name="stays">
        <div className="flex flex-col px-4 md:mt-12">
          <div className="h-[650px] hidden md:block mt-6">
            <Swiper
              onSwiper={setThumbsSwiper}
              spaceBetween={10}
              slidesPerView={4}
              freeMode={true}
              watchSlidesProgress={true}
              navigation={true}
              modules={[FreeMode, Navigation, Thumbs]}
              className="mySwiper"
            >
              {specialLodges.map((listing, index) => {
                const sortedImages = listing.stay_images.sort(
                  (x, y) => y.main - x.main
                );

                const images = sortedImages.map((image) => {
                  return image.image;
                });
                return (
                  images.length >= 2 && (
                    <SwiperSlide
                      key={index}
                      className="!w-fit cursor-pointer pr-8 pl-2"
                    >
                      <div className="flex flex-col gap-0.5">
                        <div className="uppercase self-start font-SourceSans font-bold text-xs text-gray-500">
                          {listing.location}
                        </div>

                        <div className="text-xl font-black font-SourceSans capitalize">
                          {listing.name}
                        </div>
                      </div>
                    </SwiperSlide>
                  )
                );
              })}
            </Swiper>
            <Swiper
              spaceBetween={10}
              navigation={true}
              loop={true}
              autoplay={{
                delay: 7000,
                disableOnInteraction: false,
              }}
              speed={1000}
              // onProgress={move()}
              thumbs={{ swiper: thumbsSwiper }}
              modules={[FreeMode, Navigation, Thumbs, Autoplay]}
              className="mySwiper2"
            >
              {specialLodges.map((listing, index) => {
                const sortedImages = listing.stay_images.sort(
                  (x, y) => y.main - x.main
                );

                const images = sortedImages.map((image) => {
                  return image.image;
                });

                return (
                  images.length >= 2 && (
                    <SwiperSlide key={index}>
                      <div className="flex h-full relative w-full">
                        <div className="w-[70%] absolute left-0 h-full self-end">
                          <Image
                            className="w-full h-full grayscale opacity-50"
                            layout="fill"
                            objectFit="cover"
                            alt={"Large image of " + listing.name}
                            src={images[0]}
                          />
                        </div>
                        <div className="w-[40%] border-black">
                          <div className="h-[40%] px-2 py-2">
                            <div className="flex mt-6 z-20 flex-col gap-0.5">
                              <div className="uppercase self-start font-bold text-xs text-black">
                                {listing.location}
                              </div>

                              <div className="text-2xl self-start text-black font-black font-OpenSans capitalize">
                                {listing.name}
                              </div>

                              <div
                                onClick={() => {
                                  Mixpanel.track(
                                    "Clicked on a lodge from homepage",
                                    {
                                      listing: listing.name,
                                    }
                                  );
                                }}
                                className="mt-4"
                              >
                                <Link href={`/stays/${listing.slug}`}>
                                  <a>
                                    <StyledLink
                                      titleClass="!text-sm font-bold !leading-2"
                                      text={"VISIT"}
                                    ></StyledLink>
                                  </a>
                                </Link>
                              </div>
                            </div>
                          </div>
                          <div className="h-[200px] bottom-20 absolute right-[55%] z-10 w-[250px]">
                            <Image
                              className="w-full h-full"
                              layout="fill"
                              objectFit="cover"
                              alt={"Small image of " + listing.name}
                              src={images[1]}
                            />
                          </div>
                        </div>

                        <div className="w-[60%] h-[80%] self-center relative">
                          <Image
                            className="w-full h-full"
                            layout="fill"
                            objectFit="cover"
                            alt={"Large image of " + listing.name}
                            src={images[0]}
                          />
                        </div>
                      </div>
                    </SwiperSlide>
                  )
                );
              })}
            </Swiper>
          </div>
        </div>

        <div className="block h-[550px] mt-4 md:hidden">
          <Swiper
            slidesPerView={1}
            navigation={true}
            loop={true}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
            }}
            speed={1000}
            // onProgress={move()}
            thumbs={{ swiper: thumbsSwiper }}
            modules={[FreeMode, Navigation, Thumbs, Autoplay]}
            className="mySwiper2"
          >
            {specialLodges.map((listing, index) => {
              const sortedImages = listing.stay_images.sort(
                (x, y) => y.main - x.main
              );

              const images = sortedImages.map((image) => {
                return image.image;
              });

              return (
                images.length > 0 && (
                  <SwiperSlide className="flex flex-col" key={index}>
                    <div className="h-[80%] relative w-full">
                      <Image
                        className="w-full h-full"
                        layout="fill"
                        objectFit="cover"
                        alt={"Small image of " + listing.name}
                        src={images[0]}
                      />
                    </div>
                    <div className="px-4 py-2 flex items-center justify-between bg-[#0a0375] h-[20%] w-full">
                      <div className="flex flex-col items-start">
                        <div className="uppercase font-bold text-xs text-white">
                          {listing.location}
                        </div>

                        <div className="text-xl text-white text-left font-black font-OpenSans capitalize">
                          {listing.name}
                        </div>
                      </div>

                      <div
                        onClick={() => {
                          Mixpanel.track(
                            "User clicked on an accommodation from windastays homepage",
                            {
                              name_of_accommodation: listing.name,
                            }
                          );
                        }}
                        className=""
                      >
                        <Link href={`/stays/${listing.slug}`}>
                          <a>
                            <StyledLink
                              titleClass="!text-sm !text-white font-bold !leading-2"
                              text={"VISIT"}
                            ></StyledLink>
                          </a>
                        </Link>
                      </div>
                    </div>
                  </SwiperSlide>
                )
              );
            })}
          </Swiper>
        </div>
      </Element>
    </div>
  );
}

export default Main;
