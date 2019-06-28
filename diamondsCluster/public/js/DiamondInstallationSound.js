var DiamondInstallationSound = function () {
  this.tone = new Tone();

  this.pitchCollection = [55, 57, 59, 61, 62, 64, 66, 67, 68, 69, 71, 73, 75, 76, 78, 80, 82, 83];
  this.pitch = this.pitchCollection[Math.floor(Math.random() * (this.pitchCollection.length))];

  this.chord = [68, 71, 75];
  this.chordRange = {low: -12, high: 12};
  this.chordLength = '1m';

	this.gainMaster = new Tone.Volume().toMaster();

  this.tremolo = new Tone.Tremolo({
    "frequency":8,
    "type":"sine",
    "depth":0.6,
    "spread":0
    //"wet": 0.8
  }).connect(this.gainMaster).start();

  this.synth = new Tone.SimpleSynth({
    "oscillator" : {
      "type" : "sine"
   },
   "envelope" : {
    "attack" : 2.0,
    "decay" : 0.5,
    "sustain" : 0.8,
    "release" : 2.0
   }
  }).connect(this.tremolo);
	
  this.chordSynth = new Tone.PolySynth(4, Tone.DuoSynth).connect(this.gainMaster);
	this.chordVolume = -40;
  this.chordSynth.set("volume", this.chordVolume);
	this.chordSynth.set('vibratoAmount', 0.5);
	this.chordSynth.set('vibratoRate', 5);
	this.chordSynth.set('harmonicity', 1.5);
//set the attributes using the set interface
// synth.set("detune", -1200);

	this.playerBackground = new Tone.Player("../data/diamond_background.mp3").connect(this.gainMaster);
  this.playerUtopalypse = new Tone.Player("../data/Utopalypse.mp3").connect(this.gainMaster);
  this.playerDiamonds = new Tone.Player("../data/diamonds_in_distopia.mp3").connect(this.gainMaster);
  this.playerKepler = new Tone.Player("../data/Kepler_Star.mp3").connect(this.gainMaster);
    this.playerKepler.retrigger = 1;
  this.playerEnding = new Tone.Player("../data/Ending_for_a_minute.mp3").connect(this.gainMaster);

	this.playerBackground.volume.value = -12;

  //this.gainy = new Tone.Gain().connect(this.gainMaster);
  // this.filt2 = new Tone.Filter(this.tone.midiToNote(this.pitch+12), "bandpass").connect(this.gainy);
  this.filt = new Tone.Filter(this.tone.midiToNote(this.pitch+12), "bandpass").connect(this.gainMaster);
  this.filt.Q.value = 15;
  this.filt.gain.value = 50;
  // this.filt2.Q.value = 2;
  // this.filt2.gain.value = 40;
  // this.ns = new Tone.Noise('pink').connect(this.filt);
  //this.gainy.gain.value = 10.;

  this.synth.triggerAttackRelease("C4", "8n",{} , 0.25);



}

DiamondInstallationSound.prototype.audienceEnable = function(enabled) {
		console.log('enabled? ', enabled);
	if(enabled) {
		// this.gainMaster.volume.mute = false;
		this.gainMaster.volume.val = 0.;
		this.chordSynth.set("volume", this.chordVolume);
	} else {
		// this.gainMaster.volume.mute = true;
		this.gainMaster.volume.val = -96;
		this.chordSynth.set("volume", -96);
	}
}

DiamondInstallationSound.prototype.playPitch = function () {
  this.synth.triggerAttackRelease(this.tone.midiToNote(this.pitch+12), 5);
};

DiamondInstallationSound.prototype.triggerPitch = function () {
  this.synth.triggerAttackRelease(this.tone.midiToNote(this.pitch+12), 5);
  // socket.emit('triggerPitch', dSound.pitch);
};

DiamondInstallationSound.prototype.playChord = function (chordNotes, chordLength) {
  if(chordNotes) {
    this.chord = chordNotes;
  };
  if (chordLength) {
    this.chordLength = chordLength;
  }

  this.chordSynth.triggerAttackRelease(this.chord.map(this.tone.midiToNote), this.chordLength);
};

DiamondInstallationSound.prototype.sustainChord = function (chordNotes, chordLength) {
  if(chordNotes) {
    this.chord = chordNotes;
  };
  if (chordLength) {
    this.chordLength = chordLength;
  } else {
		chordLength = '8m';
	}
  this.chordSynth.triggerAttackRelease(this.chord, this.chordLength);
};

DiamondInstallationSound.prototype.setChordRange = function () {

};

DiamondInstallationSound.prototype.setChord = function () {

};

DiamondInstallationSound.prototype.playChordSplit = function () {

};

DiamondInstallationSound.prototype.playChordDiads = function () {

};

DiamondInstallationSound.prototype.playBackground = function() {
  this.playerBackground.start();
	this.playerBackground.volume.linearRampToValue(0,1);
	this.playerBackground.volume.linearRampToValue(-15,15, +1);
};

DiamondInstallationSound.prototype.playUtopalypse = function() {
  this.playerKepler.start();
  this.playerUtopalypse.start("+2");
  this.playerKepler.start("+4");
};

DiamondInstallationSound.prototype.playDiamonds = function() {
  this.playerDiamonds.start();
};

DiamondInstallationSound.prototype.playKepler = function() {
  this.playerKepler.start();
};

DiamondInstallationSound.prototype.playEnding = function() {
  this.playerEnding.start();
};


DiamondInstallationSound.prototype.triggerDiamonds = function() {
  this.synth.triggerAttackRelease(this.tone.midiToNote(this.pitch+12), 5);
  this.playerDiamonds.start();
};
