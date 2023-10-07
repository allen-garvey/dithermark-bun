#!/bin/sh

# fix require
sed -i 's|return import.meta.require(id);|return require(id);|' out/index.js

# fix sharp
sed -i 's|require(`../build/Release/sharp-|require(`sharp/build/Release/sharp-|' out/index.js

# fix gl
sed -i 's|exports.getRoot(exports.getFileName())|`gl`|' out/index.js
