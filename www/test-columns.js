import cols from "./column.js";
import t from "./TableSource.js";
import utils from "./utils.js";

console.assert(cols.columnNameToInt("A") == 1, "columns failed with A");
console.assert(cols.columnNameToInt("Z") == 26, "columns failed with Z");
console.assert(cols.columnNameToInt("AA") == 27, "columns failed with AA");
console.assert(cols.columnNameToInt("AZ") == 52, "colulmns failed with AZ");
console.assert(cols.columnNameToInt("BA") == 53, "colulmns failed with BA");


function testColToArray () {
  let ts = new t.TableSource([["Nic", 47],
                              ["E", 16],
                              ["F", 14],
                              ["H", 13],
                              ["A", 9]]);
  let colValue = cols.columnToArray("B", ts);
  console.assert(
    utils.arrayEq(colValue, [47, 16, 14, 13, 9]),
    "testColToArray - whoops!",
    {colValue: colValue}
  );
}

testColToArray();

// test-columns.js ends here
