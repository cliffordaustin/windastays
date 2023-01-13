import React, { useMemo, useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";

import Map, { Marker, NavigationControl, Source, Layer } from "react-map-gl";

import { createGlobalStyle } from "styled-components";

import { Icon } from "@iconify/react";
import MapMakers from "../../../components/Home/MapMakers";
import Link from "next/link";
import Image from "next/image";

const locations = [
  {
    trip: "23rd April - one night in Nairobi at the African heritage house $100",
    latitude: -1.400327852,
    longitude: 36.93917108,
  },
  {
    trip: "April 24 - 25: Camping in Shompole, Lake Magadi",
    latitude: -2.012615428,
    longitude: 36.04457107,
  },
  {
    trip: "25th April - Drive back to Nairobi spend another night Treehouse, Nairobi",
    latitude: -1.368808558,
    longitude: 36.75073857,
  },
  {
    trip: "May 7 - 9: Amazing Mara Camp, Maasai Mara",
    latitude: -1.429567715,
    longitude: 35.18561773,
  },
  {
    trip: "Nanyuki (Mukima boathouse)",
    latitude: 0.0723894282,
    longitude: 37.08210222,
  },
  {
    trip: "Drive to Laikipia to Karisia walking safaris",
    latitude: 0.4551981981,
    longitude: 36.9551339,
  },
  {
    trip: "Nairobi: Airbnb in Westlands",
    latitude: -1.261191622,
    longitude: 36.7894403,
  },
  {
    trip: "Fly out to Kilimanjaro spend a night in Arusha River Trees Inn",
    latitude: -3.373356693,
    longitude: 36.86441968,
  },
  {
    trip: "Drive out to lake Manyara spend 2 nights there",
    latitude: -3.360558469,
    longitude: 35.83304911,
  },
  {
    trip: "Drive out Ngorongoro crater",
    latitude: -3.327826974,
    longitude: 35.6345586,
  },
  {
    trip: "Drive to Kilimanjaro then fly out to Zanzibar, Upendo house Stonetown",
    latitude: -6.160975292,
    longitude: 39.19045053,
  },
  {
    trip: "Z Hotel Nungwi",
    latitude: -5.730340791,
    longitude: 39.29164318,
  },
];
function MapTest2() {
  const mapRef = useRef();

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

      <div className="w-full h-[90vh]">
        <div className="flex items-center justify-center h-[70px] w-full bg-white">
          <Link href="/">
            <a className="font-lobster text-xl relative w-28 h-9 cursor-pointer">
              <Image
                layout="fill"
                alt="Logo"
                src="/images/winda_logo/horizontal-blue-font.png"
                priority
              ></Image>
            </a>
          </Link>
        </div>
        <Map
          {...viewportExpandedMap}
          maxZoom={20}
          reuseMaps
          ref={mapRef}
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
          {locations.map((location, index) => (
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

MapTest2.propTypes = {};

export default MapTest2;
