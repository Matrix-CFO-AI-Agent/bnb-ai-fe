# Matrix AI - Web3 Financial Analysis Platform

Matrix AI is a comprehensive Web3 financial analysis platform that provides wallet analysis, risk assessment, and tax advice for cryptocurrency users.

## Features

- **Wallet Analysis**: Analyze wallet transactions and generate detailed reports
- **Risk Analysis**: Monitor lending positions and receive risk alerts
- **Tax Advice**: Generate tax reports and IRS 1040 form previews

## Tech Stack

- React + TypeScript
- Vite
- Tailwind CSS
- Ant Design
- Web3React
- Ethers.js
- React Query

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## Project Structure

```
src/
├── components/     # Reusable UI components
├── pages/         # Page components
├── hooks/         # Custom React hooks
├── utils/         # Utility functions
├── services/      # API and blockchain services
├── contexts/      # React contexts
└── types/         # TypeScript type definitions
```

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
VITE_BSCSCAN_API_KEY=your_bscscan_api_key
VITE_AAVE_API_KEY=your_aave_api_key
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
