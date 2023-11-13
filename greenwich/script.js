const fs = require("fs");
const { getSubjectName, formatDate, createSign } = require("../nissen/token");

const directoryPath = "./gre_images";
const fileFormat = "_success.txt";
const fileError = "_error.txt";
const successFile = formatDate() + fileFormat;
const errorFile = formatDate() + fileError;

const params = {
  gender: 1,
  face_group_id: 18,
  store_id: 63,
};

const createSubject = async () => {
  const newToken = "b82ba7413d37bfae841227beba1f9d0b";

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
  formData.append("gender", params.gender);
  formData.append("face_group_id", params.face_group_id);
  formData.append("store_id", params.store_id);
  formData.append("faceImg", paramsData.subjectImg);

  let res = await fetch(
    "https://digieye.viotgroup.com/phpapi/accessControl/target/add",
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
