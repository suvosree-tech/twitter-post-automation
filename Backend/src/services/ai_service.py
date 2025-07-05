import uuid
import requests
import os
import traceback
from groq import Groq
from src.config import GROQ_API_KEY,HUGGINGFACE_TOKEN


UPLOAD_FOLDER="upload"
os.makedirs(UPLOAD_FOLDER,exist_ok=True)
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

def generate_image(topic:str):
    try:
        prompt=f"Create a high quality image based on the topic:{topic}. the image sould be visually appealing and relevent to the topic . use vibrant colors and clear details"
        headers={"Authorization":f"Bearer {HUGGINGFACE_TOKEN}"}
        payload={"inputs":prompt}
        
        response = requests.post(
            "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-dev",
            headers=headers,
            json=payload
        )

        if response.status_code == 200:
            image_id = uuid.uuid4()
            image_path = f"{UPLOAD_FOLDER}/image_{image_id}.png"
            with open(image_path, "wb") as f:
                f.write(response.content)
            print(f"Image saved to {image_path}")
            return image_path
        else:
            return None
    except:
        traceback.print_exc()