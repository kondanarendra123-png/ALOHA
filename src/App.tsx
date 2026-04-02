/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, ReactNode, FormEvent, useEffect } from "react";
import { motion } from "motion/react";
import { Calendar, Clock, MapPin, Sparkles, GraduationCap, PartyPopper, LogIn, UserPlus, LogOut } from "lucide-react";
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  onAuthStateChanged, 
  signOut,
  User,
  GoogleAuthProvider,
  signInWithPopup
} from "firebase/auth";
import { auth } from "./firebase";

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleAuth = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError("");
    setLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 text-white font-sans overflow-x-hidden">
      {/* Falling Confetti and Balloons Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {/* Confetti (Blast Papers) */}
        {[...Array(25)].map((_, i) => (
          <motion.div
            key={`confetti-${i}`}
            className="absolute w-2 h-4 opacity-40"
            style={{
              backgroundColor: ["#facc15", "#f87171", "#60a5fa", "#4ade80", "#fb923c"][i % 5],
            }}
            initial={{ 
              x: (i * 4) + "%", 
              y: "-10vh",
              rotate: 0 
            }}
            animate={{ 
              y: "110vh",
              rotate: 720,
              x: (i * 4 + (Math.sin(i) * 10)) + "%"
            }}
            transition={{ 
              duration: Math.random() * 6 + 6, 
              repeat: Infinity, 
              ease: "linear",
              delay: Math.random() * 10
            }}
          />
        ))}

        {/* Balloons */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={`balloon-${i}`}
            className="absolute flex flex-col items-center opacity-40"
            initial={{ 
              x: (i * 16 + 8) + "%", 
              y: "-20vh",
              scale: Math.random() * 0.3 + 0.7
            }}
            animate={{ 
              y: "120vh",
              x: (i * 16 + 8 + (Math.cos(i) * 15)) + "%"
            }}
            transition={{ 
              duration: Math.random() * 20 + 20, 
              repeat: Infinity, 
              ease: "easeInOut",
              delay: Math.random() * 15
            }}
          >
            {/* Balloon Body */}
            <div 
              className="w-12 h-16 rounded-full relative shadow-inner"
              style={{
                backgroundColor: ["#ef4444", "#3b82f6", "#10b981", "#f59e0b", "#ec4899"][i % 5],
              }}
            >
              <div className="absolute top-2 left-3 w-3 h-5 bg-white/30 rounded-full rotate-12" />
            </div>
            {/* Balloon Knot */}
            <div 
              className="w-2 h-2 -mt-1 rotate-45"
              style={{
                backgroundColor: ["#ef4444", "#3b82f6", "#10b981", "#f59e0b", "#ec4899"][i % 5],
              }}
            />
            {/* Balloon String */}
            <div className="w-0.5 h-16 bg-white/20" />
          </motion.div>
        ))}
      </div>

      {!user ? (
        /* Login Page */
        <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/10 backdrop-blur-xl p-8 md:p-12 rounded-3xl border border-white/20 shadow-2xl w-full max-w-md text-center"
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 5, repeat: Infinity }}
              className="mb-6 inline-block"
            >
              <PartyPopper className="w-16 h-16 text-yellow-400 mx-auto" />
            </motion.div>
            
            <h1 className="text-3xl md:text-4xl font-black mb-2 tracking-tight">ALOHA Authentication</h1>
            <p className="text-indigo-200 mb-10 text-sm uppercase tracking-[0.2em] font-medium">EEE Farewell 2026</p>
            
            <form onSubmit={handleAuth} className="space-y-4">
              <div className="relative">
                <input 
                  type="email" 
                  placeholder="Enter your Email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-yellow-400/50 focus:ring-2 focus:ring-yellow-400/20 transition-all text-center text-lg placeholder:text-white/20 font-medium"
                  required
                />
              </div>
              <div className="relative">
                <input 
                  type="password" 
                  placeholder="Enter your Password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-yellow-400/50 focus:ring-2 focus:ring-yellow-400/20 transition-all text-center text-lg placeholder:text-white/20 font-medium"
                  required
                />
              </div>
              
              {error && <p className="text-red-400 text-sm font-medium">{error}</p>}

              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-300 hover:to-orange-400 text-indigo-900 font-black py-4 rounded-2xl transition-all transform active:scale-[0.98] shadow-xl flex items-center justify-center gap-2 text-lg uppercase tracking-wider mt-2 disabled:opacity-50"
              >
                {loading ? (
                  <span className="animate-pulse">Processing...</span>
                ) : (
                  <>
                    {isSignUp ? <UserPlus className="w-5 h-5" /> : <LogIn className="w-5 h-5" />}
                    {isSignUp ? "Sign Up" : "Sign In"}
                  </>
                )}
              </button>
            </form>

            <div className="my-6 flex items-center gap-4">
              <div className="h-px bg-white/10 flex-1" />
              <span className="text-xs text-white/30 uppercase tracking-widest font-bold">OR</span>
              <div className="h-px bg-white/10 flex-1" />
            </div>

            <button 
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold py-4 rounded-2xl transition-all transform active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-50"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </button>

            <button 
              onClick={() => setIsSignUp(!isSignUp)}
              className="mt-6 text-indigo-200 hover:text-white text-sm font-medium transition-colors"
            >
              {isSignUp ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
            </button>
            
            <p className="mt-8 text-white/40 text-xs uppercase tracking-widest">
              GNITC • EEE Department
            </p>
          </motion.div>
        </div>
      ) : (
        /* Main Invitation Page */
        <div className="relative z-10">
          {/* Logout Button */}
          <div className="absolute top-6 right-6 z-20">
            <button 
              onClick={handleLogout}
              className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-bold transition-all active:scale-95"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>

          {/* Hero Section */}
          <header className="relative h-screen flex flex-col items-center justify-center text-center px-4">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="z-10"
            >
              <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="inline-block mb-4"
              >
                <PartyPopper className="w-16 h-16 text-yellow-400 mx-auto" />
              </motion.div>
              <h1 className="text-7xl md:text-9xl font-black tracking-tighter mb-2 bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 drop-shadow-2xl">
                ALOHA
              </h1>
              <p className="text-xl md:text-2xl font-medium tracking-widest text-pink-200 uppercase">
                Farewell 2026
              </p>
              <p className="mt-4 text-indigo-200/60 text-sm font-medium">Welcome, {user.email}</p>
            </motion.div>
          </header>

          {/* Invitation Greeting */}
          <section className="py-24 px-6 max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 md:p-12 border border-white/20 shadow-2xl"
            >
              <Sparkles className="w-10 h-10 text-yellow-400 mx-auto mb-6" />
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Aloha! You're Invited</h2>
              <p className="text-lg md:text-xl leading-relaxed text-indigo-100">
                The Department of <span className="text-yellow-400 font-semibold block mb-6">Electrical and Electronics Engineering</span> 
                warmly invites you to celebrate the journey, the memories, and the bright futures of our beloved seniors. 
                Let's bid them a grand farewell filled with joy, laughter, and tropical vibes!
              </p>
            </motion.div>
          </section>

          {/* Event Details */}
          <section className="py-20 bg-black/20">
            <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-8">
              <DetailCard 
                icon={<Calendar className="w-8 h-8 text-orange-400" />}
                title="Date"
                value="April 4, 2026"
              />
              <DetailCard 
                icon={<Clock className="w-8 h-8 text-pink-400" />}
                title="Time"
                value="10:00 AM Onwards"
              />
              <DetailCard 
                icon={<MapPin className="w-8 h-8 text-purple-400" />}
                title="Venue"
                value="Indoor Auditorium, EEE Block, GNITC"
              />
            </div>
          </section>

          {/* Message to Seniors */}
          <section className="py-24 px-6 max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <GraduationCap className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
              <h2 className="text-4xl font-bold">To Our Dear Seniors</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <MessageBlock 
                text="You came as students, but you leave as legends. Your sparks have lit up the EEE labs and our hearts."
              />
              <MessageBlock 
                text="As you transition from circuits to the real world, may your resistance be low and your potential be infinite!"
              />
              <MessageBlock 
                text="Thank you for being the mentors we needed. Your legacy will continue to resonate through these hallways."
              />
              <MessageBlock 
                text="The world is waiting for your energy. Go out there and power the future with the same passion you showed here."
              />
            </div>
          </section>

          {/* Special Thanks to Dignitary */}
          <section className="py-24 px-6 max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-[2.5rem] p-8 md:p-16 border border-white/20 shadow-2xl text-center relative overflow-hidden"
            >
              {/* Decorative background elements */}
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-yellow-400/10 rounded-full blur-3xl" />
              <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl" />
              <div className="absolute -top-24 -left-24 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl" />
              <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-yellow-400/10 rounded-full blur-3xl" />

              <Sparkles className="w-12 h-12 text-yellow-400 mx-auto mb-8" />
              <h2 className="text-sm uppercase tracking-[0.3em] text-yellow-400 font-bold mb-4">Special Thanks to Our Dignitary</h2>
              
              <div className="relative inline-block mb-8">
                <div className="absolute inset-0 bg-gradient-to-tr from-yellow-400 to-orange-500 rounded-full blur-lg opacity-30 animate-pulse" />
                <img 
                  src="/hod.jpg" 
                  alt="Dr. YV Balaramakrishna" 
                  className="w-48 h-48 md:w-56 md:h-56 rounded-full object-cover border-4 border-white/20 relative z-10 mx-auto shadow-2xl"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://picsum.photos/seed/professor/400/400";
                  }}
                />
              </div>

              <h3 className="text-3xl md:text-4xl font-black mb-2 tracking-tight">Dr. YV Balaramakrishna</h3>
              <p className="text-xl text-indigo-200 font-medium mb-8">Head of Department, EEE</p>
              
              <div className="max-w-2xl mx-auto">
                <p className="text-lg text-white/70 leading-relaxed italic">
                  "We express our deepest gratitude for your visionary leadership and unwavering support. 
                  Your guidance has been the current that powered our journey through these four years."
                </p>
              </div>
            </motion.div>
          </section>

          {/* Footer */}
          <footer className="py-12 text-center border-t border-white/10 bg-black/40">
            <p className="text-sm tracking-widest opacity-60 mb-2">Organized by</p>
            <h3 className="text-xl font-bold text-yellow-400">Department of Electrical & Electronics Engineering</h3>
            <p className="mt-4 text-xs opacity-40">© 2026 Guru Nanak Institutions Technical Campus. All Rights Reserved.</p>
          </footer>
        </div>
      )}
    </div>
  );
}

function DetailCard({ icon, title, value }: { icon: ReactNode, title: string, value: string }) {
  return (
    <motion.div 
      whileHover={{ y: -10 }}
      className="bg-white/5 p-8 rounded-2xl border border-white/10 text-center flex flex-col items-center"
    >
      <div className="mb-4">{icon}</div>
      <h3 className="text-sm uppercase tracking-widest text-gray-400 mb-2">{title}</h3>
      <p className="text-xl font-bold">{value}</p>
    </motion.div>
  );
}

function MessageBlock({ text }: { text: string }) {
  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      className="p-6 rounded-xl bg-gradient-to-r from-white/5 to-transparent border-l-4 border-yellow-400 italic text-indigo-100"
    >
      "{text}"
    </motion.div>
  );
}
