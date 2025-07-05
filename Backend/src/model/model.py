from pydantic import BaseModel
from typing import Optional,Dict,List
class Input(BaseModel):
    topic:str
class TweetContent(BaseModel):
    content:str

class Responce_Tweet(BaseModel):
    id:int
    tweet:str
class TweetOut(BaseModel):
    id: int
    topic: str
    content: str
    posted: bool
    image_path:str | None=None
class Pagable_responce(BaseModel):
    items:List[TweetOut]
    total_items:int 
    total_pages:int
    current_page:int
    limit:int
class Tweet_update(BaseModel):
    topic:str|None=None
    content:str|None=None
    
    