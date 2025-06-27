from sqlmodel import create_engine,Session,SQLModel
from typing import Annotated
from fastapi import Depends
from src.config import DATABASE
engine=create_engine(DATABASE)
def create_table():
    SQLModel.metadata.create_all(bind=engine)
def getdb():
    with Session(engine) as session:
        yield session
SessionDep=Annotated[Session,Depends(getdb)] 