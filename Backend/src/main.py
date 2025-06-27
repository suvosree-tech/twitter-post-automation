from fastapi import FastAPI
from src.routes.twitter_routs import router as TweeterAPI 
from src.db import create_table
from contextlib import asynccontextmanager
@asynccontextmanager
async def lifespan(app:FastAPI):
    create_table()
    yield 

app=FastAPI(
    title="Tweeter Automation",
    description="An API that generates, stores",
    version="1.0.0",
    lifespan=lifespan
)
app.include_router(TweeterAPI)


