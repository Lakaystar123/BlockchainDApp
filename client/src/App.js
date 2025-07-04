import React, { useState, useEffect } from 'react';
import detectEthereumProvider from '@metamask/detect-provider';
import { ethers } from 'ethers';
import { getContract } from './blockchain';
import './App.css';

function App() {
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ sender: '', receiver: '', amount: '' });
  const [txStatus, setTxStatus] = useState('');
  const [mineStatus, setMineStatus] = useState('');
  const [showSplash, setShowSplash] = useState(false);
  const [splashMessage, setSplashMessage] = useState('');
  const [balance, setBalance] = useState(null);
  const [txHistory, setTxHistory] = useState([]);
  const [showBalance, setShowBalance] = useState(true);
  const [showTxHistory, setShowTxHistory] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [confirmMessage, setConfirmMessage] = useState('');

  // Fetch balance and transaction history when account or provider changes
  useEffect(() => {
    if (provider && account) {
      // Fetch ETH balance
      provider.getBalance(account).then((bal) => {
        setBalance(ethers.formatEther(bal));
      });
      // Fetch transaction history (Ganache/Hardhat: use provider.getBlock and filter txs)
      (async () => {
        const history = [];
        const latestBlock = await provider.getBlockNumber();
        for (let i = latestBlock; i >= 0 && history.length < 100 && latestBlock - i < 1000; i--) {
          const block = await provider.getBlock(i, true);
          if (block && block.transactions) {
            block.transactions.forEach((tx) => {
              if (tx.from?.toLowerCase() === account.toLowerCase() || tx.to?.toLowerCase() === account.toLowerCase()) {
                history.push({
                  hash: tx.hash,
                  from: tx.from,
                  to: tx.to,
                  value: ethers.formatEther(tx.value),
                  blockNumber: tx.blockNumber
                });
              }
            });
          }
        }
        setTxHistory(history);
      })();
    }
  }, [provider, account]);

  // Theme switcher effect
  useEffect(() => {
    document.body.classList.toggle('dark', darkMode);
  }, [darkMode]);

  // Connect MetaMask
  const connectMetaMask = async () => {
    setError('');
    const ethProvider = await detectEthereumProvider();
    if (ethProvider) {
      try {
        await ethProvider.request({ method: 'eth_requestAccounts' });
        const ethersProvider = new ethers.BrowserProvider(ethProvider);
        const signer = await ethersProvider.getSigner();
        setProvider(ethersProvider);
        setAccount(await signer.getAddress());
      } catch (err) {
        setError('User denied MetaMask connection');
      }
    } else {
      setError('MetaMask not detected. Please install MetaMask.');
    }
  };

  // Handle form input
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Modified handleSubmit and handleMine to use confirmation modal
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Warn for risky action (large amount)
    if (parseFloat(form.amount) > 10) {
      setConfirmMessage('You are about to send more than 10 ETH. Are you sure you want to proceed?');
      setConfirmAction(() => () => doSubmit());
      setShowConfirm(true);
    } else {
      doSubmit();
    }
  };
  const doSubmit = async () => {
    setShowConfirm(false);
    setTxStatus('Submitting transaction...');
    try {
      if (!provider) throw new Error('No provider');
      const signer = await provider.getSigner();
      const contract = getContract(signer);
      const tx = await contract.submitTransaction(form.receiver, ethers.parseEther(form.amount));
      await tx.wait();
      setTxStatus('Transaction submitted!');
      setSplashMessage('Transaction Successful!');
      setShowSplash(true);
      setTimeout(() => setShowSplash(false), 2000);
    } catch (err) {
      setTxStatus('Error: ' + (err.reason || err.message));
      setSplashMessage('Error: ' + (err.reason || err.message));
      setShowSplash(true);
      setTimeout(() => setShowSplash(false), 2000);
    }
  };

  const handleMine = async () => {
    // Warn for risky action (mining block)
    setConfirmMessage('Are you sure you want to mine a new block?');
    setConfirmAction(() => () => doMine());
    setShowConfirm(true);
  };
  const doMine = async () => {
    setShowConfirm(false);
    setMineStatus('Mining block...');
    try {
      if (!provider) throw new Error('No provider');
      const signer = await provider.getSigner();
      const contract = getContract(signer);
      const tx = await contract.mineBlock();
      await tx.wait();
      setMineStatus('Block mined!');
      setSplashMessage('Block Mined Successfully!');
      setShowSplash(true);
      setTimeout(() => setShowSplash(false), 2000);
    } catch (err) {
      setMineStatus('Error: ' + (err.reason || err.message));
      setSplashMessage('Error: ' + (err.reason || err.message));
      setShowSplash(true);
      setTimeout(() => setShowSplash(false), 2000);
    }
  };

  // Eye icon SVG
  const EyeIcon = ({ open }) => open ? (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: 'middle', marginLeft: '0.5rem', cursor: 'pointer' }}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
  ) : (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: 'middle', marginLeft: '0.5rem', cursor: 'pointer' }}><path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a21.81 21.81 0 0 1 5.06-7.94M1 1l22 22"></path><path d="M9.53 9.53A3 3 0 0 0 12 15a3 3 0 0 0 2.47-5.47"></path></svg>
  );

  // Confirmation modal
  const ConfirmationModal = ({ open, message, onConfirm, onCancel }) => open ? (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
      background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000
    }}>
      <div style={{ background: 'white', borderRadius: '1.5rem', padding: '2rem 2.5rem', boxShadow: '0 8px 32px rgba(0,0,0,0.2)', textAlign: 'center', maxWidth: 350 }}>
        <div style={{ color: 'var(--bhutan-orange)', fontWeight: 700, fontSize: '1.2rem', marginBottom: '1rem' }}>{message}</div>
        <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center' }}>
          <button className="bhutan-btn" aria-label="Confirm" onClick={onConfirm}>Confirm</button>
          <button className="bhutan-btn" aria-label="Cancel" style={{ background: 'var(--bhutan-green)' }} onClick={onCancel}>Cancel</button>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      {/* Theme Switcher */}
      <button
        aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        onClick={() => setDarkMode((v) => !v)}
        style={{ position: 'absolute', top: 18, right: 18, background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.5rem', color: 'var(--bhutan-orange)', zIndex: 1100 }}
      >
        {darkMode ? (
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z"></path></svg>
        ) : (
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"></circle><path d="M12 1v2m0 18v2m11-11h-2M3 12H1m16.95 6.95-1.41-1.41M6.34 6.34 4.93 4.93m12.02 0-1.41 1.41M6.34 17.66l-1.41 1.41"/></svg>
        )}
      </button>
      {/* Confirmation Modal */}
      <ConfirmationModal open={showConfirm} message={confirmMessage} onConfirm={() => { confirmAction && confirmAction(); }} onCancel={() => setShowConfirm(false)} />
      {/* Splash Screen */}
      {showSplash && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            borderRadius: '1.5rem',
            padding: '2rem 3rem',
            boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
            textAlign: 'center',
            color: splashMessage.startsWith('Error') ? '#d32f2f' : 'var(--bhutan-green)',
            fontSize: '1.5rem',
            fontWeight: 700
          }}>
            {splashMessage}
          </div>
        </div>
      )}
      {/* Bhutanese Logo Placeholder */}
      <img src="https://th.bing.com/th/id/OIP.y1iNpZJ4B_SeBgVHFmSA2QHaHa?w=177&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3" alt="Bhutan Flag" className="bhutan-logo" style={{ borderRadius: '50%', border: '2px solid var(--bhutan-gold)', objectFit: 'cover', background: 'white' }} />
      <div className="bhutan-card w-full max-w-md">
        <h1 className="bhutan-title">Bhutan Blockchain DApp</h1>
        <div className="bhutan-subtitle">Wallet Connection & Transactions</div>
        {account ? (
          <div className="mb-4 bhutan-status success">
            Connected: {account}
          </div>
        ) : (
          <button
            onClick={connectMetaMask}
            className="bhutan-btn w-full mb-4"
          >
            Connect MetaMask
          </button>
        )}
        {error && <div className="bhutan-status error">{error}</div>}

        {/* Real-Time Balance Display */}
        {account && balance !== null && (
          <div className="mb-4 bhutan-status info" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            Balance: {showBalance ? `${balance} ETH` : '****'}
            <span onClick={() => setShowBalance(v => !v)} title={showBalance ? 'Hide Balance' : 'Show Balance'}>
              <EyeIcon open={showBalance} />
            </span>
          </div>
        )}

        {/* Transaction Form */}
        {account && (
          <form onSubmit={handleSubmit} className="mt-8">
            <h2 className="text-lg font-semibold mb-2 text-center">Submit Transaction</h2>
            <input
              type="text"
              name="sender"
              placeholder="Sender Address"
              value={form.sender}
              onChange={handleChange}
              className="bhutan-input"
              required
            />
            <input
              type="text"
              name="receiver"
              placeholder="Receiver Address"
              value={form.receiver}
              onChange={handleChange}
              className="bhutan-input"
              required
            />
            <input
              type="number"
              name="amount"
              placeholder="Amount (ETH)"
              value={form.amount}
              onChange={handleChange}
              className="bhutan-input"
              required
              min="0"
              step="any"
            />
            <button
              type="submit"
              className="bhutan-btn w-full"
            >
              Submit Transaction
            </button>
            {txStatus && <div className="bhutan-status info">{txStatus}</div>}
          </form>
        )}

        {/* Mine Block Button */}
        {account && (
          <div className="mt-8">
            <button
              onClick={handleMine}
              className="bhutan-btn w-full"
              style={{ background: 'linear-gradient(90deg, var(--bhutan-gold), var(--bhutan-orange))' }}
            >
              Mine Block
            </button>
            {mineStatus && <div className="bhutan-status info">{mineStatus}</div>}
          </div>
        )}

        {/* Transaction History Toggle Button - moved below Mine Block */}
        {account && txHistory.length > 0 && (
          <div className="mt-8">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <h2 className="text-lg font-semibold text-center" style={{ margin: 0 }}>Transaction History</h2>
              <button
                onClick={() => setShowTxHistory(v => !v)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', outline: 'none', padding: '0.25rem 0.75rem', display: 'flex', alignItems: 'center', fontWeight: 600, color: 'var(--bhutan-orange)', fontSize: '1rem', borderRadius: '0.5rem', transition: 'background 0.2s' }}
                title={showTxHistory ? 'Hide Transaction History' : 'View Transaction History'}
              >
                {showTxHistory ? 'Hide Transactions' : 'View Transactions'}
                <EyeIcon open={showTxHistory} />
              </button>
            </div>
            {showTxHistory && (
              <div style={{ maxHeight: '300px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {txHistory.map((tx) => (
                  <div key={tx.hash} style={{
                    background: 'var(--bhutan-white)',
                    border: '2px solid var(--bhutan-gold)',
                    borderRadius: '1rem',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                    padding: '1rem 1.5rem',
                    display: 'flex',
                    flexDirection: 'column',
                    fontSize: '0.98rem',
                    color: '#333',
                  }}>
                    <div style={{ fontWeight: 600, color: 'var(--bhutan-orange)', marginBottom: '0.25rem' }}>
                      Tx Hash: <span style={{ fontFamily: 'monospace' }}>{tx.hash.slice(0, 8)}...{tx.hash.slice(-6)}</span>
                    </div>
                    <div><span style={{ color: 'var(--bhutan-green)', fontWeight: 500 }}>From:</span> {tx.from.slice(0, 6)}...{tx.from.slice(-4)}</div>
                    <div><span style={{ color: 'var(--bhutan-green)', fontWeight: 500 }}>To:</span> {tx.to ? tx.to.slice(0, 6) + '...' + tx.to.slice(-4) : '-'}</div>
                    <div><span style={{ color: 'var(--bhutan-orange)', fontWeight: 500 }}>Value:</span> {tx.value} ETH</div>
                    <div style={{ color: '#888', fontSize: '0.9em' }}>Block: {tx.blockNumber}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
