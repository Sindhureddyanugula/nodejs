const http = require("http");
const fs = require("fs");
const path = require("path");
const { connect, retrieve, upload, deleteData } = require("./mongodb");

const server = http.createServer(async (req, res) => {
      const url = req.url;

      if (url === "/") {
            fs.readFile("./index.html", "UTF-8", function (err, html) {
                  res.writeHead(200, { "Content-Type": "text/html" });
                  res.end(html);
            });
      } else if (url === "/api") {
            await connect();
            // await deleteData();
            // await upload();
            results = await retrieve();
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify(results));
      } else if (url.endsWith(".jpg") || url.endsWith(".png")) {
            serveStaticFile(res, url, `image/${url.endsWith(".jpg") ? "jpeg" : "png"}`);
      } else if (url.endsWith(".css") || url.endsWith(".js")) {
            serveStaticFile(res, url, "text/css");
      } else {
            res.end("404 Not Found");
      }

      console.log(`${req.method} request received for ${req.url}`);
});

function serveStaticFile(res, url, contentType) {
      const filePath = path.join(__dirname, url);
      const fileStream = fs.createReadStream(filePath);

      fileStream.on("error", (error) => {
            res.end("404 Not Found");
      });

      res.writeHead(200, {
            "Content-Type": contentType,
            "Cache-Control": "no-cache",
      });

      fileStream.pipe(res);
}

const port = 3002;

server.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
});
