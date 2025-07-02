import traceback
from src.services.ai_service import generate 
from src.schemas.schema import Tweet
from src.db import getdb
from fastapi import HTTPException
from sqlmodel import select,func
from src.model.model import Responce_Tweet,Pagable_responce,TweetOut
from sqlalchemy import or_
from math import ceil
from src.config import TWEETER_API_KEY,TWEETER_API_URL
import requests 



def generatetweet(topic,db) :
    try:
        tweet=generate(topic)
        if tweet is None:
            raise HTTPException(status_code=500,detail="Something problemetic , try after some times")
        tweet_entry=Tweet(content=tweet, topic=topic)
        db.add(tweet_entry)
        db.commit()
        db.refresh(tweet_entry)
        return Responce_Tweet(id=tweet_entry.id,tweet=tweet)
    except:
        traceback.print_exc()
        raise HTTPException(status_code=500,detail="Something problemetic , try after some times")


        

def get_allpost(db,posted:bool | None=None,search:str |None=None,limit:int=10,offset:int=0):
    try:
        query=select(Tweet)
        count_query=select(func.count()).select_from(Tweet)
        if posted is not None:
            query=query.where(Tweet.posted==posted)
            count_query=count_query.where(Tweet.posted==posted)
        if search is not None:
            search_filter=or_(
                Tweet.topic.ilike(f"%{search}%"),
                Tweet.content.ilike(f"%{search}%")
            )
            query=query.where(search_filter)
            count_query=count_query.where(search_filter)
        total_item=db.exec(count_query).first()
        total_page=ceil(total_item/limit)if limit>0 else 1
        current_page=(offset//limit)+1 if limit>0 else 1
        query=query.order_by(Tweet.id.desc()).offset(offset=offset).limit(limit=limit)
        tweets=db.exec(query).all()
        tweetlist=[TweetOut(id=item.id,content=item.content,topic=item.topic,posted=item.posted) for item in tweets]

        return Pagable_responce(items=tweetlist,
                                total_pages=total_page,
                                total_items=total_item,
                                current_page=current_page,
                                limit=limit
                                )
    except:
        traceback.print_exc()
        raise HTTPException(status_code=500,detail="Something problemetic , try after some times")
        

def update_tweet(id,topic,content,db):
    try:
        tweet=db.exec(select(Tweet).where(Tweet.id==id)).first()
        if not tweet:
            raise HTTPException(status_code=404,detail="tweet is not found")
        if tweet.posted:
            raise HTTPException(status_code=400,detail="tweet already posted and cannot be edited.")
        if topic is not None:
            tweet.topic=topic
        if content is not None:
            tweet.content=content
        db.add(tweet)
        db.commit()
        db.refresh(tweet)
        return tweet
    except:
        traceback.print_exc()
        raise HTTPException(status_code=500,detail="Something problemetic , try after some times")

def posttweet(id,db):
    try:
        tweet=db.get(Tweet,id)
        if not tweet:
            raise HTTPException(status_code=404,detail="tweet not found")
        if tweet.posted:
            raise HTTPException(detail="already posted",status_code=400)
        responce=requests.post(
            TWEETER_API_URL,
            headers={
                "api-key":TWEETER_API_KEY,
                "Content-Type":"application/json"
            },
            json={
                "username":"suvosree",
                "text":tweet.content
            }
        )
        if responce.status_code==200:
            tweet.posted=True
            db.commit()
            return{"status":"posted","tweet":tweet.content}
        else:
            raise HTTPException(status_code=responce.status_code,detail=responce.text)
        
    except:
        traceback.print_exc()
        raise HTTPException(status_code=500,detail="Something problemetic , try after some times")

    