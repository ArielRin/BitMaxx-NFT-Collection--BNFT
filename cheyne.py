import requests
import csv

# Fetch token transaction data (this is highly simplified)
def fetch_transactions(token_address):
    # Replace with actual API call
    return requests.get("https://api.example.com/transactions?token=" + token_address).json()

# Aggregate balances
def aggregate_balances(transactions):
    balances = {}
    for tx in transactions:
        # Simplified; actual logic depends on transaction structure
        sender, receiver, amount = tx['sender'], tx['receiver'], tx['amount']
        balances[sender] = balances.get(sender, 0) - amount
        balances[receiver] = balances.get(receiver, 0) + amount
    return balances

# Calculate percentages
def calculate_percentages(balances, total_supply):
    return {address: (balance / total_supply) * 100 for address, balance in balances.items()}

# Write to CSV
def write_to_csv(data, filename):
    with open(filename, mode='w', newline='') as file:
        writer = csv.writer(file)
        writer.writerow(['Address', 'Balance', 'Percentage'])
        for address, info in data.items():
            writer.writerow([address, info['balance'], info['percentage']])

# Main process
token_address = "0xYourTokenAddress"
total_supply = 1000000  # Replace with actual total supply

transactions = fetch_transactions(token_address)
balances = aggregate_balances(transactions)
percentages = calculate_percentages(balances, total_supply)

# Combine balances and percentages
data = {address: {'balance': balance, 'percentage': percentages[address]} for address, balance in balances.items()}

write_to_csv(data, 'token_holders.csv')
