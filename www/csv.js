import utils from "./utils.js";

let api = {
  csvLineParse: function (line) {
    let results = [-1];
    let quoteMode = false;
    for (let i in line) {
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
  },

};

export default api;

// csv.js ends here
