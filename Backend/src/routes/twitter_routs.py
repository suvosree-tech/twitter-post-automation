from pathlib import Path
import traceback
from fastapi import APIRouter, HTTPException,Query
from fastapi.responses import FileResponse
from src.model.model import Input 
from src.services.twitter_service import generatetweet,get_allpost,update_tweet,posttweet,get_generate_image,get_singletweet
from src.db import getdb
from fastapi import Depends
from sqlmodel import Session
from src.model.model import Responce_Tweet,Pagable_responce,Tweet_update



router=APIRouter(prefix="/tweet",tags=["tweets"])
@router.post("/generate-tweet",response_model=Responce_Tweet)
def generate(data:Input,db:Session=Depends(getdb)):
    return generatetweet(data.topic,db)
@router.get("/tweets",response_model=Pagable_responce)
def getallpost(
    posted:bool | None=Query(None),
    search:str | None=Query(None),
    limit:int=Query(10,ge=1),
    offset:int=Query(0,ge=0),
    session:Session=Depends(getdb)
):
    return get_allpost(session,posted,search,limit,offset)
@router.put("/update/{id}")
def updatetweet(id:int,tweet:Tweet_update,session:Session=Depends(getdb)):
    result=update_tweet(id,tweet.topic,tweet.content,session)
    return {
        "message":"tweet updated successfully",
        "tweet":result
    }
@router.post("/post-tweet/{id}")
def tweetpost(id:int,session:Session=Depends(getdb)):
    return posttweet(id,session)
@router.get("/imagegenerate/{twitterid}")
def get_generateimage(twitterid:int,session:Session=Depends(getdb)):
    return get_generate_image(twitterid,db=session)
@router.get("/image/{twitterid}")
def get_image(twitterid:int,session:Session=Depends(getdb)):
    try:
        tweet=get_singletweet(tweeterid=twitterid,db=session)
        if not tweet or not tweet.image_path:
            raise HTTPException (status_code=404,detail="image path is not found ")
        image_path=Path(tweet.image_path)
        if not image_path.exists():
            raise HTTPException (status_code=404,detail="image path is not found ")
        return FileResponse(image_path,media_type="image/png",filename=image_path.name)
    except:
        traceback.print_exc()