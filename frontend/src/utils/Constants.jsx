const hours_timeline = ["8h00", "9h45", "11h30", "13h15", "15h00", "16h45", "18h30", "20h15"];
const dayList = [ "Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];
const nbDaysPerMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
const departementNames = ["ITI", "GM", "EP", "STPI"]
const departementYears = {"ITI":[3, 4, 5], "GM":[3, 4, 5], "EP":[3, 4, 5], "STPI":[1, 2]}
const minWidth = 850;
const monthList = [ "Jan", "Févr", "Mars", "Avril", "Mai", "Juin", "Juil", "Aout", "Sept", "Oct", "Nov", "Déc"];
const baseEventWidth = 93
const API_URL = process.env.REACT_APP_API_URL;
const items = [
    {
      name: "Calendrier",
      color: "#777777",
      href: "home" },
    
    {
      name: "Evenements",
      color: "#666666",
      href: "associations" },
    
    {
      name: "Parametres",
      color: "#555555",
      href: "settings" },
    
    {
        name: "Amis",
        color: "#444444",
        href: "settings" },
    
    {
      name: "A propos",
      color: "#333333",
      href: "about" }
    ];
const REDIRECT = 'theuselessweb.com'
const PATH_CALENDAR = (API_URL != undefined) ? API_URL+'/api/get_year/' : REDIRECT
const PATH_ASSO = (API_URL != undefined) ? API_URL + '/api/get_evenement': REDIRECT
const API_LOGIN = (API_URL != undefined) ? API_URL+'/authentification/login' : REDIRECT
const API_AUTH = (API_URL != undefined) ? API_URL+'/api/is_connected?format=json' : REDIRECT

export { hours_timeline, dayList, minWidth, nbDaysPerMonth, monthList, baseEventWidth, API_URL, items, PATH_ASSO, PATH_CALENDAR, API_LOGIN, API_AUTH, departementNames, departementYears };