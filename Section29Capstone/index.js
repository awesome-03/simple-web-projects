import express from "express";
import axios from "axios";

const app = express();
const PORT = 3000;

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render("index.ejs")
});

app.post("/", async (req, res) => {
  try {
    const response = await axios.get(`https://api.lyrics.ovh/v1/${req.body.artistName}/${req.body.songName}`)
    res.render("index.ejs", {
      songLyrics: response.data.lyrics,
    });
  } catch(error) {
    res.render("index.ejs", {
      songLyrics: "Cannot find a song that fit those requirements.",
    });
    console.log(error.message);
  }
});

app.listen(PORT, () => {
  console.log("Listening on port " + PORT);
});
