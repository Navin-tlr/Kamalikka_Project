# Blockchain Credential Verification POC

## Overview
This project is a Proof of Concept (POC) for a blockchain-based academic credential verification system. It allows universities to issue tamper-proof digital certificates on an Ethereum testnet, students to hold and share them, and employers to verify them instantly using a QR code or hash.

## Architecture
- **Smart Contract (Solidity)**: Stores certificate hashes and metadata on the Ethereum blockchain. Ensures immutability and transparency.
- **Frontend (React + Vite)**: A user-friendly interface for:
  - **Universities**: To issue certificates.
  - **Students**: To view their digital wallet of credentials.
  - **Verifiers**: To instantly check the validity of a credential.
- **Integration**: Uses `ethers.js` to communicate with the smart contract.

## Features
- **Issue Certificate**: Universities can issue certificates with student details.
- **Instant Verification**: Employers can verify certificates in seconds using a hash or QR code.
- **Tamper-Proof**: Once issued, the certificate data cannot be altered without invalidating the hash.
- **Revocation**: Universities can revoke certificates if needed.
- **Simulation Mode**: Works without a blockchain connection for demonstration purposes.

## Prerequisites
- Node.js (v18 or later)
- MetaMask Browser Extension (for real blockchain interaction)

## Setup Instructions

### 1. Clone and Install Dependencies
```bash
cd credential-verifier
npm install
cd frontend
npm install
```

### 2. Smart Contract Deployment (Local Hardhat Network)
*Note: If you encounter issues with Hardhat, the frontend is configured to run in Simulation Mode by default.*

1. Start the local Hardhat node:
   ```bash
   npx hardhat node
   ```
2. In a new terminal, deploy the contract:
   ```bash
   npx hardhat run scripts/deploy.js --network localhost
   ```
   This will generate a `contract-config.json` in `frontend/src/` with the deployed address.

### 3. Run the Frontend
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
3. Open your browser at `http://localhost:5173`.

## How to Run the Demo
1. **Connect Wallet**: Click "Connect Wallet". If MetaMask is not installed or the network is unreachable, it will switch to **Simulation Mode**.
2. **University Admin**:
   - Go to the "University Admin" tab.
   - Enter student details (Name, ID, Course, Grade).
   - Click "Issue Certificate".
   - Copy the generated **Tx Hash** or **Certificate Hash**.
3. **Student Wallet**:
   - Go to the "Student Wallet" tab to see examples of issued certificates and their QR codes.
4. **Verifier**:
   - Go to the "Employer / Verifier" tab.
   - Paste the Certificate Hash (or use the "Use Mock Hash" button).
   - Click "Verify".
   - See the result: **VALID** or **INVALID**.

## Social / Economic Impact
- **Trust**: Eliminates credential fraud.
- **Efficiency**: Reduces verification time from days/weeks to seconds.
- **Cost**: Removes administrative costs for manual verification.
- **Empowerment**: Students own their records.

## Tech Stack
- **Blockchain**: Ethereum (Hardhat Local / Sepolia Testnet)
- **Smart Contract**: Solidity
- **Frontend**: React, Tailwind CSS, Ethers.js
