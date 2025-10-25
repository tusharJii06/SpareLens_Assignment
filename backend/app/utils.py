# app/utils.py
import pandas as pd
import os
import zipfile 
import io 
from typing import Tuple, Dict, List
from fastapi import HTTPException

def save_uploaded_file(file, dest_path: str):
    os.makedirs(os.path.dirname(dest_path), exist_ok=True)
    with open(dest_path, "wb") as buffer:
        buffer.write(file.file.read())

def parse_csv_or_excel(path: str, original_filename: str):
    # This function will hold the file to be read
    file_to_parse = path

    try:
        if original_filename.lower().endswith(".zip"):
            with zipfile.ZipFile(path, 'r') as zf:
                # Find the first csv or excel file in the zip
                for name in zf.namelist():
                    if name.lower().endswith((".csv", ".xls", ".xlsx")) and not name.startswith("__MACOSX"):
                        # Read the file into memory from the zip
                        file_data = zf.read(name)
                        file_to_parse = io.BytesIO(file_data)

                        original_filename = name 
                        break
                else:
                    raise ValueError("No CSV or Excel file found in the ZIP archive.")

        if original_filename.lower().endswith(".csv"):
            df = pd.read_csv(file_to_parse)
        else:
            df = pd.read_excel(file_to_parse)

    except Exception as e:
        # Handle parse errors gracefully
        # You might want to delete the invalid uploaded file
        os.remove(path)
        raise HTTPException(status_code=400, detail=f"Error parsing file: {e}")

    schema = {col: str(dtype) for col, dtype in zip(df.columns, df.dtypes)}
    rows = df.fillna("").to_dict(orient="records")

    return schema, rows

def filter_rows(rows, text_filters, num_filters):
    if not text_filters and not num_filters:
        return rows

    filtered = []
    
    for row in rows:
        match = True
        
        for col, value in text_filters.items():
            if value.lower() not in str(row.get(col, "")).lower():
                match = False
                break
        
        if not match:
            continue
            
        # 2. Apply NUMERICAL Filters
        for col, (operator, value_str) in num_filters.items():
            try:
                row_value = float(row.get(col, 0))
                filter_value = float(value_str)
                
                if operator == ">" and row_value <= filter_value:
                    match = False
                    break
                elif operator == "<" and row_value >= filter_value:
                    match = False
                    break
                elif operator == ">=" and row_value < filter_value:
                    match = False
                    break
                elif operator == "<=" and row_value > filter_value:
                    match = False
                    break
            except ValueError:
                continue 
            
        if match:
            filtered.append(row)
            
    return filtered
