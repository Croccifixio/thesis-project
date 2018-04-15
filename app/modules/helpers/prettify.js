const sentenceCase = (string) => string[0].toUpperCase() + string.slice(1).toLowerCase();

const addSpaces = (string) => string.replace(/([A-Z])/g, ' $1');

const prettify = (string) => sentenceCase(addSpaces(string));

export default prettify;
