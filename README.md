# 🚀 Blockchain Transactions dApp

A modern, visually appealing decentralized application (dApp) for sending Ethereum transactions, mining blocks, and viewing transaction history. Built with **React**, **Ethers.js**, and **MetaMask** integration.

---

## ✨ Features

- **Connect MetaMask**: Securely connect your Ethereum wallet.
- **Send Transactions**: Transfer ETH to any address on the network.
- **Mine Blocks**: Instantly mine new blocks (for local testnets).
- **View Balance**: See your current ETH balance.
- **Transaction History**: Browse your recent transactions.
- **Dark/Light Mode**: Toggle between beautiful themes.
- **Confirmation Modals**: Extra safety for large transfers and mining.

---

## 🖼️ Preview

![App Screenshot](public/logo192.png)

---

## ⚡ Quick Start

1. **Install dependencies**
   ```bash
   npm install
   ```
2. **Start the app**
   ```bash
   npm start
   ```
3. **Open in browser**
   [http://localhost:3000](http://localhost:3000)

---

## 🦊 MetaMask Setup
- Install [MetaMask](https://metamask.io/) browser extension.
- Connect to your local Hardhat or Ganache network.
- Import an account with test ETH.

---

## 🛠️ Smart Contract Integration

- **Contract Address:** `0x006449DdBF47FD3a5cF7D7143B2297F0Ab7f2b2e`
- **ABI:** See [`src/TransactionsABI.json`](src/TransactionsABI.json)

### Main Functions
- `submitTransaction(address receiver, uint256 amount)` — Send ETH to another address.
- `mineBlock()` — Mine a new block (for local testnets).
- `getAllTransactions()` — View all submitted transactions.

---

## 🧩 Project Structure

```
client/
  src/
    App.js           # Main React app
    blockchain.js    # Ethers.js contract logic
    TransactionsABI.json # Smart contract ABI
    ...
  public/
    ...
```

---

## 📦 Dependencies
- [React](https://reactjs.org/)
- [Ethers.js](https://docs.ethers.org/)
- [MetaMask](https://metamask.io/)
- [Tailwind CSS](https://tailwindcss.com/) (optional, for styling)

---

## 📝 Usage

- **Connect Wallet**: Click the connect button to link MetaMask.
- **Send ETH**: Enter receiver address and amount, then submit.
- **Mine Block**: Click 'Mine Block' to add a new block (local only).
- **Toggle Theme**: Use the sun/moon icon for dark/light mode.
- **View History**: See your recent transactions and balances.

---

## 🛡️ Safety
- Confirmation modals for large transfers and mining.
- Error handling for failed transactions and wallet issues.

---

## 🤝 Contributing
Pull requests welcome! For major changes, open an issue first to discuss what you would like to change.

---

## 📄 License
[MIT](../LICENSE)

---

> Made with ❤️ for blockchain learning and experimentation.
