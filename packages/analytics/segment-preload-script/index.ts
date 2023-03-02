/**
 * This script is provided by Segment
 * - @see https://segment.com/docs/connections/sources/catalog/libraries/website/javascript/quickstart/#step-2-add-the-segment-snippet
 *
 * It has been modified to “preload” the window.analytics API without loading the full `analytics.js` segment script so we can buffer tracking calls before segment fully loads.
 *
 * This has also been modified to use the HashiCorp proxy, artemis.hashicorp.com & custom filename, instead of cdn.segment.com.
 */
export const segmentPreloadScript = `!function(){var analytics=window.analytics=window.analytics||[];if(!analytics.initialize)if(analytics.invoked)window.console&&console.error&&console.error("Segment snippet included twice.");else{analytics.methods=["trackSubmit","trackClick","trackLink","trackForm","pageview","identify","reset","group","track","ready","alias","debug","page","once","off","on"];analytics.factory=function(t){return function(){var e=Array.prototype.slice.call(arguments);e.unshift(t);analytics.push(e);return analytics}};for(var t=0;t<analytics.methods.length;t++){var e=analytics.methods[t];analytics[e]=analytics.factory(e)}analytics.load=function(t,e){var n=document.createElement("script");n.type="text/javascript";n.async=!0;n.src="https://artemis.hashicorp.com/script/"+t;var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(n,a);analytics._loadOptions=e};analytics.SNIPPET_VERSION="4.1.0";}}();`
