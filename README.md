
-----

# Data Dashboard Platform: Technical Overview

This project delivers a full-stack web application designed for secure dataset management, visualization, and dynamic filtering. It leverages a modern, decoupled architecture using **FastAPI** for the API and **React** for the client interface.

## ✨ Key Features

  * **Secure Authentication:** Implements robust user management via FastAPI, utilizing JWT for stateless session handling and bcrypt for secure password hashing.
  * **Dataset Ingestion:** Supports upload and parsing of common data formats, including **CSV, Excel (.xls, .xlsx), and ZIP** archives containing a single data file.
  * **Dynamic Data Presentation:** Features the **MUI DataGrid** for efficient, paginated, and interactive display of large datasets, with responsive height adjustment based on current filter results.
  * **Advanced Query Filtering:** Provides a powerful, custom-syntax filtering mechanism supporting both **exact text matching** and **numerical comparison operators** (`<`, `>`, `<=`, `>=`).
  * **Data Visualization:** Integrates `recharts` to generate foundational visualizations (Pie and Bar charts) from selected dataset columns.

-----

## ⚙️ Technology Stack

| Component | Technology | Role |
| :--- | :--- | :--- |
| **Backend (API)** | **FastAPI** | High-performance, asynchronous web framework (Python). |
| | **SQLAlchemy** | Python ORM for database interaction (defaulting to SQLite/PostgreSQL). |
| | **`pandas`** | Data ingestion, cleaning, and manipulation for CSV/Excel parsing. |
| | **`python-jose`, `passlib[bcrypt]`**| JWT token management and secure hashing utilities. |
| **Frontend (Client)** | **React.js** | Declarative JavaScript library for UI development. |
| | **Vite** | Modern, fast, and light-weight frontend build tool. |
| | **Material-UI (MUI)** | Professional, accessible component library. |
| | **`@mui/x-data-grid`**| High-performance data table component. |
| | **`recharts`** | Composable charting library for React. |

-----

## 🚀 Getting Started

To set up and run the application locally, follow these two concurrent setup processes for the backend and frontend environments.

### Prerequisites

Ensure you have **Python 3.8+** and **Node.js (LTS)** installed on your system.

### 1\. Backend Setup (`/backend`)

The backend manages authentication, database access, and data processing.

```bash
# 1. Navigate to the backend directory
cd backend

# 2. Set up and activate a Python virtual environment
python -m venv .venv
source .venv/bin/activate  # Use .\ .venv\Scripts\activate on Windows

# 3. Install all required Python dependencies
pip install -r requirements.txt 

# 4. Initialize the database schema
python create_db.py

# 5. Start the API server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The FastAPI instance will be accessible at `http://localhost:8000`.

### 2\. Frontend Setup (`/frontend`)

The frontend provides the user interface and interacts with the API.

```bash
# 1. Navigate to the frontend directory
cd frontend

# 2. Install Node dependencies
npm install

# 3. Start the development server
npm run dev
```

The React application will be available at `http://localhost:5173`.

-----

## 💡 Filtering Guide

The dashboard includes a powerful, custom filtering feature for dynamically querying the displayed dataset rows. The syntax combines column names, values, and optional comparison operators, separated by a semicolon (`;`).

**Syntax Structure:** `ColumnName:Value;Column2:OperatorValue`

### Supported Filter Examples

| Filter Type | Example Filter String | Description |
| :--- | :--- | :--- |
| **Text Matching** | `Country:UK` | Filters for rows where the `Country` column contains "UK" (case-insensitive). |
| **Greater Than** | `Sales:>50000` | Filters for numerical values in `Sales` strictly greater than 50,000. |
| **Less Than or Equal** | `Profit:<=2000` | Filters for numerical values in `Profit` less than or equal to 2,000. |
| **Compound Query** | `Country:USA;Year:2022` | Applies an **AND** condition: matches rows where both the `Country` is "USA" and the `Year` is "2022". |

Apply filters by entering the string and clicking the **Apply** button next to the input field.
