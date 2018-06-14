// Copyright (c) 2018 ml5
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

/* ===
ml5 Example
PoseNet example using p5.js
=== */

let w = 320;
let h = 240;
let video;
let poseNet;
let poses = [];
let skeletons = [];

let img;

let videoStarted = false;

function preload() {
  //img = loadImage('starter.png');
  img = createImg('starter.png');
  img.hide();
}


function setup() {
  createCanvas(w, h);

  // Create a new poseNet method with a single detection
  poseNet = ml5.poseNet(img, 'single', gotPoses);

  // Hide the video element, and just show the canvas
  fill(255, 0, 0);
  stroke(255, 0, 0);

  select('#videoButton').mousePressed(() => {
    video = createCapture(VIDEO);
    video.hide();
    poseNet = ml5.poseNet(video, 'single', gotPoses);
    videoStarted = true;
  });

}

function draw() {
  if (videoStarted) {
    image(video, 0, 0, w, h);
  } else {
    image(img, 0, 0, w, h);
  }

  // We can call both functions to draw all keypoints and the skeletons
  drawKeypoints();
  drawSkeleton();
}

// A function to draw ellipses over the detected keypoints
function drawKeypoints()  {
  // Loop through all the poses detected
  for (let i = 0; i < poses.length; i++) {
    // For each pose detected, loop through all the keypoints
    for (let j = 0; j < poses[i].pose.keypoints.length; j++) {
      // A keypoint is an object describing a body part (like rightArm or leftShoulder)
      let keypoint = poses[i].pose.keypoints[j];
      // Only draw an ellipse is the pose probability is bigger than 0.2
      if (keypoint.score > 0.2) {
        ellipse(keypoint.position.x / 2, keypoint.position.y / 2, 10, 10);
      }
    }
  }
}

// A function to draw the skeletons
function drawSkeleton() {
  // Loop through all the skeletons detected
  for (let i = 0; i < poses.length; i++) {
    // For every skeleton, loop through all body connections
    for (let j = 0; j < poses[i].skeleton.length; j++) {
      let partA = poses[i].skeleton[j][0];
      let partB = poses[i].skeleton[j][1];
      line(partA.position.x, partA.position.y, partB.position.x, partB.position.y);
    }
  }
}

// The callback that gets called every time there's an update from the model
function gotPoses(results) {
  poses = results;
}
