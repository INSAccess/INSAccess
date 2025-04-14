import { useState, useEffect } from "react";

/**
 * Class for handling random utility functions
 */
class RandomUtils{
  /**
   * Loads the config.json file
   * @returns {struct}
   */
  static getConfig(){
    let { data, error, loading } = RandomUtils.LoadData("http://localhost:3000/config.json")
  
    if (!loading){
      if (!error){
        return data
      } else {
        return null
      }
    }
  }
  
  /**
   * Implements the max function
   * @param {Comparable} a 
   * @param {Comparable} b 
   * @returns {Comparable} the max of a and b
   */
  static max(a, b){
    return (a > b) ? a : b;
  }
  
  /**
   * Handle for the window dimensions (width and height)
   * @returns {Array}
   */
  static useWindowDimensions(){
    const [dimensions, setDimensions] = useState({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  
    useEffect(() => {
      const handleResize = () => {
        setDimensions({ width: window.innerWidth, height: window.innerHeight });
      };
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }, []);
  
    return dimensions;
  };
  
  /**
   * Fetches the data from a given path
   * @param {string} data_path 
   * @returns {struct} data, error
   */
  static async fetchData(data_path){
    const initConfig = {
      method:'GET',
      headers:{'Content-Type':'application/json', 'Accept':'application/json', 'X-CSRFToken':RandomUtils.getCSRFToken()},
      mode:'cors',
      credentials:'include'
    }
    try {
      const response = await fetch(data_path, initConfig);
      if (!response.ok) {
        throw new Error("Erreur lors du fetch");
      }
      const json = await response.json();
      return { data: json, error: null };
    } catch (error) {
      return { data: null, error: error.message };
    }
  };
  
  /**
   * Loads the data from the given path and returns the state of loading (data if success, error message and loading)
   * @param {string} data_path 
   * @returns {struct} data, error, loading
   */
  static LoadData(data_path){
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      const loadData = async () => {
        const result = await RandomUtils.fetchData(data_path);
        setData(result.data);
        setError(result.error);
        setLoading(false);
      };
  
      loadData();
    }, []);
  
    return {data, error, loading}
  }

  static Join(list){
    let res = ""
    for (let i = 0; i < list.length-1; i++){
      res += list[i]+', '
    }
    res += list[list.length-1]
    return res
  }

  static getCSRFToken(){
    const cookies = document.cookie.split('; ');
    for (let cookie of cookies) {
        const [name, value] = cookie.split('=');
        if (name === 'csrftoken') {
            return value;
        }
    }
    return null;
  };
}

export default RandomUtils;