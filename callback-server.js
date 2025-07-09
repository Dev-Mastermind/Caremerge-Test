const { http, https } = require("follow-redirects");
const express = require("express");

const app = express();

function fetchTitle(siteUrl, callback) {
  const cleanUrl = siteUrl.startsWith("http") ? siteUrl : "http://" + siteUrl;
  const lib = cleanUrl.startsWith("https") ? https : http;

  const options = {
    headers: {
      "User-Agent": "Mozilla/5.0"
    }
  };

  lib
    .get(cleanUrl, options, (res) => {
      let data = "";

      res.on("data", (chunk) => {
        data += chunk;
      });

      res.on("end", () => {
        const match = data.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
        const title = match ? match[1].trim() : "NO TITLE FOUND";
        callback(null, { siteUrl, title });
      });
    })
    .on("error", (err) => {
      console.error(`Error fetching ${cleanUrl}:`, err.message);
      callback(null, { siteUrl, title: "NO RESPONSE" });
    });
}

app.get("/I/want/title", (req, res) => {
  let addresses = req.query.address;

  if (!addresses) {
    return res.send("No address provided.");
  }

  if (!Array.isArray(addresses)) {
    addresses = [addresses];
  }

  let results = [];
  let completed = 0;

  addresses.forEach((address, index) => {
    fetchTitle(address, (err, result) => {
      results[index] = result;
      completed++;
      if (completed === addresses.length) {
        res.send(renderHTML(results));
      }
    });
  });
});

function renderHTML(results) {
  const listItems = results
    .map((r) => `<li>${r.siteUrl} - "${r.title}"</li>`)
    .join("");

  return `
    <html>
      <head></head>
      <body>
        <h1>Following are the titles of given websites:</h1>
        <ul>${listItems}</ul>
      </body>
    </html>
  `;
}

app.use((req, res) => {
  res.status(404).send("404 Not Found");
});

app.listen(3000, () => {
  console.log("Callback server running at http://localhost:3000");
});
