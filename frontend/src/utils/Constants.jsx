const hoursTimeline = ["8h00", "9h45", "11h30", "13h15", "15h00", "16h45", "18h30", "20h15"];
const nbDaysPerMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
const departementNames = ["ITI", "GM", "EP", "STPI"]
const departementYears = {"ITI":[3, 4, 5], "GM":[3, 4, 5], "EP":[3, 4, 5], "STPI":[1, 2]}
const minWidth = 850;
const baseEventWidth = 93

const REPORT_FORM = "https://forms.gle/LyMsab1YVmbwf3LN7"
const API_URL = process.env.REACT_APP_API_URL;
const PATH_CALENDAR = API_URL+'/api/get_calendar/'
const PATH_ASSO = API_URL + '/api/get_evenements'
const API_LOGIN = API_URL+'/authentification/login'
const API_LOGOUT = API_URL+'/authentification/logout'
const API_AUTH = API_URL+'/api/is_connected?format=json'

export { hoursTimeline, minWidth, nbDaysPerMonth, baseEventWidth, API_URL, PATH_ASSO, PATH_CALENDAR, API_LOGIN, API_LOGOUT, API_AUTH, departementNames, departementYears, REPORT_FORM };