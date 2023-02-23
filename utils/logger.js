const fs = require("fs");
var path = require("path");

/**
    Log path pattern: log-2023-01-01.log
 */

module.exports = (content = "Pusty wpis") => {
  const today = new Date();
  const currentLogFileName = `log-${today.toISOString().split("T")[0]}.log`;
  const currentLogFilePath = path.join(
    __dirname,
    "../../",
    "logs",
    currentLogFileName
  );

  fs.appendFile(
    currentLogFilePath,
    `${content} -> ${today.toLocaleDateString()} at ${today.toLocaleTimeString()}\n`,
    (err) => {
      if (err) {
        console.error(err);
      }
      // file written successfully
    }
  );
};
