"use client";
import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { Loader2, CheckCircle, Save, Trash2, Cpu, Terminal, Layers } from 'lucide-react';
import toast from 'react-hot-toast';

const AIQuestionSelector = ({ quizInfo, onComplete }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState([]);
  const [selectedIds, setSelectedIds] = useState(new Set());
  
  const [formData, setFormData] = useState({
    topic: '',
    count: 10,
    difficulty: 'Moderate',
    language: 'English'
  });

  const handleGenerate = async () => {
    if (!formData.topic) return toast.error("TOPIC REQUIRED");
    setIsLoading(true);
    try {
      const response = await fetch('https://quizbyaiservice-production.up.railway.app/Generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      
      const normalized = data.map((q, idx) => ({
        id: idx,
        question: q.question,
        a: q.opt1,
        b: q.opt2,
        c: q.opt3,
        d: q.opt4,
        correct: q.correctOpt.replace('opt', '') === '1' ? 'a' : 
                 q.correctOpt.replace('opt', '') === '2' ? 'b' : 
                 q.correctOpt.replace('opt', '') === '3' ? 'c' : 'd'
      }));

      setGeneratedQuestions(normalized);
      setSelectedIds(new Set(normalized.map(q => q.id)));
      toast.success("SEQUENCE GENERATED");
    } catch (error) {
      toast.error("AI SERVICE OFFLINE");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSelection = (id) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  const handleFinalPost = async () => {
    if (selectedIds.size === 0) return toast.error("SELECT AT LEAST ONE NODE");
    if (!quizInfo?.quizId) return toast.error("MISSING QUIZ_ID REFERENCE");

    setIsSaving(true);
    const selectedQuestions = generatedQuestions.filter(q => selectedIds.has(q.id));

    const payload = selectedQuestions.map((q) => ({
      quizId: quizInfo.quizId,
      question: q.question,
      opt1: q.a,
      opt2: q.b,
      opt3: q.c,
      opt4: q.d,
      correctOpt: `opt${q.correct.toLowerCase() === 'a' ? '1' : q.correct.toLowerCase() === 'b' ? '2' : q.correct.toLowerCase() === 'c' ? '3' : '4'}`
    }));

    try {
      const response = await fetch('https://quiz-krida.onrender.com/Questions', {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        toast.success("DATA COMMITTED TO DATABASE");
        if (onComplete) onComplete(); 
      } else {
        throw new Error("SERVER_REJECTED");
      }
    } catch (error) {
      toast.error("COMMIT FAILED: CHECK CONNECTION");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Container className="theme-card">
      {!generatedQuestions.length ? (
        <InputSection>
          <div className="status-tag">CORE_STATUS: IDLE</div>
          <h3><Cpu size={18} /> NEURAL_QUESTION_FORGE</h3>
          <input 
            className="theme-input"
            placeholder="TYPE_PROTOCOL_TOPIC..."
            value={formData.topic}
            onChange={e => setFormData({...formData, topic: e.target.value})}
          />
          <button className="theme-btn-primary" onClick={handleGenerate} disabled={isLoading}>
            {isLoading ? <Loader2 className="spinner" /> : "INITIATE_AI_SYNTHESIS"}
          </button>
        </InputSection>
      ) : (
        <SelectionSection>
          <div className="header">
            <div className="stats">
              <Layers size={14} />
              <span>NODES_LOADED: {generatedQuestions.length}</span>
              <span className="accent">SELECTED: {selectedIds.size}</span>
            </div>
            <button className="theme-btn-primary small" onClick={handleFinalPost} disabled={isSaving}>
              {isSaving ? <Loader2 className="spinner" /> : <><Save size={14}/> COMMIT_DATA</>}
            </button>
          </div>
          
          <ScrollArea>
            {generatedQuestions.map((q) => (
              <SelectCard 
                key={q.id} 
                $selected={selectedIds.has(q.id)}
                onClick={() => toggleSelection(q.id)}
              >
                <div className="check-box">
                  {selectedIds.has(q.id) && <CheckCircle size={14} />}
                </div>
                <div className="content">
                  <p className="q-text">{q.question}</p>
                  <div className="options-grid">
                    <div className="opt"><span>A</span> {q.a}</div>
                    <div className="opt"><span>B</span> {q.b}</div>
                    <div className="opt"><span>C</span> {q.c}</div>
                    <div className="opt"><span>D</span> {q.d}</div>
                  </div>
                </div>
              </SelectCard>
            ))}
          </ScrollArea>
          
          <div className="footer-actions">
            <button className="ghost-btn" onClick={() => setGeneratedQuestions([])}>
              <Trash2 size={12}/> PURGE_GENERATED_CACHE
            </button>
          </div>
        </SelectionSection>
      )}
    </Container>
  );
};

/* --- STYLES --- */

const spin = keyframes` from { transform: rotate(0deg); } to { transform: rotate(360deg); } `;

const Container = styled.div`
  max-width: 800px;
  margin: 20px auto;
  border: 1px solid var(--border-color);
  background: var(--surface);
  position: relative;
`;

const InputSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 10px;
  .status-tag { font-size: 0.6rem; color: var(--text-muted); letter-spacing: 2px; }
  h3 { display: flex; align-items: center; gap: 10px; font-size: 0.8rem; letter-spacing: 1px; }
  .spinner { animation: ${spin} 1s linear infinite; }
`;

const ScrollArea = styled.div`
  max-height: 500px;
  overflow-y: auto;
  margin: 15px 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-right: 8px;

  &::-webkit-scrollbar { width: 4px; }
  &::-webkit-scrollbar-thumb { background: var(--border-color); }
`;

const SelectCard = styled.div`
  display: flex;
  gap: 15px;
  padding: 15px;
  cursor: pointer;
  background: ${props => props.$selected ? 'rgba(255,255,255,0.03)' : 'transparent'};
  border: 1px solid ${props => props.$selected ? 'var(--accent)' : 'var(--border-color)'};
  transition: 0.2s ease;
  
  .check-box {
    flex-shrink: 0; width: 18px; height: 18px;
    border: 1px solid var(--border-color);
    display: flex; align-items: center; justify-content: center;
    background: ${props => props.$selected ? 'var(--accent)' : 'var(--bg)'};
    color: var(--bg);
  }

  .content { flex: 1; }
  .q-text { font-size: 0.8rem; font-weight: 700; margin-bottom: 12px; line-height: 1.4; }
  
  .options-grid { 
    display: grid; 
    grid-template-columns: 1fr 1fr; 
    gap: 8px; 
    
    .opt { 
      font-size: 0.7rem; 
      color: var(--text-muted);
      display: flex;
      gap: 6px;
      span { color: var(--accent); font-weight: 900; opacity: 0.5; }
    }
  }

  &:hover { border-color: var(--accent); }
`;

const SelectionSection = styled.div`
  .header { 
    display: flex; justify-content: space-between; align-items: center;
    padding-bottom: 15px; border-bottom: 1px solid var(--border-color);
  }
  .stats { 
    display: flex; align-items: center; gap: 15px; font-size: 0.65rem; font-weight: 900; 
    .accent { color: var(--accent); }
  }
  .footer-actions { display: flex; justify-content: flex-start; margin-top: 10px; }
  .ghost-btn { 
    background: transparent; border: none; color: var(--text-muted); 
    cursor: pointer; display: flex; align-items: center; gap: 5px; font-size: 0.6rem;
    text-transform: uppercase; font-weight: 900;
    &:hover { color: #ff4444; }
  }
  .spinner { animation: ${spin} 1s linear infinite; }
`;

export default AIQuestionSelector;