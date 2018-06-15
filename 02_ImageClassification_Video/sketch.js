// Copyright (c) 2018 ml5
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

/* ===
ml5 Example
Webcam Image Classification using Mobilenet and p5.js
=== */

let classifier;
let video;

let img;

let videoStarted = false;

function preload() {
  //img = loadImage('starter.png');
  img = createImg('starter.png');
}

function setup() {
  createCanvas(320, 240).parent('videoContainer');
  img.hide();
  classifier = ml5.imageClassifier('MobileNet', {}, modelReady);

  select('#videoButton').mousePressed(() => {
    video = createCapture(VIDEO);
    video.hide();
    classifier = ml5.imageClassifier('MobileNet', video);
    videoStarted = true;
    classifyVideo();
  });

  // classifyVideo();
}

function modelReady() {
  classifier.predict(img, gotResult);
}


function draw() {
  background(0);
  if (videoStarted) {
    image(video, 0, 0, 320, 240);
  } else {
    image(img, 0, 0, 320, 240);
  }
}

// Get a prediction for the current video frame
function classifyVideo() {
  classifier.predict(gotResult);
  // You can also specify the amount of classes detected you want
  // classifier.predict(10, gotResult)
}

// When we get a result
function gotResult(results) {
  // The results are in an array ordered by probability.
  select('#result').html(results[0].className);
  select('#probability').html(nf(results[0].probability, 0, 2));
  if (videoStarted) {
    setTimeout(classifyVideo, 100);
  }
}
