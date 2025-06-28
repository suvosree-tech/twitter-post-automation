from fastapi import FastAPI
from src.routes.twitter_routs import router as TweeterAPI 
from src.db import create_table
from contextlib import asynccontextmanager
from fastapi.middleware.cors import CORSMiddleware


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
app.middleware(
    CORSMiddleware,
    allow_origins=[
        "*"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(TweeterAPI)


