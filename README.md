# Credit Management System for Grocery Shops

A comprehensive credit management system designed specifically for grocery shop owners to track customer credits, payments, and outstanding balances.

## 🚀 Features

- **Customer Management**: Create and manage customer profiles with unique IDs
- **Credit Tracking**: Record items borrowed on credit with timestamps
- **Payment Processing**: Record payments and automatically update balances
- **Balance Monitoring**: View outstanding balances and payment history
- **Search Functionality**: Quickly find customers by ID or name
- **Data Persistence**: All data is securely stored and easily accessible

## 🛠️ Technology Stack

- **TypeScript** (80.8%) - Primary language for type-safe development
- **JavaScript** (18.6%) - Supporting scripts and compatibility
- **Other** (0.6%) - Configuration files and assets

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/credit-management-system.git
cd credit-management-system
```

2. Install dependencies:
```bash
npm install
```

3. Build the project:
```bash
npm run build
```

4. Start the application:
```bash
npm start
```

## 💻 Usage

### Adding a New Customer
1. Navigate to the Customers section
2. Click "Add New Customer"
3. Fill in customer details (name, contact information, initial credit limit)
4. Save to generate a unique customer ID

### Recording Credit Transactions
1. Select a customer from the list or search by ID/name
2. Click "Add Credit Transaction"
3. Enter items borrowed, quantities, and prices
4. The system automatically calculates and updates the balance

### Processing Payments
1. Select a customer with outstanding balance
2. Click "Record Payment"
3. Enter payment amount and method (cash, transfer, etc.)
4. The system updates the balance and transaction history

### Viewing Reports
1. Access the Dashboard for summary statistics
2. View individual customer statements
3. Filter transactions by date range

## 🗂️ Project Structure

```
src/
├── components/     # UI components (CustomerList, PaymentForm, etc.)
├── services/       # Business logic and data management
├── types/          # TypeScript type definitions
├── utils/          # Helper functions and utilities
├── assets/         # Static files (images, styles)
└── index.ts        # Application entry point
```

## 🔧 Development

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Running in Development Mode
```bash
npm run dev
```

### Building for Production
```bash
npm run build
```

### Running Tests
```bash
npm test
```

## 📋 API Reference

The system provides these main functionalities:

- `createCustomer(customerData)`: Add a new customer
- `addCreditTransaction(customerId, items)`: Record borrowed items
- `recordPayment(customerId, amount)`: Process a payment
- `getBalance(customerId)`: Retrieve current balance
- `getTransactionHistory(customerId)`: View all transactions

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you have any questions or issues, please contact us at support@grocerycredit.com or create an issue in the GitHub repository.

## 🙏 Acknowledgments

- Built with TypeScript for robust type checking
- Designed specifically for small grocery business needs
- Simple interface for non-technical users

---

**Note**: This system is designed for local grocery shops to efficiently manage customer credits and improve cash flow management.
