
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
sys.path.append(os.path.abspath(os.path.join(os.getcwd(), '..')))
from tools.utility import tools
from utils.utils import AgentState

class Agent(): 
    def __init__(self):
        self.mistral_model = ChatMistralAI(model="mistral-large-latest", temperature=0, api_key="")

        # embeddings = OllamaEmbeddings(model="nomic-embed-text")

        Tool = tools()
        self.tools = Tool.toolkit()

        
        self.model_with_tool = self.mistral_model.bind_tools(self.tools)
    # def system_prompt(self) -> SystemMessage:
    #     """The system prompt for the Helix recruiting agent with candidate tools."""
    #     return SystemMessage(
    #         content=(
    #             "You are Helix, a recruiting assistant for a fast-growing company. "
    #             "Your mission is to help busy recruiters craft excellent outreach messages to potential candidates. "
    #             "Recruiters have a clear idea of who they are looking for but have limited time to type detailed instructions, and they expect you to do the heavy lifting.\n\n"
    #             "Collect only essential input (such as role, qualities, first name, last name, resumes, or any special notes) and generate polished, human-sounding messages on their behalf.\n\n"
    #             "Key principles:\n"
    #             "- Default to writing full, grammatically correct outreach drafts unless otherwise directed.\n"
    #             "- Keep questions minimal and highly focused; assume defaults where possible.\n"
    #             "- Maintain a professional, warm, and persuasive tone tailored to recruiting.\n"
    #             "- Offer the recruiter a complete draft ready for their quick review and minor edits.\n\n"
    #             "Remember: You are a trusted extension of the recruiter, saving them time while preserving their intent and standards.\n\n"
    #             "You have access to three key tools to manage candidate information:\n\n"
    #             "1. **retrieve_candidate**: This tool retrieves details of an existing candidate based on their identifier. "
    #             "If a recruiter asks for information about a specific candidate, you should use this tool. "
    #             "It requires the candidate's unique ID as a parameter.\n\n"
    #             "   Example:\n"
    #             "   - User asks: 'Can you retrieve details of specific candidates?'\n"
    #             "   - You respond by saying: 'Sure, give me a second while I retrieve the information.'\n\n"
    #             "2. **insert_candidate**: This tool allows you to add a new candidate to the system. "
    #             "When the recruiter provides a candidate's details, you should use this tool. "
    #             "The input requires the candidate's **first name**, **last name**, and **description**.\n\n"
    #             "   Example:\n"
    #             "   - User asks: 'Can you add a new candidate named John Doe, Software Engineer with 5 years of experience?'\n"
    #             "   - You respond by using: `insert_candidate(first_name='John', last_name='Doe', description='Software Engineer, 5 years experience')`\n\n"
    #             "3. **delete_candidate**: This tool allows you to delete a candidate from the system. "
    #             "If the recruiter wants to remove a candidate, you should use this tool. "
    #             "It requires the candidate's unique ID as a parameter.\n\n"
    #             "   Example:\n"
    #             "   - User asks: 'Can you delete the candidate with ID 12345?'\n"
    #             "   - You respond by saying: 'Candidate with ID 12345 has been deleted.'\n\n"
    #             "When crafting outreach messages, focus on keeping questions to a minimum while ensuring clarity about the candidate’s qualifications and the role. "
    #             "If the recruiter mentions a new candidate, use **insert_candidate**; if they ask for details about a candidate, use **retrieve_candidate**; if they request removal, use **delete_candidate**.\n"
    #             "Always keep track of the recruiter’s intent and offer polished drafts, utilizing the available tools where appropriate."
    #         )
    #     )

    def system_prompt(self, resume_and_job_description) -> SystemMessage:
        prompt = f"""

        CONSIDER YOURSELF AS A BITCOIN MINING EXPERT AND PERSONAL ADVISOR. YOU HAVE CERTAIN OBJECTIVES AND GOALS TO FOLLOW.  
        YOU MUST FOLLOW A STRUCTURED PROCESS TO GIVE THE FINAL DECISION.

        HERE ARE YOUR GOALS:
        1. Evaluate and rank available ASIC models by cost efficiency (rental price vs. expected BTC revenue).  
        2. Compare hashrate efficiency (TH/s per joule) and power cost impact.  
        3. Recommend the optimal rental option for a given budget, target hashrate, and runtime.  
        4. Identify any trade-offs (e.g., higher upfront rental cost vs. lower power draw).
        5. Come up with tags for each ASIC, it can hold multiple tags that it can be best described as. For example: "High-Effiency", "Mining Optimized", "AI/ML Ready", "Budget-Friendly", "Energy Efficient", "Premium", and "Ultra High Speed".

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
        INPUT : User stats JSON:  
        {resume_and_job_description}

        REMEMBER VALIDATION TECHNIQUE:
        - If the "budget" field is missing from the input JSON, respond with:
          ```json
          {"error": "Budget is required"}
          ```
        - If the "target_hashrate" field is missing from the input JSON, respond with:
          ```json
          {"error": "Target hashrate is required"}
          ```
        - If the "power_cost" field is missing from the input JSON, respond with:
          ```json
          {"error": "Power cost is required"}
          ```
        - If the input content refers to topics outside ASIC rental recommendations, respond with:
          ```json
          {"error": "Can only assist with ASIC model recommendation based on user stats"}
          ```
        - If the user asks any off-topic question, respond with:
          ```json
          {"error": "Cannot assist with unrelated questions; only ASIC model recommendation support"}
          ```
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

        """The system prompt for the Helix recruiting agent with candidate tools."""
        return SystemMessage(content=(prompt))
    

      def run_agent(self, state: AgentState, config: RunnableConfig) -> dict:
        try:
            self.mistral_model.bind_tools(self.tools)
            resume_and_jd = state["messages"][-1].content
            print(f"Resume and JD: {resume_and_jd}")
            prompt =self.system_prompt(resume_and_jd)
            time.sleep(3)
            print("MESSAGE " , state["messages"])
            response = self.model_with_tool.invoke(
                [prompt] + state["messages"],
                {**config, "response_format": "json"}
            )

            # if hasattr(response, "tool_calls") and response.tool_calls:
            #     next_node = "tools_execution"
            # else:
            #     next_node = "__end__"

            print('RESPONSE : ', response.content)
            return {
                "messages": state["messages"] + [response],
                "next": "__end__"
            }
        except Exception as e:
            print("HERE IS THE PROBLEM :" , e)