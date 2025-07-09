# Caremerge Node.js Title Fetcher

This project implements a Node.js server that fetches and displays the <title> tags of given websites using three different asynchronous control flow strategies:

1. callback-server.js — using plain callbacks  
2. async-server.js — using async.js  
3. promise-server.js — using Promises with axios

The server responds to a single route:

GET /I/want/title?address=...

It accepts one or more address query parameters, fetches each URL, extracts the <title> tag from each page, and returns an HTML response. If a site is invalid or unreachable, it shows "NO RESPONSE" instead of the title. Any other route returns a 404.

Example request:

http://localhost:3000/I/want/title?address=google.com&address=yahoo.com&address=asdasdasd

Example response:

<html>
  <head></head>
  <body>
    <h1>Following are the titles of given websites:</h1>
    <ul>
      <li>google.com - "Google"</li>
      <li>yahoo.com - "Yahoo | Mail, Weather, Search, Politics, News, Finance, Sports & Videos"</li>
      <li>asdasdasd - "NO RESPONSE"</li>
    </ul>
  </body>
</html>

To run the project:

1. Make sure Node.js is installed.  
2. Install required dependencies using: npm install

This installs:
- express
- axios
- async
- follow-redirects

To start any version:

node callback-server.js  
node async-server.js  
node promise-server.js

Test it in your browser or Postman using:

http://localhost:3000/I/want/title?address=google.com&address=facebook.com&address=asdasdasd

If no address is provided, the server will respond with: No address provided.  
If the route is invalid, the server will respond with: 404 Not Found

Files included:
- callback-server.js
- async-server.js
- promise-server.js
- README.md

This completes the Caremerge assessment for asynchronous control flow using Node.js with callbacks, async.js, and Promises.
