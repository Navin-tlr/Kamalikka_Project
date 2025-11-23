import React, { useState } from 'react';
import { WalletProvider, useWallet } from './context/WalletContext';
import UniversityView from './components/UniversityView';
import StudentView from './components/StudentView';
import VerifierView from './components/VerifierView';

const MainContent = () => {
  const { connectWallet, account, isSimulationMode } = useWallet();
  const [activeTab, setActiveTab] = useState('university');

  return (
    <div className="min-h-screen bg-gray-100 font-sans text-gray-900">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">
            🎓 BlockCert <span className="text-blue-600 text-lg font-normal">Credential Verification POC</span>
          </h1>
          <div>
            {!account ? (
              <button
                onClick={connectWallet}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
              >
                Connect Wallet
              </button>
            ) : (
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">Connected: {account.substring(0, 6)}...{account.substring(account.length - 4)}</p>
                {isSimulationMode && <p className="text-xs text-yellow-600 font-bold">SIMULATION MODE</p>}
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('university')}
              className={`${activeTab === 'university'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              University Admin
            </button>
            <button
              onClick={() => setActiveTab('student')}
              className={`${activeTab === 'student'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Student Wallet
            </button>
            <button
              onClick={() => setActiveTab('verifier')}
              className={`${activeTab === 'verifier'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Employer / Verifier
            </button>
          </nav>
        </div>

        <div className="mt-6">
          {activeTab === 'university' && <UniversityView />}
          {activeTab === 'student' && <StudentView />}
          {activeTab === 'verifier' && <VerifierView />}
        </div>
      </main>
    </div>
  );
};

function App() {
  return (
    <WalletProvider>
      <MainContent />
    </WalletProvider>
  );
}

export default App;
