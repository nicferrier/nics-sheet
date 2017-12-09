import utils from "./utils.js";
import csv from "./csv.js";

/* Table sources as an abstraction */

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
      return from.tBodies[0].children[0].children.length - 1;
    },
    forEach: function (f) {  // mangle ALL the data in the table
      return Array.from(from.tBodies[0].children)
        .map(r => Array.from(r.children).slice(1))
        .map(r => r.map(f => f.textContent))
        .forEach(f);
    }
  };
  let p = new Proxy(proxyArray, {
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
        Array.from(row.children).slice(1).forEach(e => rowArray.push(e.textContent));
        return rowArray;
      }
    },
    has: function (target, property) {
      console.log("has called", target, property);
      if (extended.hasOwnProperty(property)) {
        // console.log("we have this property", property);
        return true;
      }

      // else a DOM thing
      if (Number.isInteger(parseInt(property))) {
        return from.tBodies[0].children.length > Number.isInteger(parseInt(property));
      }
    }
  });
  console.log("from table at create - property?", p);
  return p;
}

function tableSourceFromString(from) {
  let rows = from.split("\n");
  let resultRows = rows.map(row => csv.csvLineParse(row));
  let dimensioned = utils.dimMap(resultRows);
  return tableSourceFromArray(dimensioned);
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
      return tableSourceFromString(from);
    }
  }
}


/* Actually a csv handler.

   MUST import as an array of arrays. 
*/
function importDataHandler(evt) { 
  let csvData = evt.target.form["import"].value;
  let ts = new TableSource(csvData);
  evt.target.form.tableSource = ts;
  return ts;
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

  console.log("col0", {datasource0: dataSource[0], cols: cols, rowCount: rowCount});
  
  let t = document.createElement("table");
  let headTr = t.appendChild(document.createElement("thead"))
    .appendChild(document.createElement("tr"));
  for (let i = 0; i < cols + 1; i++) {
    let col = headTr.appendChild(document.createElement("th"));
    if (i > 0) {
      col.textContent = columnNamer(i);
    }
  }

  let tbody = t.appendChild(document.createElement("tbody"));
  let rowIndex = 0;
  dataSource.forEach(row => {
    if (utils.arrayEq(row, [""])) return;
    // else
    let tr = document.createElement("tr");
    tr.appendChild(document.createElement("th")).textContent = ++rowIndex;
    row.forEach(field => {
      let td = document.createElement("td");
      td.textContent = field;
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });
  addDOMThing(t);
  return t;
}

function testTableSource() {
  let tStr = new TableSource("row1,col2,col3\nrow2,col2,col3");
  console.log("tStr row count is", tStr.rowCount());
  console.log("tStr column count is", tStr.columnCount());
  console.log("tStr index[0] is", tStr[0]);
  console.log("tStr index[1] is", tStr[1]);
  console.log("tStr indexOf(index[0]) is", tStr.indexOf(tStr[0]));
  
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
  let t2Res = [];
  t2.forEach((e,i) => { console.log("foreach i", i); t2Res.push(e) });
  console.log("t2 forEach?", t2Res);
  //console.log("indexOf(index[0]) is", t.indexOf(t[0]));
}



// maybe this could take either a header row or be told to use column 0, or even column 1
function addTableHeader(dataSource) {  
  console.log("addTableHeader", dataSource);

  /// All this is ripped off addtable - we need to genericize
  let rowCount = dataSource.rowCount();
  let cols = dataSource.columnCount();

  // Make an empty row of the correct size
  let emptyRow = new Array();
  for (let i = 0; i < cols; i++) emptyRow.push("");

  let t = document.createElement("table");
  let headTr = t.appendChild(document.createElement("thead"))
    .appendChild(document.createElement("tr"));
  for (let i = 0; i < cols + 1; i++) {
    let col = headTr.appendChild(document.createElement("th"));
    if (i > 0) {
      col.textContent = columnNamer(i);
    }
  }

  let tbody = t.appendChild(document.createElement("tbody"));
  let rowIndex = 0;
  dataSource.forEach(row => {
    console.log("row", JSON.stringify(row));
    if (utils.arrayEq(row, emptyRow)) {
      console.log("empty!");
      return;
    }
    // else
    let tr = document.createElement("tr");
    tr.appendChild(document.createElement("th")).textContent = ++rowIndex;
    row.forEach(field => {
      let td = document.createElement("td");
      if (rowIndex == 1) {
        td.classList.add("userHeader");
      }
      td.textContent = field;
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });
  addDOMThing(t);
  
  /*
  console.log("tableheader source", tableSource, tableSource.rows);
  let header = tableSource.rows[0];

  let t = document.createElement("table");
  t.appendChild(document.createElement("tr"));

  Array.from(header.children).forEach(field => {
    let fieldHeader = document.createElement("th");
    t.children[0].appendChild(fieldHeader);
    fieldHeader.textContent = field.textContent;
  });

  console.log("tableSource rows", tableSource.rows, tableSource);
  for (let rowIndex in tableSource.rows) {
    if (rowIndex < 1) continue; // header row

    let row = tableSource.rows[rowIndex];
    let tr = document.createElement("tr");

    console.log("row", row);
    Array.from(row).forEach(field => {
      let fieldTd = document.createElement("td");
      tr.appendChild(fieldTd);
      console.log("field", field);
      console.log("fieldTd", fieldTd, fieldTd.textContent);
      fieldTd.textContent = field.textContent;
    });
    t.appendChild(tr);
  }
  addDOMThing(t);
  */
  return t;
}


function testAddTables () {
  importDataHandler({target: {form: document.forms[0]}});
  let t1 = addTable(document.forms[0].tableSource);
  let t2 = addTableHeader(new TableSource(t1));
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
});
