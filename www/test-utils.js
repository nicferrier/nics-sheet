import api from "./utils.js"


function testArrayEq(){
  let testArray = [[1,2,3],
                   [4,5,6],
                   ["a","b","c"]];
  let expectation = [[1,2,3],
                     [4,5,6],
                     ["a","b","c"]];
  let isEqual = api.arrayEq(testArray, expectation);
  console.assert(
    isEqual,
    "arrayEq failed",
    {testArray: testArray, expectation: expectation});

  let testArray2 = [["    ","",""],
                   ["","","    "]];
  let expectation2 = [["","",""],
                     ["","",""]];
  let isEqual2 = api.arrayEq(testArray2, expectation2);
  console.assert(
    isEqual2,
    "arrayEq failed",
    {testArray: testArray2, expectation: expectation2});
}

function testDimmap(){
  let testArray = [[1,2,3],
                   [4,5,6,7],
                   ["a","b","c"]];
  let expectation = [[1,2,3,""],
                     [4,5,6,7],
                     ["a","b","c",""]];
  let dimMapped = api.dimMap(testArray);
  let isEqual = api.arrayEq(dimMapped, expectation);
  console.assert(
    isEqual,
    "dimMap failed", 
    {dimMapped: dimMapped, expectation: expectation});
}

testArrayEq();
testDimmap();

// test-utils.js ends here
