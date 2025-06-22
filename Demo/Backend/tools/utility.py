import os
from dotenv import load_dotenv


from tools.sellerTool import sellerTool
from tools.renterTool import renterTool

load_dotenv()

# Get the absolute path to the Data directory
current_dir = os.path.dirname(os.path.abspath(__file__))
data_dir = os.path.join(os.path.dirname(current_dir), "Data")


class tools:
    def __init__(self):

        # This is for the connection string for the database -> The only connection string that is needed to
        # Connect to CoackRaochDB
        # self.db_connection = os.getenv("DATABASE_URL")

        # # Creating the instances of both the retrival and insert tools
        # self.insert_tool = insert(self.db_connection)
        # self.retrival_tool = retrive(self.db_connection)
        # self.delete_tool = delete(self.db_connection)

        # # Building the services that will be used to invoke the tools itslef

        # self.insert = self.insert_tool.insert_canidate
        # self.retrive = self.retrival_tool.retrive
        # self.delete = self.delete_tool.delete

        self.seller_tool = sellerTool(os.path.join(data_dir, "seller_data.json"))
        self.renter_tool = renterTool(os.path.join(data_dir, "buyer_data.json"))

        self.sell = self.seller_tool.retrieve
        self.rent = self.renter_tool.retrieve

        self.tools_list = [self.sell, self.rent]

    def toolkit(self):
        return self.tools_list


if __name__ == "__main__":
    tools = tools()
    li = tools.toolkit()
    testing = li[1]
    print(testing())
    # testing = li[2]("1067972559791915009")
    # print(testing)
