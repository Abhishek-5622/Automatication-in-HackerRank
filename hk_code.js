// AIM: Login in hackerrank and submit interview preparation questions. 

//require module
let puppeteer = require("puppeteer");
let fs = require("fs");

//extract variables from other files.
let {password , email} = require("../activity/secrets.js");
let {code} = require("./code.js");

//create variable
let gtab;

//launch browser
let browserPromise = puppeteer.launch({
    //false is used to to see browser screen.
    // true is used to hide browser screen.
    headless:false,
    //Remove default view
    defaultViewport:null,
    //args is a array. --start-maximized is used to display browser window in maximised mode(full screen).
    args:["--start-maximized"]
})

//when browser launch then new tab is created.
browserPromise.then(function(browserInstance)
    {
        let newTabPromise = browserInstance.newPage();
        return newTabPromise;
    }).then(function(newTab)
    {
        //Go to some url
        let loginPagewillBeOpen = newTab.goto("https://www.hackerrank.com/auth/login?h_l=body_middle_left_button&h_r=login");
        //We need newtab variable in future work, so that's why we create gtab which is a global variable.  
        gtab = newTab;
        return loginPagewillBeOpen;
    }).then(function()
    {
        //Type email address with some delay. 
        //gtab.type(selector , content , delay);
        let emailType = gtab.type("#input-1",email,{delay:200})
        return emailType;
    }).then(function()
    {
        //Type password with some delay.
        let passwordType = gtab.type("#input-2",password,{delay:200})
        return passwordType;
    }).then(function()
    {
        //wait for selector then click
        let loginPromise = waitAndClick("button[data-analytics='LoginPassword']");
        return loginPromise;
    }).then(function()
    {
        //wait for selector then click
        let clickPromise = waitAndClick(".card-content h3[title='Interview Preparation Kit']");
        return clickPromise;
    }).then(function()
    {
        //wait for selector then click
        let warmupclick = waitAndClick("a[data-attr1='warmup']");
        return warmupclick;

    }).then(function()
    {
        //get current tab url.
        return gtab.url();
    }).then(function(url)
    {
        // code[0] is stored in questionObj. code content objects with qName and soln as a keys.
        let questionObj = code[0];

        //Solve hackerrank question function.
        questionSolver(url, questionObj.soln,questionObj.qName);
    }).
    //catch is used to handle error
    catch(function (err) {
        console.log(err);
    })

//waitAndClick is a function that wait for selector the click.
function waitAndClick(selector)
{
    //return promise.
    //resolve -> work done.
    //reject -> error come.
    return new Promise(function(resolve,reject)
    {
        //wait for selector
        let selectorWait = gtab.waitForSelector(selector,{visible:true});
        selectorWait.then(function()
        {
            //click
            selectorClick = gtab.click(selector)
            return selectorClick;
    }).then(function()
    {
        resolve();
    }).catch(function()
    {
        reject(err);
    })
})
}

//questionSolver is a function that solve hackerrank question.  
function questionSolver(modulepageUrl, code, questionName) {

    return new Promise(function (resolve, reject) {
        // page visit 
        let reachedPageUrlPromise = gtab.goto(modulepageUrl);
        reachedPageUrlPromise
            .then(function () {
                //  page h4 -> mathcing h4 -> click
                // function will exceute inside the browser console.
                function browserconsolerunFn(questionName) {
                    let allH4Elem = document.querySelectorAll("h4");
                    let textArr = [];
                    for (let i = 0; i < allH4Elem.length; i++) {
                        let myQuestion = allH4Elem[i]
                            .innerText.split("\n")[0];
                        textArr.push(myQuestion);
                    }
                    let idx = textArr.indexOf(questionName);
                    allH4Elem[idx].click();
                }
                let pageClickPromise = gtab.evaluate(browserconsolerunFn, questionName);
                return pageClickPromise;
            }).then(function () {
                // checkbox click
                let inputWillBeClickedPromise = waitAndClick(".custom-checkbox.inline");
                return inputWillBeClickedPromise;
            }).then(function () {
                // type `
                let codeWillBeTypedPromise = gtab.type(".custominput", code);
                return codeWillBeTypedPromise;
            }).then(function () {
                //press control
                let controlIsHoldPromise = gtab.keyboard.down("Control");
                return controlIsHoldPromise;
            }).then(function () {
                // ctrl a
                let aisPressedpromise = gtab.keyboard.press("a");
                return aisPressedpromise;
                // ctrl x
            }).then(function () {
                let cutPromise = gtab.keyboard.press("x");
                return cutPromise;
            })
            .then(function () {
                let editorWillBeClickedPromise = gtab.click(".monaco-editor.no-user-select.vs");
                return editorWillBeClickedPromise;
            })

            .then(function () {
                // ctrl a
                let aisPressedpromise = gtab.keyboard.press("a");
                return aisPressedpromise;
            }).then(function () {
                //ctrl+v
                let pastePromise = gtab.keyboard.press("v");
                return pastePromise;
            }).then(function () {
                //click on submit
                let submitIsClickedPromise = gtab.click(".pull-right.btn.btn-primary.hr-monaco-submit");
                return submitIsClickedPromise;
            }).then(function () {
                resolve();
            }).catch(function () {
                reject(err);
            })
    })
}

// function settingHandler() {
//     return new Promise(function (resolve, reject) {

//         // wait click
//         let settingClickPromise = waitAndClick("button[aria-label='Editor Settings']");
//         settingClickPromise
//             .then(function () {
//                 let disableButtonClickPromise = waitAndClick("button[aria-label='Disable Autocomplete']");
//                 return disableButtonClickPromise;
//             }).then(function () {
//                 // click on setting button
//                 let settingIsClickedpromise = gtab.click("button[aria-label='Editor Settings']");
//                 return settingIsClickedpromise;
//             }).then(function () {
//                 resolve();
//             }).catch(function () {
//                 resolve();
//             })
//         // autocomplete -> wait ,click

//     })
// }
