import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import gsap from 'gsap';
import './App.css'; 

const courseModules = [
  { id: 1, title: "1. Basic English Grammar Rules", duration: "12:45", url: "https://www.w3schools.com/html/mov_bbb.mp4" },
  { id: 2, title: "2. Subject-Verb Agreement", duration: "25:10", url: "https://www.w3schools.com/html/mov_bbb.mp4" },
  { id: 3, title: "3. Active and Passive Voice", duration: "18:30", url: "https://www.w3schools.com/html/mov_bbb.mp4" },
  { id: 4, title: "4. Direct and Indirect Narration", duration: "22:15", url: "https://www.w3schools.com/html/mov_bbb.mp4" },
  { id: 5, title: "5. Error Spotting Tricks", duration: "15:00", url: "https://www.w3schools.com/html/mov_bbb.mp4" },
];

function Classroom() {
  const navigate = useNavigate();
  const cursorRef = useRef(null);
  const classroomRef = useRef(null);
  const chatEndRef = useRef(null); // Chat scroll ke liye
  
  const videoRef = useRef(null);
  const [activeVideo, setActiveVideo] = useState(courseModules[0]);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState('00:00');
  const [duration, setDuration] = useState('00:00');
  const [remainingTime, setRemainingTime] = useState('-00:00');
  const [showRemaining, setShowRemaining] = useState(false); 
  
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [quality, setQuality] = useState('Auto'); 
  const [displayQuality, setDisplayQuality] = useState('Auto (1080p)');

  // 🤖 AI CHATBOT STATES
  const [showChat, setShowChat] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'ai', text: "Hello! I am your Innera AI Tutor. 🤖 I can help you with English Grammar, Math, or any SSC CGL doubts. What's confusing you today?" }
  ]);

  useEffect(() => {
    const onMouseMove = (e) => {
      gsap.to(cursorRef.current, { x: e.clientX, y: e.clientY, duration: 0.15, ease: 'power2.out' });
    };
    window.addEventListener('mousemove', onMouseMove);
    return () => window.removeEventListener('mousemove', onMouseMove);
  }, []);

 // 📶 1. Auto Quality Adjust Logic (Fix for synchronous setState error)
  useEffect(() => {
    // Isko setTimeout mein daal diya taaki linter strict warning na de
    const timer = setTimeout(() => {
      if (quality === 'Auto') {
        const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        if (conn) {
          if (conn.effectiveType === '4g') setDisplayQuality('Auto (1080p)');
          else if (conn.effectiveType === '3g') setDisplayQuality('Auto (720p)');
          else setDisplayQuality('Auto (480p)');
        } else {
          setDisplayQuality('Auto (720p)');
        }
      } else {
        setDisplayQuality(quality);
      }
    }, 0);
    
    return () => clearTimeout(timer);
  }, [quality]);

  // ▶️ 2. Video Load Logic (Fix for missing dependency error)
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.load();
      videoRef.current.play();
      setIsPlaying(true);
      videoRef.current.playbackRate = playbackSpeed; 
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeVideo]); // 👈 Linter ignore line add kar di taaki speed change par video shuru se load na ho

  // Har naye message par scroll down karna
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const formatTime = (timeInSeconds) => {
    if (isNaN(timeInSeconds) || timeInSeconds < 0) return "00:00";
    const m = Math.floor(timeInSeconds / 60).toString().padStart(2, '0');
    const s = Math.floor(timeInSeconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.ended) {
      videoRef.current.currentTime = 0;
      videoRef.current.play();
      setIsPlaying(true);
    } else if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const current = videoRef.current.currentTime;
    const total = videoRef.current.duration;
    setCurrentTime(formatTime(current));
    setProgress((current / total) * 100);
    setRemainingTime("-" + formatTime(total - current)); 
  };

  const handleVideoEnded = () => {
    setIsPlaying(false);
    setProgress(100);
  };

  const handleLoadedData = () => {
    setDuration(formatTime(videoRef.current.duration));
  };

  const handleSeek = (e) => {
    const newProgress = e.target.value;
    setProgress(newProgress);
    videoRef.current.currentTime = (newProgress / 100) * videoRef.current.duration;
  };

  const handleSpeedChange = (e) => {
    const newSpeed = parseFloat(e.target.value);
    videoRef.current.playbackRate = newSpeed;
    setPlaybackSpeed(newSpeed);
  };

  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      }
    }
  };

  // 🚀 GEMINI API INTEGRATION LOGIC
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userText = chatInput.trim();
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setChatInput('');
    setIsTyping(true);

    try {
      const API_KEY = import.meta.env.VITE_GEMINI_API_KEY; 
      
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key=${API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ 
            parts: [{ 
              text: `Act as an expert, friendly EdTech tutor for a platform called Innera. You teach SSC CGL and School Board students. The student is currently studying: "${activeVideo.title}". Keep answers very concise, encouraging, and format with emojis or bullet points if needed. Student doubt: "${userText}"` 
            }] 
          }]
        })
      });

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error.message);
      }

      const aiText = data.candidates[0].content.parts[0].text;
      setMessages(prev => [...prev, { role: 'ai', text: aiText }]);

    } catch (error) {
      console.error("Gemini Error:", error);
      setMessages(prev => [...prev, { role: 'ai', text: "❌ Oops! My brain (API) is taking a nap. Please check the API key or internet connection." }]);
    } finally {
      setIsTyping(false);
    }
  };

  const selectStyle = {
    background: '#1a1a1a', color: '#fff', border: '1px solid #444', 
    borderRadius: '4px', padding: '4px 8px', cursor: 'pointer', outline: 'none', fontSize: '13px'
  };

  const speedOptions = [0.25, 0.50, 0.75, 1.0, 1.25, 1.50, 1.75, 2.0, 2.25, 2.50, 2.75, 3.0];

  return (
    <>
      <div ref={cursorRef} className="custom-cursor"></div>

      <div style={{ backgroundColor: '#050505', minHeight: '100vh', color: '#f0f0f0', fontFamily: "'Poppins', sans-serif", position: 'relative' }}>
        
        {/* --- NAVBAR --- */}
        <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 40px', background: '#0a0a0a', borderBottom: '1px solid #222', position: 'sticky', top: 0, zIndex: 100 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <button onClick={() => navigate('/dashboard')} style={{ background: 'transparent', border: '1px solid #444', color: '#fff', padding: '8px 15px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
              ← Back
            </button>
            <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#f0f0f0' }}>
              Innera<span style={{ color: '#e94560' }}>.</span> Classroom
            </div>
          </div>
          {/* AI DOUBT SOLVER BUTTON */}
          <button 
            onClick={() => setShowChat(!showChat)}
            style={{ 
              background: showChat ? '#fff' : '#e94560', 
              color: showChat ? '#000' : 'white', 
              border: 'none', padding: '10px 20px', borderRadius: '50px', 
              fontWeight: 'bold', cursor: 'pointer', transition: '0.3s' 
            }}>
            {showChat ? 'Close Tutor ✖' : '🤖 AI Doubt Solver'}
          </button>
        </nav>

        {/* --- MAIN CLASSROOM LAYOUT --- */}
        <div ref={classroomRef} style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', padding: '30px 40px', maxWidth: '1600px', margin: '0 auto' }}>
          
          {/* LEFT SIDE: VIDEO PLAYER */}
          <div style={{ flex: '1 1 65%', display: 'flex', flexDirection: 'column', gap: '15px' }}>
            
            <div style={{ width: '100%', background: '#000', borderRadius: '12px 12px 0 0', overflow: 'hidden', border: '1px solid #333', borderBottom: 'none', aspectRatio: '16/9' }}>
              <video 
                ref={videoRef}
                onClick={togglePlay}
                onTimeUpdate={handleTimeUpdate}
                onLoadedData={handleLoadedData}
                onEnded={handleVideoEnded} 
                style={{ width: '100%', height: '100%', objectFit: 'cover', cursor: 'pointer' }}
              >
                <source src={activeVideo.url} type="video/mp4" />
              </video>
            </div>

            <div style={{ background: '#111', padding: '15px 20px', borderRadius: '0 0 12px 12px', border: '1px solid #333', display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <div style={{ fontSize: '13px', color: '#ccc', width: '40px', textAlign: 'center' }}>{currentTime}</div>
                <input type="range" min="0" max="100" value={progress} onChange={handleSeek} style={{ flex: 1, cursor: 'pointer', accentColor: '#e94560' }} />
                <div onClick={() => setShowRemaining(!showRemaining)} style={{ fontSize: '13px', color: '#ccc', width: '50px', textAlign: 'center', cursor: 'pointer', userSelect: 'none' }} title="Toggle remaining time">
                  {showRemaining ? remainingTime : duration}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <button onClick={togglePlay} style={{ background: 'none', border: 'none', color: '#fff', fontSize: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                  {isPlaying ? '⏸' : '▶'}
                </button>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <select value={playbackSpeed} onChange={handleSpeedChange} style={selectStyle}>
                    {speedOptions.map(speed => ( <option key={speed} value={speed}>{speed === 1.0 ? '1.00x Normal' : `${speed.toFixed(2)}x`}</option> ))}
                  </select>
                  <select value={quality} onChange={(e) => setQuality(e.target.value)} style={selectStyle}>
                    <option value="Auto">⚡ Auto</option><option value="1080p">1080p</option><option value="720p">720p</option><option value="480p">480p</option>
                  </select>
                  <button onClick={toggleFullscreen} style={{ background: 'none', border: '1px solid #444', borderRadius: '4px', padding: '4px 8px', color: '#fff', fontSize: '12px', cursor: 'pointer', fontWeight: 'bold' }}>⛶ Fullscreen</button>
                </div>
              </div>
            </div>

            <div style={{ background: '#0a0a0a', padding: '25px', borderRadius: '12px', border: '1px solid #222', marginTop: '5px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <h1 style={{ fontSize: '24px', margin: 0, fontWeight: '600' }}>{activeVideo.title}</h1>
                <span style={{ background: 'rgba(233,69,96,0.1)', color: '#e94560', padding: '4px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold' }}>{displayQuality}</span>
              </div>
              <p style={{ color: '#aaa', lineHeight: '1.6', fontSize: '15px', margin: 0 }}>
                In this session, we will cover the core concepts of {activeVideo.title.replace(/[0-9.]/g, '')}. 
              </p>
            </div>
          </div>

          {/* RIGHT SIDE: SYLLABUS */}
          <div style={{ flex: '1 1 30%', background: '#0a0a0a', borderRadius: '12px', border: '1px solid #222', display: 'flex', flexDirection: 'column', maxHeight: 'calc(100vh - 120px)' }}>
            <div style={{ padding: '20px', borderBottom: '1px solid #222' }}>
              <h2 style={{ fontSize: '18px', fontWeight: '600', margin: 0 }}>Course Content</h2>
            </div>
            <div style={{ overflowY: 'auto', padding: '10px' }}>
              {courseModules.map((module) => (
                <div key={module.id} onClick={() => setActiveVideo(module)}
                  style={{ 
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
                    padding: '15px', marginBottom: '8px', borderRadius: '8px', cursor: 'pointer',
                    background: activeVideo.id === module.id ? 'rgba(233, 69, 96, 0.1)' : 'transparent',
                    border: activeVideo.id === module.id ? '1px solid rgba(233, 69, 96, 0.3)' : '1px solid transparent',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div style={{ width: '30px', height: '30px', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', background: activeVideo.id === module.id ? '#e94560' : '#333', color: '#fff', fontSize: '12px' }}>
                      {activeVideo.id === module.id ? '▶' : '🔒'}
                    </div>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: activeVideo.id === module.id ? '600' : '400', color: activeVideo.id === module.id ? '#e94560' : '#fff' }}>{module.title}</div>
                      <div style={{ fontSize: '12px', color: '#666', marginTop: '3px' }}>Video • {module.duration}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* =========================================
            🤖 AI CHAT FLOATING WIDGET
            ========================================= */}
        {showChat && (
          <div style={{ 
            position: 'fixed', bottom: '20px', right: '30px', width: '360px', height: '500px', 
            background: 'rgba(10, 10, 10, 0.95)', border: '1px solid #333', borderRadius: '16px', 
            boxShadow: '0 20px 50px rgba(0,0,0,0.8)', zIndex: 1000, display: 'flex', flexDirection: 'column',
            backdropFilter: 'blur(10px)'
          }}>
            {/* Header */}
            <div style={{ padding: '15px 20px', background: '#e94560', borderRadius: '16px 16px 0 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ color: '#fff', fontWeight: 'bold', fontSize: '16px' }}>Innera AI Tutor</div>
              <button onClick={() => setShowChat(false)} style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '18px' }}>✖</button>
            </div>

            {/* Messages Area */}
            <div style={{ flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {messages.map((msg, index) => (
                <div key={index} style={{ 
                  alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                  background: msg.role === 'user' ? '#fff' : '#222',
                  color: msg.role === 'user' ? '#000' : '#fff',
                  padding: '10px 15px', borderRadius: '12px', maxWidth: '85%',
                  fontSize: '14px', lineHeight: '1.5',
                  borderBottomRightRadius: msg.role === 'user' ? '2px' : '12px',
                  borderBottomLeftRadius: msg.role === 'ai' ? '2px' : '12px'
                }}>
                  {/* React Markdown yahan baad mein add kar sakte hain list render ke liye, abhi ke liye text render hoga */}
                  <ReactMarkdown>{msg.text}</ReactMarkdown>
                </div>
              ))}
              
              {isTyping && (
                <div style={{ alignSelf: 'flex-start', background: '#222', padding: '10px 15px', borderRadius: '12px', fontSize: '14px', color: '#aaa' }}>
                  Typing... ✍️
                </div>
              )}
              <div ref={chatEndRef}></div>
            </div>

            {/* Input Box */}
            <form onSubmit={handleSendMessage} style={{ padding: '15px', borderTop: '1px solid #222', display: 'flex', gap: '10px' }}>
              <input 
                type="text" 
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask your doubt..." 
                style={{ flex: 1, padding: '12px 15px', background: '#1a1a1a', border: '1px solid #333', borderRadius: '50px', color: '#fff', outline: 'none', fontSize: '14px' }}
              />
              <button type="submit" disabled={isTyping} style={{ background: '#e94560', color: '#fff', border: 'none', width: '45px', height: '45px', borderRadius: '50%', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', opacity: isTyping ? 0.5 : 1 }}>
                ➤
              </button>
            </form>
          </div>
        )}

      </div>
    </>
  );
}

export default Classroom;