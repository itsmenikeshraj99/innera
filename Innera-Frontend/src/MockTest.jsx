import { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc } from 'firebase/firestore';
import { auth, db } from './firebase'; // Ensure your firebase path is correct
import gsap from 'gsap';
import './App.css'; 

// 📝 Dummy SSC CGL English Questions
const testQuestions = [
  { id: 1, question: "Identify the segment that contains a grammatical error: 'Neither the manager nor the employees was aware of the new policy.'", options: ["Neither the manager", "nor the employees", "was aware", "of the new policy"], answer: 2 }, 
  { id: 2, question: "Choose the correct synonym for 'ABANDON'.", options: ["Keep", "Cherish", "Forsake", "Hold"], answer: 2 },
  { id: 3, question: "Select the passive voice: 'The mechanic is repairing the car.'", options: ["The car is repaired by the mechanic.", "The car was being repaired by the mechanic.", "The car is being repaired by the mechanic.", "The car repairs the mechanic."], answer: 2 },
  { id: 4, question: "Fill in the blank: 'He is good ___ playing chess.'", options: ["in", "at", "with", "on"], answer: 1 },
  { id: 5, question: "What is the antonym of 'DILIGENT'?", options: ["Hardworking", "Careful", "Lazy", "Active"], answer: 2 }
];

const TEST_DURATION = 5 * 60; // 5 Minutes (in seconds)

