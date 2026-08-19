import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebase'; // Ensure your firebase path is correct
import gsap from 'gsap';
import './App.css';

function Dashboard() {
  const navigate = useNavigate();
  const cursorRef = useRef(null);
  const dashboardRef = useRef(null);
  
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [userData, setUserData] = useState({ name: 'Student', email: '' });
  const [userGoal, setUserGoal] = useState('Loading...');

  // 1. Cursor & Animation & Authentication Logic
  useEffect(() => {
    // Custom Cursor
    const onMouseMove = (e) => {
      gsap.to(cursorRef.current, { x: e.clientX, y: e.clientY, duration: 0.15, ease: 'power2.out' });
    };
    window.addEventListener('mousemove', onMouseMove);

    // Entry Animation
    if (!isPageLoading && dashboardRef.current) {
      gsap.fromTo(dashboardRef.current.children, 
        { opacity: 0, y: 20 }, 
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: "power3.out" }
      );
    }

    // 🔥 FAILSAFE TIMER: Agar Firebase 3 sec mein jawab na de, toh zabardasti loading band karo
    const timeoutId = setTimeout(() => {
      setIsPageLoading(false);
    }, 3000);

    // 🔒 Auth & Firestore Data Fetch
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserData({ name: user.displayName || 'Student', email: user.email });
        
        try {
          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);
          
          if (docSnap.exists() && docSnap.data().targetGoal) {
            setUserGoal(docSnap.data().targetGoal);
          } else {
            // Agar goal nahi hai toh onboarding par bhejo
            navigate('/onboarding');
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          setUserGoal("SSC CGL (Default)");
        } finally {
          setIsPageLoading(false);
          clearTimeout(timeoutId); // Clear failsafe if data fetched successfully
        }

      } else {
        // Logged out
        navigate('/');
      }
    });

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      clearTimeout(timeoutId);
      unsubscribe();
    };
  }, [navigate, isPageLoading]);

  // 🚪 Logout Handler
  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error("Logout Error", error);
    }
  };

  // -------------------------
  // UI RENDER
  // -------------------------
  return (
    <>
      <div ref={cursorRef} className="custom-cursor"></div>

      <div style={{ backgroundColor: '#050505', minHeight: '100vh', color: '#f0f0f0', fontFamily: "'Poppins', sans-serif" }}>
        
        {/* ================= LOADING SCREEN WITH ESCAPE BUTTONS ================= */}
        {isPageLoading ? (
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh', gap: '20px' }}>
             <h2 style={{ color: '#fff', fontWeight: '600', letterSpacing: '1px' }}>Loading your classroom...</h2>
             <p style={{ color: '#888', fontSize: '14px', marginTop: '-15px' }}>Syncing data with Innera servers</p>
             
             {/* ESCAPE BUTTONS */}
             <div style={{ display: 'flex', gap: '15px', marginTop: '20px' }}>
               <button 
                 onClick={() => { setIsPageLoading(false); navigate('/'); }} 
                 style={{ padding: '10px 24px', background: '#e94560', color: 'white', border: 'none', borderRadius: '50px', cursor: 'pointer', fontWeight: 'bold' }}>
                 Go Back to Home
               </button>
               <button 
                 onClick={() => setIsPageLoading(false)} 
                 style={{ padding: '10px 24px', background: 'transparent', color: '#ccc', border: '1px solid #444', borderRadius: '50px', cursor: 'pointer' }}>
                 Force Open Dashboard
               </button>
             </div>
          </div>
        ) : (
          
          /* ================= MAIN DASHBOARD UI ================= */
          <div ref={dashboardRef}>
            
            {/* --- TOP NAVBAR --- */}
            <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 50px', background: 'rgba(5, 5, 5, 0.8)', borderBottom: '1px solid #222', position: 'sticky', top: 0, zIndex: 100, backdropFilter: 'blur(10px)' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#f0f0f0', letterSpacing: '1px' }}>
                Innera<span style={{ color: '#e94560' }}>.</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '25px' }}>
                <span style={{ color: '#aaa', fontSize: '14px' }}>Welcome, <span style={{ color: '#fff', fontWeight: 'bold' }}>{userData.name}</span></span>
                <button 
                  onClick={handleLogout}
                  style={{ padding: '8px 20px', background: 'transparent', color: '#aaa', border: '1px solid #444', borderRadius: '50px', cursor: 'pointer', fontSize: '13px', fontWeight: '600', transition: '0.3s' }}>
                  Log Out
                </button>
              </div>
            </nav>

            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
              
              {/* --- HERO GREETING --- */}
              <div style={{ marginBottom: '50px' }}>
                <h1 style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '10px' }}>
                  Let's conquer your <span style={{ color: '#e94560' }}>{userGoal}</span> exams! 🚀
                </h1>
                <p style={{ color: '#888', fontSize: '16px' }}>Pick up where you left off or test your knowledge today.</p>
              </div>

              {/* --- ACTION CARDS SECTION --- */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '25px', marginBottom: '50px' }}>
                
                {/* Card 1: Video Classroom */}
                <div style={{ background: '#0a0a0a', border: '1px solid #222', borderRadius: '16px', padding: '30px', transition: 'transform 0.3s', cursor: 'pointer' }}
                     onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                     onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                  <div style={{ fontSize: '30px', marginBottom: '15px' }}>📺</div>
                  <h3 style={{ fontSize: '20px', marginBottom: '10px' }}>Interactive Classes</h3>
                  <p style={{ color: '#888', fontSize: '14px', marginBottom: '20px', lineHeight: '1.6' }}>
                    Continue your syllabus with high-quality video lessons and expert faculties.
                  </p>
                  <button 
                    onClick={() => navigate('/classroom')}
                    style={{ width: '100%', padding: '12px', background: '#e94560', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
                    Start Learning
                  </button>
                </div>

                {/* Card 2: Mock Test Engine */}
                <div style={{ background: '#0a0a0a', border: '1px solid #222', borderRadius: '16px', padding: '30px', transition: 'transform 0.3s', cursor: 'pointer' }}
                     onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                     onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                  <div style={{ fontSize: '30px', marginBottom: '15px' }}>📝</div>
                  <h3 style={{ fontSize: '20px', marginBottom: '10px' }}>Live Mock Tests</h3>
                  <p style={{ color: '#888', fontSize: '14px', marginBottom: '20px', lineHeight: '1.6' }}>
                    Practice with TCS-pattern timed quizzes to boost your speed and accuracy.
                  </p>
                  <button 
                    onClick={() => navigate('/mocktest')}
                    style={{ width: '100%', padding: '12px', background: '#fff', color: '#000', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
                    Take a Test
                  </button>
                </div>

                {/* Card 3: Performance & Progress */}
                <div style={{ background: '#0a0a0a', border: '1px solid #222', borderRadius: '16px', padding: '30px', transition: 'transform 0.3s', cursor: 'not-allowed', opacity: 0.7 }}>
                  <div style={{ fontSize: '30px', marginBottom: '15px' }}>📊</div>
                  <h3 style={{ fontSize: '20px', marginBottom: '10px' }}>Analytics</h3>
                  <p style={{ color: '#888', fontSize: '14px', marginBottom: '20px', lineHeight: '1.6' }}>
                    Track your daily study hours, mock test scores, and weak topics.
                  </p>
                  <button 
                    disabled
                    style={{ width: '100%', padding: '12px', background: '#222', color: '#888', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'not-allowed' }}>
                    Coming Soon
                  </button>
                </div>

              </div>
              
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Dashboard;