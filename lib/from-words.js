'use strict';


/**
 *
 * @param {number} wordsPerMinute
 * @returns {Function}
 */
module.exports = function fromWords(wordsPerMinute){
	wordsPerMinute = wordsPerMinute || 200;

	/**
	 * @returns {number} Time needed to read these words, in milliseconds
	 */
	return function (wordCount){
		var minutes = wordCount / wordsPerMinute;

		return Math.ceil(minutes * 60 * 1000);
	};
};
