import os
from dotenv import load_dotenv
load_dotenv()
GROQ_API_KEY=os.getenv("GROQ_API_KEY")
DATABASE=os.getenv("DATABASE")
TWEETER_API_KEY=os.getenv("TWEETER_API_KEY")
TWEETER_API_URL=os.getenv("TWEETER_API_URL")
