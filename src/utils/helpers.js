import { store } from "@/main";

// import moment from 'moment-timezone'

const proxy = "" //"https://sleepy-oasis-50684.herokuapp.com/";

const defaultHeaders = () => {
  const token = store?.state?.authentication?.token;

  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: token }),
    // "Origin": "https://thawing-ravine-99061.herokuapp.com/"
    // "Origin": "localhost:8080/"
  };
};

const ErrorsCodes = {
  SESSION_EXPIRED: 103,
  PRODUCER_INVALID_SESSION: 102,
};

export const postData = ({
  hasHeaders = true,
  payload,
  url,
  headers = {},
  formData,
  method = "POST",
}) => {
  return fetch(proxy + url, {
    method,
    mode: "cors",
    // cache: 'no-cache',
    credentials: 'include',
    ...(hasHeaders && {
      headers: {
        ...defaultHeaders(),
        ...headers,
      },
    }),
    // redirect: 'follow',
    // referrer: 'no-referrer',
    body: formData || JSON.stringify(payload),
  })
    .then((data) => data.json())
    .then((data) => {
      if (data.success === false) {
        handleErrors(data);
      }
      preResult(data);

      return data;
    });
};

export const getData = (url, query = "", token = "") => {
  return fetch(proxy + url + query, {
    method: "GET",
    mode: "cors",
    // cache: 'no-cache',
    credentials: 'include',
    headers: {
      ...defaultHeaders(),
      "Content-Type": "application/json",
    },
    // redirect: 'follow',
    // referrer: 'no-referrer'
  })
    .then((data) => data.json())
    .then((data) => {
      if (data.success === false) {
        handleErrors(data);
      }
      preResult(data);

      return data;
    });
};

const preResult = (data) => {
  // store.dispatch("authentication/setUserLoggedIn", data.userLoggedIn);
  // store.dispatch("authentication/setUserId", data.userId);
}

export const getPropertyPayload = (data) => {
  const rooms = {};

  data.rooms.forEach((roomData) => {
    if (!rooms[roomData.type]) {
      rooms[roomData.type] = [];
    }

    rooms[roomData.type].push(roomData.size);
  });

  return {
    name: data.name,
    type: data.type,
    price: data.price,
    stage: data.stage,
    netArea: data.netArea,
    heating: data.heating,
    yearBuild: data.yearBuild,
    totalArea: data.totalArea,
    description: data.description,
    pricePerSqft: data.pricePerSqft,
    floor: data.floor,
    buildingFloors: data.buildingFloors,
    images: data.images,
    location: {
      address: {
        formatted: data.address,
        city: data.city,
        neighborhood: data.neighborhood,
        country: data.country,
      },
      point: {
        type: "Point",
        coordinates: [data.longitude, data.latitude],
      },
    },
    rooms,
    choosedAgents: data.choosedAgents,
  };
};

export const getAgencyPayload = (data) => {
  return {
    name: data.name,
    agents: data.agents.map((a) => a._id),
    requests: data.requests.map((a) => a._id),
    owners: data.owners,
  };
};

export const formatDate = (date) => {
  let dateArray = date.split(" ");
  return {
    date: dateArray[0],
    time: dateArray[1],
    visible: false,
  };
};

export const reverseFormatDate = ({ date, time }) => {
  return [date, time].join(" ");
};

export const changeDateFormat = (date, utc = true, reverse = false) => {
  if (!date) return null;

  let arr = date.split(" ");
  let ISODate = !utc ? arr[0].split("-").reverse() : arr[0].split("-");
  let time = arr[1];

  let [currentYear, currentMonth, currentDay] = ISODate;
  let [currentHour, currentMinute] = time.split(":");

  const { year, month, day, hour, minute } = utcParser({
    utc,
    year: currentYear,
    month: currentMonth,
    day: currentDay,
    hour: currentHour,
    minute: currentMinute,
  });

  return reverse
    ? `${day}-${month}-${year} ${hour}:${minute}`
    : `${year}-${month}-${day} ${hour}:${minute}`;
};

export const utcParser = ({ utc, year, month, day, hour, minute }) => {
  let newDate;

  if (utc) {
    newDate = moment()
      .year(year)
      .month(month)
      .date(day)
      .hours(hour)
      .minute(minute);
    newDate = newDate.utc();
  } else {
    newDate = moment
      .utc()
      .year(year)
      .month(month)
      .date(day)
      .hours(hour)
      .minute(minute);
    newDate = newDate.local();
  }

  year = newDate.year();
  day = newDate
    .date()
    .toString()
    .padStart(2, "0")
    .slice(-2);
  month = newDate
    .month()
    .toString()
    .padStart(2, "0")
    .slice(-2);
  hour = newDate
    .hour()
    .toString()
    .padStart(2, "0")
    .slice(-2);
  minute = newDate
    .minute()
    .toString()
    .padStart(2, "0")
    .slice(-2);

  return { year, month, day, hour, minute };
};

export const formatCoordinates = (coordinates) => {
  return {
    lat: Number(coordinates[1]),
    lng: Number(coordinates[0]),
  };
};

export const throttle = (func, limit) => {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

export function debounce(fn, delay) {
  var timeoutID = null;
  return function() {
    clearTimeout(timeoutID);
    var args = arguments;
    var that = this;
    timeoutID = setTimeout(function() {
      fn.apply(that, args);
    }, delay);
  };
}

const handleErrors = (data) => {
  switch (data.code) {
    case ErrorsCodes.SESSION_EXPIRED:
    case ErrorsCodes.PRODUCER_INVALID_SESSION:
      store.push("login");
  }
  store.dispatch("snackbar/setState", {
    snackbar: true,
    message: data.error.message,
    color: "red",
  });
};

export const isEquivalent = (a, b) => {
  // Create arrays of property names
  var aProps = Object.getOwnPropertyNames(a);
  var bProps = Object.getOwnPropertyNames(b);

  // If number of properties is different,
  // objects are not equivalent
  if (aProps.length != bProps.length) {
    return false;
  }

  for (var i = 0; i < aProps.length; i++) {
    var propName = aProps[i];

    // If values of same property are not equal,
    // objects are not equivalent
    if (a[propName] !== b[propName]) {
      return false;
    }
  }

  // If we made it this far, objects
  // are considered equivalent
  return true;
};

export const setCookie = (name, value, daysToLive = 365, remove = false) => {
  // Encode value in order to escape semicolons, commas, and whitespace
  let cookie = name + "=" + encodeURIComponent(value);

  if (typeof daysToLive === "number") {
    /* Sets the max-age attribute so that the cookie expires
      after the specified number of days */
    cookie += "; max-age=" + remove ? 1 : daysToLive * 24 * 60 * 60;

    document.cookie = cookie;
  }
};

export const removeCookie = (name) => {
  document.cookie = name+'=; Max-Age=-99999999;';  
};

export const getCookie = (name) => {
  // Split cookie string and get all individual name=value pairs in an array
  let cookieArr = document.cookie.split(";");

  // Loop through the array elements
  for (let i = 0; i < cookieArr.length; i++) {
    let cookiePair = cookieArr[i].split("=");

    /* Removing whitespace at the beginning of the cookie name
      and compare it with the given string */
    if (name == cookiePair[0].trim()) {
      // Decode the cookie value and return
      return decodeURIComponent(cookiePair[1]);
    }
  }

  // Return null if not found
  return null;
};
