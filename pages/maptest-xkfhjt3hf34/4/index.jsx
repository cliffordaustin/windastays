import React, { useMemo, useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";

import Map, { Marker, NavigationControl, Source, Layer } from "react-map-gl";
import axios from "axios";
import { useRouter } from "next/router";

import { createGlobalStyle } from "styled-components";

import { Icon } from "@iconify/react";
import MapMakers from "../../../components/Home/MapMakers";

import Link from "next/link";
import Image from "next/image";

function MapTest1({ trip }) {
  const router = useRouter();

  //   const [trip, setTrip] = useState([]);

  //   const getTrip = async () => {
  //     const trip = await axios.get(
  //       `${process.env.NEXT_PUBLIC_baseURL}/curated-trips/hy1yr0stvp9quw8eaju9adwh/`
  //     );
  //     setTrip(trip.data);
  //   };

  //   useEffect(() => {
  //     getTrip();
  //   }, []);

  const [viewportExpandedMap, setViewportExpandedMap] = useState({
    longitude: 36.8442449,
    latitude: -1.3924933,
    zoom: 6,
  });

  const GlobalStyle = createGlobalStyle`
  .mapboxgl-map {
    -webkit-mask-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAA5JREFUeNpiYGBgAAgwAAAEAAGbA+oJAAAAAElFTkSuQmCC);
    @media (min-width: 768px) {
      border-radius: 0rem !important;
    }
  }
  .mapboxgl-popup-content {
    background: none;
    box-shadow: none !important;
  }
  .mapboxgl-popup-anchor-bottom .mapboxgl-popup-tip {
    border-top-color: transparent !important;
    border: none !important;
  }
`;

  return (
    <div style={{ position: "relative", height: "100%", width: "100%" }}>
      <GlobalStyle></GlobalStyle>

      <div className="flex h-[70px] w-full bg-white">
        <Link href="/">
          <a className="font-lobster text-xl relative w-28 h-9 cursor-pointer mx-auto my-auto">
            <Image
              layout="fill"
              alt="Logo"
              src="/images/winda_logo/horizontal-blue-font.png"
              priority
            ></Image>
          </a>
        </Link>
      </div>
      <div className="w-full h-[90vh]">
        <Map
          {...viewportExpandedMap}
          maxZoom={20}
          width="100%"
          height="100%"
          scrollZoom={true}
          boxZoom={true}
          doubleClickZoom={true}
          mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_API_KEY}
          onMove={(evt) => setViewportExpandedMap(evt.viewState)}
          mapStyle="mapbox://styles/mapbox/streets-v9"
        >
          <NavigationControl></NavigationControl>
          {trip.locations.map((location, index) => (
            <MapMakers
              key={index}
              num={index + 1}
              location={location}
            ></MapMakers>
          ))}
        </Map>
      </div>
    </div>
  );
}

MapTest1.propTypes = {};

export async function getServerSideProps(context) {
  try {
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_baseURL}/curated-trips/y8pk6y02e8tyat8pt747654u/`
    );

    return {
      props: {
        trip: data,
      },
    };
  } catch (error) {
    if (error.response.status === 404) {
      return {
        notFound: true,
      };
    } else {
      return {
        props: {
          trip: [],
        },
      };
    }
  }
}

export default MapTest1;
