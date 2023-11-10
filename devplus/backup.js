function countEntriesByDate(fileContent) {
  const lines = fileContent.split("\n");
  const entriesByDate = {};
  for (const line of lines) {
    if (line.includes("Entry")) {
      const name = line.split("\t")[5];
      const date = line.split("\t")[1];
      if (!entriesByDate[name]) {
        entriesByDate[name] = {};
      }
      if (!entriesByDate[name][date]) {
        entriesByDate[name][date] = 0;
      }
      entriesByDate[name][date]++;
    }
  }
  return entriesByDate;
}

function printEntriesByName(entriesByDate, name) {
  for (const date in entriesByDate[name]) {
    const count = entriesByDate[name][date];
    console.log(`${date}\t${count > 1 ? "C" : "S"} = ${count}`);
  }
}

fs.readFile(filePath, "utf-8", (err, fileContent) => {
  if (err) {
    console.error(err);
    return;
  }
  const entriesByDate = countEntriesByDate(fileContent);
  const names = Object.keys(entriesByDate);
  names.forEach((name) => {
    console.log(`${name} :`);
    printEntriesByName(entriesByDate, name);
  });
});
