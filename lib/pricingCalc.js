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

// get age group

// const maxAdults = (room_types) => {
//   let max = 0;
//   room_types.every((room_type) => {
//     room_type.room_resident_availabilities.length > 0
//       ? room_type.room_resident_availabilities.every((availability) => {
//           availability.room_resident_guest_availabilities.every((room) => {
//             if (room.name === "ADULT SINGLE") {
//               max = 1;
//               return;
//             }
//             return true;
//           });
//         })
//       : room_type.room_non_resident_availabilities.every((availability) => {
//           availability.room_non_resident_availabilities.every((room) => {
//             if (room.name === "ADULT SINGLE") {
//               max = 1;
//               return;
//             }
//             return true;
//           });
//         });
//     return true;
//   });
//   return max;
// }

const adultAgeGroup = (room_type) => {
  let ageGroup = "";

  room_type.room_resident_availabilities.length > 0
    ? room_type.room_resident_availabilities.every((availability) => {
        availability.room_resident_guest_availabilities.every((room) => {
          if (
            room.name === "ADULT SINGLE" ||
            room.name === "ADULT DOUBLE" ||
            room.name === "ADULT TRIPLE"
          ) {
            ageGroup = room.age_group;
            return;
          }
          return true;
        });
      })
    : room_type.room_non_resident_availabilities.every((availability) => {
        availability.room_non_resident_guest_availabilities.every((room) => {
          if (
            room.name === "ADULT SINGLE" ||
            room.name === "ADULT DOUBLE" ||
            room.name === "ADULT TRIPLE"
          ) {
            ageGroup = room.age_group;
            return;
          }
          return true;
        });
      });

  return ageGroup;
};

const childAgeGroup = (room_type) => {
  let ageGroup = "";
  room_type.room_resident_availabilities.length > 0
    ? room_type.room_resident_availabilities.every((availability) => {
        availability.room_resident_guest_availabilities.every((room) => {
          if (
            room.name === "CHILD SINGLE" ||
            room.name === "CHILD DOUBLE" ||
            room.name === "CHILD TRIPLE"
          ) {
            ageGroup = room.age_group;
            return;
          }
          return true;
        });
      })
    : room_type.room_non_resident_availabilities.every((availability) => {
        availability.room_non_resident_guest_availabilities.every((room) => {
          if (
            room.name === "CHILD SINGLE" ||
            room.name === "CHILD DOUBLE" ||
            room.name === "CHILD TRIPLE"
          ) {
            ageGroup = room.age_group;
            return;
          }
          return true;
        });
      });

  return ageGroup;
};

const infantAgeGroup = (room_type) => {
  let ageGroup = "";

  room_type.room_resident_availabilities.length > 0
    ? room_type.room_resident_availabilities.every((availability) => {
        availability.room_resident_guest_availabilities.every((room) => {
          if (room.name === "INFANT") {
            ageGroup = room.age_group;
            return;
          }
          return true;
        });
      })
    : room_type.room_non_resident_availabilities.every((availability) => {
        availability.room_non_resident_guest_availabilities.every((room) => {
          if (room.name === "INFANT") {
            ageGroup = room.age_group;
            return;
          }
          return true;
        });
      });

  return ageGroup;
};

// check if guest type is available

const isResidentAdultAvailable = (room_type) => {
  let isAvailable = false;

  room_type.room_resident_availabilities.length > 0
    ? room_type.room_resident_availabilities.every((availability) => {
        availability.room_resident_guest_availabilities.every((room) => {
          if (room.name === "ADULT SINGLE" || room.name === "ADULT DOUBLE") {
            isAvailable = true;
            return;
          }
          return true;
        });
      })
    : (isAvailable = false);

  return isAvailable;
};

const isResidentChildAvailable = (room_type) => {
  let isAvailable = false;

  room_type.room_resident_availabilities.length > 0
    ? room_type.room_resident_availabilities.every((availability) => {
        availability.room_resident_guest_availabilities.every((room) => {
          if (room.name === "CHILD SINGLE" || room.name === "CHILD DOUBLE") {
            isAvailable = true;
            return;
          }
          return true;
        });
      })
    : (isAvailable = false);

  return isAvailable;
};

const isNonResidentAdultAvailable = (room_type) => {
  let isAvailable = false;

  room_type.room_non_resident_availabilities.length > 0
    ? room_type.room_non_resident_availabilities.every((availability) => {
        availability.room_non_resident_guest_availabilities.every((room) => {
          if (room.name === "ADULT SINGLE" || room.name === "ADULT DOUBLE") {
            isAvailable = true;
            return;
          }
          return true;
        });
      })
    : (isAvailable = false);

  return isAvailable;
};

const isNonResidentChildAvailable = (room_type) => {
  let isAvailable = false;

  room_type.room_non_resident_availabilities.length > 0
    ? room_type.room_non_resident_availabilities.every((availability) => {
        availability.room_non_resident_guest_availabilities.every((room) => {
          if (room.name === "CHILD SINGLE" || room.name === "CHILD DOUBLE") {
            isAvailable = true;
            return;
          }
          return true;
        });
      })
    : (isAvailable = false);

  return isAvailable;
};

const isResidentInfantAvailable = (room_type) => {
  let isAvailable = false;

  room_type.room_resident_availabilities.length > 0
    ? room_type.room_resident_availabilities.map((availability) => {
        availability.room_resident_guest_availabilities.map((room) => {
          if (room.name === "INFANT") {
            isAvailable = true;
            return;
          }
          return true;
        });
      })
    : (isAvailable = false);

  return isAvailable;
};

const isNonResidentInfantAvailable = (room_type) => {
  let isAvailable = false;
  room_type.room_non_resident_availabilities.length > 0
    ? room_type.room_non_resident_availabilities.map((availability) => {
        availability.room_non_resident_guest_availabilities.map((room) => {
          if (room.name === "INFANT") {
            isAvailable = true;
            return;
          }
          return true;
        });
      })
    : (isAvailable = false);

  return isAvailable;
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
  adultAgeGroup,
  childAgeGroup,
  infantAgeGroup,
  isResidentChildAvailable,
  isResidentAdultAvailable,
  isNonResidentAdultAvailable,
  isNonResidentChildAvailable,
  isResidentInfantAvailable,
  isNonResidentInfantAvailable,
};
