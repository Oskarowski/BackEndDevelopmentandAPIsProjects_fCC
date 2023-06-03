require("dotenv").config();
const express = require("express");
const cors = require("cors");
const nodemon = require("nodemon");
const { urlencoded } = require("body-parser");
const dns = require("dns");

const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/public", express.static(`${process.cwd()}/public`));

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

// Your first API endpoint
app.get("/api/hello", function (req, res) {
  res.json({ greeting: "hello API" });
});

const originalURLs = [];
const shortenedURLs = [];

// function isValidURL(url, callback) {
//   // Extract the host from the URL
//   try {
//     const host = new URL(url).host;

//     // Perform DNS lookup for the host
//     dns.lookup(host, (err, address) => {
//       if (err || !address) {
//         // If there's an error or no address is found, the URL is invalid
//         callback(false);
//       } else {
//         // The URL is valid
//         callback(true);
//       }
//     });
//   } catch (err) {
//     // Catch any URL parsing errors
//     callback(false);
//   }
// }

app.post("/api/shorturl", (req, res) => {
  const inputFromForm = req.body.url;
  const foundIndexOfURL = originalURLs.indexOf(inputFromForm);

  // isValidURL(String(inputFromForm), async (isValid) => {
  //   if (!isValid) {
  //     return res.json({ error: "invalid url" });
  //   } else {
  //     if (foundIndexOfURL === -1) {
  //       originalURLs.push(inputFromForm);
  //       shortenedURLs.push(shortenedURLs.length);

  //       return res.json({
  //         original_url: inputFromForm,
  //         short_url: shortenedURLs.length - 1,
  //       });
  //     }

  //     return res.json({
  //       original_url: inputFromForm,
  //       short_url: shortenedURLs[foundIndexOfURL],
  //     });
  //   }
  // });

  if (
    inputFromForm.startsWith("http://") ||
    inputFromForm.startsWith("https://")
  ) {
    if (foundIndexOfURL === -1) {
      originalURLs.push(inputFromForm);
      shortenedURLs.push(shortenedURLs.length);

      return res.json({
        original_url: inputFromForm,
        short_url: shortenedURLs.length - 1,
      });
    }

    return res.json({
      original_url: inputFromForm,
      short_url: shortenedURLs[foundIndexOfURL],
    });
  }
  return res.json({ error: "invalid url" });
});

app.get("/api/shorturl/:short_url", (req, res) => {
  const shortURL = parseInt(req.params.short_url);
  const indexOfShort = shortenedURLs.indexOf(shortURL);

  if (indexOfShort === -1) {
    return res.json({ error: "No short URL found for the given input" });
  }

  const orginalURL = originalURLs[indexOfShort];
  res.redirect(orginalURL);
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
