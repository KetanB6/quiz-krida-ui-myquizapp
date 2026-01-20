"use client";
import React from 'react';
import styled from 'styled-components';
import { Play, PlusCircle, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

const QuickActions = () => {
  const actions = [
    {
      title: "Play Quiz",
      desc: "Enter a code and test your knowledge",
      icon: <Play size={32} />,
      color: "#2d8cf0", // Blue
      onClick: () => toast.success("Opening Game Lobby...")
    },
    {
      title: "Create Quiz",
      desc: "Build your own custom quiz manually",
      icon: <PlusCircle size={32} />,
      color: "#2ecc71", // Green
      onClick: () => toast.success("Redirecting to Creator...")
    },
    {
      title: "Quiz by AI",
      desc: "Generate a quiz from a topic or URL",
      icon: <Sparkles size={32} />,
      color: "#9b59b6", // Purple
      onClick: () => toast.success("AI Assistant waking up...")
    }
  ];

  return (
    <Container>
      {actions.map((action, index) => (
        <Card key={index} color={action.color} onClick={action.onClick}>
          <div className="icon-box">{action.icon}</div>
          <h3>{action.title}</h3>
          <p>{action.desc}</p>
          <button className="action-btn">Go!</button>
        </Card>
      ))}
    </Container>
  );
};

const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 25px;
  width: 100%;
  max-width: 1000px;
  margin: 40px auto;
  padding: 0 20px;
`;

const Card = styled.div`
  
  border: 2px solid #fefefe;
  box-shadow: 6px 6px 0px #fefefe;
  border-radius: 10px;
  padding: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;

  .icon-box {
    color: ${props => props.color};
    margin-bottom: 15px;
    background: rgba(255, 255, 255, 0.05);
    padding: 15px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px dashed ${props => props.color};
  }

  h3 {
    color: #fefefe;
    font-size: 1.5rem;
    margin-bottom: 10px;
  }

  p {
    color: #7e7e7e;
    font-size: 0.9rem;
    line-height: 1.4;
    margin-bottom: 20px;
    height: 40px;
  }

  .action-btn {
    width: 100%;
    padding: 10px;
    background: transparent;
    border: 2px solid ${props => props.color};
    color: ${props => props.color};
    font-weight: bold;
    border-radius: 5px;
    box-shadow: 4px 4px 0px ${props => props.color};
    transition: all 0.1s;
  }

  &:hover {
    transform: translate(-2px, -2px);
    box-shadow: 10px 10px 0px ${props => props.color};
  }

  &:active {
    transform: translate(4px, 4px);
    box-shadow: 0px 0px 0px;
  }

  &:active .action-btn {
    box-shadow: 0px 0px 0px;
  }
`;

export default QuickActions;