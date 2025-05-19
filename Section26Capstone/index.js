import express from "express";

const app = express();
const PORT = 3000;

/*
  The routes for this project are going to be something like this:
  ----------------------------------------------------------------
  / -> The main page of the project where it explains the project details, such as what the user can do etc.
  /blogs -> Where the user can see choose a blog post to read/make/edit
  /blogs/create -> The page to create and publish blogs.
  /blogs/[blog-title-here] -> The page for reading/editing the blog. Here, there's an edit button to edit the text and save.
*/

app.get("/", (req, res) => {
  res.render("index.ejs");
});

app.listen(PORT, () => {
  console.log("Listening to port " + PORT);
});
