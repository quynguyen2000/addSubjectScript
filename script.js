const fs = require("fs");
const { getToken, getSubjectName, formatDate, createSign } = require("./token");

const directoryPath = "./images";
const fileFormat = "_success.txt";
const fileError = "_error.txt";
const successFile = formatDate() + fileFormat;
const errorFile = formatDate() + fileError;

const params = {
  subject_type_id: 2,
  store_id: 31,
};

const createSubject = async () => {
  const newToken = await getToken();
  let d = Date(Date.now());

  try {
    const images = fs.readdirSync(directoryPath);
    const tasks = images.map((image) => createSubjectPromise(image, newToken));

    const results = await Promise.all(tasks);
    console.log(results);
  } catch (error) {
    console.log(error.message);
    // throw new Error(error.message);
  }
};

const createSubjectPromise = async (image, newToken) => {
  const imageData = fs.readFileSync(directoryPath + "/" + image);

  const imgFile = new File([imageData], image, {
    lastModified: 1695876303057,
    lastModifiedDate: new Date(1695876303057),
  });

  const paramsData = {
    ...params,
    name: getSubjectName(image),
    subjectImg: imgFile,
  };

  const formData = new FormData();

  const sign = createSign(paramsData, newToken);

  formData.append("name", paramsData.name);
  formData.append("subject_type_id", params.subject_type_id);
  formData.append("store_id", params.store_id);
  formData.append("subjectImg", paramsData.subjectImg);

  let res = await fetch(
    "https://digieye.viotgroup.com/phpapi/aiApplication/subject/addSubject",
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
    console.log(`${getSubjectName(image)} - ${res.msg}`);

    if (!fs.existsSync(successFile)) {
      fs.writeFileSync(successFile, res.data.subject_id.toString() + "\n");
    } else {
      fs.appendFileSync(successFile, res.data.subject_id.toString() + "\n");
    }

    return res.data.subject_id;
  } else {
    if (!fs.existsSync(errorFile)) {
      fs.writeFileSync(errorFile, `${image.toString()} ${res.msg}` + "\n");
    } else {
      fs.appendFileSync(errorFile, `${image.toString()} ${res.msg}` + "\n");
    }
    throw new Error(`${getSubjectName(image)} - ${res.msg}`);
  }
};

createSubject();
