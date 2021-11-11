import { pages } from '../configs/main'
import XLSX from 'xlsx'
import { chromium, firefox } from 'playwright'
import isEqual from 'lodash.isequal'
import path from 'path'
import fs from 'fs'
import glob from 'glob'

// =================
// Main script logic
// =================

async function run() {
  console.log('Loading base data into a SheetJS workbook...')

  let baseCookieData = []

  // Check if at least a chromium.xlsx file exists
  try {
    await fs.promises.access(path.join(__dirname, '../base-data/chromium.xlsx'))
    // If it does, create a SheetJS workbook from it

    baseCookieData = glob
      .sync(path.join(__dirname, '../base-data/*.xlsx'))
      .map((baseDataFile) => {
        XLSX.readFileSync(
          path.join(__dirname, `../base-data/${baseDataFile}.xlsx`)
        )
      })
  } catch {
    throw Error('No `base-data` file(s) found to compare against! Aborting.')
  }

  await createNewWorkbooks(pages)

  // Add workbooks generated above to a new array, with browser type as label
  const workbooks = glob
    .sync(path.join(__dirname, '../out/cookie-data/*.xlsx'))
    .map((path) => {
      const browserTypeRegex = new RegExp(
        /(?<=cookie-data\/)(.*)\w(?=.xlsx)/,
        'gi'
      )

      return {
        browserType: path.match(browserTypeRegex),
        newCookieData: XLSX.readFileSync(path),
      }
    })

  /**
   * For each new workbook, compare its data to the base data
   * and export the differences
   */
  for (const { browserType, newCookieData } of workbooks) {
    await recordCookieDataComparison(baseCookieData, newCookieData, browserType)
  }
}

run()

// ==============
// Functions used
// ==============

/**
 * Creates Excel workbooks containing new cookie
 * data gathered from headless Chromium and Firefox,
 * using Playwright.
 *
 * Exports an `.xlsx` file per browser engine after
 * successful gathering of cookie data.
 *
 * @param {Array} sites An array of objects containing
 * a title and url for each of our sites
 */
async function createNewWorkbooks(sites) {
  console.log(`Recording new cookie data into workbooks...`)

  // TODO Add `webkit` to this browser type list once the TLS handshake error is solved
  for (const browserType of [chromium, firefox]) {
    const browserWb = XLSX.utils.book_new()

    // Open a browser with the specified browser engine
    console.log(`Launching ${browserType.name()} browser...`)

    const browser = await browserType.launch()

    // Collect data from each page and add it to the browser-specific workbook
    console.log('Beginning cookie collection...')

    for (const siteData of sites) {
      await collectAndRecordData(siteData, browser, browserWb)
    }

    console.log(`Cookie collection complete for ${browserType.name()}!`)

    // Cleanup: close the Playwright browser and write the workbook to file
    console.log(`Closing ${browserType.name()} browser...`)

    await browser.close()

    console.log(`Exporting ${browserType.name()} cookie data...`)

    // If /cookie-data isn't yet created in /out, create it
    try {
      await fs.promises.access(path.join(__dirname, '../out/cookie-data'))
    } catch {
      fs.mkdir(path.join(__dirname, '../out/cookie-data'), (err) => {
        if (err) {
          throw err
        }
      })
    }

    XLSX.writeFileSync(
      browserWb,
      path.join(__dirname, `../out/cookie-data/${browserType.name()}.xlsx`)
    )

    console.log(`Export complete!`)
  }

  console.log(`Workbooks created!`)
}

/**
 * Gathers cookie data from a given site, and records it
 * to its own sheet in a SheetJS workbook.
 *
 * @param {Object} siteData Title and URL for the site to
 * gather data from
 * @param {*} browser A Playwright headless browser
 * @param {Object} workbook A SheetJS workbook to add cookie data to
 */
async function collectAndRecordData(siteData, browser, workbook) {
  const { title, url } = siteData

  // Create a new page and context for this site to load in, and visit it
  console.log(`Navigating to ${url}...`)
  const context = await browser.newContext()
  const page = await context.newPage()
  await page.goto(url)

  // Grab the page's cookies
  console.log(
    `Gathering cookie data from ${url} before accepting our consent manager...`
  )

  // Give the cookies some time to populate
  await page.waitForTimeout(3000)

  const cookiesBeforeCM = await context.cookies()
  let cookiesAfterCM = []

  console.log(`Data gathered!`)

  // Accept our consent manager
  console.log(`Accepting consent manager options...`)

  // If the consent manager exists, accept its options and collect more data
  if (await page.isVisible('[data-testid="consent-banner"]')) {
    cookiesAfterCM = await retrievePostCMCookies(page, context, cookiesBeforeCM)
  } else {
    console.log(`No consent manager present! Proceeding to next step...`)
  }

  // Create worksheet for this site
  console.log(`Creating worksheet from cookie data...`)

  const sheetData = [...cookiesBeforeCM, ...cookiesAfterCM]

  if (sheetData.length === 0)
    console.warn(`No cookie data! This site's sheet will be blank.`)

  // Create a new SheetJS sheet and add it to the workbook
  console.log(`Adding ${title} worksheet to workbook...`)

  const newSheet = await formatSheet(sheetData)
  XLSX.utils.book_append_sheet(workbook, newSheet, title)

  console.log(`${title} worksheet added!`)
}

