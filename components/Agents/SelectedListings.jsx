import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { useRouter } from "next/router";
import SelectedListing from "./SelectedListing";
import { Icon } from "@iconify/react";
import Selected from "./Selected";

function SelectedListings({
  listings,
  hasRoomTypeData,
  setHasRoomTypeData,
  openPopup,
}) {
  return (
    <div>
      {listings.length > 0 && (
        <div className="text-xl font-bold font-SourceSans mt-5 ml-3 mb-6">
          {listings.length} {listings.length > 1 ? "lodges" : "lodge"} selected
        </div>
      )}

      {/* <div className="flex w-[150px] mb-2 bg-white rounded-md overflow-hidden">
        <div className="w-[50%] gap-0.5 font-bold text-sm text-white cursor-pointer flex items-center justify-center bg-blue-500 px-2 py-1">
          <Icon
            icon="ic:sharp-grid-view"
            className="w-6 h-6 text-white text-xl"
          />
          <span>Insight</span>
        </div>
        <div className="w-[50%] gap-0.5 font-bold text-sm px-2 py-1 cursor-pointer flex items-center justify-center">
          <Icon
            icon="material-symbols:table-chart-sharp"
            className="w-4 h-4 text-gray-600"
          />
          <span>Table</span>
        </div>
      </div> */}
      {listings.length > 0 &&
        listings.map((listing, index) => {
          return (
            // <Selected
            //   key={listing.id}
            //   index={index}
            //   listing={listing}
            // ></Selected>
            <SelectedListing
              hasRoomTypeData={hasRoomTypeData}
              setHasRoomTypeData={setHasRoomTypeData}
              key={listing.id}
              index={index}
              listing={listing}
            />
          );
        })}

      {listings.length === 0 && (
        <div className="absolute top-[50%] left-[50%] -translate-x-2/4">
          <h1 className="font-bold text-xl font-SourceSans">
            No lodge selected yet
          </h1>
        </div>
      )}
    </div>
  );
}

SelectedListings.propTypes = {};

export default SelectedListings;
