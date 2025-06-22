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
            YOU MUST FOLLOW A STRUCTURED PROCESS INTERNALLY TO GIVE THE FINAL DECISION, BUT ONLY OUTPUT THE FINAL JSON RESULT.

            HERE ARE YOUR GOALS:
            1. Evaluate and rank available ASIC models by cost efficiency (rental price vs. expected BTC revenue).  
            2. Compare hashrate efficiency (TH/s per joule) and power cost impact.  
            3. Recommend the optimal rental option for a given budget, target hashrate, and runtime.  
            4. Identify any trade-offs (e.g., higher upfront rental cost vs. lower power draw).  
            5. Come up with tags for each ASIC, it can hold multiple tags that it can be best described as. For example: "High-Efficiency", "Mining Optimized", "AI/ML Ready", "Budget-Friendly", "Energy Efficient", "Premium", and "Ultra High Speed".

            INTERNAL PROCESS (DO NOT SHOW THIS TO USER):
            Follow this process internally but DO NOT output any intermediate steps:
            1. **Brainstorming Phase** - Generate candidate ASIC models from database
            2. **Evaluation Phase** - Compute cost-per-TH/s and joules-per-TH metrics  
            3. **Debate & Prune Phase** - Compare ROI, energy cost, and reliability
            4. **Synthesis Phase** - Rank and select top 3 models

            CRITICAL: DO NOT SHOW ANY INTERMEDIATE STEPS. ONLY OUTPUT THE FINAL JSON RESULT.

            ----

            REMEMBER VALIDATION TECHNIQUE:
            - If the "budget" field is missing from the input JSON, respond with:
            {"error": "Budget is required"}

            - If the input content refers to topics outside ASIC rental recommendations, respond with:
            {"error": "Can only assist with ASIC model recommendation based on user stats"}

            - If the user asks any off-topic question, respond with:
            {"error": "Cannot assist with unrelated questions; only ASIC model recommendation support"}

            ### EXECUTION RULES:
            - Use the provided tools for retrieving ASIC specifications, pricing, and power metrics.
            - Perform all cost and efficiency calculations programmatically via tools; do not hardcode any values.
            - Do not introduce any external or unverified data; rely only on input JSON and tool outputs.
            - DO NOT SHOW ANY INTERMEDIATE STEPS, PROCESS, OR EXPLANATIONS.
            - ONLY OUTPUT THE FINAL JSON RESULT.

            REQUIRED OUTPUT FORMAT (ONLY THIS JSON, NOTHING ELSE):
            {
                "top_3_asic_models": [
                    "Model Name 1",
                    "Model Name 2", 
                    "Model Name 3"
                ],
                "key_metrics": {
                    "Model Name 1": {
                        "cost_per_TH": 1.25,
                        "joules_per_TH": 31,
                        "estimated_daily_profit": 0.00056,
                        "tags": ["High-Efficiency", "Budget-Friendly"],
                        "recommended_pool": "Antpool",
                        "pool_fee": 1.5,
                        "pool_features": ["PPS+", "Low Latency", "24/7 Support"]
                    },
                    "Model Name 2": {
                        "cost_per_TH": 1.36,
                        "joules_per_TH": 29.5,
                        "estimated_daily_profit": 0.00055,
                        "tags": ["Energy Efficient", "Premium"],
                        "recommended_pool": "F2Pool",
                        "pool_fee": 2.0,
                        "pool_features": ["FPPS", "High Reliability", "Global Servers"]
                    },
                    "Model Name 3": {
                        "cost_per_TH": 1.40,
                        "joules_per_TH": 32,
                        "estimated_daily_profit": 0.00052,
                        "tags": ["Mining Optimized"],
                        "recommended_pool": "ViaBTC",
                        "pool_fee": 1.8,
                        "pool_features": ["PPLNS", "Stable Payouts", "Advanced Dashboard"]
                    }
                },
                "recommended_rental_duration": "30 days",
                "budget_envelope": "$200/day",
                "summary_of_trade_offs": {
                    "Model Name 1": "Brief trade-off description",
                    "Model Name 2": "Brief trade-off description",
                    "Model Name 3": "Brief trade-off description"
                }
            }

            IMPORTANT: ONLY OUTPUT THE JSON ABOVE. DO NOT INCLUDE ANY TEXT, EXPLANATIONS, OR PROCESS STEPS BEFORE OR AFTER THE JSON.
            """
            )
        )

    def run_agent(self, state: AgentState, config: RunnableConfig) -> dict:
        time.sleep(3)
        model = self.mistral_model.bind_tools([tools])
        try:
            print("running")
            response = self.model_with_tool.invoke(
                [self.system_prompt()] + state["messages"], config
            )
        except Exception as e:
            print(e)
            return {"error": str(e)}

        return {"messages": [response]}
