import sys
import os
import json
from typing import Dict, Any, List

from dotenv import load_dotenv
load_dotenv()

sys.path.append(os.path.abspath(os.path.join(os.getcwd(), '..')))

class renterTool:
    def __init__(self, json_path: str):
        self.json_path = json_path

    def retrieve(self) -> Dict[str, List[Dict[str, Any]]]:
        """
        Retrieve the candidate data from the JSON file.
        Assumes each line is a JSON object (JSONL format).
        """
        if not os.path.exists(self.json_path):
            raise FileNotFoundError(f"File not found: {self.json_path}")

        try:
            with open(self.json_path, 'r') as f:
                data = json.load(f)
            return {"Retrieved Data": data}
        except Exception as e:
            return {"error": str(e)}

# if __name__ == "__main__":
#     json_file_path = os.path.join("../Data", "buyer_data.json")
#     retriever = RetrieveJSON(json_file_path)
#     result = retriever.retrieve()
#     print(result)
