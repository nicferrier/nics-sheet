let api = {
  columnNamer: function(number) { // I stole this from the Internet some place
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
  },

  columnNameToInt: function (columnName) {
    let summary = 0;
    Array.from(columnName)
      .reverse()
      .forEach((e, i) => {
        let mult = i * 26;
        mult = (mult < 1) ? 1 : mult;
        summary += (parseInt(e.charCodeAt(0)) - 64) * mult;
    });
    return summary;
  },

  columnToArray: function (column, tableSource) {
    let index = api.columnNameToInt(column) - 1;
    console.log("index", index);
    let results = tableSource.map(row => row[index]);
    return results;
  }
}

export default api;

// column.js ends here
