import React from 'react';

const TestApp = () => {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ color: 'blue' }}>🎉 ZIDIO Test Page</h1>
      <p>If you can see this, React is working!</p>
      <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#f0f0f0', borderRadius: '5px' }}>
        <h2>Next Steps:</h2>
        <ul>
          <li>✅ React is rendering</li>
          <li>🔄 Now checking for import errors...</li>
        </ul>
      </div>
    </div>
  );
};

export default TestApp;