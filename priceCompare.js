let puppeteer = require("puppeteer");
let fs = require("fs");
let links = ["https://www.amazon.in", "https://www.flipkart.com", "https://paytmmall.com/"];
let pName = "Iphone 11";

(async function () {
    try {
        let browserInstance = await puppeteer.launch({
            headless: false,
            defaultViewport: null,
            args: ["--start-maximized"]
        });
        let amazon = await getListingFromAmazon(links[0], browserInstance,pName);
        let flipkart = await getListingFromFlipkart(links[1], browserInstance,pName);
        let paytmMall = await getListingFromPaytm(links[2], browserInstance,pName);
        console.table(amazon);
        console.table(flipkart);
        console.table(paytmMall);

    } catch (err) {
        console.log(err);
    }
})();

//  product Name,url of amazon home page
// output-> top 5 matching product -> price Name print 
async function getListingFromAmazon(link, browserInstance, pName) {
    let newTab = await browserInstance.newPage();
    await newTab.goto(link);
    await newTab.type("#twotabsearchtextbox", pName, { delay: 200 });
    await newTab.click("#nav-search-submit-button");
    await newTab.waitForSelector(".a-price-whole",{visible:true});

    function browserconsolerunFn(priceSelector,pNameSelector) {
        let pName = document.querySelectorAll(pNameSelector);
        let priceArr = document.querySelectorAll(priceSelector);
        let details=[];
        for(let i=0;i<5;i++)
        {
            let price = priceArr[i].innerText;
            let Name = pName[i].innerText;
            details.push({
                price,Name
            })
        }
        return details;

    }
    return newTab.evaluate(browserconsolerunFn,".a-price-whole",".a-size-medium.a-color-base.a-text-normal");
    // console.log(detailsArr);
  
}

async function getListingFromFlipkart(link, browserInstance, pName) {
    let newTab = await browserInstance.newPage();
    await newTab.goto(link);
    
    await newTab.click("._2KpZ6l._2doB4z");
    await newTab.type("._3704LK", pName, { delay: 200 });
    await newTab.click(".L0Z3Pu");
    await newTab.waitForSelector("._30jeq3._1_WHN1",{visible:true});

    function browserconsolerunFn(priceSelector,pNameSelector) {
        let pName = document.querySelectorAll(pNameSelector);
        let priceArr = document.querySelectorAll(priceSelector);
        let details=[];
        for(let i=0;i<5;i++)
        {
            let price = priceArr[i].innerText;
            let Name = pName[i].innerText;
            details.push({
                price,Name
            })
        }
        return details;

    }
    return newTab.evaluate(browserconsolerunFn,"._30jeq3._1_WHN1","._4rR01T");
    // console.log(detailsArr);
  
}


async function getListingFromPaytm(link, browserInstance, pName) {
    let newPage = await browserInstance.newPage();
    await newPage.goto(link);
    await newPage.type("#searchInput",pName,{ delay: 200 });
    await newPage.keyboard.press("Enter",{ delay: 200 });
    await newPage.keyboard.press("Enter");
    await newPage.waitForSelector(".UGUy", { visible: true });
    await newPage.waitForSelector("._1kMS", { visible: true });
    function consoleFn(priceSelector, pNameSelector) {
        let priceArr = document.querySelectorAll(priceSelector);
        let PName = document.querySelectorAll(pNameSelector);
        let details = [];
        for (let i = 0; i < 5; i++) {
            let price = priceArr[i].innerText;
            let Name = PName[i].innerText;
            details.push({
                price, Name
            })
        }
        return details;
    }
    return newPage.evaluate(consoleFn,
        "._1kMS",
        ".UGUy");


}