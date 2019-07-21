// Utility functions for music making
//
// Jesse Allison 2016

var NXMusic = function() {
	
}

NXMusic.prototype.mtof = function(midi) {
	freq = Tone.Frequency(midi,'midi').toFrequency();
	return freq;
}

NXMusic.prototype.mton = function(midi) {
	note = Tone.Frequency(midi,'midi').toNote();
	return note;
}

NXMusic.prototype.toNote = function(midi) {
	note = Tone.Frequency(midi,'midi').toNote();
	return note;
}


nxMusic = new NXMusic();
