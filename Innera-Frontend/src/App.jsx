import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import './App.css';

function App() {
  const inneraTextRef = useRef(null);
  const subtitleRef = useRef(null);
  const formRef = useRef(null);
  const cursorRef = useRef(null);
  const buttonRef = useRef(null); // Naya reference button ke liye
  const [email, setEmail] = useState('');

  useEffect(() => {
    // 1. Initial Reveal Animation
    const tl = gsap.timeline();
    tl.fromTo(
      inneraTextRef.current,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1.2, ease: 'power4.out' }
    )
    .fromTo(
      subtitleRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
      '-=0.8'
    )
    .fromTo(
      formRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
      '-=0.5'
    );

    // 2. Custom Cursor Tracking
    const onMouseMove = (e) => {
      gsap.to(cursorRef.current, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.15,
        ease: 'power2.out'
      });
    };
    window.addEventListener('mousemove', onMouseMove);

    // 3. Magnetic Button Effect Logic
    const btn = buttonRef.current;
    
    const magneticMove = (e) => {
      const rect = btn.getBoundingClientRect();
      // Mouse ki position button ke center se calculate karte hain
      const x = (e.clientX - rect.left) - rect.width / 2;
      const y = (e.clientY - rect.top) - rect.height / 2;

      // Button ko mouse ki taraf thoda sa shift karna (0.4 multiplier force control karta hai)
      gsap.to(btn, {
        x: x * 0.4,
        y: y * 0.4,
        duration: 0.3,
        ease: 'power2.out'
      });
    };

    const magneticLeave = () => {
      // Mouse hatne par button wapas 0,0 par elastic bounce ke saath aayega
      gsap.to(btn, {
        x: 0,
        y: 0,
        duration: 0.7,
        ease: 'elastic.out(1, 0.3)'
      });
    };

    if (btn) {
      btn.addEventListener('mousemove', magneticMove);
      btn.addEventListener('mouseleave', magneticLeave);
    }

    // Cleanup function
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      if (btn) {
        btn.removeEventListener('mousemove', magneticMove);
        btn.removeEventListener('mouseleave', magneticLeave);
      }
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Backend ko request bhej rahe hain
      const response = await fetch('http://127.0.0.1:8000/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("🎉 Success: " + data.message);
        setEmail(''); // Input box ko khali karne ke liye
      } else {
        alert("Oops! Kuch gadbad ho gayi.");
      }
    } catch (error) {
      console.error("Connection Error:", error);
      alert("Backend se connect nahi ho paya. Kya server chalu hai?");
    }
  };

  return (
    <>
      <div ref={cursorRef} className="custom-cursor"></div>

      <div className="innera-intro-container">
        <div className="background-gradient"></div>
        <div className="content">
          <h1 ref={inneraTextRef} className="hero-text">
            Innera
          </h1>
          <p ref={subtitleRef} className="subtitle-text">
            Redefining Education through Immersive Experiences.
          </p>

          <form ref={formRef} className="waitlist-form" onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Enter your email address"
              className="email-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button 
              ref={buttonRef} 
              type="submit" 
              className="join-btn"
            >
              Join Waitlist
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default App;