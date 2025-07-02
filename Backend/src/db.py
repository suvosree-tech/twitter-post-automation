import traceback
from sqlmodel import create_engine,Session,SQLModel
from typing import Annotated
from fastapi import Depends
from src.config import DATABASE
engine=create_engine(DATABASE)
def create_table():
    try:
        SQLModel.metadata.create_all(bind=engine)
    except:
        traceback.print_exc()
        raise HTTPException(status_code=500,detail="Something problemetic , try after some times")

def getdb():
    try:
        with Session(engine) as session:
            yield session
    except:
        traceback.print_exc()
        raise HTTPException(status_code=500,detail="Something problemetic , try after some times")


