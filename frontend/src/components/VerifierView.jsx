import React, { useState } from 'react';
import { useWallet } from '../context/WalletContext';

const VerifierView = () => {
    const { contract, isSimulationMode } = useWallet();
    const [certHash, setCertHash] = useState('');
    const [verificationResult, setVerificationResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleVerify = async () => {
        if (!contract) return alert("Please connect wallet (or use simulation mode)");
        if (!certHash) return alert("Please enter a certificate hash");

        setLoading(true);
        setVerificationResult(null);

        try {
            // Call smart contract
            const result = await contract.verifyCertificate(certHash);
            // Result is [isValid, metadata]
            // Metadata is a struct/tuple

            const isValid = result[0];
            const metadata = result[1];

            setVerificationResult({
                isValid: isValid,
                studentName: metadata.studentName,
                courseName: metadata.courseName,
                issuer: metadata.issuer,
                isRevoked: metadata.isRevoked,
                issueDate: metadata.issueDate.toString()
            });
        } catch (error) {
            console.error(error);
            alert("Verification failed: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4 text-purple-600">Employer / Verifier Portal</h2>
            <p className="mb-4 text-gray-600">Instant Credential Verification</p>

            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Certificate Hash / ID</label>
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={certHash}
                        onChange={(e) => setCertHash(e.target.value)}
                        placeholder="0x..."
                        className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 border p-2"
                    />
                    <button
                        onClick={handleVerify}
                        disabled={loading}
                        className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 disabled:bg-purple-300"
                    >
                        {loading ? 'Verifying...' : 'Verify'}
                    </button>
                </div>
                <div className="mt-2 text-xs text-gray-500">
                    <button onClick={() => setCertHash("0xMockCertHash" + Date.now())} className="underline mr-2">
                        Use Mock Hash
                    </button>
                    (For testing)
                </div>
            </div>

            {verificationResult && (
                <div className={`mt-6 p-4 border rounded-lg ${verificationResult.isValid ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                    <h3 className={`text-lg font-bold mb-2 ${verificationResult.isValid ? 'text-green-700' : 'text-red-700'}`}>
                        {verificationResult.isValid ? '✅ VALID CERTIFICATE' : '❌ INVALID / REVOKED'}
                    </h3>

                    {verificationResult.isValid && (
                        <div className="space-y-2 text-gray-800">
                            <p><strong>Student:</strong> {verificationResult.studentName}</p>
                            <p><strong>Course:</strong> {verificationResult.courseName}</p>
                            <p><strong>Issuer:</strong> {verificationResult.issuer}</p>
                            <p><strong>Date:</strong> {new Date(Number(verificationResult.issueDate) * 1000).toLocaleDateString()}</p>
                        </div>
                    )}

                    {verificationResult.isRevoked && (
                        <p className="text-red-600 font-bold mt-2">⚠️ THIS CERTIFICATE HAS BEEN REVOKED</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default VerifierView;
