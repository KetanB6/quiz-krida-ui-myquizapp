"use client";
import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, ChevronLeft, ChevronRight, Save, Layout } from 'lucide-react';
import toast from 'react-hot-toast';

const CreatePage = () => {
  const [quizTitle, setQuizTitle] = useState("");
  const [questions, setQuestions] = useState([
    { question: "", a: "", b: "", c: "", d: "", correct: "a" }
  ]);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Your Specific Palette
  const primaryColor = "#2563eb";  // Vibrant Blue
  const lightColor = "#e0f2fe";    // Very Light Blue (used for text/highlights)

  const addSlide = () => {
    setQuestions([...questions, { question: "", a: "", b: "", c: "", d: "", correct: "a" }]);
    setCurrentSlide(questions.length);
    toast.success("New slide added!");
  };

  const removeSlide = (index) => {
    if (questions.length === 1) {
      toast.error("You need at least one question!");
      return;
    }
    const newQuestions = questions.filter((_, i) => i !== index);
    setQuestions(newQuestions);
    setCurrentSlide(Math.max(0, index - 1));
  };

  const updateQuestion = (field, value) => {
    const newQuestions = [...questions];
    newQuestions[currentSlide][field] = value;
    setQuestions(newQuestions);
  };

  return (
    <PageWrapper $primary={primaryColor}>
      <ContentHeader
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        $primary={primaryColor}
      >
        <div className="title-section">
          <Layout size={32} color={primaryColor} />
          <input
            value={quizTitle}
            onChange={(e) => setQuizTitle(e.target.value)}
            placeholder="Enter Quiz Title..."
            className="title-input"
          />
        </div>
        <div className="progress-container">
          <div className="progress-text">Progress: {Math.round(((currentSlide + 1) / questions.length) * 100)}%</div>
          {/* Fixed: Use $primary instead of themeColor */}
          <ProgressBar $primary={primaryColor}>
            <div className="fill" style={{ width: `${((currentSlide + 1) / questions.length) * 100}%` }} />
          </ProgressBar>
        </div>
      </ContentHeader>

      <MainContainer>
        <div className="nav-controls">
          <NavBtn onClick={() => setCurrentSlide(Math.max(0, currentSlide - 1))} disabled={currentSlide === 0}>
            <ChevronLeft /> Previous
          </NavBtn>
          <span className="slide-counter">Slide {currentSlide + 1} of {questions.length}</span>
          <NavBtn onClick={() => setCurrentSlide(Math.min(questions.length - 1, currentSlide + 1))} disabled={currentSlide === questions.length - 1}>
            Next <ChevronRight />
          </NavBtn>
        </div>

        <AnimatePresence mode="wait">
          <SlideCard
            key={currentSlide}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <DeleteBtn onClick={() => removeSlide(currentSlide)} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Trash2 size={18} />
            </DeleteBtn>

            {/* Fixed: Use $primary */}
            <FormGroup $primary={primaryColor}>
              <label>Question Content</label>
              <textarea
                value={questions[currentSlide].question}
                onChange={(e) => updateQuestion('question', e.target.value)}
                placeholder="Type your question here..."
              />
            </FormGroup>

            <div className="options-grid">
              {['a', 'b', 'c', 'd'].map((letter) => (
                <OptionInput
                  key={letter}
                  $primary={primaryColor}
                  $light={lightColor}
                  $isCorrect={questions[currentSlide].correct === letter}
                >
                  <span className="prefix">{letter.toUpperCase()}</span>
                  <input
                    value={questions[currentSlide][letter]}
                    onChange={(e) => updateQuestion(letter, e.target.value)}
                    placeholder={`Option ${letter.toUpperCase()}`}
                  />
                  <input
                    type="radio"
                    name="correct-ans"
                    checked={questions[currentSlide].correct === letter}
                    onChange={() => updateQuestion('correct', letter)}
                  />
                </OptionInput>
              ))}
            </div>
          </SlideCard>
        </AnimatePresence>

        <ActionArea>
          {/* Fixed: Use $primary */}
          <AddBtn $primary={primaryColor} onClick={addSlide} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Plus size={20} /> Add Another Question
          </AddBtn>
          <SaveBtn $primary={primaryColor} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Save size={20} /> Publish Quiz
          </SaveBtn>
        </ActionArea>
      </MainContainer>
    </PageWrapper>
  );
};

/* --- Styled Components --- */

