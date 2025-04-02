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
      name: "Home",
      color: "#757575",
      href: "home" },
    
    {
      name: "Associative events",
      color: "#555555",
      href: "associations" },
    
    {
      name: "Settings",
      color: "#444444",
      href: "settings" },
    
    {
      name: "About",
      color: "#333333",
      href: "about" }
    ];
const PATH_CALENDAR = API_URL+'/api/get_year/'
const PATH_ASSO = 'http://localhost:3000/data_asso.json'
const API_LOGIN = API_URL+'/authentification/login'
const API_AUTH = API_URL+'/api/is_connected?format=json'

export { hours_timeline, dayList, minWidth, nbDaysPerMonth, monthList, baseEventWidth, API_URL, items, PATH_ASSO, PATH_CALENDAR, API_LOGIN, API_AUTH, departementNames, departementYears };