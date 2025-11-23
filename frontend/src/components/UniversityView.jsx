import React, { useState } from 'react';
import { useWallet } from '../context/WalletContext';
import { QRCodeSVG } from 'qrcode.react';

const UniversityView = () => {
    const { contract, account, isSimulationMode } = useWallet();
    const [formData, setFormData] = useState({
        studentName: '',
        studentId: '',
        courseName: '',
        grade: ''
    });
    const [status, setStatus] = useState('');
    const [issuedCert, setIssuedCert] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!contract) return alert("Please connect wallet first");

        setStatus('Issuing certificate...');
        try {
            // In simulation mode, the mock contract returns an object with a hash property directly or via wait()
            // In real mode, tx.wait() returns the receipt.
            // Let's handle both.

            const tx = await contract.issueCertificate(
                formData.studentName,
                formData.studentId,
                formData.courseName,
                formData.grade
            );

            console.log("Transaction sent:", tx);

            let receipt;
            if (tx.wait) {
                receipt = await tx.wait();
            } else {
                receipt = tx; // Mock might return the result directly
            }

            console.log("Transaction receipt:", receipt);

            // Calculate hash (mock or real)
            // In real contract, we'd get it from the event.
            // For simplicity in this POC, we'll just display the transaction hash or a mock cert hash.
            // If simulation, we generated a mock hash.

            // If real, we need to parse logs to get the certHash.
            // For now, let's just show the transaction hash and a "computed" cert hash for display.

            const certHash = isSimulationMode ? "0xMockCertHash" + Date.now() : "Check Tx Logs for Hash";

            setIssuedCert({
                ...formData,
                certHash: certHash,
                txHash: receipt.hash || "0x..."
            });
            setStatus('Certificate Issued Successfully!');
        } catch (error) {
            console.error(error);
            setStatus('Error issuing certificate: ' + error.message);
        }
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4 text-blue-600">University Admin Portal</h2>
            <div className="mb-4">
                <p className="text-sm text-gray-600">Issuer Address: {account || "Not Connected"}</p>
                {isSimulationMode && <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">Simulation Mode</span>}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Student Name</label>
                    <input
                        type="text"
                        name="studentName"
                        value={formData.studentName}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Student ID</label>
                    <input
                        type="text"
                        name="studentId"
                        value={formData.studentId}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Course Name</label>
                    <input
                        type="text"
                        name="courseName"
                        value={formData.courseName}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Grade</label>
                    <input
                        type="text"
                        name="grade"
                        value={formData.grade}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    disabled={!contract}
                >
                    Issue Certificate
                </button>
            </form>

            {status && <p className="mt-4 text-center font-medium">{status}</p>}

            {issuedCert && (
                <div className="mt-8 p-4 border rounded bg-gray-50">
                    <h3 className="text-lg font-bold mb-2">Certificate Generated</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <p><strong>Student:</strong> {issuedCert.studentName}</p>
                            <p><strong>Course:</strong> {issuedCert.courseName}</p>
                            <p><strong>Grade:</strong> {issuedCert.grade}</p>
                            <p className="text-xs break-all"><strong>Tx Hash:</strong> {issuedCert.txHash}</p>
                        </div>
                        <div className="flex flex-col items-center">
                            <QRCodeSVG value={JSON.stringify(issuedCert)} size={128} />
                            <p className="text-xs mt-2 text-gray-500">Scan to Verify</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UniversityView;
