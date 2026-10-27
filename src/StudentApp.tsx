import React, { useState, useRef, useEffect } from 'react';
import { supabase, Stroke } from './lib/supabase';
import { LABELS_FACE, LABELS_PROFIL, AnatomicalLabel } from './config/labels';

function StaticCanvas({ strokes, title, imageSrc }: { strokes: Stroke[], title: string, imageSrc: string }) {
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
        <img ref={imageRef} src={imageSrc} alt={title} draggable={false} style={{ width: '100%', display: 'block', pointerEvents: 'none' }} onLoad={() => setLoaded(true)} />
        <canvas ref={canvasRef} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }} />
      </div>
    </div>
  );
}

function DrawingBoard({ title, imageSrc, labels, strokes, setStrokes, onNext, buttonText }: { title: string, imageSrc: string, labels: AnatomicalLabel[], strokes: Stroke[], setStrokes: any, onNext: () => void, buttonText: string }) {
  const [activeLabelId, setActiveLabelId] = useState(labels[0].id);
  const [currentStroke, setCurrentStroke] = useState<Stroke | null>(null);
  const [loaded, setLoaded] = useState(false); 
  
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
      for (let i = 1; i < stroke.points.length; i++) ctx.lineTo(stroke.points[i].x * canvas.width, stroke.points[i].y * canvas.height);
      ctx.stroke();
    });

    const handleResize = () => setLoaded(prev => !prev);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [strokes, currentStroke, loaded]);

  const getCoordinates = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect(); 
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    
    return { 
      x: (clientX - rect.left) / rect.width, 
      y: (clientY - rect.top) / rect.height 
    };
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    isDrawing.current = true;
    const coords = getCoordinates(e);
    if (!coords) return;
    const activeLabel = labels.find(l => l.id === activeLabelId);
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

  return (
    <div style={{ display: 'flex', flexDirection: window.innerWidth > 768 ? 'row' : 'column', height: '100vh' }}>
      <div style={{ padding: 20, flex: 1, overflowY: 'auto', background: 'white' }}>
        <h3>{title}</h3>
        {labels.map(label => (
          <div key={label.id} onClick={() => setActiveLabelId(label.id)} style={{ padding: 10, margin: '5px 0', cursor: 'pointer', borderLeft: `5px solid ${label.color}`, backgroundColor: activeLabelId === label.id ? '#e5e7eb' : 'transparent', fontWeight: activeLabelId === label.id ? 'bold' : 'normal' }}>
            {label.name}
          </div>
        ))}
        <div style={{ marginTop: 20 }}>
          <button onClick={() => setStrokes(strokes.slice(0, -1))} style={{ marginRight: 10, padding: 8 }}>Annuler</button>
          <button onClick={() => { if(window.confirm('Tout effacer ?')) setStrokes([]) }} style={{ padding: 8 }}>Effacer tout</button>
        </div>
        <button onClick={() => { if(strokes.length === 0) alert("Veuillez dessiner d'abord."); else onNext(); }} style={{ width: '100%', padding: 15, marginTop: 30, background: '#2563eb', color: 'white', border: 'none' }}>{buttonText}</button>
      </div>
      {/* CORRECTION ICI : Ajout de overflowY: 'auto' et alignItems: 'flex-start' */}
      <div style={{ flex: 3, padding: 20, display: 'flex', justifyContent: 'center', overflowY: 'auto', alignItems: 'flex-start' }}>
        <div style={{ position: 'relative', width: '100%', maxWidth: '800px', userSelect: 'none' }}>
          {/* CORRECTION ICI : L'image ne peut plus voler les clics (pointerEvents: 'none') */}
          <img ref={imageRef} src={imageSrc} alt="Radio" draggable={false} style={{ width: '100%', display: 'block', pointerEvents: 'none' }} onLoad={() => setLoaded(true)} />
          <canvas ref={canvasRef} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', touchAction: 'none' }} onMouseDown={startDrawing} onMouseMove={draw} onMouseUp={stopDrawing} onMouseLeave={stopDrawing} onTouchStart={startDrawing} onTouchMove={draw} onTouchEnd={stopDrawing} />
        </div>
      </div>
    </div>
  );
}

