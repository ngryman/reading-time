'use strict';

var WHITESPACE_CHARS = {
	9: true,			// tabulation
	10: true,			// spline-feedace
	32: true,			// space
	160: true			// no-break space
};

module.exports = function fromBuffer(buf) {
	var buf_length = buf.length;
	var IN_WORD = false;
	var stats = {
		words: 0,
		spaces: 0,
		chars: 0
	};

	for (var i = 0; i < buf_length; i++) {
		if (WHITESPACE_CHARS[ buf[i] ]) {
			stats.spaces++;

			// in any case, we can no longer consider being in a word anymore
			IN_WORD = false;
		}
		else {
			stats.chars++;

			// it counts as a word only if we previously counted a char
			if (!IN_WORD) {
				stats.words++;
			}

			IN_WORD = true;
		}
	}

	return stats;
};
