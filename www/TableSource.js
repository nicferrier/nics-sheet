import utils from "./utils.js";
import csv from "./csv.js";

let api = {
  tableSourceFromArray: function(from) {
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
  },

  isATable: function(obj) {
    return obj instanceof HTMLElement && obj.tagName == "TABLE";
  },

  tableSourceFromTable: function(from) {
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
  },

  tableSourceFromString: function(from) {
    let rows = from.split("\n");
    let resultRows = rows.map(row => csv.csvLineParse(row));
    let dimensioned = utils.dimMap(resultRows);
    return api.tableSourceFromArray(dimensioned);
  },

  TableSource: class {
    constructor(from) {
      if (Array.isArray(from) && Array.isArray(from[0])) {
        return api.tableSourceFromArray(from);
      }
      else if (api.isATable(from)) {
        return api.tableSourceFromTable(from);
      }
      else if (typeof(from) == "string") {
        return api.tableSourceFromString(from);
      }
    }
  }
};

export default api;

// TableSource.js ends here
