from flask import Flask, request, jsonify
from flask_cors import CORS
from langchain_core.messages import HumanMessage
from Workflow.workflow import workflow
import os
import sys
sys.path.append(os.path.abspath(os.path.join(os.getcwd(), '..')))
import json

JSON_DIR = os.path.join(os.getcwd(), "data")
app = Flask(__name__)
CORS(app, resources={r"/ask": {"origins": "http://localhost:3000"}}, supports_credentials=True)


graph_instance = workflow()
graph = graph_instance.get_graph()

@app.route('/asic-data')
def fetch_json():
    try:
        with open('Data/seller_data.json', 'r') as f:
             data = [json.loads(line) for line in f]
        return jsonify(data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/ask', methods=['POST'])
def ask_agent():
    data = request.get_json()
    session_id = data.get("session_id")
    user_message = data.get("message")
    if not session_id or not user_message:
        return jsonify({"error": "Missing session_id or message"}), 400

    config = {"configurable": {"session_id": session_id, "thread_id": session_id}}
    try:
        
        result = graph.invoke({"messages": [HumanMessage(content=user_message)]}, config=config)
        messages = result.get("messages", [])
        response_text = messages[-1].content if messages else "No response generated."

        return jsonify({"response": response_text})
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    





if __name__ == '__main__':
    app.run(debug=True, port=5000)