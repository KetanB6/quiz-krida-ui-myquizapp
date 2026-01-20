"use client";
import React from 'react';
import { Sparkles } from 'lucide-react';

const AiPage = () => {
  return (
    <div style={{ padding: '100px 20px', textAlign: 'center', color: 'white' }}>
      <Sparkles color="#9b59b6" size={48} style={{ marginBottom: '20px' }} />
      <h1>AI Quiz Generator</h1>
      <p style={{ color: '#7e7e7e' }}>Enter a topic and let AI generate the questions</p>
      <textarea 
        placeholder="e.g. Create a 5 question quiz about the history of space travel..." 
        style={{ 
            width: '100%', 
            maxWidth: '500px', 
            height: '120px', 
            padding: '15px', 
            marginTop: '20px',
            borderRadius: '10px',
            background: '#1a1a1a',
            color: 'white',
            border: '2px solid #9b59b6'
        }}
      />
      <br />
      <button style={{ 
          marginTop: '20px', 
          padding: '12px 40px', 
          background: '#9b59b6', 
          color: 'white', 
          border: 'none', 
          borderRadius: '5px',
          fontWeight: 'bold',
          cursor: 'pointer'
      }}>
        Generate Now
      </button>
    </div>
  );
};

export default AiPage;