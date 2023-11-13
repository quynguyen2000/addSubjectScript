const fs = require("fs");

const filePath = "./devplus_recognition.txt";
const resultPath = "./devplus.txt";

function formatData(inputFile, outputFile) {
  fs.readFile(inputFile, "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return;
    }

    const lines = data.split("\n");
    const formattedData = {};
    const dateStrings = [];

    for (let line of lines) {
      const [_, __, ___, date, time, ____, _____, name] = line.split("\t");

      const date_time = new Date(`${date} ${time}`);
      const mins_date = new Date(`${date} 08:00:00`);
      const maxs_date = new Date(`${date} 08:45:00`);
      const minc_date = new Date(`${date} 13:00:00`);
      const maxc_date = new Date(`${date} 13:45:00`);

      const currentHoursDate = date_time.getHours();
      const targetHoursDate = currentHoursDate + 7;
      date_time.setHours(targetHoursDate);

      //sáng
      // const currentHoursMaxsDate = maxs_date.getHours();
      // const targetHoursMaxsDate = currentHoursMaxsDate + 7;
      // maxs_date.setHours(targetHoursMaxsDate);
      const currentHoursMinsDate = mins_date.getHours();
      const targetHoursMinsDate = currentHoursMinsDate + 7;
      mins_date.setHours(targetHoursMinsDate);

      //chiều
      const currentHoursMaxcDate = maxc_date.getHours();
      const targetHoursMaxcDate = currentHoursMaxcDate + 7;
      maxc_date.setHours(targetHoursMaxcDate);
      const currentHoursMincDate = minc_date.getHours();
      const targetHoursMincDate = currentHoursMincDate + 7;
      minc_date.setHours(targetHoursMincDate);

      if (date_time >= mins_date && date_time <= maxc_date) {
        const dateString = date_time.toISOString().slice(0, 10);

        if (!formattedData[name]) {
          formattedData[name] = {
            S: 0,
            C: 0,
          };
        }

        if (date_time >= minc_date) {
          formattedData[name].C = 1;
        }

        formattedData[name].S = 1;

        if (!dateStrings.includes(dateString)) {
          dateStrings.push(dateString);
        }
      }
    }

    let output = "";

    for (let name in formattedData) {
      output += `${name}:\n`;
      for (let dateString of dateStrings) {
        output += `${dateString}\tS = ${formattedData[name].S}\n`;
        output += `${dateString}\tC = ${formattedData[name].C}\n\n`;
      }
    }

    fs.writeFile(outputFile, output, (err) => {
      if (err) {
        console.error(err);
        return;
      }

      console.log(`Formatted data has been written to ${outputFile}.`);
    });
  });
}

formatData(filePath, resultPath);
