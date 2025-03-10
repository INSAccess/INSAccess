const hours_timeline = ["8h00", "9h45", "11h30", "13h15", "15h00", "16h45", "18h30", "20h15"];
const dayList = [ "Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
const nbDaysPerMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
const minWidth = 850;
const monthList = [ "Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Aout", "Septembre", "Octobre", "Novembre", "Décembre"];
const baseEventWidth = 93
const API_URL = process.env.REACT_APP_API_URL;
const items = [
    {
      name: "Home",
      color: "#FED9EA",
      href: "home" },
    
    {
      name: "Associative events",
      color: "#CFD6EF",
      href: "associations" },
    
    {
      name: "Settings",
      color: "#70D1F9",
      href: "settings" },
    
    {
      name: "About",
      color: "#40cefe",
      href: "about" }
    ];

export { hours_timeline, dayList, minWidth, nbDaysPerMonth, monthList, baseEventWidth, API_URL, items };