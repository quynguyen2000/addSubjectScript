var crypto = require("crypto");
const md5 = (data) => crypto.createHash("md5").update(data).digest("hex");

const getToken = async () => {
  try {
    const response = await fetch(
      "https://digieye.viotgroup.com/phpapi/common/home/openAuthorization",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          app_id: "446caavsptsbcmtv",
          secret_key: "uy3i3fdi8hjiipebjf5imusnvv2vfnsq",
        }),
      }
    );

    const data = await response.json();

    if (data.data) {
      const { token } = data.data;
      return token;
    }
  } catch (error) {
    console.error("Error occurred:", error);
  }
};

function getSubjectName(fileName) {
  const fileNameWithoutExtension = fileName.split(".")[0];
  return fileNameWithoutExtension.split("_").join(" ");
}

function formatDate() {
  var d = new Date();
  return (
    d.getFullYear() +
    "_" +
    (d.getMonth() + 1) +
    "_" +
    d.getDate() +
    "_" +
    d.getHours() +
    "_" +
    d.getMinutes()
  );
}

function removeFileTypesFromJSON(json) {
  if (typeof json === "object" && json !== null) {
    if (json instanceof File) {
      return undefined;
    }

    if (Array.isArray(json)) {
      return json.map((item) => removeFileTypesFromJSON(item));
    }

    const result = {};

    for (const key in json) {
      const value = json[key];
      const newValue = removeFileTypesFromJSON(value);

      if (typeof newValue !== "undefined") {
        result[key] = newValue;
      }
    }

    return result;
  }

  return json;
}

const createSign = (params, key) => {
  const data = removeFileTypesFromJSON(params);

  const sortedParams = data
    ? Object.keys(data)
        .filter((key) => data[key] !== "")
        .sort()
        .reduce((result, key) => {
          result[key] = data[key];
          return result;
        }, {})
    : null;

  const stringA = sortedParams
    ? Object.entries(sortedParams)
        .map(([key, value]) => {
          if (Array.isArray(value)) {
            return `${key}=${value
              .map((v) => encodeURIComponent(v))
              .join(",")}`;
          } else {
            return `${key}=${value}`;
          }
        })
        .join("&")
    : null;

  const stringSignTemp = (stringA && stringA + "&key=" + key) || "key=" + key;

  const signValue = md5(stringSignTemp).toUpperCase();

  return signValue;
};

module.exports = { getToken, getSubjectName, formatDate, createSign };
