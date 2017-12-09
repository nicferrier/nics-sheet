import utils from "./utils.js";
import csv from "./csv.js";

function testCsvParse() {
  let value = csv.csvLineParse("hello,one,two");
  let expectation = ["hello", "one", "two"];
  let isEqual = utils.arrayEq(value, expectation);
  console.assert(
    isEqual,
    "testCsvParse simple parse failed",
    {value: value, expectation: expectation});

  let complex = csv.csvLineParse("hello,\"long field name\",field 3");
  let complexExpectation = ["hello", "\"long field name\"", "field 3"];
  isEqual = utils.arrayEq(complex, complexExpectation);
  console.assert(
    isEqual,
    "testCsvParse complex field names with quotes failed", 
    {complexValue: complex, expectation: complexExpectation});

  let complex2 = csv.csvLineParse("hello,\"long, very long, field name\",field 3");
  let complex2Expectation = ["hello", "\"long, very long, field name\"", "field 3"];
  isEqual = utils.arrayEq(complex2, complex2Expectation);
  console.assert(
    isEqual,
    "testCsvParse complex field names with quotes surrounding commas failed", 
    {complexValue: complex2, expectation: complex2Expectation});

  console.log("testCsvParse done.");
}

testCsvParse();

// test-csv.js ends here
