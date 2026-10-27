import React, { useState, useRef, useEffect } from 'react';
import { supabase, Stroke } from './lib/supabase';
import { LABELS_FACE, LABELS_PROFIL, AnatomicalLabel } from './config/labels';
import { QCMS } from './config/qcms';

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
    return { x: (clientX - rect.left) / rect.width, y: (clientY - rect.top) / rect.height };
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
      <div style={{ flex: 3, padding: 20, display: 'flex', justifyContent: 'center', overflowY: 'auto', alignItems: 'flex-start' }}>
        <div style={{ position: 'relative', width: '100%', maxWidth: '800px', userSelect: 'none' }}>
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
  
  const [qcmAnswers, setQcmAnswers] = useState<Record<number, string>>({});
  const [studentQuestion, setStudentQuestion] = useState('');

  const [correctionFace, setCorrectionFace] = useState<Stroke[] | null>(null);
  const [correctionProfil, setCorrectionProfil] = useState<Stroke[] | null>(null);

  const handleSubmit = async () => {
    const { error } = await supabase.from('submissions').insert([{ 
      student_name: name, 
      strokes: strokesFace, 
      strokes_profil: strokesProfil,
      qcm_answers: qcmAnswers,
      student_question: studentQuestion
    }]);
    if (error) return alert("Erreur lors de l'envoi.");
    
    const { data: correctionData } = await supabase.from('corrections').select('strokes, strokes_profil').eq('id', 1).single();
    if (correctionData) {
      setCorrectionFace(correctionData.strokes);
      setCorrectionProfil(correctionData.strokes_profil);
    }
    setStep(4);
  };

  if (step === 0) return (
    <div style={{ maxWidth: 400, margin: '100px auto', padding: 20 }}>
      <h1>Radiothorax Mastery</h1>
      <input type="text" placeholder="Votre nom complet" value={name} onChange={e => setName(e.target.value)} style={{ width: '100%', padding: 10, margin: '20px 0' }} />
      <button onClick={() => name.trim() && setStep(1)} disabled={!name.trim()} style={{ width: '100%', padding: 10 }}>Commencer (Étape 1/3)</button>
    </div>
  );

  if (step === 1) return (
    <DrawingBoard key="face" title="1. Radio de Face" imageSrc="/radiothorax.jpg" labels={LABELS_FACE} strokes={strokesFace} setStrokes={setStrokesFace} onNext={() => setStep(2)} buttonText="Passer à la Radio de Profil" />
  );

  if (step === 2) return (
    <DrawingBoard key="profil" title="2. Radio de Profil" imageSrc="/radioprofil.jpg" labels={LABELS_PROFIL} strokes={strokesProfil} setStrokes={setStrokesProfil} onNext={() => setStep(3)} buttonText="Passer au QCM" />
  );

  if (step === 3) return (
    <div style={{ maxWidth: 900, margin: '40px auto', padding: 30, background: 'white', borderRadius: 8, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
      <h2 style={{ borderBottom: '2px solid #e2e8f0', paddingBottom: 15, marginBottom: 30 }}>3. Questions d'évaluation</h2>
      
      {QCMS.map(q => {
        const hasAnswered = !!qcmAnswers[q.id];
        const isCorrect = qcmAnswers[q.id] === q.correctAnswer;

        return (
          <div key={q.id} style={{ marginBottom: 40 }}>
            <p style={{ fontWeight: 'bold', marginBottom: 15, fontSize: '1.1em', lineHeight: '1.5' }}>{q.question}</p>
            
            {q.options.map(opt => {
              const isSelected = qcmAnswers[q.id] === opt;
              let optStyle: any = { 
                display: 'block', 
                margin: '10px 0', 
                padding: '12px 15px', 
                borderRadius: '6px', 
                border: '1px solid #e2e8f0', 
                cursor: hasAnswered ? 'default' : 'pointer',
                transition: 'all 0.2s',
                background: '#f8fafc'
              };
              
              // Mettre en évidence les bonnes et mauvaises réponses après le clic
              if (hasAnswered) {
                 if (opt === q.correctAnswer) {
                   optStyle.border = '2px solid #10b981';
                   optStyle.background = '#ecfdf5';
                 } else if (isSelected) {
                   optStyle.border = '2px solid #ef4444';
                   optStyle.background = '#fef2f2';
                 } else {
                   optStyle.opacity = 0.5; // Griser les autres options
                 }
              }

              return (
                <label key={opt} style={optStyle}>
                  <input 
                    type="radio" 
                    name={`qcm-${q.id}`} 
                    value={opt} 
                    checked={isSelected}
                    onChange={() => {
                      if (!hasAnswered) setQcmAnswers(prev => ({ ...prev, [q.id]: opt }))
                    }}
                    disabled={hasAnswered}
                    style={{ marginRight: 10 }}
                  />
                  {opt}
                </label>
              )
            })}

            {/* LE BLOC D'EXPLICATION (Style académique) */}
            {hasAnswered && (
              <div style={{ 
                marginTop: '20px', 
                padding: '20px 25px', 
                background: '#f1f5f9', 
                borderLeft: '4px solid #475569', 
                borderRadius: '0 8px 8px 0',
                fontFamily: 'Georgia, "Times New Roman", serif',
                fontStyle: 'italic',
                color: '#1e293b',
                lineHeight: '1.7',
                fontSize: '1.05em'
              }}>
                <div style={{ fontFamily: 'system-ui, sans-serif', fontStyle: 'normal', fontWeight: 'bold', color: isCorrect ? '#059669' : '#dc2626', marginBottom: '12px', fontSize: '0.95em' }}>
                  {isCorrect ? '✓ Excellente déduction.' : '✗ Point d\'attention.'}
                </div>
                {q.explanation}
              </div>
            )}
          </div>
        )
      })}

      <div style={{ marginTop: 50, padding: 25, background: '#f8fafc', borderRadius: 8, border: '1px dashed #cbd5e1' }}>
        <h3 style={{ marginBottom: 10, color: '#334155' }}>Une zone d'ombre persiste ? (Optionnel)</h3>
        <p style={{ fontSize: '0.9em', color: '#64748b', marginBottom: 15 }}>Inscrivez vos doutes ou questions. Ils seront analysés lors de la correction.</p>
        <textarea 
          value={studentQuestion} 
          onChange={e => setStudentQuestion(e.target.value)} 
          rows={4}
          style={{ width: '100%', padding: '15px', borderRadius: '6px', border: '1px solid #cbd5e1', fontFamily: 'inherit', resize: 'vertical' }}
          placeholder="Ex: Je n'ai pas bien compris comment délimiter l'atrium droit..."
        />
      </div>

      <button 
        onClick={handleSubmit} 
        style={{ width: '100%', padding: '18px', marginTop: 40, background: '#2563eb', color: 'white', border: 'none', fontSize: '1.1em', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', transition: 'background 0.2s' }}
        onMouseOver={e => e.currentTarget.style.background = '#1d4ed8'}
        onMouseOut={e => e.currentTarget.style.background = '#2563eb'}
      >
        Soumettre définitivement mon analyse
      </button>
    </div>
  );

  return (
    <div style={{ padding: 20, maxWidth: 1400, margin: '0 auto' }}>
      <h2 style={{ textAlign: 'center', marginBottom: 30 }}>Merci {name}, vos réponses ont été envoyées !</h2>
      <h2 style={{ borderBottom: '2px solid #ccc', paddingBottom: 10, marginTop: 40 }}>Résultat : Radio de Face</h2>
      <div style={{ display: 'flex', flexDirection: window.innerWidth > 768 ? 'row' : 'column', gap: 20 }}>
        <StaticCanvas strokes={strokesFace} title="Votre dessin (Face)" imageSrc="/radiothorax.jpg" />
        {correctionFace ? <StaticCanvas strokes={correctionFace} title="Correction Officielle" imageSrc="/radiothorax.jpg" /> : <div style={{ flex: 1, padding: 10, textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px dashed #ccc', borderRadius: 8 }}><p>Pas de correction publiée.</p></div>}
      </div>
      <h2 style={{ borderBottom: '2px solid #ccc', paddingBottom: 10, marginTop: 60 }}>Résultat : Radio de Profil</h2>
      <div style={{ display: 'flex', flexDirection: window.innerWidth > 768 ? 'row' : 'column', gap: 20 }}>
        <StaticCanvas strokes={strokesProfil} title="Votre dessin (Profil)" imageSrc="/radioprofil.jpg" />
        {correctionProfil ? <StaticCanvas strokes={correctionProfil} title="Correction Officielle" imageSrc="/radioprofil.jpg" /> : <div style={{ flex: 1, padding: 10, textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px dashed #ccc', borderRadius: 8 }}><p>Pas de correction publiée.</p></div>}
      </div>
    </div>
  );
}
