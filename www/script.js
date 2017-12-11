import utils from "./utils.js";
import csv from "./csv.js";
import tablesrc from "./TableSource.js";
import columns from "./column.js";

/* Actually a csv handler.

   MUST import as an array of arrays. 
*/
function importDataHandler(evt) { 
  let csvData = evt.target.form["import"].value;
  let ts = new tablesrc.TableSource(csvData);
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
      col.textContent = columns.columnNamer(i);
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
  let tStr = new tablesrc.TableSource("row1,col2,col3\nrow2,col2,col3");
  console.log("tStr row count is", tStr.rowCount());
  console.log("tStr column count is", tStr.columnCount());
  console.log("tStr index[0] is", tStr[0]);
  console.log("tStr index[1] is", tStr[1]);
  console.log("tStr indexOf(index[0]) is", tStr.indexOf(tStr[0]));
  
  let t = new tablesrc.TableSource(
    [["col1", "col2", "col3"],
     ["1", "2", "3"]]
  );
  console.log("row count is", t.rowCount());
  console.log("column count is", t.columnCount());
  console.log("index[0] is", t[0]);
  console.log("index[1] is", t[1]);
  console.log("indexOf(index[0]) is", t.indexOf(t[0]));

  addTable(t);

  let t2 = new tablesrc.TableSource(document.querySelector("table"));
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
      col.textContent = columns.columnNamer(i);
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
  return t;
}

function addTableFunction (dataSource) {
  /// All this is ripped off addtable - we need to genericize
  let rowCount = dataSource.rowCount();
  let cols = dataSource.columnCount();

  let t = document.createElement("table");
  let headTr = t.appendChild(document.createElement("thead"))
    .appendChild(document.createElement("tr"));
  for (let i = 0; i < cols + 1; i++) {
    let col = headTr.appendChild(document.createElement("th"));
    if (i > 0) {
      col.textContent = cols.columnNamer(i);
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
  return t;
}


function testAddTables () {
  importDataHandler({target: {form: document.forms[0]}});
  let t1 = addTable(document.forms[0].tableSource);
  let t2 = addTableHeader(new tablesrc.TableSource(t1));
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
});
