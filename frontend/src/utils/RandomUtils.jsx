import { useState, useEffect } from 'react';

/**
 * Class for handling random utility functions
 */
class RandomUtils {
  /**
   * Implements the max function
   * @param {Comparable} a
   * @param {Comparable} b
   * @returns {Comparable} the max of a and b
   */
  static max(a, b) {
    return a > b ? a : b;
  }

  /**
   * Handle for the window dimensions (width and height)
   * @returns {Array}
   */
  static useWindowDimensions() {
    const [dimensions, setDimensions] = useState({
      width: window.innerWidth,
      height: window.innerHeight,
    });

    useEffect(() => {
      const handleResize = () => {
        setDimensions({ width: window.innerWidth, height: window.innerHeight });
      };
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, []);

    return dimensions;
  }
  /**
   * Fetches the data from a given path
   * @param {string} dataPath
   * @returns {struct} data, error
   */
  static async fetchData(dataPath) {
    const initConfig = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'X-CSRFToken': RandomUtils.getCSRFToken(),
      },
      mode: 'cors',
      credentials: 'include',
    };
    const response = await fetch(dataPath, initConfig);
    const json = await response.json();

    if (!response.ok) {
      return { data: null, error: json.error };
    }
    return { data: json, error: null };
  }

  static async fetchDataWithMethod(url, method, body = null) {
    const initConfig = {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'X-CSRFToken': RandomUtils.getCSRFToken(),
      },
      mode: 'cors',
      credentials: 'include',
      body: body ? JSON.stringify(body) : null,
    };
    const response = await fetch(url, initConfig);
    const json = await response.json();
    if (!response.ok) {
      return { data: null, error: json.error };
    }
    return { data: json, error: null };
  }

  /**
   * Loads the data from the given path and returns the state of loading (data if success, error message and loading)
   * @param {string} dataPath
   * @returns {struct} data, error, loading
   */
  static LoadData(dataPath) {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const loadData = async () => {
        const result = await RandomUtils.fetchData(dataPath);
        setData(result.data);
        setError(result.error);
        setLoading(false);
      };

      loadData();
    }, []);

    return { data, error, loading };
  }

  /**
   * Concatenates all the strings passed in as a list, or returns the original string if there is only one
   * @param {*} list List of string or single string to concatenate
   * @returns {string} Concatenation of the strings passed in
   */
  static Join(list) {
    if (typeof list == 'string') {
      return list;
    }
    let res = '';
    for (let i = 0; i < list.length - 1; i++) {
      res += list[i] + ', ';
    }
    res += list[list.length - 1];
    return res;
  }

  static getCSRFToken() {
    const cookies = document.cookie.split('; ');
    for (let cookie of cookies) {
      const [name, value] = cookie.split('=');
      if (name === 'csrftoken') {
        return value;
      }
    }
    return null;
  }
}

export default RandomUtils;