export default function StudentApp() {
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  
  const [strokesFace, setStrokesFace] = useState<Stroke[]>([]);
  const [strokesProfil, setStrokesProfil] = useState<Stroke[]>([]);
  
  const [correctionFace, setCorrectionFace] = useState<Stroke[] | null>(null);
  const [correctionProfil, setCorrectionProfil] = useState<Stroke[] | null>(null);

  const handleSubmit = async () => {
    const { error } = await supabase.from('submissions').insert([{ student_name: name, strokes: strokesFace, strokes_profil: strokesProfil }]);
    if (error) return alert("Erreur lors de l'envoi.");
    
    const { data: correctionData } = await supabase.from('corrections').select('strokes, strokes_profil').eq('id', 1).single();
    if (correctionData) {
      setCorrectionFace(correctionData.strokes);
      setCorrectionProfil(correctionData.strokes_profil);
    }
    setStep(3);
  };

  if (step === 0) return (
    <div style={{ maxWidth: 400, margin: '100px auto', padding: 20 }}>
      <h1>Radiothorax Mastery</h1>
      <input type="text" placeholder="Votre nom complet" value={name} onChange={e => setName(e.target.value)} style={{ width: '100%', padding: 10, margin: '20px 0' }} />
      <button onClick={() => name.trim() && setStep(1)} disabled={!name.trim()} style={{ width: '100%', padding: 10 }}>Commencer (Étape 1/2)</button>
    </div>
  );

  if (step === 1) return (
    <DrawingBoard key="face" title="1. Radio de Face" imageSrc="/radiothorax.jpg" labels={LABELS_FACE} strokes={strokesFace} setStrokes={setStrokesFace} onNext={() => setStep(2)} buttonText="Passer à la Radio de Profil" />
  );

  if (step === 2) return (
    <DrawingBoard key="profil" title="2. Radio de Profil" imageSrc="/radioprofil.jpg" labels={LABELS_PROFIL} strokes={strokesProfil} setStrokes={setStrokesProfil} onNext={handleSubmit} buttonText="Envoyer et voir les corrections" />
  );

  return (
    <div style={{ padding: 20, maxWidth: 1400, margin: '0 auto' }}>
      <h2 style={{ textAlign: 'center', marginBottom: 30 }}>Merci {name}, vos réponses ont été envoyées !</h2>
      
      <h2 style={{ borderBottom: '2px solid #ccc', paddingBottom: 10, marginTop: 40 }}>Résultat : Radio de Face</h2>
      <div style={{ display: 'flex', flexDirection: window.innerWidth > 768 ? 'row' : 'column', gap: 20 }}>
        <StaticCanvas strokes={strokesFace} title="Votre dessin (Face)" imageSrc="/radiothorax.jpg" />
        {correctionFace ? <StaticCanvas strokes={correctionFace} title="Correction Professeur" imageSrc="/radiothorax.jpg" /> : <div style={{ flex: 1, padding: 10, textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px dashed #ccc', borderRadius: 8 }}><p>Pas de correction publiée.</p></div>}
      </div>

      <h2 style={{ borderBottom: '2px solid #ccc', paddingBottom: 10, marginTop: 60 }}>Résultat : Radio de Profil</h2>
      <div style={{ display: 'flex', flexDirection: window.innerWidth > 768 ? 'row' : 'column', gap: 20 }}>
        <StaticCanvas strokes={strokesProfil} title="Votre dessin (Profil)" imageSrc="/radioprofil.jpg" />
        {correctionProfil ? <StaticCanvas strokes={correctionProfil} title="Correction Professeur" imageSrc="/radioprofil.jpg" /> : <div style={{ flex: 1, padding: 10, textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px dashed #ccc', borderRadius: 8 }}><p>Pas de correction publiée.</p></div>}
      </div>
    </div>
  );
}
