# app/crud.py
from sqlalchemy.orm import Session
from . import models, auth
from typing import Optional

def get_user_by_username(db: Session, username: str):
    return db.query(models.User).filter(models.User.username == username).first()

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def create_user(db: Session, username: str, email: str, password: str):
    hashed = auth.hash_password(password)
    user = models.User(username=username, email=email, password_hash=hashed) 
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

def create_dataset(db: Session, user_id: int, name: str, schema: dict, raw_path: str):
    ds = models.Dataset(user_id=user_id, name=name, schema=schema, raw_path=raw_path)
    db.add(ds)
    db.commit()
    db.refresh(ds)
    return ds

def get_datasets_for_user(db: Session, user_id: int):
    return db.query(models.Dataset).filter(models.Dataset.user_id == user_id).all()

def get_dataset(db: Session, dataset_id: int):
    return db.query(models.Dataset).filter(models.Dataset.id == dataset_id).first()
