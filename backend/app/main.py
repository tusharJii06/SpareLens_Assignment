# app/main.py
from fastapi import FastAPI, UploadFile, File, Depends, HTTPException, status, Form
from . import crud, models, schemas, auth, utils
from .db import engine
from .deps import get_db, get_current_user
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv

load_dotenv()

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Dashboard Backend")

# Allow React dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/auth/me")
def read_users_me(current_user: models.User = Depends(get_current_user)):
    return {"username": current_user.username, "email": current_user.email}


@app.post("/auth/signup", response_model=schemas.Token)
def signup(user: schemas.UserCreate, db: Session = Depends(get_db)):
    if crud.get_user_by_username(db, user.username) or crud.get_user_by_email(db, user.email):
        raise HTTPException(status_code=400, detail="Username or email already registered")
    db_user = crud.create_user(db, user.username, user.email, user.password)
    token = auth.create_access_token({"sub": db_user.username})
    return {"access_token": token, "token_type": "bearer"}

from fastapi.security import OAuth2PasswordRequestForm

@app.post("/auth/login", response_model=schemas.Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = crud.get_user_by_username(db, form_data.username)
    
    # --- START DEBUG LOGGING ---
    print(f"\n--- DEBUG LOGIN START ---")
    print(f"Login attempt for: {form_data.username}")
    print(f"User Found: {user is not None}")
    if user:
        print(f"DB Password Hash: {user.password_hash}")
    print(f"--- DEBUG LOGIN END ---\n")
    # --- END DEBUG LOGGING ---
    
    if not user or not auth.verify_password(form_data.password, user.password_hash):
        raise HTTPException(status_code=400, detail="Incorrect username or password")
    
    token = auth.create_access_token({"sub": user.username})
    return {"access_token": token, "token_type": "bearer"}
@app.post("/upload", response_model=schemas.DatasetOut)
def upload_file(
    file: UploadFile = File(...), 
    name: str = Form(...), 
    current_user: models.User = Depends(get_current_user), 
    db: Session = Depends(get_db)
):
    # Add .zip to your check
    allowed_extensions = (".csv", ".xls", ".xlsx", ".zip")
    if not file.filename.lower().endswith(allowed_extensions):
        raise HTTPException(status_code=400, detail="Only CSV, Excel, or ZIP files allowed")

    dest = f"app/uploads/{current_user.id}_{file.filename}"
    utils.save_uploaded_file(file, dest)

    schema, rows = utils.parse_csv_or_excel(dest, file.filename) 

    ds = crud.create_dataset(db, current_user.id, name, schema, dest)
    return ds

@app.get("/datasets")
def list_datasets(current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    datasets = crud.get_datasets_for_user(db, current_user.id)
    return datasets

@app.get("/datasets/{dataset_id}/rows")
def get_dataset_rows(dataset_id: int, q: str = None, page: int = 1, per_page: int = 25, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    ds = crud.get_dataset(db, dataset_id)
    if not ds or ds.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Dataset not found")
    filename = os.path.basename(ds.raw_path)
    sschema, rows = utils.parse_csv_or_excel(ds.raw_path, filename)
    # naive query parser: q like "col:value;col2:value2"
    filters = {}
    num_filters = {}   # For numerical comparisons (Sales:>50000)
    
    if q:
        parts = q.split(";")
        for p in parts:
            if ":" in p:
                k, v = p.split(":", 1)
                
                operator = "="
                val = v
                
                if v.startswith(">="):
                    operator = ">="
                    val = v[2:]
                elif v.startswith("<="):
                    operator = "<="
                    val = v[2:]
                elif v.startswith(">"):
                    operator = ">"
                    val = v[1:]
                elif v.startswith("<"):
                    operator = "<"
                    val = v[1:]

                if operator == "=":
                    filters[k] = val
                else:
                    # Store as a tuple: (operator, value)
                    num_filters[k] = (operator, val)

    from math import ceil
    filtered = utils.filter_rows(rows, filters, num_filters) 
    total = len(filtered)
    start = (page - 1) * per_page
    end = start + per_page
    return {"total": total, "page": page, "per_page": per_page, "rows": filtered[start:end]}

@app.get("/datasets/{dataset_id}/aggregate")
def aggregate_for_chart(dataset_id: int, column: str, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    ds = crud.get_dataset(db, dataset_id)
    if not ds or ds.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Dataset not found")
    import pandas as pd
    filename = os.path.basename(ds.raw_path)
    schema, rows = utils.parse_csv_or_excel(ds.raw_path, filename)
    df = pd.DataFrame(rows)
    if column not in df.columns:
        raise HTTPException(status_code=400, detail="Column not found")
    result = df[column].fillna("N/A").astype(str).value_counts().reset_index().rename(columns={"index": "key", column: "value"})
    return {"data": result.to_dict(orient="records")}
