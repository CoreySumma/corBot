export default function analyzeFacials(expressionData) {
  let emotionObj = {
    anger: 0,
    disgusted: 0,
    fearful: 0,
    happy: 0,
    neutral: 0,
    sad: 0,
    surprised: 0,
  };
  // This will count how many times this function was called in a row
  let count = 0;

  const getAverageEmotion = (emotionObj) => {
    // divide each emotion by rhe count to get the average
    for (let emotion in emotionObj) {
      emotionObj[emotion] /= count;
    }
  };

  const getHighestEmtion = (emotionObj) => {
    // Start with a blank emotion and number
    let highestEmotion = "";
    let highestNumber = 0;
    // loop through the emotionObj
    for (let emotion in emotionObj) {
      // if the emotion is greater than the highest number (starting at 0)
      if (emotionObj[emotion] > highestNumber) {
        // Set the highest emotion to the current emotion or first emotion
        highestEmotion = emotion;
        // Set the highest number to the current emotion or first emotion
        highestNumber = emotionObj[emotion];
      }
    }
    return highestEmotion;
  }

  for (let emotion in expressionData) {
    // grab the number for each emotion
    let number = expressionData[emotion];
    // correlate the number to the emotion in our emotionObj
    emotionObj[emotion] += number;
  }
  count++;
  getAverageEmotion(emotionObj);
  return getHighestEmtion(emotionObj);
}
