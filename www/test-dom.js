

const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const dom = new JSDOM(`
<html>
    <head>
        <title>Sheets</title>
        <link rel="stylesheet" href="/style.css" type="text/css"/>
    </head>
    <body>
        <div class="entry" id="enter">
            <form>
                <textarea name="import" placeholder="data import">

Date, Type, Description, Value, Balance, Account Name

31/12/2010,D/D,"PAYEE #1",-10.00,1781.21,"'FERRIER NJ",
31/12/2010,POS,"'PAYEE #2, LONG 1213, SOMEWHERE GB",-8.64,1791.21,"'FERRIER NJ",
30/12/2010,D/D,"UPHONEUPOO",-51.95,1799.85,"'FERRIER NJ",
29/12/2010,D/D,"BIGLECCY",-228.00,1851.80,"'FERRIER NJ",
29/12/2010,D/D,"OCHRE",-12.31,2079.80,"'FERRIER NJ",

                </textarea>
                <button name="import!">import</button>
            </form>
        </div>
    </body>
</html>
`);
const { document } = (dom).window;

document.body.appendChild(document.createElement("table"))
  .appendChild(document.createElement("tr"))
  .appendChild(document.createElement("td")).textContent = "A CELL";

console.log(dom.serialize());

// test-dom.js ends here
