

const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { document } = (new JSDOM(`
<html>
    <head>
        <title>Sheets</title>
        <link rel="stylesheet" href="/style.css" type="text/css"/>
    </head>
    <body>
        <div class="entry" id="enter">
            <form>
                <textarea name="import" placeholder="data import">

Date, Type, Description, Value, Balance, Account Name, Account Number

31/12/2014,D/D,"'WWF UK",-10.00,1781.21,"'FERRIER NJ","'600008-49127454",
31/12/2014,POS,"'4545 30DEC14 , WWW.MEMSET.COM/REC, CRANLEIGH GB",-8.64,1791.21,"'FERRIER NJ","'600008-49127454",
30/12/2014,D/D,"'EE AND T-MOBILE",-51.95,1799.85,"'FERRIER NJ","'600008-49127454",
29/12/2014,D/D,"'SCOTTISHPOWER",-228.00,1851.80,"'FERRIER NJ","'600008-49127454",
29/12/2014,D/D,"'ORANGE",-12.31,2079.80,"'FERRIER NJ","'600008-49127454",

                </textarea>
                <button name="import!">import</button>
            </form>
        </div>
    </body>
</html>
`)).window;


console.log(document.querySelector("div"));
