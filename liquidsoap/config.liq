#!/usr/bin/liquidsoap

set("log.stdout", true)

music = playlist("/music/playlist.m3u")
adverts = playlist("/music/adverts.m3u")

radio = mksafe(random([music]))
radio = random(weights = [1, 7],[adverts, radio])

output.icecast(%mp3(bitrate=128, samplerate=44100),
  host = "icecast",
  port = 8000,
  password = "password",
  mount = "/automix",
  name="Waste Radio",
  description="Badboy pirate radio",
  genre="All kinds of ill shit",
radio)