/**
 * Opens the consent manager on the page, accepts all options,
 * then saves. Afterward, filters out any cookies from before
 * the consent manager acceptance, then returns the rest.
 *
 * @param {*} page A Playwright page object for the current page to retrieve cookies from
 * @param {*} context Playwright context, for calling `.cookies()`
 * @param {Array} cookiesPreCM The array of cookies gathered before accepting the consent manager
 * @returns An array of just the cookies added by the consent manager
 */
async function retrievePostCMCookies(page, context, cookiesPreCM) {
  // Check all option checkboxes for the consent manager and save
  await page.click(
    '[data-testid="consent-banner"] [data-testid="manage-preferences"]'
  )

  await page.waitForSelector('[data-testid="react-toggle"]')
  const cmOptionCheckboxes = await page.$$('input[data-testid="react-toggle"]')

  for (const checkbox of Array.from(cmOptionCheckboxes)) {
    await checkbox.check({ force: true })
  }

  await page.click('[data-ga-button="save-preferences"]')

  console.log(`Accepted!`)

  // Give the cookies some time to populate
  await page.waitForTimeout(3000)

  // Grab all cookies again, filtering out cookies from before the consent manager's changes
  console.log(
    `Checking if there were changes to the cookie data after consent manager acceptance...`
  )

  const rawCookiesPostCM = await context.cookies()

  const cookiesPostCM = rawCookiesPostCM.filter((cookieFromAfter) => {
    /**
     * if this cookie is found in the cookies from before,
     * then it's an exact dupe. skip it
     *
     * otherwise, it's new! keep it
     */
    const cookieIsDupe = cookiesPreCM.some((cookieFromBefore) =>
      isEqual(cookieFromBefore, cookieFromAfter)
    )

    return !cookieIsDupe
  })

  /**
   * If the consent manager added/edited any cookies after acceptance,
   * separate them from the rest visually
   */
  if (cookiesPostCM.length > 0) {
    // Adds a cookie as a separator for readability in the final data
    cookiesPostCM.unshift({
      domain: 'vvv Adds/changes after accepting consent manager options vvv',
      name: 'vvv Adds/changes after accepting consent manager options vvv',
      value: '',
      path: '',
      expires: 1652306416,
      httpOnly: false,
      secure: false,
      sameSite: 'None',
    })

    console.log(`Changes found! Changes added to data for this site.`)
    return cookiesPostCM
  } else {
    console.log(`No changes found! Proceeding to next step...`)
    return []
  }
}

/**
 * Formats an array of objects to prepare it for addition
 * into a SheetJS workbook.
 *
 * Handles renaming/reorganizing
 * headers/columns aw well as running the necessary
 * "JS-to-SheetJS" conversion.
 *
 * The columns set here are the key points to consider
 * during our cookie audits.
 *
 * @param {*} sheet
 * @returns SheetJS-ready sheet
 */
async function formatSheet(sheet) {
  const formattedSheet = sheet.map((cookie) => {
    // TODO Add proper descriptions for cookies with a "Lax" or "None" setting
    const acceptedConnectionType =
      cookie.sameSite === 'Strict'
        ? 'Same-site connections only'
        : 'Any kind of connection'

    /**
     * "Third-party access" and "What does it intend..."
     * can realistically only be filled out manually,
     * so these are left blank here.
     */
    return {
      'What domain?': cookie.domain,
      'Name?': cookie.name,
      'What are the contents?': cookie.value,
      'Accepted connections?': acceptedConnectionType,
      'Third-pary access?': '',
      'What does it intend to store?': '',
    }
  })
  const finalSheet = XLSX.utils.json_to_sheet(formattedSheet)
  console.log({ finalSheet })
  return finalSheet
}

/**
 * Automates comparison of new cookie data
 * to a given set of base data, recording results
 * into a new Excel workbook.
 *
 * See this gist for more details on rationale:
 * https://gist.github.com/EnMod/a51c62fdf7f476331aa0a8512dc19071
 *
 * @param {*} baseData A SheetJS-parsed Excel workbook with data to compare against
 * @param {*} newData A SheetJS-parsed Excel workbook with new data to compare to the base data
 */
async function recordCookieDataComparison(baseData, newData, browserType) {
  console.log('Creating comparison results workbook...')
  const resultsWb = XLSX.book_new()

  console.log('Converting workbooks to workable JS...')
  const newSheets = convertSheetJSWbToAoO(newData)
  const baseSheets = convertSheetJSWbToAoO(baseData)

  console.log('Running main comparison logic...')
  for (const newSheet of newSheets) {
    // Determine if there's base data for this sheet
    const baseDataExists = baseSheets.find(
      (baseSheet) => baseSheet.name === newSheet.name
    )

    // if there isn't, skip comparison, add to results, and move on to the next sheet
    if (!baseDataExists) {
      XLSX.utils.book_append_sheet(
        resultsWb,
        newSheet,
        `(NEW) ${newSheet.name}`
      )
      continue
    }

    // TODO Finish comparison logic
  }

  // If out/result-data isn't yet created in /out, create it
  try {
    await fs.promises.access(path.join(__dirname, '../out/result-data'))
  } catch {
    fs.mkdir(path.join(__dirname, '../out/result-data'), (err) => {
      if (err) {
        throw err
      }
    })
  }

  XLSX.writeFileSync(
    resultsWb,
    path.join(__dirname, `../out/result-data/${browserType.name()}.xlsx`)
  )
}

function convertSheetJSWbToAoO(workbook) {
  const sheetNames = workbook.sheetNames

  return sheetNames.map((sheetName) => {
    return {
      name: sheetName,
      data: XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]),
    }
  })
}
