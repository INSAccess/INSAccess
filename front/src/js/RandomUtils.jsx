import { useState, useEffect } from "react";

class RandomUtils{
  static getConfig(){
    let { data, error, loading } = LoadData("http://localhost:3000/config.json")
  
    if (!loading){
      if (!error){
        return data
      } else {
        return null
      }
    }
  }
  
  static max(a, b){
    return (a > b) ? a : b;
  }
  
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
  
  static async fetchData(data_path){
    const initConfig = {
      method:'GET',
      headers:{'Content-Type':'application/json', 'Accept':'application/json'},
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
  
  static LoadData(data_path){
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      const loadData = async () => {
        const result = await fetchData(data_path);
        setData(result.data);
        setError(result.error);
        setLoading(false);
      };
  
      loadData();
    }, []);
  
    return {data, error, loading}
  }
}

export default RandomUtils;