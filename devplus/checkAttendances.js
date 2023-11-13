const fs = require("fs");

const names = fs.readFileSync("./name.txt", "utf-8").split("\n");
const attendanceData = fs
  .readFileSync("./devplus_recognition.txt", "utf-8")
  .split("\n");

function getTimePeriod(time) {
  const hour = parseInt(time.slice(0, 2));
  if (hour < 12) {
    return "sang";
  } else if (hour > 12) {
    return "chieu";
  }
}

const absentData = {};

for (const record of attendanceData) {
  const [_, __, ___, date, time, ____, _____, name] = record.split("\t");
  if (!absentData[date]) {
    absentData[date] = {
      sang: [],
      chieu: [],
    };
  }
  const timePeriod = getTimePeriod(time);
  if (timePeriod) {
    absentData[date][timePeriod].push(name);
  }
}

let output = "";

for (const name of names) {
  let absentDates = [];
  for (const date in absentData) {
    if (
      !absentData[date].sang.includes(name) &&
      !absentData[date].chieu.includes(name)
    ) {
      absentDates.push(date);
    }
  }
  console.log("absentDates", absentDates);
  if (absentDates.length > 0) {
    for (const date of absentDates) {
      if (!absentData[date].sang.includes(name)) {
        output += `${date} - ${name} - SÁNG\n`;
      }
      if (!absentData[date].chieu.includes(name)) {
        output += `${date} - ${name} - CHIỀU\n`;
      }
    }
  }
}

if (output.trim() !== "") {
  if (!fs.existsSync("devplus_absent.txt")) {
    fs.writeFileSync("devplus_absent.txt", output);
  } else {
    fs.appendFileSync("devplus_absent.txt", output);
  }
}
