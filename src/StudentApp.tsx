import React, { useState, useRef, useEffect } from 'react';
import { supabase, Stroke } from './lib/supabase';
import { LABELS } from './config/labels';

export default function StudentApp() {
  const [name, setName] = useState('');
  const [started, setStarted] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [activeLabelId, setActiveLabelId] = useState(LABELS[0].id);
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const [currentStroke, setCurrentStroke] = useState<Stroke | null>(null);
  
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
    const { error } = await supabase.from('submissions').insert([{ student_name: name, strokes }]);
    if (error) alert("Erreur lors de l'envoi.");
    else setSubmitted(true);
  };

  if (submitted) return <div style={{ padding: 40, textAlign: 'center' }}><h2>Merci, vos réponses ont été envoyées !</h2></div>;
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
        <button onClick={handleSubmit} style={{ width: '100%', padding: 15, marginTop: 30, background: '#2563eb', color: 'white', border: 'none' }}>Envoyer</button>
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
