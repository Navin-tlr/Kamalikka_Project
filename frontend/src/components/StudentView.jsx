import React from 'react';
import { QRCodeSVG } from 'qrcode.react';

const StudentView = () => {
    // In a real app, we would query the graph or filter events for the connected student address.
    // For this POC, we'll show mock data.
    const mockCertificates = [
        {
            studentName: "Navin Sivakumar",
            studentId: "NS2025",
            courseName: "Advanced Blockchain Architecture",
            grade: "A+",
            issueDate: "2025-11-20",
            certHash: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef"
        },
        {
            studentName: "Navin Sivakumar",
            studentId: "NS2025",
            courseName: "React for Web3",
            grade: "A",
            issueDate: "2025-10-15",
            certHash: "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890"
        }
    ];

    return (
        <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4 text-green-600">Student Wallet</h2>
            <p className="mb-4 text-gray-600">Your Digital Credentials</p>

            <div className="space-y-6">
                {mockCertificates.map((cert, index) => (
                    <div key={index} className="border rounded-lg p-4 flex flex-col md:flex-row justify-between items-center bg-gray-50">
                        <div className="mb-4 md:mb-0">
                            <h3 className="text-xl font-bold">{cert.courseName}</h3>
                            <p className="text-gray-700">Grade: <span className="font-bold">{cert.grade}</span></p>
                            <p className="text-sm text-gray-500">Issued: {cert.issueDate}</p>
                            <p className="text-xs text-gray-400 break-all mt-1">ID: {cert.certHash}</p>
                        </div>
                        <div className="flex flex-col items-center bg-white p-2 rounded shadow-sm">
                            <QRCodeSVG value={cert.certHash} size={100} />
                            <span className="text-xs mt-1 text-gray-500">Credential QR</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StudentView;
