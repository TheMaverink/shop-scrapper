import puppeteer from "puppeteer";

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
