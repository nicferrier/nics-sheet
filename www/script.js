function csvLineParse(line) {
  let results = [-1];
  let quoteMode = false;
  for (i in line) {
    let c = line.charAt(i);

    if (quoteMode) {
      if (c == "\"") {
        quoteMode = false;
      }
      // otherwise keep looking
      continue;
    }
    else {
      if (c == "\"") {
        quoteMode = true;
        continue;
      }
      else if (c == ",") {
        results.push(parseInt(i));
      }
    }
  }
  results.push(line.length);
  let newResults = new Array();
  results.forEach((e,i) => {
    if (i <= results.length - 2) { // we've added two to the array remember
      let startPos = results[i] + 1;
      let endPos = results[i + 1];
      let f = line.substring(startPos, endPos);
      newResults.push(f);
    }
  });
  return newResults;
}


function arrayEq (a1, a2) {
  if (a1 == a2) return true;
  if (a1.length != a2.length) return false;
  for (i in a1) {
     //console.log("a1[i]", a1[i], a2[i]);
    if (a1[i] !== a2[i]) return false;
  }
  return true;
}

function testCsvParse() {
  let value = csvLineParse("hello,one,two");
  console.log("simple line works", arrayEq(value,["hello", "one", "two"]), value);

  let complex = csvLineParse("hello,\"long field name\",field 3");
  console.log("complex field names with quotes", arrayEq(complex, ["hello", "\"long field name\"", "field 3"]), complex);

  let complex2 = csvLineParse("hello,\"long, very long, field name\",field 3");
  console.log("complex field names with quotes surrounding commas", 
              arrayEq(
                complex2, 
                ["hello", "\"long, very long, field name\"", "field 3"]), 
              complex2);
}

function childEach(element, f) {
  for (var i = 0; i < element.childElementCount; i++) {
    let child = element.children[i];
    f(child);
  }
}


/* Actually a csv handler.

   MUST import as an array of arrays. 
*/
function importDataHandler(evt) { 
  let rows = evt.target.form["import"].value.split("\n");
  console.log("number of rows", rows.length);
  let resultRows = rows.map(row => csvLineParse(row));;
  evt.target.form.resultRows = resultRows;
  console.log("res Rows", resultRows);
  return resultRows;
}

function addDOMThing(thing) {
  document.importNode(thing, true);
  document.body.insertBefore(thing, document.body.firstElementChild);
}

function addTable(dataSource) {
  let rowCount = dataSource.length;
  let cols = (dataSource != null && rowCount > 0) ? dataSource[0].length : 0;
  
  let t = document.createElement("table");
  for (i in dataSource) {
    let row = dataSource[i];
    if (arrayEq(row, [""])) continue;
    // else
    let tr = document.createElement("tr");
    for (field of row) {
      let td = document.createElement("td");
      td.textContent = field;
      tr.appendChild(td);
    }
    t.appendChild(tr);
  }
  addDOMThing(t);
  return t;
}


// maybe this could take either a header row or be told to use column 0, or even column 1
function addTableHeader(tableSource) {
  console.log("tableheader source", tableSource);
  let header = tableSource.rows[0];
  console.log("tableheader row[0]", header);

  let t = document.createElement("table");
  t.appendChild(document.createElement("tr"));

  childEach(header, field => {
    console.log("field", field, field.textContent);
    let fieldHeader = document.createElement("th");
    t.children[0].appendChild(fieldHeader);
    fieldHeader.textContent = field.textContent;
  });

  for (rowIndex in tableSource.rows) {
    if (rowIndex < 1) continue;

    let row = tableSource.rows[rowIndex];
    console.log("row", row);
    let tr = document.createElement("tr");
    childEach(row, field => {
      let fieldTd = document.createElement("td");
      tr.appendChild(fieldTd);
      fieldTd.textContent = field.textContent;
    });
    t.appendChild(tr);
  }
  addDOMThing(t);
  return t;
}


function testAddTables () {
  importDataHandler({target: {form: document.forms[0]}});
  let t1 = addTable(document.forms[0].resultRows);
  let t2 = addTableHeader(t1);
}

document.addEventListener("DOMContentLoaded", e => {
  let form = document.querySelector(".entry form");
  form.addEventListener("submit", evt => {
    evt.preventDefault();
  });

  let button = document.querySelector(".entry form button[name='import!']");
  button.addEventListener("click", importDataHandler);

  
  // test stuff
  window.testAddTables = testAddTables;
  // window.testCsvParse - testCsvParse;
});
