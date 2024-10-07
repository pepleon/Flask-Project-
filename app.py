
from flask import Flask, Response, send_from_directory, jsonify, request
from flask_pymongo import PyMongo
from bson.json_util import dumps  
from bson.objectid import ObjectId
import threading
import cv2
import time
import pymongo
from flask_cors import CORS

outputFrame = None
lock = threading.Lock()
app = Flask(__name__, static_folder='build/static', template_folder='build')

#//////////////////////////////////////////////////////////////////////////////////



mongo_client = pymongo.MongoClient("mongodb+srv://amanhussain:amanhussain123@amanhussain.hwjav.mongodb.net/?retryWrites=true&w=majority&appName=amanhussain")  # Replace with your MongoDB URI
mongo = mongo_client["amanhussain"]  
@app.route('/test_connection')
def test_connection():
    try:
        
        db_names = mongo_client.list_database_names()
        return jsonify({"message": "Connected to MongoDB!", "databases": db_names}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500




@app.route('/save-overlay', methods=['POST'])
def save_overlay():
    data = request.json
    overlay_collection = mongo["overlays"] 
    overlay_id = overlay_collection.insert_one(data).inserted_id 
    return jsonify({'message': 'Overlay saved successfully', 'id': str(overlay_id)}), 201

@app.route('/overlays', methods=['GET'])
def get_overlays():
    overlay_collection = mongo["overlays"]  
    overlays = overlay_collection.find()  
    overlay_list = []
    for overlay in overlays:
        overlay["_id"] = str(overlay["_id"])  
        overlay_list.append(overlay)
    return jsonify(overlay_list), 200






@app.route('/overlays/<id>', methods=['DELETE'])
def delete_overlay(id):
    overlay_collection = mongo["overlays"]  
    try:
        
        result = overlay_collection.delete_one({"_id": ObjectId(id)})
        
        if result.deleted_count > 0:
            return jsonify({'message': 'Overlay deleted successfully'}), 200
        
        return jsonify({'message': 'Overlay not found'}), 404

    except Exception as e:
        return jsonify({'message': str(e)}), 400  







@app.route('/overlays/<id>', methods=['GET'])
def get_overlay_by_id(id):
    overlay_collection = mongo["overlays"]  
    try:
        
        overlay = overlay_collection.find_one({"_id": ObjectId(id)})
        if overlay:
            overlay["_id"] = str(overlay["_id"])  
            return jsonify(overlay), 200
        return jsonify({'message': 'Overlay not found'}), 404
    except Exception as e:
        return jsonify({'message': str(e)}), 400  
















#////////////////////////////////////

source = "rtsp://rtspstream:cc512510ea738f684bff629ecbdc2958@zephyr.rtsp.stream/movie"
cap = cv2.VideoCapture(source)
time.sleep(2.0)  


streaming = True

@app.route("/")
def index():
    return send_from_directory(app.template_folder, 'index.html')

@app.route("/toggle_stream")
def toggle_stream():
    global streaming
    streaming = not streaming  
    return {"streaming": streaming}

def stream(frameCount):
    global outputFrame, lock, streaming
    if cap.isOpened():
        print("RTSP stream opened successfully")
        while True:
            if streaming:
                ret_val, frame = cap.read()

                if not ret_val:
                    print("Failed to capture frame. Retrying...")
                    continue

                if frame is not None and frame.size > 0:
                    print("Frame received, resizing...")
                    frame = cv2.resize(frame, (640, 360))
                    with lock:
                        outputFrame = frame.copy()
                else:
                    print("Empty frame received, skipping...")
    else:
        print('Failed to open RTSP stream')

def generate():
    global outputFrame, lock

    while True:
        with lock:
            if outputFrame is None:
                continue

            (flag, encodedImage) = cv2.imencode(".jpg", outputFrame)

            if not flag:
                continue

        yield(b'--frame\r\n' b'Content-Type: image/jpeg\r\n\r\n' + 
              bytearray(encodedImage) + b'\r\n')

@app.route("/video_feed")
def video_feed():
    return Response(generate(), mimetype="multipart/x-mixed-replace; boundary=frame")


if __name__ == '__main__':
    t = threading.Thread(target=stream, args=(32,))
    t.daemon = True
    t.start()
 
    app.run(host='0.0.0.0', port=8000, debug=False, threaded=True, use_reloader=False)

cap.release()
cv2.destroyAllWindows()
