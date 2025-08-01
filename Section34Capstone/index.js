import express from "express";
import pg from "pg";
import dotenv from "dotenv";
import axios from "axios";

const envResult = dotenv.config();
if (envResult.error) {
  throw envResult.error;
}
const env = envResult.parsed;

const app = express();
const port = 3000;

// Tweak these to be the same as yours
const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "book_app",
  password: env.POSTGRES_PASSWORD,
  port: 5432,
});

db.connect();

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

async function getBooks(direction = "date", order_mode = "DESC") {
  const validDirections = ["ASC", "DESC"];
  const validColumns = ["date", "rating", "title"];

  if (!validDirections.includes(order_mode.toUpperCase())) {
    throw new Error("Invalid order mode");
  }
  if (!validColumns.includes(direction)) {
    throw new Error("Invalid direction");
  }

  const query = `SELECT * FROM entries ORDER BY ${direction} ${order_mode}`;
  const response = await db.query(query);
  return response.rows;
}

async function addBook(isbn, title, author, rating, date, comment) {
  try {
    const cover = await axios.get(
      `https://bookcover.longitood.com/bookcover/${isbn}`
    );
    try {
      const response = await db.query(
        "INSERT INTO entries (isbn, title, author, rating, date, cover, comment) VALUES($1, $2, $3, $4, $5, $6, $7)",
        [isbn, title, author, rating, date, cover.data.url, comment]
      );
    } catch (error) {
      console.log(error);
    }
  } catch (error) {
    console.log(error.response.data.error);
  }
}

app.get("/", async (req, res) => {
  try {
    const direction = req.query.sort || "date";
    const order_mode = req.query.order || "DESC";

    const books = await getBooks(direction, order_mode);
    res.render("index.ejs", {
      books: books,
      sort: direction,
      order: order_mode,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Could not get book entries.");
  }
});

app.post("/add", async (req, res) => {
  const { isbn, title, author, rating, date, comment } = req.body;
  try {
    await addBook(isbn, title, author, rating, date, comment);
    res.redirect("/");
  } catch (error) {
    console.error(error);
    res.status(500).send("Failed to add book");
  }
});

app.post("/delete", express.json(), async (req, res) => {
  try {
    await db.query("DELETE FROM entries WHERE isbn = $1", [req.body.isbn]);
    res.sendStatus(200);
  } catch (err) {
    console.error("Delete failed:", err);
    res.sendStatus(500);
  }
});


app.listen(port, () => {
  console.log("Server running on http://localhost:" + port);
});
