const fs = require("fs");
const { formatDate, getToken, createSign } = require("./token");
const fileFormat = "_success.txt";

const deleteSubject = async (filename) => {
  const newToken = await getToken();

  const pathRoot = filename + fileFormat;

  try {
    const textFile = fs.readFileSync(pathRoot);
    const textString = textFile.toString("ascii").split("\n");

    const subjectIds = textString
      .map((str) => parseInt(str.trim()))
      .filter((number) => !isNaN(number));

    const params = {
      pid: 28,
      ids: subjectIds,
    };

    const formData = new FormData();
    const sign = createSign(params, newToken);

    formData.append("pid", params.pid);
    formData.append("ids", params.ids);

    let res = await fetch(
      "https://digieye.viotgroup.com/phpapi/aiApplication/subject/deleteSubject",
      {
        method: "POST",
        headers: {
          Sign: sign,
          Token: newToken,
        },
        body: formData,
      }
    );
    res = await res.json();
    if (res.code === 1000) {
      fs.unlinkSync(pathRoot);
      console.log(res);
    }
  } catch (error) {
    console.log(error);
  }
};
deleteSubject("2023_10_6_17_16");
