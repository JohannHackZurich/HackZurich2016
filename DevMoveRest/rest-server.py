#http://blog.miguelgrinberg.com/post/designing-a-restful-api-with-python-and-flask

from flask import Flask, jsonify, request, abort
import requests
import uuid

app = Flask(__name__)

players = {}

@app.route('/api/players', methods=['POST'])
def create_player():
    if not request.json or not 'name' in request.json or not 'steps' in request.json:
        abort(400)
    
    id = str(uuid.uuid4())
    print(id)

    players[id] = {
        'id': id,
        'name': request.json['name'],
        'initSteps': request.json['steps'],
        'steps': 0,
    }
   
    print("Add player with id " + id)
    return jsonify(players[id]), 200

@app.route('/api/players/<string:id>', methods=['GET'])
def get_player(id):
    print("get player with id " + id)

    if id in players:
        return jsonify(players[id]), 200

    abort(400)   

@app.route('/api/players', methods=['GET'])
def get_players():
    # get all players
    return jsonify([players[k] for k in players]), 200

@app.route('/api/competitions/start', methods=["POST"])
def start():
    print("start new competition.")
    for id in players:
        player = players[id]
        player["initStep"] = player["steps"]
        player["steps"] = 0
    return "", 200

@app.route('/api/players/<string:id>/steps/<int:count>', methods=['PUT'])
def update_steps(id, count):
    
    if id in players:
        players[id]["steps"] = count
        return jsonify(players[id]), 200

    abort(400)

if __name__ == '__main__':
    app.run(debug=True)

