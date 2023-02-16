import moment from "moment";

const singleResidentAdultPrice = (availabilities) => {
  const price = 0;

  availabilities.forEach((availability) => {
    availability.room_resident_guest_availabilities.map((room) => {
      if (room.name === "ADULT SINGLE") {
        price += room.price;
      }
    });
  });

  return price;
};

const singleResidentChildPrice = (availabilities) => {
  const price = 0;

  availabilities.forEach((availability) => {
    availability.room_resident_guest_availabilities.map((room) => {
      if (room.name === "CHILD SINGLE") {
        price += room.price;
      }
    });
  });

  return price;
};

const singleNonResidentAdultPrice = (availabilities) => {
  const price = 0;

  availabilities.forEach((availability) => {
    availability.room_non_resident_guest_availabilities.map((room) => {
      if (room.name === "ADULT SINGLE") {
        price += room.price;
      }
    });
  });

  return price;
};

const singleNonResidentChildPrice = (availabilities) => {
  const price = 0;

  availabilities.forEach((availability) => {
    availability.room_non_resident_guest_availabilities.map((room) => {
      if (room.name === "CHILD SINGLE") {
        price += room.price;
      }
    });
  });

  return price;
};

const doubleResidentAdultPrice = (availabilities) => {
  const price = 0;

  availabilities.forEach((availability) => {
    availability.room_resident_guest_availabilities.map((room) => {
      if (room.name === "ADULT DOUBLE") {
        price += room.price;
      }
    });
  });

  return price;
};

const doubleResidentChildPrice = (availabilities) => {
  const price = 0;

  availabilities.forEach((availability) => {
    availability.room_resident_guest_availabilities.map((room) => {
      if (room.name === "CHILD DOUBLE") {
        price += room.price;
      }
    });
  });

  return price;
};

const doubleNonResidentAdultPrice = (availabilities) => {
  const price = 0;

  availabilities.forEach((availability) => {
    availability.room_non_resident_guest_availabilities.map((room) => {
      if (room.name === "ADULT DOUBLE") {
        price += room.price;
      }
    });
  });

  return price;
};

const doubleNonResidentChildPrice = (availabilities) => {
  const price = 0;

  availabilities.forEach((availability) => {
    availability.room_non_resident_guest_availabilities.map((room) => {
      if (room.name === "CHILD DOUBLE") {
        price += room.price;
      }
    });
  });

  return price;
};

const tripleResidentAdultPrice = (availabilities) => {
  const price = 0;

  availabilities.forEach((availability) => {
    availability.room_resident_guest_availabilities.map((room) => {
      if (room.name === "ADULT TRIPLE") {
        price += room.price;
      }
    });
  });

  return price;
};

const tripleResidentChildPrice = (availabilities) => {
  const price = 0;

  availabilities.forEach((availability) => {
    availability.room_resident_guest_availabilities.map((room) => {
      if (room.name === "CHILD TRIPLE") {
        price += room.price;
      }
    });
  });

  return price;
};

const tripleNonResidentAdultPrice = (availabilities) => {
  const price = 0;

  availabilities.forEach((availability) => {
    availability.room_non_resident_guest_availabilities.map((room) => {
      if (room.name === "ADULT TRIPLE") {
        price += room.price;
      }
    });
  });

  return price;
};

const tripleNonResidentChildPrice = (availabilities) => {
  const price = 0;

  availabilities.forEach((availability) => {
    availability.room_non_resident_guest_availabilities.map((room) => {
      if (room.name === "CHILD TRIPLE") {
        price += room.price;
      }
    });
  });

  return price;
};

const infantResidentPrice = (availabilities) => {
  const price = 0;

  availabilities.forEach((availability) => {
    availability.room_resident_guest_availabilities.map((room) => {
      if (room.name === "INFANT") {
        price += room.price;
      }
    });
  });

  return price;
};

const infantNonResidentPrice = (availabilities) => {
  const price = 0;

  availabilities.forEach((availability) => {
    availability.room_non_resident_guest_availabilities.map((room) => {
      if (room.name === "INFANT") {
        price += room.price;
      }
    });
  });

  return price;
};

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  singleResidentAdultPrice,
  singleResidentChildPrice,
  singleNonResidentAdultPrice,
  singleNonResidentChildPrice,
  doubleResidentAdultPrice,
  doubleResidentChildPrice,
  doubleNonResidentAdultPrice,
  doubleNonResidentChildPrice,
  tripleResidentAdultPrice,
  tripleResidentChildPrice,
  tripleNonResidentAdultPrice,
  tripleNonResidentChildPrice,
  infantResidentPrice,
  infantNonResidentPrice,
};
