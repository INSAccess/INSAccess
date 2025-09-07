import { API_URL } from './utils/Constants.jsx';

const reportWebVitals = (onPerfEntry) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(onPerfEntry);
      getFID(onPerfEntry);
      getFCP(onPerfEntry);
      getLCP(onPerfEntry);
      getTTFB(onPerfEntry);
    });
  }
};

function sendToAnalytics(metric) {
  const body = JSON.stringify(metric);
  const url = API_URL + '/post_analytics';

  // Use `navigator.sendBeacon()` if available, falling back to `fetch()`
  try {
    if (navigator.sendBeacon) {
      navigator.sendBeacon(url, body);
    } else {
      fetch(url, { body, method: 'POST', keepalive: true });
    }
  } catch (e) {
    console.error("Couldn't send vitals to analytics");
    console.error(e);
  }
}

export { reportWebVitals, sendToAnalytics };
