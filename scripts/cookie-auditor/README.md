# `@hashicorp/cookie-auditor`

A script that gathers the cookie data from given sites into Excel workbooks. It then compares those workbooks to data from a previous run, and exports the comparison results to Excel workbooks.

## How to use locally

1. In your command line, run `cd scripts/cookie-auditor` from the project root.
2. Then, run `npm i` to install deps.
3. Add an Excel workbook of base data to `scripts/cookie-auditor/base-data` if not already there. (Future versions of this script will skip data comparison if no base data is found, but continue with new data generation).
4. Finally, run `npm run start`. This will update your locally installed `playwright` browsers and then execute the script.

## Known issues

- The script's base data workbooks must be named to match Playwright's supported browser types _exactly_. This can cause issues if expecting, say, a sheet named `google.xlsx` to work for the `chromium` browser type. The user should be able to use or set filename aliases that the script will pick up as valid.
- The process for data entry for the manual step of the auditing process could use some documentation for new users of the auditor. A collection of knowledgebases and links should accompany the package in either this README or files in a `docs` folder.
- Sheets in new result workbooks can sometimes end up empty.
- Pages without our cookie manager component implemented cause the `retrievePostCMCookies()` function to timeout, due to awaiting the visibility of a component that isn't there.

## `TODO`

See [the Asana project](https://app.asana.com/0/1205391667405183/1205399681178382) for details on remaining work.
