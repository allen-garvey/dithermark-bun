#!/bin/sh

sed -i 's|return import.meta.require(id);|return require(id);|' out/index.js

sed -i 's|require(`../build/Release/sharp-|require(`sharp/build/Release/sharp-|' out/index.js