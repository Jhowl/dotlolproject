const calculateStatistics = (array) => {
  return {
    average: average(array),
    median: median(array),
    mode: mode(array),
    standardDeviation: standardDeviation(array),
    variance: variance(array),
    confidenceInterval: confidenceInterval(array),
    regression: regression(array),
    min: min(array),
    max: max(array),
    standardDeviationbyTime: standardDeviationbyTime(array),
    standardDeviationbyScore: standardDeviationbyScore(array),
  };
};

const average = (array) => {
  const sum = array.reduce((a, b) => a + b);
  return (sum / array.length);
};

const median = (array) => {
  const mid = Math.floor(array.length / 2),
    nums = [...array].sort((a, b) => a - b);
  return array.length % 2 !== 0 ? nums[mid] : (nums[mid - 1] + nums[mid]) / 2;
};

const mode = (array) => {
  const newArray = [...array]

  return newArray.sort((a, b) =>
    newArray.filter(v => v === a).length
    - newArray.filter(v => v === b).length
  ).pop();
};

const standardDeviation = (array) => {
  const avg = average(array);

  const squareDiffs = array.map((value) => {
    const diff = value - avg;
    const sqrDiff = diff * diff;
    return sqrDiff;
  });

  const avgSquareDiff = average(squareDiffs);

  const stdDev = Math.sqrt(avgSquareDiff);
return stdDev;
};

const variance = (array) => {
  const avg = average(array);

  const squareDiffs = array.map((value) => {
    const diff = value - avg;
    const sqrDiff = diff * diff;
    return sqrDiff;
  });

  const avgSquareDiff = average(squareDiffs);

  return avgSquareDiff;
};

const confidenceInterval = (array) => {
  const avg = average(array);
  const stdDev = standardDeviation(array);
  const n = array.length;
  const z = 1.96;
  const marginOfError = z * (stdDev / Math.sqrt(n));
  const lowerBound = avg - marginOfError;
  const upperBound = avg + marginOfError;
  return [lowerBound, upperBound];
};

const regression = (array) => {
  const x = array.map((item, index) => index);
  const y = array;
  const xAvg = average(x);
  const yAvg = average(y);
  const xDiff = x.map((item) => item - xAvg);
  const yDiff = y.map((item) => item - yAvg);
  const xDiffSquared = xDiff.map((item) => item * item);
  const xDiffSquaredSum = xDiffSquared.reduce((a, b) => a + b);
  const xDiffTimesYDiff = xDiff.map((item, index) => item * yDiff[index]);
  const xDiffTimesYDiffSum = xDiffTimesYDiff.reduce((a, b) => a + b);
  const slope = xDiffTimesYDiffSum / xDiffSquaredSum;
  const intercept = yAvg - (slope * xAvg);
  return [slope, intercept];
};

const min = (array) => {
  return Math.min(...array);
};

const max = (array) => {
  return Math.max(...array);
};

const standardDeviationbyTime = (array) => {
  const times = array.reduce((acc, curr) => {
    acc.thirty = curr < 1800 ? acc.thirty + 1 : acc.thirty;
    acc.thirtyTwo = curr < 1920 ? acc.thirtyTwo + 1 : acc.thirtyTwo;
    acc.thirtyFour = curr < 2040 ? acc.thirtyFour + 1 : acc.thirtyFour;
    acc.thirtySix = curr < 2160 ? acc.thirtySix + 1 : acc.thirtySix;
    acc.thirtyEight = curr < 2280 ? acc.thirtyEight + 1 : acc.thirtyEight;
    acc.forty = curr < 2400 ? acc.forty + 1 : acc.forty;
    acc.fortyTwo = curr < 2520 ? acc.fortyTwo + 1 : acc.fortyTwo;
    acc.fortyFour = curr < 2640 ? acc.fortyFour + 1 : acc.fortyFour;

    return acc
  }, {
    thirty: 0,
    thirtyTwo: 0,
    thirtyFour: 0,
    thirtySix: 0,
    thirtyEight: 0,
    forty: 0,
    fortyTwo: 0,
    fortyFour: 0
  })

  const percents = Object.keys(times).reduce((acc, curr) => {
    acc[curr] = ((times[curr] / array.length) * 100).toFixed(2)
    return acc
  }, {})

  return percents
}

const standardDeviationbyScore = (array) => {
  const scores = array.reduce((acc, curr) => {
    acc.thirty = curr < 30.5 ? acc.thirty + 1 : acc.thirty
    acc.thirtyTwo = curr < 32.5 ? acc.thirtyTwo + 1 : acc.thirtyTwo
    acc.thirtyFour = curr < 34.5 ? acc.thirtyFour + 1 : acc.thirtyFour
    acc.thirtySix = curr < 36.5 ? acc.thirtySix + 1 : acc.thirtySix
    acc.thirtyEight = curr < 38.5 ? acc.thirtyEight + 1 : acc.thirtyEight
    acc.forty = curr < 40.5 ? acc.forty + 1 : acc.forty
    acc.fortyTwo = curr < 42.5 ? acc.fortyTwo + 1 : acc.fortyTwo
    acc.fortyFour = curr < 44.5 ? acc.fortyFour + 1 : acc.fortyFour //Save ids heros, percent of heroes in this match
    acc.fortySix = curr < 46.5 ? acc.fortySix + 1 : acc.fortySix
    acc.fortyEight = curr < 48.5 ? acc.fortyEight + 1 : acc.fortyEight
    acc.fifty = curr < 50.5 ? acc.fifty + 1 : acc.fifty
    acc.fiftyTwo = curr < 52.5 ? acc.fiftyTwo + 1 : acc.fiftyTwo
    acc.fiftyFour = curr < 54.5 ? acc.fiftyFour + 1 : acc.fiftyFour
    acc.fiftySix = curr < 56.5 ? acc.fiftySix + 1 : acc.fiftySix
    acc.fiftyEight = curr < 58.5 ? acc.fiftyEight + 1 : acc.fiftyEight
    acc.sixty = curr < 60.5 ? acc.sixty + 1 : acc.sixty
    acc.sixtyTwo = curr < 62.5 ? acc.sixtyTwo + 1 : acc.sixtyTwo
    acc.sixtyFour = curr < 64.5 ? acc.sixtyFour + 1 : acc.sixtyFour
    acc.sixtySix = curr < 66.5 ? acc.sixtySix + 1 : acc.sixtySix
    acc.sixtyEight = curr < 68.5 ? acc.sixtyEight + 1 : acc.sixtyEight
    acc.seventy = curr < 70.5 ? acc.seventy + 1 : acc.seventy

    return acc
  }, {
    thirty: 0,
    thirtyTwo: 0,
    thirtyFour: 0,
    thirtySix: 0,
    thirtyEight: 0,
    forty: 0,
    fortyTwo: 0,
    fortyFour: 0,
    fortySix: 0,
    fortyEight: 0,
    fifty: 0,
    fiftyTwo: 0,
    fiftyFour: 0,
    fiftySix: 0,
    fiftyEight: 0,
    sixty: 0,
    sixtyTwo: 0,
    sixtyFour: 0,
    sixtySix: 0,
    sixtyEight: 0,
    seventy: 0
  })

  const percents = Object.keys(scores).reduce((acc, curr) => {
    acc[curr] = ((scores[curr] / array.length) * 100).toFixed(2)
    return acc
  }, {})

  return percents
}

export default calculateStatistics
