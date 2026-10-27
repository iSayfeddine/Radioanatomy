import React, { useState, useEffect, useRef } from 'react';
import { supabase, Submission, Stroke } from './lib/supabase';
import { QCMS } from './config/qcms';

function ReadOnlyCanvas({ strokes, imageSrc }: { strokes: Stroke[], imageSrc: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx || !imageRef.current || !loaded) return;
    canvas.width = imageRef.current.clientWidth;
    canvas.height = imageRef.current.clientHeight;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = 4;
    strokes.forEach((stroke) => {
      if (stroke.points.length === 0) return;
      ctx.strokeStyle = stroke.color;
      ctx.beginPath();
      ctx.moveTo(stroke.points[0].x * canvas.width, stroke.points[0].y * canvas.height);
      for (let i = 1; i < stroke.points.length; i++) ctx.lineTo(stroke.points[i].x * canvas.width, stroke.points[i].y * canvas.height);
      ctx.stroke();
    });
    const handleResize = () => setLoaded(prev => !prev);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [strokes, loaded]);

  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: '800px', margin: '0 auto 40px auto' }}>
      <img ref={imageRef} src={imageSrc} alt="Radio" style={{ width: '100%', display: 'block' }} onLoad={() => setLoaded(true)} />
      <canvas ref={canvasRef} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }} />
    </div>
  );
}

export default function TeacherApp() {
  const [session, setSession] = useState<any>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [selectedSub, setSelectedSub] = useState<Submission | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: authListener } = supabase.auth.onAuthStateChange((_, session) => setSession(session));
    return () => authListener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session) supabase.from('submissions').select('*').order('created_at', { ascending: false }).then(({ data }) => setSubmissions(data || []));
  }, [session]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert("Erreur de connexion : " + error.message);
  };

  const handleSetCorrection = async () => {
    if (!selectedSub) return;
    if (!window.confirm("Définir ce double dessin comme la correction officielle ?")) return;
    const { error } = await supabase.from('corrections').upsert({ id: 1, strokes: selectedSub.strokes, strokes_profil: selectedSub.strokes_profil || [] });
    if (error) alert("Erreur : " + error.message);
    else alert("Correction officielle enregistrée avec succès !");
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
      <div style={{ flex: 3, padding: 20, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
        {!selectedSub ? <p>Sélectionnez un étudiant.</p> : (
          <div style={{ width: '100%', maxWidth: '900px', margin: '0 auto', paddingBottom: 60 }}>
            <div style={{ marginBottom: 25, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2>Travail de : {selectedSub.student_name}</h2>
              <button onClick={handleSetCorrection} style={{ background: '#10b981', color: 'white', border: 'none', padding: '10px 15px', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer' }}>
                Définir comme correction officielle
              </button>
            </div>
            
            <h3 style={{textAlign: 'center', marginBottom: 10, borderBottom: '2px solid #eee', paddingBottom: 10}}>Radio de Face</h3>
            <ReadOnlyCanvas strokes={selectedSub.strokes || []} imageSrc="/radiothorax.jpg" />
            
            <h3 style={{textAlign: 'center', marginBottom: 10, borderBottom: '2px solid #eee', paddingBottom: 10}}>Radio de Profil</h3>
            <ReadOnlyCanvas strokes={selectedSub.strokes_profil || []} imageSrc="/radioprofil.jpg" />

            <h3 style={{ marginTop: 60, marginBottom: 20, borderBottom: '2px solid #eee', paddingBottom: 10 }}>Réponses aux QCM</h3>
            <div style={{ background: '#f8fafc', padding: 20, borderRadius: 8, border: '1px solid #e2e8f0' }}>
              {QCMS.map(q => {
                // On extrait juste le titre de la question (avant le saut de ligne) pour ne pas encombrer l'écran
                const titreQuestion = q.question.split('\n')[0];
                const reponseEtudiant = selectedSub.qcm_answers?.[q.id];
                const estCorrect = reponseEtudiant === q.correctAnswer;

                return (
                  <div key={q.id} style={{ marginBottom: 20, paddingBottom: 15, borderBottom: '1px dashed #cbd5e1' }}>
                    <p style={{ margin: '0 0 8px 0', fontWeight: 'bold', color: '#334155' }}>{titreQuestion}</p>
                    {reponseEtudiant ? (
                      <p style={{ margin: 0, color: estCorrect ? '#059669' : '#dc2626', fontWeight: '500' }}>
                        {estCorrect ? '✅ ' : '❌ '} {reponseEtudiant}
                      </p>
                    ) : (
                      <p style={{ margin: 0, color: '#94a3b8', fontStyle: 'italic' }}>Aucune réponse sélectionnée</p>
                    )}
                  </div>
                )
              })}
            </div>

            <h3 style={{ marginTop: 40, marginBottom: 20, borderBottom: '2px solid #eee', paddingBottom: 10 }}>Question / Remarque de l'étudiant</h3>
            <div style={{ background: '#fffbeb', padding: 20, borderRadius: 8, borderLeft: '4px solid #f59e0b' }}>
              {selectedSub.student_question ? (
                <p style={{ margin: 0, whiteSpace: 'pre-wrap', color: '#1e293b' }}>{selectedSub.student_question}</p>
              ) : (
                <p style={{ margin: 0, color: '#94a3b8', fontStyle: 'italic' }}>L'étudiant n'a laissé aucune question.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
