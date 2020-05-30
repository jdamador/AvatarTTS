// * Load the gif
var sup1 = new SuperGif({ gif: document.getElementById('exampleimg') });
sup1.load(function () {

});

// * Load all available voices

// Charge all voices at the beginning
function getVoices() {
	speechSynthesis.getVoices();
}
getVoices();

// Update the voices when they change (chrome loads asynchronously)
window.speechSynthesis.onvoiceschanged = function (e) {
	getVoices();
};

// * Play text to speech.
/**
 * It receive a text and transform it to speech.
 * @param {*} textToSpeech 
 */
function playSincronized(textToSpeech = "There is nobody here!") {

	if (speechSynthesis.speaking) {
		return;
	}
	var text = textToSpeech

	// Set the selected voice.
	var voice = speechSynthesis.getVoices().filter(function (voice) {
		return voice.name == "Google US English"
	})[0];

	// Splitting each utterance up using punctuation is important.  Intra-utterance
	// punctuation will add silence to the tts which looks bad unless the mouth stops moving
	// correctly. Better to split it into separate utterances so play_for_duration will move when
	// talking, and be on frame 0 when not. 

	// split everything betwen deliminators [.?,!], but include the deliminator.
	var substrings = text.match(/[^.?,!]+[.?,!]?/g);
	for (var i = 0, l = substrings.length; i < l; ++i) {
		var str = substrings[i].trim();

		// Make sure there is something to say other than the deliminator
		var numpunc = (str.match(/[.?,!]/g) || []).length;
		if (str.length - numpunc > 0) {

			// suprisingly decent approximation for multiple languages.

			// if you change the rate, you would have to adjust
			var speakingDurationEstimate = str.length * 50;
			// Chinese needs a different calculation.  Haven't tried other Asian languages.
			if (str.match(/[\u3400-\u9FBF]/)) {
				speakingDurationEstimate = str.length * 200;
			}

			var msg = new SpeechSynthesisUtterance();

			(function (dur) {
				msg.addEventListener('start', function () {
					sup1.play_for_duration(dur);
				})
			})(speakingDurationEstimate);

			// The end event is too inacurate to use for animation,
			// but perhaps it could be used elsewhere.  You might need to push 
			// the msg to an array or aggressive garbage collection fill prevent the callback
			// from firing.
			//msg.addEventListener('end', function (){console.log("too late")}			                

			msg.text = str;
			//change voice here
			msg.voice = voice;

			window.speechSynthesis.speak(msg);
		}
	}
}