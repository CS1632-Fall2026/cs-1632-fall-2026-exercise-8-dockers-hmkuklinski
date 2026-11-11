import { test, expect } from '@playwright/test';

const baseUrl = 'http://localhost:8080/';
const rentACatUrl = "http://localhost:8080/rent-a-cat";
const feedACatUrl = "http://localhost:8080/feed-a-cat";
const greetACatUrl = "http://localhost:8080/greet-a-cat";
const resetUrl = "http://localhost:8080/reset";
const cat1 = "ID 1. Jennyanydots";
const cat2 = "ID 2. Old Deuteronomy";
const cat3 = "ID 3. Mistoffelees";

//FUN-RESET - reset the Rent-A-Cat system such that all cats are returned and available
test('TEST-1-RESET', async({page}) =>{
    //go to page
    await page.goto('http://localhost:8080/');
    
    //reset the cookies using evaluate API
    await page.evaluate(() => {
        document.cookie = "1=true";
        document.cookie = "2=true";
        document.cookie = "3=true";
    });

    await page.getByRole('link', { name: 'Reset' }).click();

    await expect(page.locator('xpath=//ul[@aria-label="Cat names"]//li').nth(0)).toHaveText(cat1);
    await expect(page.locator('xpath=//ul[@aria-label="Cat names"]//li').nth(1)).toHaveText(cat2);
    await expect(page.locator('xpath=//ul[@aria-label="Cat names"]//li').nth(2)).toHaveText(cat3);

});

//FUN-CATALOG - display exactly three images of cats in numbered list with file path checks
test('TEST-2-CATALOG', async({page}) =>{
    //go to page
    await page.goto('http://localhost:8080/');
    await page.getByRole('link', { name: 'Catalog' }).click();
   
    await expect(page.locator('xpath=//ol[@aria-label="Cat photos"]//li//img').nth(1)).toHaveAttribute('src', '/images/cat2.jpg');
});

test('TEST-3-LISTING', async({page}) =>{
    //go to page
    await page.goto('http://localhost:8080/');
    await page.getByRole('link', { name: 'Catalog' }).click();
    
    //check that the page contains the text "Rent-A-Cat"
    const listOfCats = page.locator('xpath=//ul[@aria-label="Cat names"]//li');
    await expect(listOfCats).toHaveCount(3);
    await expect(listOfCats.nth(2)).toHaveText(cat3);
});

test('TEST-4-RENT-A-CAT', async({page}) =>{
    //go to page
    await page.goto('http://localhost:8080/');
    await page.getByRole('link', { name: 'Rent-A-Cat' }).click();

    //check that the page has two buttons
    await expect(page.locator('xpath=//button[text()="Rent"]')).toHaveCount(1);
    await expect(page.locator('xpath=//button[text()="Return"]')).toHaveCount(1);
});

test('TEST-5-RENT', async({page}) =>{
    //go to page
    await page.goto('http://localhost:8080/');
    await page.getByRole('link', { name: 'Rent-A-Cat' }).click();

    //check that the page has two buttons
    await page.locator('xpath=//input[@id="rentID"]').fill('1');
    await page.locator('xpath=//button[text()="Rent"]').click();
    await expect(page.getByText("Success!")).toBeVisible();

    await expect(page.locator('xpath=//ul[@aria-label="Cat names"]//li').nth(0)).toHaveText("Rented out");
    await expect(page.locator('xpath=//ul[@aria-label="Cat names"]//li').nth(1)).toHaveText(cat2);
    await expect(page.locator('xpath=//ul[@aria-label="Cat names"]//li').nth(2)).toHaveText(cat3);
});

test('TEST-6-RETURN', async({page}) =>{
    //go to page
    await page.goto('http://localhost:8080/');

    await page.evaluate(() => {
        document.cookie = "1=false";
        document.cookie = "2=true";
        document.cookie = "3=true";
    });

    await page.getByRole('link', { name: 'Rent-A-Cat' }).click();

    await page.locator('xpath=//input[@id="returnID"]').fill('2');
    await page.locator('xpath=//button[text()="Return"]').click();
    await expect(page.getByText("Success!")).toBeVisible();

    await expect(page.locator('xpath=//ul[@aria-label="Cat names"]//li').nth(0)).toHaveText(cat1);
    await expect(page.locator('xpath=//ul[@aria-label="Cat names"]//li').nth(1)).toHaveText(cat2);
    await expect(page.locator('xpath=//ul[@aria-label="Cat names"]//li').nth(2)).toHaveText("Rented out");
});

test('TEST-7-FEED-A-CAT', async({page}) =>{
    await page.goto('http://localhost:8080/');
    await page.getByRole('link', { name: 'Feed-A-Cat' }).click();
    await expect(page.locator('xpath=//button[text()="Feed"]')).toHaveCount(1);
});

test('TEST-8-FEED', async({page}) =>{
    //go to page
    await page.goto('http://localhost:8080/');
    await page.getByRole('link', { name: 'Feed-A-Cat' }).click();


    await page.locator('xpath=//input[@id="catnips"]').fill('6');
    await page.locator('xpath=//button[text()="Feed"]').click();
    await expect(page.getByText("Nom, nom, nom.")).toBeVisible({timeout: 10000});
});

test('TEST-9-GREET-A-CAT', async({page}) =>{
    await page.goto('http://localhost:8080/');
    await page.getByRole('link', { name: 'Greet-A-Cat' }).click();

    await expect(page.getByText("Meow!Meow!Meow!")).toBeVisible();
});

test('TEST-10-GREET-A-CAT-WITH-NAME', async({page}) =>{
    await page.goto('http://localhost:8080/greet-a-cat/Jennyanydots');
    await expect(page.getByText("Meow! from Jennyanydots.")).toBeVisible();
});

test('TEST-11-FEED-A-CAT-SCREENSHOT', async({page}) =>{
    await page.goto('http://localhost:8080/');

    await page.evaluate(() => {
        document.cookie = "1=true";
        document.cookie = "2=true";
        document.cookie = "3=true";
    });

    await page.getByRole('link', { name: 'Feed-A-Cat' }).click();
    await expect(page.locator('body')).toHaveScreenshot();
});

