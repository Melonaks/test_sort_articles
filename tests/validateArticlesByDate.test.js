const { test, expect } = require('@playwright/test');


// External parameters
const targetURL = "https://news.ycombinator.com/newest";
const targetAmountOfArticles = 100;


test('Validate Articles By Date', async ({ page }) => {

    // Preparing global variables
    let articlesDates = [];
    let articlesLinks = [];

    await page.goto(targetURL);
    await expect(page).toHaveTitle(/.*New Links/);

    // Global cycle
    for(let i = 1; i <= targetAmountOfArticles;) {
        const articlesAge = page.locator('[class="age"]');
        const count = await articlesAge.count();

        // Page cycle
        let e = 0;
        for (; e < count; e++) {
            if ((i + e) <= targetAmountOfArticles) {
                articlesDates[[i + e]] = Date.parse(await articlesAge.nth(e).getAttribute("title"));
                articlesLinks[i + e] = await articlesAge.nth(e).getByRole('link').getAttribute("href");
            }
            else { break; }
        }
        // Incrementing total articles counter by an amount of grabbed articles on the page
        i += e;

        if (articlesDates.length < targetAmountOfArticles) {
            await page.locator('[class="morelink"]').click({ timeout: 2 * 1000 })
        }
    }
    function checkArticlesDatesDesc(dates, links) {
        let outcome = true;
        dates.forEach((a, i) => {
            if (a < dates[i + 1]) {
                console.log("Article "+links[i]+" with timecode "+a+" is older than previous "+links[i + 1]+" with timecode "+dates[i + 1]);
                outcome = false;
            }
        });
        return outcome;
    }
    
    const result = checkArticlesDatesDesc(articlesDates, articlesLinks);
    expect(result).toBeTruthy();
})

