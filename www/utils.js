let api = {
  arrayEq: function (a1, a2) {
    if (a1 == a2) return true;
    if (a1.length != a2.length) return false;
    for (let i in a1) {
    // console.log("a1[i]", {a1: a1[i], a2: a2[i], eq: a1[i] == a2[i]});
      
      let a1i = a1[i];
      let a2i = a2[i];

      if (typeof(a1i) == "string") { a1i = a1i.trim(); }
      if (typeof(a2i) == "string") { a2i = a2i.trim(); }
      
      if (Array.isArray(a1i) && Array.isArray(a2i)) {
        if (api.arrayEq(a1i, a2i)) { continue; }
        else { return false; }
      }
      else {
        if (a1i !== a2i) return false;
      }
    }
    return true;
  },

  dimMap: function (array) {
    let RowsizeException = {};
    let makeDimer = function (size) {
      return function (rowArray) {
        // console.log("dimmapper", size);
        if (rowArray.length > size) {
          // This should never happen because we take the maxSize below.
          throw RowsizeException;
        }
        if (rowArray.length < size) {
          // console.log("need to dimmap", rowArray.length, size);
          for (let i = rowArray.length; i<size; i++) {
            rowArray.push("");
          }
        }
        return rowArray;
      };
    };

    let maxSize = 0;
    array.forEach(row => {
      if (row.length > maxSize) { 
        maxSize=row.length; 
      }
    });
    
    while (true) {
      try {
        return array.map(row => makeDimer(maxSize)(row));
      }
      catch (e) {
        console.log("e", {e:e, eisknown: e==RowsizeException});
        break;
      }
    }
  },
};

export default api;

/* utils.js ends here */
