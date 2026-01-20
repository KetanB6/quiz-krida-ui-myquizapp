"use client";
import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Zap, ChevronRight, Sparkles } from 'lucide-react';
import { Trophy, Users, Gift, Globe } from 'lucide-react';
import Link from 'next/link';
import QuickActions from './QuickActions';


const LandingPage = () => {
  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.8, staggerChildren: 0.2 } 
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    
    <PageWrapper>
      <div className="grid-overlay" />
      
      <HeroSection
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="badge">
          <Sparkles size={14} className="sparkle-icon" />
          <span>New: AI Quiz Generation is live</span>
        </motion.div>

        <motion.h1 variants={itemVariants}>
          The Future of <br />
          <span className="gradient-text">Interactive Learning</span>
        </motion.h1>

        <motion.p variants={itemVariants}>
          Join thousands of learners using AI to turn any topic into a 
          competitive challenge. Fast, fun, and completely free.
        </motion.p>

        <motion.div variants={itemVariants} className="hero-btns">
          <Link href="/login" className="primary-btn">
            Get Started <ChevronRight size={18} />
          </Link>
          <button className="glass-btn">Explore Features</button>
        </motion.div>
      </HeroSection>

      <CardsWrapper
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
      >
        <QuickActions />
      </CardsWrapper>

      <StatsSection
  initial={{ opacity: 0 }}
  whileInView={{ opacity: 1 }}
  transition={{ duration: 1 }}
  viewport={{ once: true }}
>
  <div className="stats-grid">
    <div className="stat-card">
      <div className="icon-circle blue"><Users size={24} /></div>
      <div className="texts">
        <h4>12,402</h4>
        <p>Active Players</p>
      </div>
    </div>

    <div className="stat-card">
      <div className="icon-circle purple"><Trophy size={24} /></div>
      <div className="texts">
        <h4>$5,000+</h4>
        <p>Monthly Prizes</p>
      </div>
    </div>

    <div className="stat-card">
      <div className="icon-circle green"><Gift size={24} /></div>
      <div className="texts">
        <h4>850</h4>
        <p>Trophies Awarded</p>
      </div>
    </div>

    <div className="stat-card">
      <div className="icon-circle orange"><Globe size={24} /></div>
      <div className="texts">
        <h4>Global</h4>
        <p>24/7 Tournaments</p>
      </div>
    </div>
  </div>

  <WinnerTicker>
    <div className="ticker-track">
      <span>🏆 @Dhiraj_01 won $50 in Weekly Quiz</span>
      <span>⭐ @Alex_Dev just earned 'AI Master' Badge</span>
      <span>🏆 @Rahul.js won the Science Bowl</span>
      <span>⭐ @Sarah_Quizzer hit 100 day streak</span>
      {/* Repeat for continuous loop */}
      <span>🏆 @Dhiraj_01 won $50 in Weekly Quiz</span>
      <span>⭐ @Alex_Dev just earned 'AI Master' Badge</span>
    </div>
  </WinnerTicker>
</StatsSection>
    </PageWrapper>
  );
};

// --- Styled Components ---

const StatsSection = styled(motion.section)`
  width: 100%;
  max-width: 1100px;
  margin: 60px auto;
  padding: 0 20px;

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 20px;
    margin-bottom: 50px;
  }

  .stat-card {
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.08);
    padding: 20px;
    border-radius: 16px;
    display: flex;
    align-items: center;
    gap: 15px;
    transition: 0.3s;

    &:hover {
      background: rgba(255, 255, 255, 0.06);
      transform: translateY(-5px);
    }
  }

  .icon-circle {
    width: 50px;
    height: 50px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    
    &.blue { background: rgba(45, 140, 240, 0.15); color: #2d8cf0; }
    &.purple { background: rgba(155, 89, 182, 0.15); color: #9b59b6; }
    &.green { background: rgba(46, 204, 113, 0.15); color: #2ecc71; }
    &.orange { background: rgba(230, 126, 34, 0.15); color: #e67e22; }
  }

  .texts h4 {
    font-size: 1.5rem;
    color: white;
    margin: 0;
  }

  .texts p {
    font-size: 0.85rem;
    color: #a1a1a1;
    margin: 0;
  }
`;

const WinnerTicker = styled.div`
  background: linear-gradient(90deg, transparent, rgba(155, 89, 182, 0.1), transparent);
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  padding: 15px 0;
  overflow: hidden;
  white-space: nowrap;

  .ticker-track {
    display: inline-block;
    animation: marquee 20s linear infinite;
  }

  span {
    color: #fefefe;
    font-size: 0.9rem;
    margin-right: 50px;
    font-weight: 500;
  }

  @keyframes marquee {
    0% { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }
`;

const PageWrapper = styled.div`
 
  min-height: 100vh;
  position: relative;
  margin-top: -80px; /* Adjust if navbar height changes */
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;

  /* Floating Grid Effect */
  .grid-overlay {
    position: absolute;
    inset: 0;
    background-image: radial-gradient(circle at 2px 2px, #ffffff10 1px, transparent 0);
    background-size: 40px 40px;
    mask-image: linear-gradient(to bottom, black, transparent);
    z-index: 0;
  }
`;

const HeroSection = styled(motion.section)`
  position: relative;
  z-index: 1;
  text-align: center;
  padding: 120px 20px 40px; /* Moves it closer to navbar */
  max-width: 1000px;

  .badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    padding: 6px 16px;
    border-radius: 100px;
    color: #9b59b6;
    font-size: 0.85rem;
    font-weight: 500;
    margin-bottom: 30px;
    backdrop-filter: blur(5px);

    .sparkle-icon {
      animation: rotate 3s linear infinite;
    }
  }

  h1 {
    font-size: clamp(2.5rem, 8vw, 5rem);
    font-weight: 800;
    letter-spacing: -2px;
    line-height: 1;
    color: white;
    margin-bottom: 24px;

    .gradient-text {
      background: linear-gradient(90deg, #2d8cf0, #9b59b6);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      display: inline-block;
    }
  }

  p {
    color: #a1a1a1;
    font-size: 1.25rem;
    max-width: 650px;
    margin: 0 auto 40px;
    line-height: 1.6;
  }

  .hero-btns {
    display: flex;
    justify-content: center;
    gap: 15px;

    @media (max-width: 600px) {
      flex-direction: column;
      align-items: center;
    }
  }

  .primary-btn {
    background: #fefefe;
    color: #000;
    padding: 14px 28px;
    border-radius: 8px;
    font-weight: 700;
    text-decoration: none;
    display: flex;
    align-items: center;
    gap: 5px;
    transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);

    &:hover {
      transform: scale(1.05) translateY(-3px);
      box-shadow: 0 10px 20px rgba(255, 255, 255, 0.15);
    }
  }

  .glass-btn {
    background: rgba(255, 255, 255, 0.03);
    color: white;
    border: 1px solid rgba(255, 255, 255, 0.1);
    padding: 14px 28px;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: 0.3s;

    &:hover {
      background: rgba(255, 255, 255, 0.08);
      border-color: rgba(255, 255, 255, 0.3);
    }
  }

  @keyframes rotate {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;

const CardsWrapper = styled(motion.div)`
  width: 100%;
  position: relative;
  z-index: 1;
  margin-top: -20px; /* Pulls cards upward to merge with hero */
`;

export default LandingPage;