from sqlmodel import SQLModel,Field 
from typing import Optional


class Tweet(SQLModel,table=True):
    id:Optional[int]=Field(default=None,primary_key=True)
    content:str
    topic:str
    posted:bool=False
    image_path:Optional[str]=Field(default=None)