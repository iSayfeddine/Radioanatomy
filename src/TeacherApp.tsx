import React, { useState, useEffect, useRef } from 'react';
import { supabase, Submission } from './lib/supabase';

export default function TeacherApp() {
  const [session, setSession] = useState<any>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [selectedSub, setSelectedSub] = useState<Submission | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: authListener } = supabase.auth.onAuthStateChange((_, session) => setSession(session));
    return () => authListener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session) supabase.from('submissions').select('*').order('created_at', { ascending: false }).then(({ data }) => setSubmissions(data || []));
  }, [session]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx || !imageRef.current || !selectedSub) return;
    canvas.width = imageRef.current.clientWidth;
    canvas.height = imageRef.current.clientHeight;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = 4;
    selectedSub.strokes.forEach((stroke) => {
      if (stroke.points.length === 0) return;
      ctx.strokeStyle = stroke.color;
      ctx.beginPath();
      ctx.moveTo(stroke.points[0].x * canvas.width, stroke.points[0].y * canvas.height);
      for (let i = 1; i < stroke.points.length; i++) ctx.lineTo(stroke.points[i].x * canvas.width, stroke.points[i].y * canvas.height);
      ctx.stroke();
    });
  }, [selectedSub, window.innerWidth]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      alert("Erreur de connexion : " + error.message);
    }
  };

  if (!session) return (
    <form onSubmit={handleLogin} style={{ maxWidth: 300, margin: '100px auto', padding: 20 }}>
      <h2>Espace Enseignant</h2>
      <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} style={{ width: '100%', padding: 10, margin: '10px 0' }} />
      <input type="password" placeholder="Mot de passe" value={password} onChange={e => setPassword(e.target.value)} style={{ width: '100%', padding: 10, marginBottom: 10 }} />
      <button type="submit" style={{ width: '100%', padding: 10 }}>Connexion</button>
    </form>
  );

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <div style={{ flex: 1, borderRight: '1px solid #ccc', padding: 20, overflowY: 'auto', background: 'white' }}>
        <h2>Soumissions ({submissions.length})</h2>
        <button onClick={() => supabase.auth.signOut()} style={{ marginBottom: 20 }}>Déconnexion</button>
        {submissions.map(sub => (
          <div key={sub.id} onClick={() => setSelectedSub(sub)} style={{ padding: 10, margin: '5px 0', background: selectedSub?.id === sub.id ? '#e5e7eb' : 'white', cursor: 'pointer', border: '1px solid #ddd' }}>
            <strong>{sub.student_name}</strong>
            <div style={{ fontSize: '0.8em', color: '#666' }}>{new Date(sub.created_at).toLocaleString()}</div>
          </div>
        ))}
      </div>
      <div style={{ flex: 3, padding: 20, display: 'flex', justifyContent: 'center' }}>
        {!selectedSub ? <p>Sélectionnez un étudiant.</p> : (
          <div style={{ position: 'relative', width: '100%', maxWidth: '800px' }}>
            <img ref={imageRef} src="/radiothorax.jpg" alt="Radiothorax" style={{ width: '100%', display: 'block' }} onLoad={() => setSelectedSub({...selectedSub})} />
            <canvas ref={canvasRef} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }} />
          </div>
        )}
      </div>
    </div>
  );
}
