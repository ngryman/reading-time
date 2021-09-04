import readingTime from './reading-time'
import ReadingTimeStream from './stream'

// Wacky way to support const readingTime = require('reading-time') :(
// Basically we can't use ES import/export anymore because re-assigning module.exports
// decouples it from the exports object, which TS export compiles to
module.exports = readingTime
module.exports.default = readingTime
module.exports.ReadingTimeStream = ReadingTimeStream