const PageWrapper = styled.div`
  min-height: 100vh;
  padding: 40px 20px;
  /* Updated Background Gradient */
  background: radial-gradient(circle at top right, ${props => props.$primary}20, transparent);
`;

const ContentHeader = styled(motion.div)`
  max-width: 800px;
  margin: 0 auto 40px;
  .title-section {
    display: flex; align-items: center; gap: 15px; margin-bottom: 20px;
  }
  .title-input {
    background: transparent; border: none; border-bottom: 2px solid rgba(255,255,255,0.1);
    font-size: 2rem; color: white; width: 100%; outline: none; transition: 0.3s;
    &:focus { border-color: ${props => props.$primary}; }
  }
  .progress-text { font-size: 0.8rem; color: #e0f2fe; margin-bottom: 8px; }
`;

const ProgressBar = styled.div`
  width: 100%; height: 6px; background: rgba(255,255,255,0.05); border-radius: 10px; overflow: hidden;
  .fill { 
    height: 100%; 
    background: ${props => props.$primary}; 
    transition: 0.5s ease; 
    box-shadow: 0 0 10px ${props => props.$primary}; 
  }
`;

const MainContainer = styled.div`
  max-width: 800px; margin: 0 auto;
  .nav-controls {
    display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;
  }
  .slide-counter { color: #e0f2fe; font-weight: 500; font-size: 0.9rem; opacity: 0.7; }
`;

const SlideCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 40px;
  position: relative;
  box-shadow: 0 20px 50px rgba(0,0,0,0.3);

  .options-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 30px; }
  @media (max-width: 600px) { .options-grid { grid-template-columns: 1fr; } }
`;

const FormGroup = styled.div`
  label { 
    display: block; 
    color: ${props => props.$primary}; 
    font-size: 0.75rem; 
    font-weight: bold; 
    text-transform: uppercase; 
    margin-bottom: 10px; 
  }
  textarea {
    width: 100%; background: rgba(0,0,0,0.2); border: 1px solid rgba(255,255,255,0.1);
    border-radius: 10px; padding: 15px; color: white; font-size: 1.1rem; height: 100px; outline: none;
    &:focus { border-color: ${props => props.$primary}; background: rgba(0,0,0,0.4); }
  }
`;

const OptionInput = styled.div`
  display: flex; align-items: center; gap: 10px; 
  /* Fixed: Using $isCorrect and $primary */
  background: ${props => props.$isCorrect ? `${props.$primary}1a` : 'rgba(255,255,255,0.02)'};
  border: 1px solid ${props => props.$isCorrect ? props.$primary : 'rgba(255,255,255,0.08)'};
  padding: 10px 15px; border-radius: 12px; transition: 0.2s;
  
  &:hover { background: rgba(255,255,255,0.05); }

  .prefix { color: ${props => props.$primary}; font-weight: 900; }
  input[type="text"] { background: transparent; border: none; color: ${props => props.$light}; width: 100%; outline: none; }
  input[type="radio"] { accent-color: ${props => props.$primary}; cursor: pointer; width: 18px; height: 18px; }
`;

const NavBtn = styled.button`
  background: transparent; border: 1px solid rgba(255,255,255,0.1); color: #e0f2fe;
  padding: 8px 16px; border-radius: 8px; cursor: pointer; display: flex; align-items: center; gap: 8px;
  &:disabled { opacity: 0.3; cursor: not-allowed; }
  &:hover:not(:disabled) { background: rgba(255,255,255,0.05); }
`;

const ActionArea = styled.div`
  margin-top: 30px; display: flex; gap: 20px;
`;

const AddBtn = styled(motion.button)`
  flex: 1; padding: 16px; background: rgba(255,255,255,0.05); border: 1px dashed ${props => props.$primary};
  color: ${props => props.$primary}; border-radius: 12px; cursor: pointer; font-weight: bold;
  display: flex; align-items: center; justify-content: center; gap: 10px;
`;

const SaveBtn = styled(motion.button)`
  flex: 1; padding: 16px; background: ${props => props.$primary}; border: none;
  color: white; border-radius: 12px; cursor: pointer; font-weight: bold;
  display: flex; align-items: center; justify-content: center; gap: 10px;
  box-shadow: 0 10px 20px ${props => props.$primary}4d;
`;

const DeleteBtn = styled(motion.button)`
  position: absolute; top: 20px; right: 20px; background: rgba(255, 75, 75, 0.1);
  border: none; color: #ff4b4b; padding: 8px; border-radius: 8px; cursor: pointer;
`;

export default CreatePage;