// fixes required to get to run in node

var __require = (id) => {
  return require(id);
};

module.exports = require(`sharp/build/Release/sharp-${platformAndArch}.node`);