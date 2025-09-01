# Credit Management System for Grocery Shops

A comprehensive credit management system designed specifically for grocery shop owners to track customer credits, payments, and outstanding balances.

## Overview

This application allows grocery shop owners to:
- Create and manage customer credit accounts
- Track borrowed items and credit limits
- Record payments and update balances
- Monitor outstanding debts through an intuitive interface

## Technology Stack

- **TypeScript (80.8%)**: Primary language for type-safe development
- **JavaScript (18.6%)**: Supporting scripts and compatibility layers
- **Other (0.6%)**: Configuration files and assets

## Features

### Customer Management
- Create customer profiles with unique identifiers
- Store contact information and credit limits
- Track individual borrowing history

### Credit Tracking
- Record items borrowed on credit
- Set credit limits per customer
- Track repayment due dates

### Payment Processing
- Record partial and full payments
- Automatically update balance amounts
- Maintain payment history

### Reporting & Analytics
- View current outstanding balances
- Generate customer credit statements
- Monitor overall shop credit health

## Installation

1. Clone the repository
2. Install dependencies: `npm install`
3. Build the project: `npm run build`
4. Start the application: `npm start`

## Usage

### Adding a New Customer
1. Navigate to the Customers section
2. Click "Add New Customer"
3. Fill in customer details and set credit limit
4. Save to generate a unique customer ID

### Recording Credit Transactions
1. Select a customer from the list
2. Click "Add Credit Transaction"
3. Enter items borrowed and their values
4. The system will automatically update the balance

### Processing Payments
1. Select a customer with outstanding balance
2. Click "Record Payment"
3. Enter payment amount and method
4. The system will update the balance and transaction history

### Viewing Reports
1. Access the Dashboard for summary statistics
2. Use the Reports section for detailed analysis
3. Filter by date range or specific customers

## Development

### Project Structure
```
src/
├── components/     # UI components
├── services/       # Business logic and API calls
├── types/          # TypeScript type definitions
├── utils/          # Helper functions
└── assets/         # Static files
```

### Building from Source
```bash
# Install dependencies
npm install

# Build for production
npm run build

# Development mode with hot reload
npm run dev
```

## Support

For technical support or questions about implementation, please contact the development team or create an issue in the repository.

## License

This project is proprietary software developed for grocery shop credit management. All rights reserved.
