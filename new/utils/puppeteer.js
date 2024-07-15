import puppeteer from "puppeteer";
import axios from "axios";

export const getBrowser = async () => {
  return await puppeteer.launch({
    detached: false,
    headless: false,
    // args: ["--disable-features=site-per-process"],
    args: [
      "--user-agent=Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36",
      "--disable-background-timer-throttling",
      "--disable-backgrounding-occluded-windows",
      "--disable-renderer-backgrounding",
    ],

    // args: [
    //   "--disable-features=SameSiteByDefaultCookies,CookiesWithoutSameSiteMustBeSecure",
    //   "--disable-background-timer-throttling",
    //   "--disable-backgrounding-occluded-windows",
    //   "--disable-renderer-backgrounding",
    // ],
  });
};

export const fetchFullPage = async (url) => {
  const browser = await getBrowser();
  const page = await browser.newPage();

  try {
    await page.goto(url, { waitUntil: "networkidle0" }); // Wait for DOMContentLoaded event
    // You can also use 'load' if you want to wait for the full page to load.

    const fullHTML = await page.content(); // Get the full HTML after the page is loaded
    return fullHTML;
  } catch (error) {
    console.error("Error fetching full page:", error.message);
    throw error;
  } finally {
    await browser.close();
  }
};