function MockTest() {
  const navigate = useNavigate();
  const cursorRef = useRef(null);
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(TEST_DURATION);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  // 🖱️ Custom Cursor Animation
  useEffect(() => {
    const onMouseMove = (e) => {
      gsap.to(cursorRef.current, { x: e.clientX, y: e.clientY, duration: 0.15, ease: 'power2.out' });
    };
    window.addEventListener('mousemove', onMouseMove);
    return () => window.removeEventListener('mousemove', onMouseMove);
  }, []);

  // 🧠 useCallback se function ko memorize kiya taaki React confuse na ho
  const handleSubmitTest = useCallback(async () => {
    let finalScore = 0;
    testQuestions.forEach((q, index) => {
      if (selectedAnswers[index] === q.answer) {
        finalScore += 1;
      }
    });
    setScore(finalScore);
    setIsSubmitted(true);
    // 🔥 FIREBASE SAVE LOGIC
      if (auth.currentUser) {
       try {
        const testRef = collection(db, "users", auth.currentUser.uid, "mockTests");
         await addDoc(testRef, {
          testName: "SSC CGL English Mock 1",
          score: finalScore,
          total: testQuestions.length,
          date: new Date().toISOString()
        });
        console.log("✅ Score securely saved to Firestore!");
      } catch (error) {
        console.error("❌ Error saving score:", error);
      }
    }
  }, 
  [selectedAnswers]); // Har baar naye answer pe update hoga

  // ⏱️ Bulletproof Timer Logic
  useEffect(() => {
    if (isSubmitted) return;

    const timerId = setInterval(() => {
      setTimeLeft((prev) => {
        // Time check ab interval ke andar hai, isliye koi error nahi aayega
        if (prev <= 1) {
          clearInterval(timerId);
          handleSubmitTest(); 
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerId);
  }, [isSubmitted, handleSubmitTest]);

  // Time format (MM:SS)
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // 🟢 Answer Selection Handler
  const handleOptionSelect = (optionIndex) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQuestion]: optionIndex
    }));
  };

  // 🎨 Question Palette Color Logic
  const getQuestionStatus = (index) => {
    if (selectedAnswers[index] !== undefined) return 'attempted'; 
    if (index === currentQuestion) return 'active'; 
    return 'unattempted'; 
  };

  return (
    <>
      <div ref={cursorRef} className="custom-cursor"></div>

      <div style={{ backgroundColor: '#050505', minHeight: '100vh', color: '#f0f0f0', fontFamily: "'Poppins', sans-serif" }}>
        
        {/* --- NAVBAR --- */}
        <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 40px', background: '#0a0a0a', borderBottom: '1px solid #222', position: 'sticky', top: 0, zIndex: 100 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            {isSubmitted && (
              <button onClick={() => navigate('/dashboard')} style={{ background: 'transparent', border: '1px solid #444', color: '#fff', padding: '8px 15px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', transition: '0.3s' }}>
                ← Dashboard
              </button>
            )}
            <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#f0f0f0' }}>
              Innera<span style={{ color: '#e94560' }}>.</span> Test Engine
            </div>
          </div>
          
          {!isSubmitted && (
            <div style={{ 
              background: timeLeft < 60 ? 'rgba(233, 69, 96, 0.2)' : '#111', 
              color: timeLeft < 60 ? '#e94560' : '#fff', 
              border: timeLeft < 60 ? '1px solid #e94560' : '1px solid #333', 
              padding: '8px 20px', borderRadius: '50px', fontWeight: 'bold', 
              fontSize: '18px', display: 'flex', alignItems: 'center', gap: '10px', 
              transition: 'all 0.3s' 
            }}>
              ⏱️ {formatTime(timeLeft)}
            </div>
          )}
        </nav>

        {/* --- MAIN TEST INTERFACE --- */}
        <div style={{ padding: '30px 40px', maxWidth: '1400px', margin: '0 auto' }}>
          
          {isSubmitted ? (
            
            // 🏆 RESULT SCREEN
            <div style={{ background: '#0a0a0a', border: '1px solid #333', borderRadius: '20px', padding: '50px', textAlign: 'center', maxWidth: '600px', margin: '50px auto', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}>
              <div style={{ fontSize: '50px', marginBottom: '20px' }}>🎯</div>
              <h1 style={{ fontSize: '32px', marginBottom: '10px', fontWeight: 'bold' }}>Test Completed!</h1>
              <p style={{ color: '#888', fontSize: '15px', marginBottom: '30px' }}>Here is your performance overview for the SSC CGL Mock Test.</p>
              
              <div style={{ background: '#111', border: '1px solid #222', borderRadius: '16px', padding: '30px', marginBottom: '30px' }}>
                <div style={{ fontSize: '14px', color: '#aaa', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '10px' }}>Total Score</div>
                <div style={{ fontSize: '64px', fontWeight: '800', color: '#e94560', lineHeight: '1' }}>
                  {score} <span style={{ fontSize: '24px', color: '#555', fontWeight: '500' }}>/ {testQuestions.length}</span>
                </div>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'center', gap: '40px', padding: '20px 0', borderTop: '1px solid #222', borderBottom: '1px solid #222' }}>
                <div>
                  <div style={{ color: '#888', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '5px' }}>Accuracy</div>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#fff' }}>{Math.round((score / testQuestions.length) * 100)}%</div>
                </div>
                <div style={{ width: '1px', background: '#333' }}></div>
                <div>
                  <div style={{ color: '#888', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '5px' }}>Attempted</div>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#fff' }}>{Object.keys(selectedAnswers).length}</div>
                </div>
              </div>

              <button 
                onClick={() => navigate('/dashboard')}
                style={{ width: '100%', marginTop: '30px', padding: '16px', background: '#e94560', color: 'white', border: 'none', borderRadius: '12px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', transition: '0.3s' }}>
                Back to Dashboard
              </button>
            </div>

          ) : (
            
            // 📝 ACTIVE TEST SCREEN
            <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
              
              <div style={{ flex: '1 1 70%', background: '#0a0a0a', border: '1px solid #222', borderRadius: '16px', padding: '40px', display: 'flex', flexDirection: 'column', minHeight: '600px' }}>
                <div style={{ fontSize: '14px', color: '#e94560', fontWeight: 'bold', marginBottom: '15px', letterSpacing: '1px', textTransform: 'uppercase' }}>
                  Question {currentQuestion + 1} of {testQuestions.length}
                </div>
                <div style={{ fontSize: '22px', fontWeight: '500', lineHeight: '1.6', marginBottom: '40px', color: '#fff' }}>
                  {testQuestions[currentQuestion].question}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', flex: 1 }}>
                  {testQuestions[currentQuestion].options.map((option, index) => {
                    const isSelected = selectedAnswers[currentQuestion] === index;
                    return (
                      <div 
                        key={index}
                        onClick={() => handleOptionSelect(index)}
                        style={{
                          padding: '18px 25px', borderRadius: '12px', cursor: 'pointer',
                          background: isSelected ? 'rgba(233, 69, 96, 0.1)' : '#111',
                          border: isSelected ? '1px solid #e94560' : '1px solid #333',
                          display: 'flex', alignItems: 'center', gap: '15px',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <div style={{ 
                          width: '22px', height: '22px', borderRadius: '50%', 
                          border: isSelected ? '6px solid #e94560' : '2px solid #555', 
                          background: isSelected ? '#fff' : 'transparent',
                          transition: 'all 0.2s'
                        }}></div>
                        <span style={{ fontSize: '16px', color: isSelected ? '#fff' : '#ccc', fontWeight: isSelected ? '500' : 'normal' }}>
                          {option}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '40px', borderTop: '1px solid #222', paddingTop: '25px' }}>
                  <button 
                    onClick={() => setCurrentQuestion((prev) => Math.max(0, prev - 1))}
                    disabled={currentQuestion === 0}
                    style={{ padding: '12px 30px', background: 'transparent', border: '1px solid #444', borderRadius: '8px', color: '#fff', cursor: currentQuestion === 0 ? 'not-allowed' : 'pointer', opacity: currentQuestion === 0 ? 0.4 : 1, fontWeight: 'bold' }}>
                    Previous
                  </button>
                  
                  {currentQuestion === testQuestions.length - 1 ? (
                    <button 
                      onClick={handleSubmitTest}
                      style={{ padding: '12px 40px', background: '#e94560', border: 'none', borderRadius: '8px', color: '#fff', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 15px rgba(233, 69, 96, 0.4)' }}>
                      Submit Test
                    </button>
                  ) : (
                    <button 
                      onClick={() => setCurrentQuestion((prev) => Math.min(testQuestions.length - 1, prev + 1))}
                      style={{ padding: '12px 40px', background: '#fff', color: '#000', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
                      Next
                    </button>
                  )}
                </div>
              </div>

              <div style={{ flex: '1 1 25%', background: '#0a0a0a', border: '1px solid #222', borderRadius: '16px', padding: '25px', alignSelf: 'flex-start' }}>
                <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: '600' }}>Question Palette</h3>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '30px' }}>
                  {testQuestions.map((_, index) => {
                    const status = getQuestionStatus(index);
                    let bgColor = '#111';
                    let borderColor = '#333';
                    let color = '#888';

                    if (status === 'attempted') {
                      bgColor = 'rgba(76, 175, 80, 0.15)'; borderColor = '#4caf50'; color = '#4caf50';
                    } else if (status === 'active') {
                      bgColor = '#fff'; borderColor = '#fff'; color = '#000';
                    }

                    return (
                      <div 
                        key={index}
                        onClick={() => setCurrentQuestion(index)}
                        style={{
                          aspectRatio: '1', display: 'flex', justifyContent: 'center', alignItems: 'center',
                          background: bgColor, border: `1px solid ${borderColor}`, color: color,
                          borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px',
                          transition: 'all 0.2s'
                        }}
                      >
                        {index + 1}
                      </div>
                    );
                  })}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px', color: '#888', background: '#111', padding: '15px', borderRadius: '10px', border: '1px solid #222' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><div style={{ width: '14px', height: '14px', background: '#fff', borderRadius: '4px' }}></div> Current</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><div style={{ width: '14px', height: '14px', background: 'rgba(76, 175, 80, 0.2)', border: '1px solid #4caf50', borderRadius: '4px' }}></div> Answered</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><div style={{ width: '14px', height: '14px', background: '#111', border: '1px solid #333', borderRadius: '4px' }}></div> Unanswered</div>
                </div>

                <button 
                  onClick={handleSubmitTest}
                  style={{ width: '100%', marginTop: '30px', padding: '14px', background: 'transparent', border: '1px solid #e94560', color: '#e94560', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', transition: '0.3s' }}>
                  Submit Test Early
                </button>
              </div>

            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default MockTest;