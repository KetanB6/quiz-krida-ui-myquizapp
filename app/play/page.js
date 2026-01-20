"use client";
import React from 'react';

const PlayPage = () => {
  return (
    <div style={{ padding: '100px 20px', textAlign: 'center', color: 'white' }}>
      <h1>Enter Game Code</h1>
      <p style={{ color: '#7e7e7e' }}>Join a live quiz session</p>
      <input 
        type="text" 
        placeholder="e.g. 123456" 
        style={{ 
            padding: '15px', 
            borderRadius: '8px', 
            border: '2px solid #2d8cf0', 
            marginTop: '20px',
            background: '#1a1a1a',
            color: 'white'
        }}
      />
      <br />
      <button style={{ 
          marginTop: '20px', 
          padding: '12px 40px', 
          background: '#2d8cf0', 
          color: 'white', 
          border: 'none', 
          borderRadius: '5px',
          fontWeight: 'bold',
          cursor: 'pointer'
      }}>
        Join Exam
      </button>
    </div>
  );
};

export default PlayPage; // Ensure this line is exactly like this