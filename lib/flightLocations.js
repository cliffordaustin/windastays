export const startingLocationOptions = [
  {
    label: "Nairobi",
    value: "Nairobi",
  },
  {
    label: "Zanzibar",
    value: "Zanzibar",
  },
  {
    label: "Maasai Mara",
    value: "Maasai Mara",
  },
];

export const flightTypes = [
  {
    value: "ONE WAY",
    label: "One way",
  },
  {
    label: "Return",
    value: "RETURN",
  },
];

export const destinationLocationOptions = [
  {
    label: "Diani",
    value: "Diani",
  },
  {
    label: "Maasai Mara",
    value: "Maasai Mara",
  },

  {
    label: "Samburu",
    value: "Samburu",
  },
  {
    label: "Amboseli",
    value: "Amboseli",
  },
  {
    label: "Nanyuki",
    value: "Nanyuki",
  },
  {
    label: "Mombasa",
    value: "Mombasa",
  },
  {
    label: "Malindi",
    value: "Malindi",
  },
  {
    label: "Lamu",
    value: "Lamu",
  },
  {
    label: "Tsavo West",
    value: "Tsavo West",
  },
  {
    label: "Naivasha",
    value: "Naivasha",
  },
  {
    label: "Mombasa",
    value: "Mombasa",
  },
  {
    label: "Zanzibar",
    value: "Zanzibar",
  },
  {
    label: "Kilimanjaro",
    value: "Kilimanjaro",
  },
  {
    label: "Kigali",
    value: "Kigali",
  },
];

export const destinationLocationOptionsForZanzibar = [
  {
    label: "Mombasa",
    value: "Mombasa",
  },
];

export const destinationLocationOptionsForMaasaiMara = [
  {
    label: "Samburu",
    value: "Samburu",
  },
];

export const checkFlightPrice = (
  startingLocation,
  destinationLocation,
  flightType
) => {
  return startingLocation == "Nairobi" &&
    destinationLocation == "Diani" &&
    flightType == "ONE WAY"
    ? 190
    : startingLocation == "Nairobi" &&
      destinationLocation == "Diani" &&
      flightType == "RETURN"
    ? 290
    : startingLocation == "Nairobi" &&
      destinationLocation == "Maasai Mara" &&
      flightType == "ONE WAY"
    ? 150
    : startingLocation == "Nairobi" &&
      destinationLocation == "Maasai Mara" &&
      flightType == "RETURN"
    ? 240
    : startingLocation == "Nairobi" &&
      destinationLocation == "Samburu" &&
      flightType == "ONE WAY"
    ? 280
    : startingLocation == "Nairobi" &&
      destinationLocation == "Samburu" &&
      flightType == "RETURN"
    ? 400
    : startingLocation == "Nairobi" &&
      destinationLocation == "Amboseli" &&
      flightType == "ONE WAY"
    ? 200
    : startingLocation == "Nairobi" &&
      destinationLocation == "Amboseli" &&
      flightType == "RETURN"
    ? 300
    : startingLocation == "Nairobi" &&
      destinationLocation == "Nanyuki" &&
      flightType == "ONE WAY"
    ? 200
    : startingLocation == "Nairobi" &&
      destinationLocation == "Nanyuki" &&
      flightType == "RETURN"
    ? 300
    : startingLocation == "Nairobi" &&
      destinationLocation == "Mombasa" &&
      flightType == "ONE WAY"
    ? 170
    : startingLocation == "Nairobi" &&
      destinationLocation == "Mombasa" &&
      flightType == "RETURN"
    ? 220
    : startingLocation == "Nairobi" &&
      destinationLocation == "Malindi" &&
      flightType == "ONE WAY"
    ? 190
    : startingLocation == "Nairobi" &&
      destinationLocation == "Malindi" &&
      flightType == "RETURN"
    ? 300
    : startingLocation == "Nairobi" &&
      destinationLocation == "Lamu" &&
      flightType == "ONE WAY"
    ? 200
    : startingLocation == "Nairobi" &&
      destinationLocation == "Lamu" &&
      flightType == "RETURN"
    ? 340
    : startingLocation == "Nairobi" &&
      destinationLocation == "Tsavo West" &&
      flightType == "ONE WAY"
    ? 250
    : startingLocation == "Nairobi" &&
      destinationLocation == "Tsavo West" &&
      flightType == "RETURN"
    ? 380
    : startingLocation == "Nairobi" &&
      destinationLocation == "Naivasha" &&
      flightType == "ONE WAY"
    ? 160
    : startingLocation == "Nairobi" &&
      destinationLocation == "Naivasha" &&
      flightType == "RETURN"
    ? 260
    : startingLocation == "Zanzibar" &&
      destinationLocation == "Mombasa" &&
      flightType == "ONE WAY"
    ? 290
    : startingLocation == "Zanzibar" &&
      destinationLocation == "Mombasa" &&
      flightType == "RETURN"
    ? 420
    : startingLocation == "Nairobi" &&
      destinationLocation == "Zanzibar" &&
      flightType == "ONE WAY"
    ? 280
    : startingLocation == "Nairobi" &&
      destinationLocation == "Zanzibar" &&
      flightType == "RETURN"
    ? 230
    : startingLocation == "Nairobi" &&
      destinationLocation == "Kilimanjaro" &&
      flightType == "ONE WAY"
    ? 180
    : startingLocation == "Nairobi" &&
      destinationLocation == "Kilimanjaro" &&
      flightType == "RETURN"
    ? 330
    : startingLocation == "Nairobi" &&
      destinationLocation == "Kigali" &&
      flightType == "ONE WAY"
    ? 270
    : startingLocation == "Nairobi" &&
      destinationLocation == "Kigali" &&
      flightType == "RETURN"
    ? 400
    : startingLocation == "Maasai Mara" &&
      destinationLocation == "Samburu" &&
      flightType == "ONE WAY"
    ? 400
    : startingLocation == "Maasai Mara" &&
      destinationLocation == "Samburu" &&
      flightType == "RETURN"
    ? 500
    : "";
};
