# create_db.py
from app.db import engine, Base
from app import models
print("Creating database tables...")
models.Base.metadata.create_all(bind=engine)
print("Done.")
