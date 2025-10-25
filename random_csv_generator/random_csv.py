# random_csv_generator/random_csv.py
import csv
import random

# --- Configuration ---
FILE_NAME = 'random_sales_data.csv'
COUNTRIES = ['India', 'USA', 'UK', 'Germany', 'Canada', 'Australia']
YEARS = [2021, 2022, 2023]
PRODUCTS = ['Laptop', 'Phone', 'Tablet', 'Monitor', 'Keyboard']

# --- Helper function for random data generation ---
def generate_random_entry():
    """Generates a single row of random sales data."""
    country = random.choice(COUNTRIES)
    year = random.choice(YEARS)
    product = random.choice(PRODUCTS)

    # Generate Sales and Profit based on the product category
    if product == 'Laptop':
        # High value, moderate profit margin
        base_sales = random.randint(45000, 65000)
        base_profit_margin = random.randint(12, 18)
    elif product == 'Phone':
        # Moderate value, good profit margin
        base_sales = random.randint(35000, 48000)
        base_profit_margin = random.randint(15, 22)
    elif product == 'Tablet':
        # Medium value, lower profit margin
        base_sales = random.randint(25000, 38000)
        base_profit_margin = random.randint(10, 15)
    else: # Monitor, Keyboard, etc. (Lower value items)
        # Low value, higher profit margin percentage
        base_sales = random.randint(5000, 15000)
        base_profit_margin = random.randint(20, 30)

    # Add some small randomness to sales
    sales = base_sales + random.randint(-2000, 2000)

    # Calculate profit
    profit = int(sales * (base_profit_margin / 100))

    return [country, year, product, sales, profit]

# --- Main script to write the CSV file ---
def create_csv_file():
    """Prompts the user for row count and writes the random data to a CSV file."""
    
    # 1. Get the desired number of rows from the user
    num_rows = -1
    while num_rows <= 0:
        try:
            input_str = input(f"How many data entries (rows) do you want in '{FILE_NAME}'? ")
            num_rows = int(input_str)
            if num_rows <= 0:
                print("Please enter a positive number of rows.")
        except ValueError:
            print("Invalid input. Please enter a whole number.")
            
    # 2. Generate Data
    header = ['Country', 'Year', 'Product', 'Sales', 'Profit']

    print(f"\nGenerating {num_rows} rows of data...")
    data = [generate_random_entry() for _ in range(num_rows)]

    # 3. Write to CSV
    try:
        with open(FILE_NAME, 'w', newline='') as file:
            writer = csv.writer(file)
            writer.writerow(header)
            writer.writerows(data)

        print(f"\n Success! The file '{FILE_NAME}' was created with {num_rows} entries.")

    except Exception as e:
        print(f"\n An error occurred while writing the file: {e}")

if __name__ == "__main__":
    create_csv_file()
