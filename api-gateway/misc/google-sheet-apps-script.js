// resources:
// https://developers.google.com/apps-script/reference/url-fetch
// https://hawksey.info/blog/2014/07/google-sheets-as-a-database-insert-with-apps-script-using-postget-methods-with-ajax-example/

// function doGet(e) {
//     var params = JSON.stringify(e);
//     return HtmlService.createHtmlOutput(params);
// }

//  1. Enter sheet name where data is to be written below
var SHEET_NAME = "Sheet1";
//  2. Run > setup
//
//  3. Publish > Deploy as web app
//    - enter Project Version name and click 'Save New Version'
//    - set security level and enable service (most likely execute as 'me' and access 'anyone, even anonymously)
//
//  4. Copy the 'Current web app URL' and post this in your form/script action
//
//  5. Insert column names on your destination sheet matching the parameter names of the data you are passing in (exactly matching case)
var SCRIPT_PROP = PropertiesService.getScriptProperties(); // new property service
// If you don't want to expose either GET or POST methods you can comment out the appropriate function
function doGet(e) {
    return handleResponse(e);
}

function doPost(e) {
    return handleResponse(e);
}

function handleResponse(e) {
    console.log('logger works!')
// shortly after my original solution Google announced the LockService[1]
// this prevents concurrent access overwritting data
// [1] http://googleappsdeveloper.blogspot.co.uk/2011/10/concurrency-and-google-apps-script.html
// we want a public lock, one that locks for all invocations
    var lock = LockService.getPublicLock();
    lock.waitLock(30000);  // wait 30 seconds before conceding defeat.
    console.log('afterWaitStart1')
    // lock.waitLock(5000);  // wait 5 seconds before conceding defeat.
    /* // If you are passing JSON in the body of the request uncomment this block
    // console.log('afterWaitStart')
    var jsonString = e.postData.getDataAsString();
    console.log({jsonString})
    e.parameter = JSON.parse(jsonString);
    */
    try {
        console.log('inside try')
// next set where we write the data - you could write to multiple/alternate destinations
        var doc = SpreadsheetApp.openById(SCRIPT_PROP.getProperty("key"));
        console.log('test1')
        console.log({doc})
        var sheet = doc.getSheetByName(SHEET_NAME);
// we'll assume header is in row 1 but you can override with header_row in GET/POST data
        var headRow = e.parameter.header_row || 1;
        var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
        // console.log({headers})
        var nextRow = sheet.getLastRow() + 1; // get next row
        var row = [];
// loop through the header columns
        for (i in headers) {
            if (headers[i] == "Timestamp") { // special case if you include a 'Timestamp' column
                row.push(new Date());
            } else { // else use header name to get data
                row.push(e.parameter[headers[i]]);
            }
        }
// more efficient to set values as [][] array than individually
        sheet.getRange(nextRow, 1, 1, row.length).setValues([row]);
// return json success results
        return ContentService
            .createTextOutput(JSON.stringify({"result": "success", "row": nextRow}))
            .setMimeType(ContentService.MimeType.JSON);
    } catch (error) {
// if error return this
        console.log(error)
        return ContentService
            .createTextOutput(JSON.stringify({"result": "error", "error": e}))
            .setMimeType(ContentService.MimeType.JSON);
    } finally { //release lock
        lock.releaseLock();
    }
}

function setup() {
    var doc = SpreadsheetApp.getActiveSpreadsheet();
    SCRIPT_PROP.setProperty("key", doc.getId());
}