const fs = require("fs");
const path = require("path");

function findToggleComponents(data) {
  let results = [];
//finds all components in the figma json that have "Toggle" in their name and no underscore, to filter out the exact toggle components.
  if (Array.isArray(data)) {
    data.forEach(item => {
      results = results.concat(findToggleComponents(item));
    });
  } else if (typeof data === "object" && data !== null) {
    if (
      data.name &&
      data.name.includes("Toggle") &&
      !data.name.includes("_")
    ) {
      results.push(data);
    }
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        results = results.concat(findToggleComponents(data[key]));
      }
    }
  }

  return results;
}

fs.readFile("figma.json", "utf8", (err, jsonString) => {
  if (err) {
    console.error("Error reading input file:", err);
    return;
  }

  try {
    const jsonData = JSON.parse(jsonString);
    const toggles = findToggleComponents(jsonData);

    if (!fs.existsSync("output")) {
      fs.mkdirSync("output");
    }
//splitting each toggle component into its own JSON file in the output directory.
    toggles.forEach((toggle, index) => {
      const filename = path.join("output", `toggle-${index + 1}.json`);
      fs.writeFile(filename, JSON.stringify(toggle, null, 2), (err) => {
        if (err) {
          console.error(`Error writing ${filename}:`, err);
        } else {
          console.log(`Saved: ${filename}`);
        }
      });
    });

  } catch (parseErr) {
    console.error("Error parsing JSON:", parseErr);
  }
});
