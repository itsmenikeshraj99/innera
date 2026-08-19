import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, signOut, sendEmailVerification } from 'firebase/auth';
import { auth, googleProvider, facebookProvider } from './firebase'; 
import gsap from 'gsap';
import './App.css';

function App() {
  const navigate = useNavigate();
  const cursorRef = useRef(null);
  const heroRef = useRef(null);
  
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login'); 
  const [countryCode, setCountryCode] = useState('+91'); 
  
  const [authMessage, setAuthMessage] = useState({ type: '', text: '' });
  
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', phone: '', password: '', confirmPassword: ''
  });

  useEffect(() => {
    const onMouseMove = (e) => {
      gsap.to(cursorRef.current, { x: e.clientX, y: e.clientY, duration: 0.15, ease: 'power2.out' });
    };
    window.addEventListener('mousemove', onMouseMove);

    if (heroRef.current) {
      gsap.fromTo(heroRef.current.children, 
        { y: 40, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 1, stagger: 0.2, ease: "power3.out", delay: 0.2 }
      );
    }
    return () => window.removeEventListener('mousemove', onMouseMove);
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 📧 Email/Password Form Submit
  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setAuthMessage({ type: '', text: '' }); 
    
    try {
      if (authMode === 'register') {
        if (formData.password !== formData.confirmPassword) {
          return setAuthMessage({ type: 'error', text: "Passwords do not match!" });
        }
        
        const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
        
        await updateProfile(userCredential.user, {
          displayName: `${formData.firstName} ${formData.lastName}`
        });

        await sendEmailVerification(userCredential.user);
        await signOut(auth);
        
        setAuthMode('login'); 
        setAuthMessage({ 
          type: 'success', 
          text: "Account created successfully! A verification link has been sent to your email. Please verify before logging in." 
        });
        
      } else {
        const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
        
        if (!userCredential.user.emailVerified) {
          await signOut(auth); 
          // ⚠️ Yahan warning aayegi jiske baad user Resend button dekh payega
          return setAuthMessage({ 
            type: 'warning', 
            text: "Please verify your email. A verify link was sent to your inbox. If you can't find it, please check your Spam Folder." 
          });
        }

        setShowAuthModal(false);
        navigate('/dashboard'); 
      }
    } catch (error) {
      let cleanError = error.message.replace("Firebase: ", "");
      setAuthMessage({ type: 'error', text: cleanError });
    }
  };

  // 🔄 NAYA FUNCTION: Resend Verification Email
  const handleResendVerification = async () => {
    setAuthMessage({ type: '', text: '' }); // Clear old message
    try {
      // User ke current form data se temporarily login karo taaki Firebase user object mil sake
      const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
      
      // Naya email bhejo
      await sendEmailVerification(userCredential.user);
      
      // Turant wapas logout kar do
      await signOut(auth);
      
      setAuthMessage({ type: 'success', text: "✅ A new verification link has been sent! Please check your email." });
    } catch (error) {
      let cleanError = error.message.replace("Firebase: ", "");
      setAuthMessage({ type: 'error', text: "Failed to resend. Please check your credentials: " + cleanError });
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      setShowAuthModal(false);
      navigate('/onboarding');
    } catch (error) {
      setAuthMessage({ type: 'error', text: error.message });
    }
  };

  const handleFacebookLogin = async () => {
    try {
      await signInWithPopup(auth, facebookProvider);
      setShowAuthModal(false);
      navigate('/onboarding');
    } catch (error) {
      console.error("Facebook Login Error", error);
       setAuthMessage({ type: 'error', text: "Facebook Login Failed." });
    }
  };

  const closeModal = () => {
    setShowAuthModal(false);
    setAuthMessage({ type: '', text: '' });
  };

  const toggleAuthMode = () => {
    setAuthMode(authMode === 'login' ? 'register' : 'login');
    setAuthMessage({ type: '', text: '' });
  };

  const inputStyle = {
    width: '100%', padding: '12px 15px', background: 'rgba(255,255,255,0.05)', 
    border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white', 
    marginBottom: '15px', outline: 'none', fontSize: '14px'
  };

  return (
    <>
      <div ref={cursorRef} className="custom-cursor"></div>

      <div style={{ backgroundColor: '#050505', minHeight: '100vh', color: '#f0f0f0', fontFamily: "'Poppins', sans-serif", overflowX: 'hidden', position: 'relative' }}>
        
        {/* --- NAVBAR --- */}
        <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 50px', background: 'rgba(5, 5, 5, 0.8)', backdropFilter: 'blur(10px)', position: 'sticky', top: 0, zIndex: 100, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#f0f0f0', letterSpacing: '1px' }}>
            Innera<span style={{ color: '#e94560' }}>.</span>
          </div>
          <div style={{ display: 'flex', gap: '35px', alignItems: 'center', fontSize: '15px' }}>
            <span style={{ cursor: 'pointer', color: '#aaa', transition: 'color 0.3s' }}>Home</span>
            <span style={{ cursor: 'pointer', color: '#aaa', transition: 'color 0.3s' }}>Courses</span>
            <span style={{ cursor: 'pointer', color: '#aaa', transition: 'color 0.3s' }}>AI Tutor</span>
            <button 
              onClick={() => { setAuthMode('login'); setShowAuthModal(true); }} 
              style={{ padding: '10px 24px', background: 'white', color: 'black', borderRadius: '50px', cursor: 'pointer', fontWeight: '600', border: 'none', transition: 'transform 0.3s ease' }}>
              Login / Register
            </button>
          </div>
        </nav>

        {/* --- HERO SECTION --- */}
        <section ref={heroRef} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '120px 20px 80px', minHeight: '75vh', position: 'relative' }}>
          <div style={{ position: 'absolute', top: '10%', left: '50%', transform: 'translateX(-50%)', width: '60vw', height: '60vw', background: 'radial-gradient(circle, rgba(233,69,96,0.15) 0%, rgba(5,5,5,0) 70%)', zIndex: 0, pointerEvents: 'none' }}></div>
          <div style={{ padding: '8px 20px', background: 'rgba(255, 255, 255, 0.05)', color: '#fff', borderRadius: '50px', fontSize: '14px', fontWeight: '500', marginBottom: '25px', border: '1px solid rgba(255, 255, 255, 0.1)', zIndex: 1, backdropFilter: 'blur(5px)' }}>
            ✨ AI-Powered Learning Platform
          </div>
          <h1 style={{ fontSize: '5.5vw', margin: '0 0 20px 0', maxWidth: '900px', lineHeight: '1.1', fontWeight: '800', zIndex: 1, letterSpacing: '-1.5px' }}>
            Master Your Exams with <br />
            <span style={{ background: 'linear-gradient(135deg, #e94560 0%, #ff8a9d 100%)', WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Intelligent Practice</span>
          </h1>
          <p style={{ fontSize: '1.2rem', color: '#888', maxWidth: '650px', margin: '0 0 45px 0', lineHeight: '1.6', zIndex: 1, fontWeight: '300' }}>
            Experience personalized mock tests, interactive video classes, and a 24/7 AI tutor designed specifically for competitive excellence.
          </p>
          <div style={{ zIndex: 1 }}>
            <button 
              onClick={() => { setAuthMode('login'); setShowAuthModal(true); }} 
              style={{ padding: '16px 40px', background: 'white', color: 'black', border: 'none', borderRadius: '50px', fontSize: '18px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.3s ease', boxShadow: '0 4px 15px rgba(255,255,255,0.2)' }}>
              Get Started
            </button>
          </div>
        </section>

        {/* --- TRENDING COURSES --- */}
        <section style={{ padding: '80px 50px', background: '#0a0a0a', borderTop: '1px solid #111' }}>
           <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center', color: '#888' }}>
              <p>Explore Top Categories Module (Hidden for brevity)</p>
           </div>
        </section>

        {/* --- FOOTER --- */}
        <footer style={{ textAlign: 'center', padding: '40px', background: '#050505', color: '#555', borderTop: '1px solid #111' }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#fff', marginBottom: '10px' }}>Innera.</div>
          <p style={{ margin: 0, fontSize: '14px' }}>© 2026 Innera Education. Empowering minds.</p>
        </footer>

        {/* =========================================
            ADVANCED AUTH MODAL (LOGIN & REGISTER)
            ========================================= */}
        {showAuthModal && (
          <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0, 0, 0, 0.8)', backdropFilter: 'blur(8px)',
            display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000,
            padding: '20px'
          }}>
            <div style={{
              background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '24px',
              padding: '40px', width: '100%', maxWidth: '420px', textAlign: 'center',
              boxShadow: '0 20px 50px rgba(0,0,0,0.5)', position: 'relative',
              maxHeight: '90vh', overflowY: 'auto' 
            }}>
              
              <button onClick={closeModal} style={{ position: 'absolute', top: '20px', right: '20px', background: 'transparent', border: 'none', color: '#888', fontSize: '20px', cursor: 'pointer' }}>✖</button>

              <h2 style={{ fontSize: '24px', marginBottom: '5px', color: '#fff' }}>
                {authMode === 'login' ? 'Welcome Back' : 'Create an Account'}
              </h2>
              <p style={{ color: '#888', fontSize: '14px', marginBottom: '20px' }}>
                {authMode === 'login' ? 'Log in to continue your learning.' : 'Join Innera to start your journey.'}
              </p>

              {/* 🆕 MESSAGE BOX & RESEND BUTTON */}
              {authMessage.text && (
                <div style={{
                  padding: '12px 15px',
                  marginBottom: '20px',
                  borderRadius: '8px',
                  fontSize: '13px',
                  textAlign: 'left',
                  lineHeight: '1.5',
                  background: authMessage.type === 'error' ? 'rgba(233, 69, 96, 0.1)' : authMessage.type === 'warning' ? 'rgba(255, 193, 7, 0.1)' : 'rgba(76, 175, 80, 0.1)',
                  color: authMessage.type === 'error' ? '#e94560' : authMessage.type === 'warning' ? '#ffc107' : '#4caf50',
                  border: `1px solid ${authMessage.type === 'error' ? 'rgba(233, 69, 96, 0.3)' : authMessage.type === 'warning' ? 'rgba(255, 193, 7, 0.3)' : 'rgba(76, 175, 80, 0.3)'}`
                }}>
                  {authMessage.type === 'warning' ? '⚠️ ' : authMessage.type === 'error' ? '❌ ' : '✅ '}
                  {authMessage.text}
                  
                  {/* Agar Type warning hai, toh resend link dikhao */}
                  {authMessage.type === 'warning' && (
                    <button 
                      onClick={handleResendVerification}
                      style={{
                        display: 'block', marginTop: '10px', background: '#ffc107', color: '#000', 
                        border: 'none', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', 
                        fontWeight: 'bold', cursor: 'pointer'
                      }}>
                      🔄 Resend Verification Email
                    </button>
                  )}
                </div>
              )}

              {/* 📧 MANUAL FORM */}
              <form onSubmit={handleEmailAuth} style={{ textAlign: 'left' }}>
                
                {authMode === 'register' && (
                  <>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <input type="text" name="firstName" placeholder="First Name" required style={inputStyle} onChange={handleInputChange} />
                      <input type="text" name="lastName" placeholder="Last Name" required style={inputStyle} onChange={handleInputChange} />
                    </div>
                    
                    <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                      <select 
                        value={countryCode} 
                        onChange={(e) => setCountryCode(e.target.value)}
                        style={{ ...inputStyle, width: '35%', marginBottom: '0', cursor: 'pointer', background: '#1a1a1a', color: '#fff' }}>
                        <option value="+91">🇮🇳 +91</option>
                        <option value="+1">🇺🇸 +1</option>
                        <option value="+44">🇬🇧 +44</option>
                        <option value="+61">🇦🇺 +61</option>
                      </select>
                      <input type="tel" name="phone" placeholder="Phone Number" required style={{ ...inputStyle, width: '65%', marginBottom: '0' }} onChange={handleInputChange} />
                    </div>
                  </>
                )}

                <input type="email" name="email" placeholder="Email Address" required style={inputStyle} onChange={handleInputChange} />
                <input type="password" name="password" placeholder="Password" required style={inputStyle} onChange={handleInputChange} />

                {authMode === 'register' && (
                  <input type="password" name="confirmPassword" placeholder="Confirm Password" required style={inputStyle} onChange={handleInputChange} />
                )}

                <button type="submit" style={{ width: '100%', padding: '14px', background: '#e94560', color: 'white', border: 'none', borderRadius: '12px', fontSize: '16px', fontWeight: '600', cursor: 'pointer', marginBottom: '20px', transition: '0.3s' }}>
                  {authMode === 'login' ? 'Log In' : 'Sign Up'}
                </button>
              </form>

              {/* 🔄 TOGGLE BUTTON */}
              <div style={{ fontSize: '14px', color: '#aaa', marginBottom: '25px' }}>
                {authMode === 'login' ? "Don't have an account? " : "Already have an account? "}
                <span 
                  onClick={toggleAuthMode} 
                  style={{ color: '#e94560', cursor: 'pointer', fontWeight: 'bold' }}>
                  {authMode === 'login' ? 'Sign Up' : 'Log In'}
                </span>
              </div>

              {/* DIVIDER */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', color: '#555', fontSize: '12px', fontWeight: 'bold' }}>
                <div style={{ flex: 1, height: '1px', background: '#333' }}></div>
                OR CONTINUE WITH
                <div style={{ flex: 1, height: '1px', background: '#333' }}></div>
              </div>

              {/* SOCIAL BUTTONS */}
              <div style={{ display: 'flex', gap: '15px' }}>
                <button onClick={handleGoogleLogin} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', padding: '12px', background: 'white', color: 'black', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>
                  <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="G" style={{ width: '18px' }} /> Google
                </button>
                <button onClick={handleFacebookLogin} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', padding: '12px', background: '#1877F2', color: 'white', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>
                  <img src="https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg" alt="F" style={{ width: '18px' }} /> Facebook
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </>
  );
}

export default App;