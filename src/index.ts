import readingTime from './reading-time'
import ReadingTimeStream from './stream'

export { ReadingTimeStream }
export default readingTime
/** Wacky way to support const readingTime = require('reading-time') */
module.exports = readingTime
