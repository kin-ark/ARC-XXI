const express = require("express");
const fs = require("fs");
const app = express();
const PORT = 3000;

let movies = [];

// fungsi untuk nge-load data
function loadData() {
  fs.readFile("movies.json", "utf8", (err, data) => {
    if (err) throw err;
    movies = JSON.parse(data);
  });
}

app.use(express.json());

// Backend dapat menampilkan list semua film di bioskop
app.get("/", (req, res) => {
  res.json(movies);
});

// Backend dapat menampilkan film sesuai dengan id yang diminta
app.get("/:imdbId", (req, res, next) => {
  const imdbId = req.params.imdbId;
  const movie = movies.find((movie) => movie.imdbID === imdbId);
  if (movie) {
    res.send(movie);
  } else {
    res.status(404).send("Not Found");
  }
});

// Backend dapat menambahkan film ke database 
app.post("/", (req, res, next) => {
  const { Title, Year, imdbID, Type, Poster } = req.body;
  const movie = {
    Title: Title,
    Year: Year,
    imdbID: imdbID,
    Type: Type,
    Poster: Poster,
  };
  movies.push(movie);
  res.status(201).send("Movie added");
});

// Backend dapat menghapus film sesuai dengan id pada request
app.delete("/:imdbId", (req, res, next) => {
  const imdbId = req.params.imdbId;
  movies = movies.filter((movie) => movie.imdbID != imdbId);
  movies.splice(imdbId, 1);
  res.status(204).send("Movie deleted");
});

// Backend dapat melakukan update pada film sesuai dengan id pada request
app.patch("/:imdbId", (req, res, next) => {
  const imdbId = req.params.imdbId;
  const { Title, Year, Type, Poster } = req.body;
  const movie = movies.find((movie) => movie.imdbID === imdbId);
  movie.Title = Title;
  movie.Year = Year;
  movie.Type = Type;
  movie.Poster = Poster;

  res.status(200).send("Movie updated")
});

// Backend dapat melakukan search film dengan nama
app.get('/title/:title', (req, res, next) => {
  const title = req.params.title.toLowerCase();
  const filteredMovies = movies.filter(movie => movie.Title.toLowerCase().includes(title));
  res.json(filteredMovies);
});

// Ketika server dinyalakan, akan di load sebuah json ke dalam program sebagai database awal
app.listen(PORT, () => {
  loadData();
  console.log(`Server is running on port ${PORT}`);
});

// Ketika server dimatikan, semua perubahan yang dilakukan harus disimpan ke dalam sebuah json
process.on("SIGINT", () => {
  fs.writeFile("test.json", JSON.stringify(movies, null, 2), (err) => {
    if (err) {
      console.error("Error saving JSON data:", err);
    } else {
      console.log("JSON data saved successfully.");
    }
    process.exit();
  });
});