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


function whichIndex(child) {
  let p = child.parentNode;
  let index = Array.prototype.indexOf.call(p.children, child);
  return index;
}

function testColumnNamer() {
  // need a better setup here
  testAddTables();
  let t = document.querySelector("table");
  console.log("name?", columnNamer(whichIndex(t.children[5])));
}

function tableSourceFromArray(from) {
  let p = new Proxy(from, {
    get: function (target, property, receiver) {
      // console.log("got called", property);
      if (this.hasOwnProperty(property)) {
        return this[property];
      }
      return target[property];
    },
  });
  p.rowCount =  function () {
    return from.length;
  };
  p.columnCount = function () {
    return from[0].length;
  };
  return p;
}

function isATable(obj) {
  return obj instanceof HTMLElement && obj.tagName == "TABLE";
}

function tableSourceFromTable(from) {
  let proxyArray = new Array();
  let extended = {
    rowCount: function () {
      return from.tBodies[0].childElementCount;
    },
    columnCount: function () {
      return from.tBodies[0].children[0].children.length;
    }
  };
  let p = new Proxy(proxyArray,{
    get: function (target, property, receiver) {
      // console.log("special get called property = ", property, extended);
      if (extended.hasOwnProperty(property)) {
        // console.log("we have this property", property);
        return extended[property];
      }
      if (Number.isInteger(parseInt(property))) {
        let row = from.tBodies[0].children[property];
        // console.log("from table row is", row);
        let rowArray = [];
        Array.from(row.children).forEach(e => rowArray.push(e.textContent));
        return rowArray;
      }
    }
  });
  console.log("from table at create - property?", p);
  
  return p;
}

class TableSource {
  constructor(from) {
    if (Array.isArray(from) && Array.isArray(from[0])) {
      return tableSourceFromArray(from);
    }
    else if (isATable(from)) {
      return tableSourceFromTable(from);
    }
    else if (typeof(from) == "string") {
      let rows = from.split("\n");
      let resultRows = rows.map(row => csvLineParse(row));;
      return tableSourceFromArray(resultRows);
    }
  }
}


function columnNamer(number) {
  let num = number;
  let baseChar = "A".charCodeAt(0);
  let letters  = "";
  
  do {
    number--;
    let ch = String.fromCharCode(baseChar + (number % 26));
    letters = ch + letters;
    number = (number / 26) >> 0; // quick `floor`
  } 
  while(number > 0);

  // console.log("number, letters is", num, letters);
  return letters;
}

function addTable(dataSource) {
  console.log("getting rowcount");
  let rowCount = dataSource.rowCount();
  let cols = dataSource.columnCount();

  console.log("col0", dataSource[0], cols, rowCount);
  
  let t = document.createElement("table");
  let headTr = t.appendChild(document.createElement("thead"))
    .appendChild(document.createElement("tr"));
  for (let i = 0; i < cols; i++) {
    let col = headTr.appendChild(document.createElement("th"));
    col.textContent = columnNamer(i + 1);
  }

  let tbody = t.appendChild(document.createElement("tbody"));
  dataSource.forEach(row => {
    if (arrayEq(row, [""])) return;
    // else
    let tr = document.createElement("tr");
    for (field of row) {
      let td = document.createElement("td");
      td.textContent = field;
      tr.appendChild(td);
    }
    tbody.appendChild(tr);
  });
  addDOMThing(t);
  return t;
}

function testTableSource() {
  let t = new TableSource(
    [["col1", "col2", "col3"],
     ["1", "2", "3"]]
  );
  console.log("row count is", t.rowCount());
  console.log("column count is", t.columnCount());
  console.log("index[0] is", t[0]);
  console.log("index[1] is", t[1]);
  console.log("indexOf(index[0]) is", t.indexOf(t[0]));

  addTable(t);

  let t2 = new TableSource(document.querySelector("table"));
  console.log("row count is", t2.rowCount());
  console.log("column count is", t2.columnCount());
  console.log("index 2[0] is", t2[0]);
  console.log("index 2[1] is", t2[1]);
  //console.log("indexOf(index[0]) is", t.indexOf(t[0]));
}



// maybe this could take either a header row or be told to use column 0, or even column 1
function addTableHeader(tableSource) {
  console.log("tableheader source", tableSource);
  let header = tableSource.rows[0];

  let t = document.createElement("table");
  t.appendChild(document.createElement("tr"));

  Array.from(header.children).forEach(field => {
    let fieldHeader = document.createElement("th");
    t.children[0].appendChild(fieldHeader);
    fieldHeader.textContent = field.textContent;
  });

  for (rowIndex in tableSource.rows) {
    if (rowIndex < 1) continue;

    let row = tableSource.rows[rowIndex];
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
  window.testTableSource = testTableSource;
  window.testAddTables = testAddTables;
  window.testColumnNamer = testColumnNamer;
  // window.testCsvParse - testCsvParse;
});
