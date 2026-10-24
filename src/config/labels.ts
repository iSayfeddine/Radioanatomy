export interface AnatomicalLabel { id: string; name: string; color: string; }

export const LABELS: AnatomicalLabel[] = [
  { id: 'veine-cave-sup', name: 'Arc supérieur droit (veine cave supérieure)', color: '#FF3B30' },
  { id: 'atrium-droit', name: 'Arc inférieur droit (atrium droit)', color: '#007AFF' },
  { id: 'ligne-para-droite', name: 'Ligne paratrachéale droite', color: '#34C759' },
  { id: 'bouton-aortique', name: 'Bouton aortique', color: '#FF9500' },
  { id: 'tronc-pulmonaire', name: "Tronc de l'artère pulmonaire", color: '#AF52DE' },
  { id: 'ventricule-gauche', name: 'Arc inférieur gauche (ventricule gauche)', color: '#FF2D55' },
  { id: 'coupole-droite', name: 'Coupole diaphragmatique droite', color: '#A2845E' },
  { id: 'coupole-gauche', name: 'Coupole diaphragmatique gauche', color: '#5AC8FA' },
  { id: 'sinus-costo', name: 'Sinus costo-diaphragmatiques', color: '#8E8E93' }
];
