import _ from 'lodash';

export const textAreaToArray = (text) => {
  text = removeUnavailableChar(text);
  text = text.split(/\r?\n/);
  text = _.chain(text).pull("").uniq().value();
  return text;
};

export const removeUnavailableChar = (text) => {
  return text.replace(/[^a-zA-Z\d.\r\n\-\_\+]/g, "");
};
