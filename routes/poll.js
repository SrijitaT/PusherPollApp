const express = require("express");
const router = express.Router();
const Pusher = require("pusher");
const mongoose = require("mongoose");
const Vote = require("../models/Votes.js");
const keys = require("../config/keys_dev");
var pusher = new Pusher({
  appId: keys.pusherAppId,
  key: keys.pusherKey,
  secret: keys.pusherSecret,
  cluster: keys.pusherCluster,
  encrypted: keys.pusherEncrypted
});

router.get("/", (req, res) => {
  Vote.find()
    .then(votes => res.json({ success: true, votes: votes }))
    .catch(err => console.log(err));
});

router.post("/", (req, res) => {
  const newVote = {
    os: req.body.os,
    points: 1
  };
  Vote.findOne({ os: req.body.os })
    .then(vote => {
      Vote.updateOne(
        { os: req.body.os },
        { $set: { points: parseInt(vote.points) + 1 } }
      )
        .then(updatedVote => {
          pusher.trigger("os-poll", "os-vote", {
            points: 1,
            os: req.body.os
          });
          return res.json({ success: true, message: "Vote count updated!" });
        })
        .catch(err => console.log(err));
    })
    .catch(err => console.log(err));
});

module.exports = router;
