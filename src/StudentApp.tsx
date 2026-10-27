import React, { useState, useRef, useEffect } from 'react';
import { supabase, Stroke } from './lib/supabase';
import { LABELS } from './config/labels';

// Helper component to display a read-only canvas with an image
function StaticCanvas({ strokes, title }: { strokes: Stroke[], title: string }) {
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
    <div style={{ flex: 1, padding: 10, textAlign: 'center' }}>
      <h3 style={{ marginBottom: 15, padding: 10, background: '#f3f4f6', borderRadius: 8 }}>{title}</h3>
      <div style={{ position: 'relative', width: '100%', maxWidth: '600px', margin: '0 auto' }}>
        <img ref={imageRef} src="/radiothorax.jpg" alt="Radiothorax" style={{ width: '100%', display: 'block' }} onLoad={() => setLoaded(true)} />
        <canvas ref={canvasRef} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }} />
      </div>
    </div>
  );
}

export default function StudentApp() {
  const [name, setName] = useState('');
  const [started, setStarted] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [activeLabelId, setActiveLabelId] = useState(LABELS[0].id);
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const [currentStroke, setCurrentStroke] = useState<Stroke | null>(null);
  
  // New state to hold the teacher's correction
  const [correctionStrokes, setCorrectionStrokes] = useState<Stroke[] | null>(null);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const isDrawing = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx || !imageRef.current) return;
    canvas.width = imageRef.current.clientWidth;
    canvas.height = imageRef.current.clientHeight;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = 4;
    const allStrokes = currentStroke ? [...strokes, currentStroke] : strokes;
    allStrokes.forEach((stroke) => {
      if (stroke.points.length === 0) return;
      ctx.strokeStyle = stroke.color;
      ctx.beginPath();
      ctx.moveTo(stroke.points[0].x * canvas.width, stroke.points[0].y * canvas.height);
      for (let i = 1; i < stroke.points.length; i++) {
        ctx.lineTo(stroke.points[i].x * canvas.width, stroke.points[i].y * canvas.height);
      }
      ctx.stroke();
    });
  }, [strokes, currentStroke]);

  const getCoordinates = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    return { x: (clientX - rect.left) / canvas.width, y: (clientY - rect.top) / canvas.height };
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    isDrawing.current = true;
    const coords = getCoordinates(e);
    if (!coords) return;
    const activeLabel = LABELS.find(l => l.id === activeLabelId);
    setCurrentStroke({ points: [coords], color: activeLabel?.color || '#000', labelId: activeLabelId });
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (!isDrawing.current || !currentStroke) return;
    const coords = getCoordinates(e);
    if (!coords) return;
    setCurrentStroke({ ...currentStroke, points: [...currentStroke.points, coords] });
  };

  const stopDrawing = () => {
    if (!isDrawing.current || !currentStroke) return;
    isDrawing.current = false;
    setStrokes([...strokes, currentStroke]);
    setCurrentStroke(null);
  };

  const handleSubmit = async () => {
    if (strokes.length === 0) return alert("Veuillez dessiner avant d'envoyer.");
    
    // 1. Save student submission
    const { error } = await supabase.from('submissions').insert([{ student_name: name, strokes }]);
    if (error) return alert("Erreur lors de l'envoi.");
    
    // 2. Fetch teacher correction
    const { data: correctionData } = await supabase.from('corrections').select('strokes').eq('id', 1).single();
    if (correctionData) {
      setCorrectionStrokes(correctionData.strokes);
    }

    setSubmitted(true);
  };

  // --- NEW SPLIT-SCREEN SUBMISSION VIEW ---
  if (submitted) {
    return (
      <div style={{ padding: 20, maxWidth: 1400, margin: '0 auto' }}>
        <h2 style={{ textAlign: 'center', marginBottom: 30 }}>Merci {name}, vos réponses ont été envoyées !</h2>
        <div style={{ display: 'flex', flexDirection: window.innerWidth > 768 ? 'row' : 'column', gap: 20 }}>
          
          <StaticCanvas strokes={strokes} title="Votre dessin" />
          
          {correctionStrokes ? (
            <StaticCanvas strokes={correctionStrokes} title="Correction du Professeur" />
          ) : (
             <div style={{ flex: 1, padding: 10, textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px dashed #ccc', borderRadius: 8 }}>
                <p style={{ color: '#666' }}>Le professeur n'a pas encore publié la correction.</p>
             </div>
          )}
        </div>
      </div>
    );
  }

  if (!started) return (
    <div style={{ maxWidth: 400, margin: '100px auto', padding: 20 }}>
      <h1>Radiothorax Mastery</h1>
      <input type="text" placeholder="Votre nom complet" value={name} onChange={e => setName(e.target.value)} style={{ width: '100%', padding: 10, margin: '20px 0' }} />
      <button onClick={() => name.trim() && setStarted(true)} disabled={!name.trim()} style={{ width: '100%', padding: 10 }}>Commencer</button>
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: window.innerWidth > 768 ? 'row' : 'column', height: '100vh' }}>
      <div style={{ padding: 20, flex: 1, overflowY: 'auto', background: 'white' }}>
        <h3>Structures</h3>
        {LABELS.map(label => (
          <div key={label.id} onClick={() => setActiveLabelId(label.id)} style={{ padding: 10, margin: '5px 0', cursor: 'pointer', borderLeft: `5px solid ${label.color}`, backgroundColor: activeLabelId === label.id ? '#e5e7eb' : 'transparent', fontWeight: activeLabelId === label.id ? 'bold' : 'normal' }}>
            {label.name}
          </div>
        ))}
        <div style={{ marginTop: 20 }}>
          <button onClick={() => setStrokes(strokes.slice(0, -1))} style={{ marginRight: 10, padding: 8 }}>Annuler</button>
          <button onClick={() => { if(window.confirm('Tout effacer ?')) setStrokes([]) }} style={{ padding: 8 }}>Effacer tout</button>
        </div>
        <button onClick={handleSubmit} style={{ width: '100%', padding: 15, marginTop: 30, background: '#2563eb', color: 'white', border: 'none' }}>Envoyer et voir la correction</button>
      </div>
      <div style={{ flex: 3, padding: 20, display: 'flex', justifyContent: 'center' }}>
        <div style={{ position: 'relative', width: '100%', maxWidth: '800px', userSelect: 'none' }}>
          <img ref={imageRef} src="/radiothorax.jpg" alt="Radiothorax placeholder" style={{ width: '100%', display: 'block' }} onLoad={() => setStrokes([...strokes])} />
          <canvas ref={canvasRef} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', touchAction: 'none' }} onMouseDown={startDrawing} onMouseMove={draw} onMouseUp={stopDrawing} onMouseLeave={stopDrawing} onTouchStart={startDrawing} onTouchMove={draw} onTouchEnd={stopDrawing} />
        </div>
      </div>
    </div>
  );
}
