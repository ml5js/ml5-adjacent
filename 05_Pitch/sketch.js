// Copyright (c) 2018 ml5
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

/* ===
ml5 Example
A game using pitch Detection with CREPE
=== */

// Crepe variables
let crepe;
const voiceLow = 100;
const voiceHigh = 500;
let audioStream;
let fft;

// Circle variables
let circleSize = 42;
const circleHeight = 100;
const scale = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

// Text variables
let goalNote = 0;
let currentNote = '';
let currentText = '';
let textCoordinates;

function createCrepe() {
  crepe = ml5.pitchDetection('Crepe', getAudioContext(), audioStream.stream);
  loop();
}

function getNoteFromMidiNum(midiNum) {
  let note = scale[midiNum % 12];
  return note;
}


function setup() {
  let canvas = createCanvas(320, 240).hide();
  let button = createButton('start microphone').mousePressed(() => {
    canvas.show();
    gameReset();
    audioStream = new p5.AudioIn(function(err) {
      console.error(err);
    });
    audioStream.start(createCrepe, function(err) {
      console.error(err);
    });
    fft = new p5.FFT();
    button.hide();
  });
  textCoordinates = [width / 2, 30];
  textAlign(CENTER);
  noLoop();
}

function parse(result) {
  let splitResult = result.split(" Hz");
  return float(splitResult[0])
}

function gameReset() {
  goalNote = round(random(0, scale.length - 1));
  loop();
}

function hit(note) {
  noLoop();
  background(240);
  fill(138, 43, 226);
  ellipse(width / 2, circleHeight, circleSize, circleSize);
  textSize(18);
  fill(255);
  text(note, width / 2, circleHeight + (circleSize / 6));
  fill(50);
  textSize(32);
  text("Hooray!", textCoordinates[0], textCoordinates[1]+15);
  setTimeout(gameReset, 3000);
}

function drawCircles() {
  noStroke();
  //GOAL CIRCLE
  fill(255, 0, 0);
  ellipse(width / 2, circleHeight, circleSize, circleSize);
  fill(255);
  text(scale[goalNote], (width / 2), circleHeight + (circleSize / 6));
  //IF TARGET IS HIT
  if (scale[scale.indexOf(currentNote)] == scale[goalNote]){
    hit(scale[goalNote]);
  }
}

function drawText() {
  fill(50);
  noStroke();
  textSize(12);
  text("Hum or sing to hit the right pitch!\nNotes will match no matter the octave.", textCoordinates[0], textCoordinates[1]);
  text(currentText, textCoordinates[0], textCoordinates[1] + 35);
  if (currentNote != '') {
    text("NOTE: " + currentNote, textCoordinates[0], textCoordinates[1] + 35);
  }
}

function draw() {
  background(240);
  if (!crepe) {
    console.log("Crepe not yet initialized");
    return;
  }
  let results = crepe.getResults();
  if (results) {
    if (results['result'] == "no voice") {
      currentText = 'No input detected';
      currentNote = '';
    } else {
      result = parse(results['result']);
      console.log(result);
      currentText = '';
      currentFreq = result;
      let midiNum = freqToMidi(result);
      currentNote = getNoteFromMidiNum(midiNum);
      console.log(currentNote);
      console.log('\n');
    }
  }
  drawText();
  drawCircles();
}
