
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

const mount = () => {
  const container = document.getElementById('root');
  if (!container) {
    console.error("Root container not found");
    return;
  }

  try {
    const root = createRoot(container);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  } catch (error) {
    console.error("Critical error during React initialization:", error);
    container.innerHTML = `<div style="padding: 20px; color: #ff4444; font-family: sans-serif;">
      <h2>Application Failed to Start</h2>
      <p>${error instanceof Error ? error.message : 'Unknown error'}</p>
      <button onclick="window.location.reload()" style="padding: 8px 16px; background: #333; color: white; border: none; border-radius: 4px; cursor: pointer;">Retry</button>
    </div>`;
  }
};

// Use a more reliable ready state check
if (document.readyState === 'complete' || document.readyState === 'interactive') {
  mount();
} else {
  document.addEventListener('DOMContentLoaded', mount);
}
