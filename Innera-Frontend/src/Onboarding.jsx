import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, setDoc } from 'firebase/firestore'; // Firestore functions
import { auth, db } from './firebase'; // Firebase config import kiya

function Onboarding() {
  const navigate = useNavigate();
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const goals = [
    { id: 'school', title: 'School Boards', desc: 'CBSE, ICSE & State Boards (Class 6-12)' },
    { id: 'entrance', title: 'Entrance Exams', desc: 'JEE, NEET & CUET Preparation' },
    { id: 'competitive', title: 'Competitive Exams', desc: 'SSC CGL, Banking, UPSC & Railways' }
  ];

  const handleContinue = async () => {
    if (!selectedGoal) {
      alert("Please select a goal to continue.");
      return;
    }

    const user = auth.currentUser; // Check kiya kaun login hai
    
    if (user) {
      setIsSaving(true);
      try {
        // Firestore ke 'users' collection me user ki ID se ek document banaya
        await setDoc(doc(db, "users", user.uid), {
          targetGoal: selectedGoal,
          email: user.email,
          name: user.displayName,
          updatedAt: new Date()
        }, { merge: true }); // merge: true se purana data delete nahi hoga

        // Save hone ke baad Dashboard bhej diya
        navigate('/dashboard');
      } catch (error) {
        console.error("Error saving goal: ", error);
        alert("❌ Failed to save your goal. Please try again.");
        setIsSaving(false);
      }
    } else {
      alert("⚠️ No user logged in. Please login first.");
      navigate('/');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: '#1a1a2e', color: 'white', fontFamily: 'sans-serif', padding: '20px' }}>
      <h1 style={{ marginBottom: '10px' }}>What are you preparing for? 🎯</h1>
      <p style={{ color: '#ccc', marginBottom: '40px' }}>Select your goal to personalize your Innera experience.</p>

      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
        {goals.map((goal) => (
          <div key={goal.id} onClick={() => setSelectedGoal(goal.title)}
            style={{ width: '250px', padding: '20px', borderRadius: '12px', border: selectedGoal === goal.title ? '2px solid #e94560' : '2px solid transparent', background: 'rgba(255,255,255,0.05)', cursor: 'pointer', transition: 'all 0.3s ease', textAlign: 'center' }}>
            <h3 style={{ margin: '0 0 10px 0', color: selectedGoal === goal.title ? '#e94560' : 'white' }}>{goal.title}</h3>
            <p style={{ fontSize: '14px', color: '#aaa', margin: 0 }}>{goal.desc}</p>
          </div>
        ))}
      </div>

      <button onClick={handleContinue} disabled={isSaving}
        style={{ marginTop: '40px', padding: '12px 40px', borderRadius: '8px', border: 'none', background: selectedGoal ? '#e94560' : '#555', color: 'white', cursor: selectedGoal && !isSaving ? 'pointer' : 'not-allowed', fontWeight: 'bold', fontSize: '16px', transition: 'background 0.3s' }}>
        {isSaving ? "Saving..." : "Continue to Dashboard"}
      </button>
    </div>
  );
}

export default Onboarding;