export interface AnatomicalLabel { id: string; name: string; color: string; }

export const LABELS_FACE: AnatomicalLabel[] = [
  { id: 'arc-sup-droit', name: 'Arc supérieur droit : veine cave supérieure', color: '#FF3B30' },
  { id: 'arc-moyen-droit', name: 'Arc moyen droit : ligne paratrachéale droite', color: '#FF9500' },
  { id: 'arc-inf-droit', name: 'Arc inférieur droit : atrium droit', color: '#007AFF' },
  { id: 'arc-sup-gauche', name: 'Arc supérieur gauche : bouton aortique et artère subclavière gauche', color: '#5856D6' },
  { id: 'arc-moyen-gauche', name: 'Arc moyen gauche : tronc de l’artère pulmonaire et auricule gauche', color: '#AF52DE' },
  { id: 'arc-inf-gauche', name: 'Arc inférieur gauche : ventricule gauche', color: '#FF2D55' },
  { id: 'cul-de-sac-droit', name: 'Cul-de-sac costo-diaphragmatique droit', color: '#34C759' },
  { id: 'cul-de-sac-gauche', name: 'Cul-de-sac costo-diaphragmatique gauche', color: '#00C7BE' },
  { id: 'angle-cardio-droit', name: 'Angle cardio-phrénique droit', color: '#A4C400' },
  { id: 'angle-cardio-gauche', name: 'Angle cardio-phrénique gauche', color: '#5AC8FA' },
  { id: 'crosse-azygos', name: 'Crosse de la veine azygos', color: '#FFC107' },
  { id: 'ligne-para-azygo', name: 'Ligne para-azygo-œsophagienne', color: '#A2845E' },
  { id: 'ligne-para-gauche', name: 'Ligne paratrachéale gauche', color: '#F012BE' },
  { id: 'ligne-paravert-droite', name: 'Ligne paravertébrale droite', color: '#FF7F50' },
  { id: 'ligne-para-aortique', name: 'Ligne para-aortique', color: '#40E0D0' },
  { id: 'bulle-gastrique', name: 'Bulle gastrique', color: '#4169E1' },
  { id: 'carene', name: 'Carène', color: '#DC143C' },
  { id: 'petite-scissure', name: 'Petite scissure (scissure horizontale droite)', color: '#FF1493' },
  { id: 'arc-post-cote-droite', name: 'Arc postérieur de la première côte droite', color: '#00FF7F' },
  { id: 'arc-ant-cote-droite', name: 'Arc antérieur de la première côte droite', color: '#DA70D6' },
  { id: 'bord-interne-clavicules', name: 'Bord interne des deux clavicules', color: '#FFD700' }
];

export const LABELS_PROFIL: AnatomicalLabel[] = [
  { id: 'coupole-droite-p', name: 'Coupole diaphragmatique droite', color: '#FF3B30' },
  { id: 'coupole-gauche-p', name: 'Coupole diaphragmatique gauche', color: '#007AFF' },
  { id: 'cul-de-sac-post-droit', name: 'Cul-de-sac costo-diaphragmatique postérieur droit', color: '#34C759' },
  { id: 'cul-de-sac-post-gauche', name: 'Cul-de-sac costo-diaphragmatique postérieur gauche', color: '#FF9500' },
  { id: 'espace-clair-retro', name: 'Espace clair rétrosternal', color: '#AF52DE' },
  { id: 'espace-clair-cardio', name: 'Espace clair rétrocardiaque', color: '#FF2D55' },
  { id: 'trachee-p', name: 'Trachée', color: '#F012BE' },
  { id: 'grande-scissure', name: 'Grande scissure', color: '#00C7BE' },
  { id: 'petite-scissure-p', name: 'Petite scissure', color: '#FFD700' }
];
