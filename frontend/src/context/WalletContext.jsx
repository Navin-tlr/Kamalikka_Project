import React, { createContext, useState, useEffect, useContext } from 'react';
import { ethers } from 'ethers';
import contractConfig from '../contract-config.json';

const WalletContext = createContext();

export const useWallet = () => useContext(WalletContext);

export const WalletProvider = ({ children }) => {
    const [account, setAccount] = useState(null);
    const [contract, setContract] = useState(null);
    const [isSimulationMode, setIsSimulationMode] = useState(false);
    const [provider, setProvider] = useState(null);

    const connectWallet = async () => {
        if (window.ethereum) {
            try {
                const browserProvider = new ethers.BrowserProvider(window.ethereum);
                const signer = await browserProvider.getSigner();
                const userAccount = await signer.getAddress();
                setAccount(userAccount);
                setProvider(browserProvider);

                const verifierContract = new ethers.Contract(
                    contractConfig.address,
                    contractConfig.abi,
                    signer
                );
                setContract(verifierContract);
                setIsSimulationMode(false);
            } catch (error) {
                console.error("Error connecting wallet:", error);
                alert("Failed to connect wallet. Switching to Simulation Mode.");
                enableSimulationMode();
            }
        } else {
            alert("MetaMask not found. Switching to Simulation Mode.");
            enableSimulationMode();
        }
    };

    const enableSimulationMode = () => {
        setIsSimulationMode(true);
        setAccount("0xSimulationUser123");
        // Mock contract object
        setContract({
            issueCertificate: async (name, id, course, grade) => {
                console.log("Simulating issueCertificate:", name, id, course, grade);
                await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate delay
                const mockHash = ethers.id(name + id + course + Date.now());
                return {
                    wait: async () => ({ status: 1, hash: "0xTxHash..." }),
                    hash: "0xTxHash..." // Return transaction hash
                };
            },
            verifyCertificate: async (hash) => {
                console.log("Simulating verifyCertificate:", hash);
                await new Promise(resolve => setTimeout(resolve, 500));
                // Return mock data based on hash or random
                return [
                    true, // isValid
                    {
                        issuer: "0xUniversityAdmin",
                        studentName: "Alice Doe",
                        studentId: "12345",
                        courseName: "Blockchain 101",
                        grade: "A",
                        issueDate: BigInt(Math.floor(Date.now() / 1000)),
                        isRevoked: false,
                        certHash: hash
                    }
                ];
            },
            revokeCertificate: async (hash) => {
                console.log("Simulating revokeCertificate:", hash);
                await new Promise(resolve => setTimeout(resolve, 1000));
                return { wait: async () => ({ status: 1 }) };
            }
        });
    };

    return (
        <WalletContext.Provider value={{ account, contract, connectWallet, isSimulationMode, enableSimulationMode }}>
            {children}
        </WalletContext.Provider>
    );
};
