import { createServer } from "node:http";

const server = createServer((request, response) => {
  console.log("request received");

  response.statusCode = 200;

  response.setHeader("Content-Type", "application/json");

  response.end(JSON.stringify({ location: "Mars" }));
});

server.listen(3000, () => {
  console.log("server running at http://localhost:3000");
});
