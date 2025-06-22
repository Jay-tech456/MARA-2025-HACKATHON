import time
from langchain_core.messages import SystemMessage
from langchain_core.runnables import RunnableConfig
from langchain_ollama import OllamaEmbeddings
from langchain_ollama import ChatOllama
from langchain_core.messages import HumanMessage
import sys
import os
from langchain_mistralai import ChatMistralAI
import time
import dotenv

dotenv.load_dotenv()
# Having a system path so that the files are all readable
sys.path.append(os.path.abspath(os.path.join(os.getcwd(), "..")))
from tools.utility import tools
from utils.utils import AgentState


class Agent:
    def __init__(self):
        self.mistral_model = ChatMistralAI(
            model="mistral-large-latest",
            temperature=0,
            api_key="b5BKS19Dnp3ypIzvT03pDrqFDr970XcJ",
        )

        # embeddings = OllamaEmbeddings(model="nomic-embed-text")

        Tool = tools()
        self.tools = Tool.toolkit()

        self.model_with_tool = self.mistral_model.bind_tools(self.tools)

    def system_prompt(self) -> SystemMessage:
        """The system prompt for the Bitcoin recruiting agent with candidate tools."""
        return SystemMessage(
            content=(
                """
            CONSIDER YOURSELF AS A BITCOIN MINING EXPERT AND PERSONAL ADVISOR. YOU HAVE CERTAIN OBJECTIVES AND GOALS TO FOLLOW.  
            YOU MUST FOLLOW A STRUCTURED PROCESS TO GIVE THE FINAL DECISION.

                        
            You have access to two tools:

            1. `renterTool`: 
            - Retrieves buyer requests from a JSON dataset (`buyer_data.json`).
            - Use this when the user is looking to rent an ASIC or mentions needing a system for a use case.

            2. `sellerTool`: 
            - Retrieves seller listings from a JSON dataset (`seller_data.json`).
            - Use this when the user wants to see available ASIC systems for rent.

            Decide which tool to use based on the user’s input.

            Example 1:
            User: "I want to see all available ASICs I can rent."
            → Call: `sellerTool.retrieve()`

            Example 2:
            User: "I'm trying to train a model and need a miner for 24 hours."
            → Call: `renterTool.retrieve()`

            --- Available Tools ---
            Tool 1: `sellerTool` - gets ASIC machines available for rent.
            Tool 2: `renterTool` - gets users' use cases or rental intents.

            --- Output Format ---
            Respond in JSON like this:
            {
            "tool": "<tool_name>",
            "tool_input": {},
            "reason": "Why this tool is the best match for the input"
            }


            HERE ARE YOUR GOALS:
            1. Evaluate and rank available ASIC models by cost efficiency (rental price vs. expected BTC revenue).  
            2. Compare hashrate efficiency (TH/s per joule) and power cost impact.  
            3. Recommend the optimal rental option for a given budget, target hashrate, and runtime.  
            4. Identify any trade-offs (e.g., higher upfront rental cost vs. lower power draw).  
            5. Come up with tags for each ASIC, it can hold multiple tags that it can be best described as. For example: "High-Efficiency", "Mining Optimized", "AI/ML Ready", "Budget-Friendly", "Energy Efficient", "Premium", and "Ultra High Speed".

            CREATE A TREE OF THOUGHTS (ToT) PROCESS:
            1. **Brainstorming Phase**  
            - Generate a list of candidate ASIC models that match the user’s budget and hashrate needs from the existing database of available ASIC models.  
            - For each model, note its key specs: hashrate, power draw, rental cost.  

            2. **Evaluation Phase**  
            - Independently compute cost-per-TH/s and joules-per-TH metrics.  
            - Estimate daily BTC yield based on current network difficulty and power rates.  

            3. **Debate & Prune Phase**  
            - Contrast top contenders on ROI, energy cost, and reliability.  
            - Eliminate sub-optimal models (e.g., those with poor ROI or high power draw).  

            4. **Synthesis Phase**  
            - Aggregate findings into a ranked shortlist.  
            - Draft explanations of why each top choice excels.

            FINALIZE RESULTS:
            • Output a concise recommendation report with:  
            – **Top 3 ASIC models**, ranked.  
            – **Key metrics** for each (cost/TH, joules/TH, estimated daily profit).  
            – **Recommended rental duration** and budget envelope.  
            – **Summary of trade-offs** to inform the buyer’s decision.

            ----
            INPUT: User stats JSON:  
            {resume_and_job_description}

            REMEMBER VALIDATION TECHNIQUE:
            - If the "budget" field is missing from the input JSON, respond with:
            {"error": "Budget is required"}

            - If the "target_hashrate" field is missing from the input JSON, respond with:
            {"error": "Target hashrate is required"}

            - If the "power_cost" field is missing from the input JSON, respond with:
            {"error": "Power cost is required"}

            - If the input content refers to topics outside ASIC rental recommendations, respond with:
            {"error": "Can only assist with ASIC model recommendation based on user stats"}

            - If the user asks any off-topic question, respond with:
            {"error": "Cannot assist with unrelated questions; only ASIC model recommendation support"}

            ### EXECUTION RULES:
            - Use the provided tools for retrieving ASIC specifications, pricing, and power metrics.
            - Perform all cost and efficiency calculations programmatically via tools; do not hardcode any values.
            - Strictly follow the Tree of Thoughts (ToT) process defined above.
            - Do not introduce any external or unverified data; rely only on input JSON and tool outputs.
            - Format the final recommendation as a JSON object containing:
            {
                "recommendations": [
                {
                    "model": "<ASIC model>",
                    "cost_per_th": "<value>",
                    "power_efficiency": "<value>",
                    "estimated_profit": "<value>"
                },
                ...
                ]
            }
            - Output must be valid JSON with no additional commentary or text.
            """
            )
        )

    def run_agent(self, state: AgentState, config: RunnableConfig) -> dict:
        time.sleep(3)
        model = self.mistral_model.bind_tools([tools])

        response = self.model_with_tool.invoke(
            [self.system_prompt()] + state["messages"], config
        )

        return {"messages": [response]}
