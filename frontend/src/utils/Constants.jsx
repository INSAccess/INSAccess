const hoursTimeline = ["8h00", "9h45", "11h30", "13h15", "15h00", "16h45", "18h30", "20h15"];
const nbDaysPerMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
const departementNames = ["ITI", "GM", "EP", "STPI"]
const departementYears = {"ITI":[3, 4, 5], "GM":[3, 4, 5], "EP":[3, 4, 5], "STPI":[1, 2]}
const minWidth = 850;
const baseEventWidth = 93

const LANGUAGES = ["en", "fr"]
const API_URL = process.env.REACT_APP_API_URL;
const REDIRECT = 'theuselessweb.com'
const PATH_CALENDAR = (API_URL != undefined) ? API_URL+'/api/get_year/' : REDIRECT
const PATH_ASSO = (API_URL != undefined) ? API_URL + '/api/get_evenements': REDIRECT
const API_LOGIN = (API_URL != undefined) ? API_URL+'/authentification/login' : REDIRECT
const API_AUTH = (API_URL != undefined) ? API_URL+'/api/is_connected?format=json' : REDIRECT

export { hoursTimeline, minWidth, nbDaysPerMonth, baseEventWidth, API_URL, PATH_ASSO, PATH_CALENDAR, API_LOGIN, API_AUTH, departementNames, departementYears, LANGUAGES };