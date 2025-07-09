const express = require("express");
const axios = require("axios");

const app = express();

function fetchTitle(siteUrl) {
  const cleanUrl = siteUrl.startsWith("http") ? siteUrl : "http://" + siteUrl;

  return axios
    .get(cleanUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0",
      },
    })
    .then((response) => {
      const match = response.data.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
      const title = match ? match[1].trim() : "NO TITLE FOUND";
      return { siteUrl, title };
    })
    .catch((error) => {
      console.error(`Error fetching ${cleanUrl}:`, error.message);
      return { siteUrl, title: "NO RESPONSE" };
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

  const promises = addresses.map((address) => fetchTitle(address));

  Promise.all(promises).then((results) => {
    res.send(renderHTML(results));
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
  console.log("Promise server running at http://localhost:3000");
});
