import _ from 'lodash';

export const textAreaToArray = (text) => {
  // text = removeUnavailableChar(text);
  text = text.trim()
  text = text.split(/\r?\n/);
  // .pull("")
  text = _.chain(text).uniq().value(); 
  return text;
};

export const removeUnavailableChar = (text) => {
  return text.replace(/[^a-zA-Z\d.\r\n\-\_\+]/g, "");
};

//array to String
export const arraySlice = (array, startIndex, endIndex) => {
  return array.slice(startIndex, endIndex);
};