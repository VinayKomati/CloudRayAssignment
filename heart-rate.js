const fs = require('fs');
const _ = require('lodash');

// Read the JSON file
const rawData = fs.readFileSync('heartrate.json');
const heartRateData = JSON.parse(rawData);

// Group data by date
const groupedData = _.groupBy(heartRateData, (data) => data.timestamps.startTime.split('T')[0]);

// Calculate statistics for each day
const result = [];


function calculateMedian(data) {
    const sortedData = _.sortBy(data, (item) => item.beatsPerMinute);
    const length = sortedData.length;
    if (length % 2 === 0) {
      const middle1 = sortedData[length / 2 - 1].beatsPerMinute;
      const middle2 = sortedData[length / 2].beatsPerMinute;
      return (middle1 + middle2) / 2;
    } else {
      return sortedData[Math.floor(length / 2)].beatsPerMinute;
    }
  }
  

for (const date in groupedData) {
  if (groupedData.hasOwnProperty(date)) {
    const dayData = groupedData[date];

    //Calculating Min Max and median for the sorted data
    const min = _.minBy(dayData, (data) => data.beatsPerMinute).beatsPerMinute;
    const max = _.maxBy(dayData, (data) => data.beatsPerMinute).beatsPerMinute;
    const median = calculateMedian(dayData);

    // Sort data by timestamp and pick the latest
    const latestData = _.maxBy(dayData, (data) => new Date(data.timestamps.startTime));

    result.push({
      date: date,
      min: min,
      max: max,
      median: median,
      latestDataTimestamp: latestData.timestamps.startTime,
    });
  }
}

// Sort the result by date
const sortedResult = _.sortBy(result, (entry) => entry.date);

// Write the result to output.json
fs.writeFileSync('output.json', JSON.stringify(sortedResult, null, 2), 'utf8');

console.log('Statistics calculated and saved to output.json.');
