const fs = require("fs");

// function getName(fileName) {
//   const fileNameWithoutExtension = fileName.split(".")[0];
//   return fileNameWithoutExtension.split("_").join(" ");
// }
function getName(fileName) {
  const fileNameWithoutExtension = fileName.split(".")[0];
  return fileNameWithoutExtension;
}

const createSubject = async () => {
  const directoryPath = "./images";
  const images = fs.readdirSync(directoryPath);
  const namePath = "./gre_names.txt";

  images.forEach((image) => {
    if (!fs.existsSync(namePath)) {
      fs.writeFileSync(namePath, getName(image) + "\n");
    } else {
      fs.appendFileSync(namePath, getName(image) + "\n");
    }
  });
};
createSubject();
