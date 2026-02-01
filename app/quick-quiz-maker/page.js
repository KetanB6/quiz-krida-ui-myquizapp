"use client";
import React, { useState, useEffect } from 'react';
import styled, { keyframes, createGlobalStyle } from 'styled-components';
import {
  Sparkles, Loader2, Trophy, RefreshCcw, Timer,
  ChevronRight, Clipboard, CheckCircle2, XCircle,
  AlertCircle, MessageSquare, Gamepad2, MousePointer2, Rocket, ExternalLink, Clock
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

const GlobalStyle = createGlobalStyle`
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { 
    background-color: #050505; 
    color: #e2e2e2; 
    font-family: 'Inter', system-ui, -apple-system, sans-serif;
    overflow-x: hidden;
  }
`;

const QuickQuizMaker = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [quizData, setQuizData] = useState(null);
  const [userAnswers, setUserAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [rawJson, setRawJson] = useState('');
  const [topic, setTopic] = useState('');
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [minsPerQuestion, setMinsPerQuestion] = useState(1);
  const [timeLeft, setTimeLeft] = useState(60);
  const [modal, setModal] = useState({ show: false, platform: '', url: '' });

  useEffect(() => {
    if (!quizData || isSubmitted) return;
    if (timeLeft === 0) {
      handleNextQuestion();
      return;
    }
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, quizData, isSubmitted]);

  const getPrompt = () => `Generate 10 multiple choice questions about "${topic || 'General Knowledge'}". 
Return ONLY a JSON array. Each object must have keys: "question", "opt1", "opt2", "opt3", "opt4", and "correctOpt". 
The "correctOpt" value must be the text of the correct option Base64 encoded.`;

  const handleCopyOnly = () => {
    if (!topic.trim()) return toast.error("Please enter a topic!");
    navigator.clipboard.writeText(getPrompt());
    toast.success("Prompt copied!");
  };

  const triggerAI = (platform) => {
    if (!topic.trim()) return toast.error("Please enter a topic!");
    navigator.clipboard.writeText(getPrompt());
    const url = platform === 'chatgpt' ? "https://chatgpt.com/" : "https://gemini.google.com/app";
    setModal({ show: true, platform: platform === 'chatgpt' ? 'ChatGPT' : 'Gemini', url });
  };

  const handleProceedToAI = () => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (modal.platform === 'ChatGPT' && isMobile) {
      window.location.href = "chatgpt://";
      setTimeout(() => { window.open(modal.url, "_blank"); }, 800);
    } else {
      window.open(modal.url, "_blank");
    }
    setModal({ show: false, platform: '', url: '' });
  };

  const handleProcessPaste = () => {
    if (!rawJson.trim()) return toast.error("Paste the AI response first!");
    setIsLoading(true);
    try {
      const cleanJson = rawJson.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(cleanJson);
      const decodedData = parsed.map(q => ({
        ...q,
        decodedAnswer: (() => {
          try { return atob(q.correctOpt).trim(); }
          catch { return String(q.correctOpt).trim(); }
        })()
      }));
      setQuizData(decodedData);
      setIsSubmitted(false);
      setUserAnswers({});
      setCurrentQuestionIdx(0);
      setTimeLeft(minsPerQuestion * 60);
    } catch (error) {
      toast.error("Format error. Check the code block.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIdx === quizData.length - 1) {
      let currentScore = 0;
      quizData.forEach((q, idx) => {
        if (checkIsCorrect(q, userAnswers[idx])) currentScore++;
      });
      setScore(currentScore);
      setIsSubmitted(true);
    } else {
      setCurrentQuestionIdx(prev => prev + 1);
      setTimeLeft(minsPerQuestion * 60);
    }
  };

  const checkIsCorrect = (q, selected) => {
    if (!selected) return false;
    const decoded = q.decodedAnswer.toLowerCase();
    const sel = String(selected).toLowerCase().trim();
    return sel === decoded || (q[decoded] && String(q[decoded]).toLowerCase().trim() === sel);
  };

  return (
    <>
      <GlobalStyle />
      <PageContainer>
        <Toaster position="top-center" />

        {modal.show && (
          <ModalOverlay onClick={() => setModal({ show: false })}>
            <ModalContent onClick={e => e.stopPropagation()}>
              <div className="icon-wrap"><CheckCircle2 size={32} color="#00ff9d" /></div>
              <h3>Prompt Copied!</h3>
              <p>Open {modal.platform} and paste the text to get your quiz code.</p>
              <div className="modal-actions">
                <button className="cancel" onClick={() => setModal({ show: false })}>Back</button>
                <button className="go" onClick={handleProceedToAI}>
                  Open {modal.platform} <ExternalLink size={14} />
                </button>
              </div>
            </ModalContent>
          </ModalOverlay>
        )}

        {!quizData ? (
          <SplitLayout>
            <GlassCard>
              <Header>
                <div className="icon-badge"><Rocket size={20} /></div>
                <div>
                  <h2>Quick Quiz Maker</h2>
                  <p>Ready to start your challenge?</p>
                </div>
              </Header>

              <FormGrid>
                <div className="row">
                  <InputGroup flex={2}>
                    <label><Sparkles size={12} /> 1. Topic</label>
                    <input
                      type="text"
                      placeholder="Enter a topic..."
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                    />
                  </InputGroup>
                  <InputGroup flex={1}>
                    <label><Clock size={12} /> Limit</label>
                    <input
                      type="number"
                      min="1"
                      max="3"
                      value={minsPerQuestion}
                      onChange={(e) => setMinsPerQuestion(Math.min(3, Math.max(1, parseInt(e.target.value) || 1)))}
                    />
                  </InputGroup>
                </div>

                <InputGroup>
                  <label>Generate With</label>
                  <div className="ai-buttons">
                    <AIButton className="gpt" onClick={() => triggerAI('chatgpt')}>ChatGPT</AIButton>
                    <AIButton className="gemini" onClick={() => triggerAI('gemini')}>Gemini</AIButton>
                    <CopyOnlyBtn onClick={handleCopyOnly} title="Copy prompt only"><Clipboard size={16} /></CopyOnlyBtn>
                  </div>
                </InputGroup>

                <InputGroup>
                  <label><MessageSquare size={12} /> 2. Paste JSON Code Generated By AI</label>
                  <textarea
                    value={rawJson}
                    onChange={(e) => setRawJson(e.target.value)}
                    placeholder='Paste the code block result here...'
                  />
                </InputGroup>

                <PrimaryButton onClick={handleProcessPaste} disabled={isLoading || !rawJson || !topic}>
                  {isLoading ? <Loader2 className="spinner" size={20} /> : "Start Playing"}
                </PrimaryButton>
              </FormGrid>
            </GlassCard>

            <InfoSection>
              <SectionTitle>Stop Reading. <br /> Start Playing.</SectionTitle>
              <InfoCard>
                <div className="info-icon"><Gamepad2 size={24} /></div>
                <div>
                  <h3>Chatting AI for practicing questions</h3>
                  <p>Don't just read answers. Transform your AI conversations into a timed, interactive practice session to truly master any topic.</p>
                </div>
              </InfoCard>
              <InfoCard>
                <div className="info-icon"><MousePointer2 size={24} /></div>
                <div>
                  <h3>Active Practice</h3>
                  <p>Instead of passive reading, you actively click choices and beat the clock to remember what you learn.</p>
                </div>
              </InfoCard>
              <StepBox>
                <h4>Simple 3-Step Process:</h4>
                <ul>
                  <li><span>1</span> Enter a topic & pick an AI.</li>
                  <li><span>2</span> Paste the prompt into the AI chat.</li>
                  <li><span>3</span> Copy the code result & paste it here.</li>
                </ul>
              </StepBox>
            </InfoSection>
          </SplitLayout>
        ) : (
          <ResultContainer>
            <ResultHeader>
              <Badge className={isSubmitted ? "score" : "timer"}>
                {isSubmitted ? `Final Score: ${score} / ${quizData.length}` : `Time: ${timeLeft}s`}
              </Badge>
              {isSubmitted && (
                <button className="reset-btn" onClick={() => { setQuizData(null); setRawJson(''); setTopic(''); }}>
                  <RefreshCcw size={14} /> Reset
                </button>
              )}
            </ResultHeader>
            <QuestionCard>
              {quizData.map((q, idx) => {
                if (!isSubmitted && idx !== currentQuestionIdx) return null;
                return (
                  <div key={idx} style={{ marginBottom: isSubmitted ? '40px' : '0' }}>
                    <div className="q-num">Question {idx + 1}</div>
                    <h3>{q.question}</h3>
                    <div className="options-list">
                      {[q.opt1, q.opt2, q.opt3, q.opt4].map((opt, i) => {
                        const isSelected = userAnswers[idx] === opt;
                        const correct = checkIsCorrect(q, opt);
                        let status = isSubmitted ? (correct ? "correct" : (isSelected ? "wrong" : "")) : (isSelected ? "selected" : "");
                        return (
                          <Option key={i} className={status} onClick={() => !isSubmitted && setUserAnswers({ ...userAnswers, [idx]: opt })}>
                            {opt}
                          </Option>
                        );
                      })}
                    </div>
                    {isSubmitted && !checkIsCorrect(q, userAnswers[idx]) && (
                      <div className="explanation"><AlertCircle size={12} /> Correct Answer: {q[q.decodedAnswer] || q.decodedAnswer}</div>
                    )}
                  </div>
                );
              })}
            </QuestionCard>
            {!isSubmitted && (
              <StickyFooter>
                <SubmitButton onClick={handleNextQuestion}>
                  {currentQuestionIdx === quizData.length - 1 ? "Finish Quiz" : "Next Question"} <ChevronRight size={18} />
                </SubmitButton>
              </StickyFooter>
            )}
          </ResultContainer>
        )}
      </PageContainer>
    </>
  );
};

// --- STYLES ---
const spin = keyframes` from { transform: rotate(0deg); } to { transform: rotate(360deg); } `;

const PageContainer = styled.div`
    width: 100vw; min-height: 100vh; display: flex; align-items: center; justify-content: center;  padding: 40px 20px;
    @media (max-width: 900px) { align-items: flex-start; }
`;

const SplitLayout = styled.div`
    display: grid; grid-template-columns: 1fr 1fr; gap: 60px; width: 100%; max-width: 1050px; align-items: center;
    @media (max-width: 900px) { grid-template-columns: 1fr; gap: 40px; }
`;

const GlassCard = styled.div` background: #0f0f0f; border: 1px solid #222; border-radius: 24px; padding: 32px; box-shadow: 0 20px 40px rgba(0,0,0,0.4); `;

const Header = styled.div`
    display: flex; gap: 16px; margin-bottom: 28px;
    .icon-badge { width: 44px; height: 44px; background: rgba(0, 255, 157, 0.05); border-radius: 12px; display: flex; align-items: center; justify-content: center; color: #00ff9d; border: 1px solid rgba(0, 255, 157, 0.1); }
    h2 { font-size: 1.4rem; color: #fff; } p { color: #666; font-size: 0.9rem; }
`;

const FormGrid = styled.div` display: flex; flex-direction: column; gap: 20px; .row { display: flex; gap: 12px; } `;

const InputGroup = styled.div`
    flex: ${props => props.flex || 'none'};
    label { display: block; color: #555; font-size: 0.75rem; text-transform: uppercase; margin-bottom: 8px; font-weight: 800; letter-spacing: 0.5px; }
    input { width: 100%; background: #000; border: 1px solid #222; border-radius: 10px; padding: 12px; color: #fff; font-size: 1rem; transition: 0.2s; &:focus { border-color: #00ff9d; outline: none; } }
    textarea { width: 100%; height: 110px; background: #000; border: 1px solid #222; border-radius: 10px; padding: 12px; color: #00ff9d; font-family: monospace; font-size: 0.85rem; resize: none; transition: 0.2s; &:focus { border-color: #00ff9d; outline: none; } }
    .ai-buttons { display: grid; grid-template-columns: 1fr 1fr 50px; gap: 10px; }
`;

const AIButton = styled.button`
    padding: 12px; border-radius: 10px; border: 1px solid #222; font-weight: 700; cursor: pointer; color: #fff; font-size: 0.85rem; transition: 0.2s; background: #000;
    &.gpt { border-color: #10a37f; color: #10a37f; &:hover { background: rgba(16, 163, 127, 0.15); } }
    &.gemini { border-color: #1a73e8; color: #1a73e8; &:hover { background: rgba(26, 115, 232, 0.15); } }
`;

const CopyOnlyBtn = styled.button` background: #000; color: #555; border: 1px solid #222; border-radius: 10px; cursor: pointer; display: flex; align-items: center; justify-content: center; &:hover { color: #fff; border-color: #444; } `;

const PrimaryButton = styled.button` width: 100%; padding: 16px; border-radius: 14px; border: none; font-weight: 800; background: linear-gradient(135deg, #00ff9d, #6366f1); cursor: pointer; color: #000; font-size: 1rem; &:disabled { opacity: 0.2; cursor: not-allowed; } .spinner { animation: ${spin} 1s linear infinite; } `;

const InfoSection = styled.div` display: flex; flex-direction: column; gap: 28px; `;
const SectionTitle = styled.h2` font-size: 2.8rem; font-weight: 900; color: #fff; line-height: 1.1; letter-spacing: -1.5px; `;
const InfoCard = styled.div`
    display: flex; gap: 16px; 
    .info-icon { color: #00ff9d; padding-top: 4px; }
    h3 { color: #fff; font-size: 1.2rem; margin-bottom: 6px; } p { color: #777; font-size: 0.95rem; line-height: 1.5; }
`;
const StepBox = styled.div`
    background: rgba(255,255,255,0.03); border: 1px solid #1a1a1a; padding: 28px; border-radius: 20px;
    h4 { color: #555; margin-bottom: 18px; font-size: 0.85rem; text-transform: uppercase; font-weight: 800; }
    ul { list-style: none; display: flex; flex-direction: column; gap: 14px; }
    li { display: flex; align-items: center; gap: 14px; color: #999; font-size: 1rem; }
    span { width: 24px; height: 24px; background: #00ff9d; color: #000; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.8rem; font-weight: 900; }
`;

const ResultContainer = styled.div` width: 100%; max-width: 700px; margin: 0 auto; `;
const ResultHeader = styled.div` display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; .reset-btn { background: #111; color: #fff; border: 1px solid #222; padding: 8px 16px; border-radius: 10px; cursor: pointer; font-size: 0.85rem; display: flex; gap: 6px; } `;
const Badge = styled.div` padding: 6px 14px; border-radius: 100px; font-weight: 800; font-size: 0.8rem; &.timer { background: rgba(0, 255, 157, 0.1); color: #00ff9d; } &.score { background: #f1c40f; color: #000; } `;
const QuestionCard = styled.div` background: #0f0f0f; border: 1px solid #222; padding: 32px; border-radius: 24px; .q-num { color: #00ff9d; font-size: 0.8rem; font-weight: 900; margin-bottom: 8px; } h3 { font-size: 1.2rem; margin-bottom: 24px; line-height: 1.4; } `;
const Option = styled.div`
    padding: 14px 20px; border-radius: 12px; background: #000; border: 1px solid #222; margin-bottom: 12px; cursor: pointer; color: #888; font-size: 1rem; transition: 0.2s;
    &.selected { border-color: #00ff9d; color: #fff; } &.correct { border-color: #2ecc71; color: #2ecc71; } &.wrong { border-color: #e74c3c; color: #e74c3c; }
`;
const StickyFooter = styled.div` position: fixed; bottom: 30px; left: 0; width: 100%; display: flex; justify-content: center; padding: 0 20px; `;
const SubmitButton = styled(PrimaryButton)` width: auto; min-width: 180px; border-radius: 100px; `;

const ModalOverlay = styled.div` position: fixed; inset: 0; background: rgba(0,0,0,0.9); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 20px; `;
const ModalContent = styled.div` background: #111; border: 1px solid #222; padding: 32px; border-radius: 24px; max-width: 380px; text-align: center; h3 { margin: 15px 0; font-size: 1.5rem; } p { color: #777; font-size: 0.95rem; line-height: 1.5; margin-bottom: 28px; } .modal-actions { display: flex; gap: 12px; button { flex: 1; padding: 14px; border-radius: 12px; border: none; cursor: pointer; font-weight: 700; font-size: 0.9rem; } .cancel { background: #222; color: #888; } .go { background: #fff; color: #000; } } `;

export default QuickQuizMaker;