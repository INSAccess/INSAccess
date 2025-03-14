import { nbDaysPerMonth, dayList, monthList } from './constants.jsx'

const Day = class Day{

  date = "2025-01-01";
  day = 1;
  month = 1;
  year = 1970;
  
  constructor(date){
    if (date instanceof Date){
      this.day = date.getDate()
      this.month = date.getMonth()+1
      this.year = date.getFullYear()
      let monthZero = (this.month < 10) ? "0" : ""
      let dayZero = (this.day < 10) ? "0" : ""
      this.date = this.year+"-"+monthZero+this.month+"-"+dayZero+this.day
    } else {
      this.date = date;
      this.update();
    }
    
  }

  setDay(date){
    this.date = date;
    this.update();
  }

  update(){
    this.day = parseInt(this.date.slice(8, 10));
    this.month = parseInt(this.date.slice(5, 7));
    this.year = parseInt(this.date.slice(0, 4))
  }

  static constructDay(day, month, year){
    let nDay = (day < 10) ? "0" + day : "" + day;
    let nMonth = (month < 10) ? "0" + month : "" + month;
    let newDay = new Day(year+"-"+nMonth+"-"+nDay)
    return newDay;
  }

  next(nb_jours){
    let day = this.day+nb_jours
    let month = this.month;
    let year = this.year;
    let nbDays = nbDaysPerMonth[this.month-1]
    if (day > nbDays){
      day -= nbDays
      month += 1
      if (month > 12){
        month = 1
        year += 1
      }
    }
    let newDay = Day.constructDay(day, month, year)
    return newDay;
  }
  
  prev(nb_jours){
    // nb_jours entre 1 et 31
    let day = this.day-nb_jours
    let month = this.month;
    let year = this.year;
    let nbDays = nbDaysPerMonth[(this.month+10)%12]
    if (day < 1){
      day += nbDays
      month -= 1
      if (month < 1){
        month = 12
        year -= 1
      }
    }
    let newDay = Day.constructDay(day, month, year)
    return newDay;
  }

  copy(){
    let res = new Day(this.date);
    return res;
  }

  startOfWeek(){
    let day = this.copy();
    while (day.getDayOfWeek() !== dayList[1]){
      day = day.prev(1);
    }
    return day;
  }
    
  static presentableHour(hour){
    return hour[0]+hour[1]+":"+hour[2]+hour[3]
  }

  getDayOfWeek(){
    let date = new Date(this.date)
    return dayList[date.getDay()]
  }

  getMonthOfYear(){
    return monthList[this.month-1]
  }

  getDay(){
    return this.day;
  }

  getMonth(){
    return this.month;
  }

  getYear(){
    return this.year;
  }

  getDate(){
    return this.date;
  }

  setDate(date){
    this.date = date;
    this.update()
  }
  
  getDateInfo(){
      return [this.getDayOfWeek(), this.getDay(), this.getMonthOfYear()];
  }

  toString(){
    return this.date;
  }

  static createHours(){
    let result = [];
    let string = "";
    let last_hour = "2015"
    let currentHour = 8;
    let currentMinute = 0;
    for (let i = 0; i <= 12; i++){
      for (let j = 0; j < 12; j++){
        string = "";
        if (currentHour < 10){
          string += "0";
        }
        string += `${currentHour}`;
        if (currentMinute < 10){
          string += "0";
        }
        string += `${currentMinute}`;
        result.push(string);
        currentMinute += 5;
        if (string === last_hour){
          return result;
        }
      }
      currentHour += 1;
      currentMinute = 0;
    }
    return result;
  }
} 





export default Day;