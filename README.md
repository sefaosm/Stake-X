# 🌟 StakeX - MultiversX Staking DApp

A decentralized staking application built on MultiversX blockchain, allowing users to stake EGLD tokens and earn rewards.

## 🚀 Features

- **💳 Wallet Integration**: Seamless connection with MultiversX Web Wallet
- **📊 Real-time Dashboard**: View staking positions and rewards
- **🔒 Secure Staking**: Direct interaction with smart contract
- **💰 Rewards System**: Dynamic APY-based reward calculation
- **⚡ Instant Updates**: Real-time balance and rewards tracking

## 🛠 Technology Stack

### Frontend
- React.js
- MultiversX SDK
- TypeScript
- CSS3

### Smart Contract
- Rust
- MultiversX SC Framework
- WebAssembly

## 🏗 Project Structure

staking-project/
├── staking-frontend/ # React frontend application
│ ├── src/
│ │ ├── pages/ # React components
│ │ └── index.css # Styling
│ └── public/ # Static assets
└── staking-contract/ # Rust smart contract
├── src/
│ └── lib.rs # Contract implementation
└── wasm/ # Compiled contract

## 🚦 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- Rust (latest stable)
- MultiversX SDK
- MultiversX wallet

### Installation

1. Clone the repository
```
# bash
git clone https://github.com/sefaosm/Stake-X
cd staking-project
```
2. Install frontend dependencies
```
# bash
cd staking-frontend
npm install
```
3. Set up environment variables
```
# bash
cp .env.example .env
```
4. Start the development server
```
# bash
npm run dev
```
### Smart Contract Deployment

1. Build the contract
```
# bash
cd staking-contract
cargo build
```
2. Deploy to testnet
```
# bash
cargo run deploy
```
## 🎯 Usage

1. Connect your MultiversX wallet
2. Enter the amount you want to stake
3. Approve the transaction
4. Monitor your staking position and rewards
5. Unstake or claim rewards when desired

## 🔐 Security

- Smart contract audited for security vulnerabilities
- Secure wallet integration
- Protected transaction handling

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- MultiversX Team
- MultiversX Community
- [Your Name/Team]

## 📞 Contact

Email: sfsmnl@gmail.com
linkedin: linkedin.com/in/sefaosm

---
Built with ❤️ on MultiversX
