import os

from flask import Flask, render_template, jsonify, request
from flask_socketio import SocketIO, emit
from datetime import timedelta

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
app.config["SEND_FILE_MAX_AGE_DEFAULT"] = timedelta(seconds=1)
socketio = SocketIO(app)

channels = []
channelContent = {}
current_channel = ''

@app.route("/")
def index():
    return render_template('index.html')

@socketio.on("connect")
def initialization():
    emit("initChannelList", {"existingChannels": channels}, broadcast=True)
    emit("initChannelContent", {"initChannel": channelContent[current_channel]}, broadcast=True)


@socketio.on("submit channel")
def addChannel(data):
    newChan = data["newChan"]
    channels.append(newChan)
    channelContent[current_channel] = []
    emit("updateChannelList", {"newChan": newChan}, broadcast=True)

@socketio.on("change channel")
def ch_channel(data):
    current_channel = data['current_channel']
    if current_channel not in channelContent.keys():
        channelContent[current_channel] = []
    emit("initChannelContent", {"initChannel": channelContent[current_channel]}, broadcast=True)
    

@socketio.on("submit text")
def addTextToChannel(data):
    text = data["text"]
    current_channel = data["current_channel"]
    current_time = data["current_time"]
    current_user = data["current_user"]
    channelContent[current_channel].append({"text": text, "user": current_user, "time": current_time})
    emit('refresh channel', {"newMessage": {"text": text, "user": current_user, "time": current_time}}, broadcast=True)
