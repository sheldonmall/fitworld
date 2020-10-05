const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const db = require("./models");

const app = express();
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const PORT = process.env.PORT || 3000;
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/fitworld", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

// Here are the html routes into the public folder
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});

app.get("/exercise", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/exercise.html"));
});

app.get("/stats", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/stats.html"));
});

// --- APIs to GET and POST data -----------------
app.get("/api/workouts", (req, res) => {
  db.Fitworld.find({})
    .sort({ day: -1 })
    .limit(1)
    .then((dbexercise) => {
      res.json(dbexercise);
    })
    .catch((err) => {
      res.json(err);
    });
});

app.get("/api/workouts/range", (req, res) => {
  db.Fitworld.find({})
    .then((dbexercise) => {
      res.json(dbexercise);
    })
    .catch((err) => {
      res.json(err);
    });
});

app.post("/api/workouts", (req, res) => {
  console.log(req.body);
  db.Fitworld.create({})
    .then((dbexercise) => {
      res.json(dbexercise);
    })
    .catch((err) => {
      res.json(err);
    });
});

app.put("/api/workouts/:id", (req, res) => {
  db.Fitworld.updateOne(
    {
      _id: req.params.id,
    },
    {
      $push: {
        exercises: [
          {
            type: req.body.type,
            name: req.body.name,
            duration: req.body.duration,
            weight: req.body.weight,
            sets: req.body.sets,
            reps: req.body.reps,
            distance: req.body.distance,
          },
        ],
      },
    },
    (error, data) => {
      if (error) {
        res.send(error);
      } else {
        res.send(data);
      }
    }
  );
});
// --- End of APIs --------------

app.listen(PORT, () => {
  console.log(`App has started on port ${PORT}!`);
});
