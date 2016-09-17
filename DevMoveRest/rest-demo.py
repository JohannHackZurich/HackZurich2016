import requests
import json

headers = {'Content-type':'application/json'}

# url = 'http://localhost:5000/todo/api/v1.0/tasks'


# response = requests.get(url, headers=headers)

# print(response.json())

data = {"name" : "AI", "steps": 0}
player1_json = json.dumps(data)

data = {"name" : "Mobile Device", "steps": 0}
player2_json = json.dumps(data)


#response = requests.get('http://localhost:4440/api/values', headers=headers)

base_url = 'http://localhost:4440/api/'
base_url = "http://hackzurich2016.azurewebsites.net/api/"

# response = requests.post('http://localhost:58492/api/v1/players', data=data_json, headers=headers)
response = requests.post(base_url + 'players', data=player1_json, headers=headers)
if(response.status_code == 200):
    id = response.json()['Id']
    print(id)

response = requests.post(base_url + 'players', data=player2_json, headers=headers)
if(response.status_code == 200):
    id = response.json()['Id']
    print(id)

# response = requests.post(base_url + 'players', data=data_json, headers=headers)
# if(response.status_code == 200):
#     id = response.json()['Id']
#     print(id)

# response = requests.get(base_url + 'players/1', headers=headers)
# if(response.status_code == 200):
#     print(response.json())

# response = requests.get(base_url + 'players/' + id, headers=headers)
# if(response.status_code == 200):
#     print(response.json())

# response = requests.get(base_url + 'players', headers=headers)
# if(response.status_code == 200):
#     print(response.json())

# response = requests.post(base_url + 'competitions/start', headers=headers)

# response = requests.put(base_url + 'players/' + id + "/steps/" + str(5233), headers=headers)
# if(response.status_code == 200):
#     id = response.json()
#     print(id)

# response = requests.delete(base_url + 'players')

response = requests.get(base_url + 'players', headers=headers)
if(response.status_code == 200):
    print(response.json())
