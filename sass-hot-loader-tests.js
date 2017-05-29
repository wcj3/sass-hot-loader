// Import Tinytest from the tinytest Meteor package.
import { Tinytest } from "meteor/tinytest";

// Import and rename a variable exported by sass-hot-loader.js.
import { name as packageName } from "meteor/wcj3:sass-hot-loader";

// Write your tests here!
// Here is an example.
// TODO: add thorough test coverage
Tinytest.add('sass-hot-loader - example', function (test) {
  test.equal(packageName, "sass-hot-loader");
});
