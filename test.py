import requests
api_url = "https://node-ms-speakerservice.azurewebsites.net/list"
response = requests.get(api_url)
response.json()
print(response)

api_url = "https://node-ms-feedbackservice.azurewebsites.net/list"
response = requests.get(api_url)
response.json()
print(response)


