import os
import traceback

from groq import Groq
from src.config import GROQ_API_KEY
client = Groq(
    api_key=GROQ_API_KEY
)

def generate(topic):
    try:
        chat_completion = client.chat.completions.create(
            messages=[
                {
                    "role":"system",
                    "content":"you are a helpful assistant that writes short ,engaging,and informative tweets,"
                },
                {
                    "role":"user",
                    "content":f"Write a twitter post with tags and under 400 words about{topic}"
                }
            ],
            model="llama-3.3-70b-versatile",
        )
        return chat_completion.choices[0].message.content
    except:
        traceback.print_exc()
        return None
    # topic=input("enter your topic")
    # print(generate({topic}))