import { writeFile } from "node:fs";

writeFile("Hello.txt", "This is a new file", (error) => {
  if (error) {
    console.error(error);
    return;
  } else {
    console.log("file written successfully!");
  }
});
