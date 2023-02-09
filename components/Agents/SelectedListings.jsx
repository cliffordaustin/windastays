import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { useRouter } from "next/router";
import SelectedListing from "./SelectedListing";

function SelectedListings({ listings }) {
  return (
    <div>
      {listings.length > 0 && (
        <div className="text-xl font-bold font-SourceSans mt-5 ml-3 mb-6">
          {listings.length} {listings.length > 1 ? "lodges" : "lodge"} selected
        </div>
      )}
      {listings.length > 0 &&
        listings.map((listing, index) => {
          return (
            <SelectedListing key={listing.id} index={index} listing={listing} />
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
