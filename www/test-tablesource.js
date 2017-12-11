import utils from "./utils.js";
import api from "./TableSource.js";

function testStringTableSource () {
  let isATable = api.isATable;
  api.isATable = function (t) { return false; };
  try {
    let tStr = new api.TableSource("row1,col2,col3\nrow2,col2,col3");
    console.assert(
      tStr.rowCount() == 2,
      "testStringTableSource tStr row count is", 
      tStr.rowCount());
    console.assert(
      tStr.columnCount() == 3,
      "testStringTableSource tStr column count is", 
      tStr.columnCount());

    console.assert(
      utils.arrayEq(tStr[0], ["row1", "col2", "col3"]),
      "testStringTableSource tStr index[0] is", 
      tStr[0]);
    console.assert(
      utils.arrayEq(tStr[1], ["row2", "col2", "col3"]),
      "testStringTableSource tStr index[1] is", 
      tStr[1]);

    console.assert(
      tStr.indexOf(tStr[0]) == 0,
      "testStringTableSource tStr indexOf(index[0]) is",
      tStr.indexOf(tStr[0]));
  }
  finally {
    api.isATable = isATable;
  }
}

function testArrayTableSource() {
  let isATable = api.isATable;
  api.isATable = function (t) { return false; };
  try {
    let tArr = new api.TableSource(
      [["col1", "col2", "col3"],
       ["1", "2", "3"]]
    );
    console.assert(
      tArr.rowCount() == 2,
      "testArrayTableSource tArr row count is", 
      tArr.rowCount());
    console.assert(
      tArr.columnCount() == 3,
      "testArrayTableSource tArr column count is", 
      tArr.columnCount());

    console.assert(
      utils.arrayEq(tArr[0], ["col1", "col2", "col3"]),
      "testArrayTableSource tArr index[0] is", 
      tArr[0]);
    console.assert(
      utils.arrayEq(tArr[1], ["1", "2", "3"]),
      "testArrayTableSource tArr index[1] is", 
      tArr[1]);

    console.assert(
      tArr.indexOf(tArr[0]) == 0,
      "testArrayTableSource tArr indexOf(index[0]) is",
      tArr.indexOf(tArr[0]));
  }
  finally {
    api.isATable = isATable;
  }
}

testStringTableSource();
testArrayTableSource();

// test-tablesource.js ends here
