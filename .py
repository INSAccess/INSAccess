import requests

cas_url = "http://192.168.1.25:3004/cas/p3/serviceValidate"
params = {
    "ticket": "ST-1756547687006-mhkr9fkos",
    "service": "http://192.168.1.25:8000/authentification/login/?next=/authentification/profile"
}

try:
    response = requests.get(cas_url, params=params, timeout=5)
    response.raise_for_status()
    print(response.text)
except requests.exceptions.ConnectionError as e:
    print("ConnectionError:", e)
except requests.exceptions.HTTPError as e:
    print("HTTPError:", e)
except Exception as e:
    print("Other error:", e)