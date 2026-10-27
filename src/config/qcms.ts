export interface QCM {
  id: number;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export const QCMS: QCM[] = [
  {
    id: 1,
    question: "Les fameuses \"Zones Aveugles\" (Blind spots) : Vous avez méthodiquement analysé les poumons de votre patient de la base au sommet. Cependant, votre tuteur vous rappelle de vérifier les \"Zones aveugles\". Pourquoi l'espace rétrocardiaque (derrière le cœur) est-il une zone aveugle si dangereuse sur un cliché de face ?",
    options: [
      "A) Parce que la densité de la colonne vertébrale dorsale superposée au cœur absorbe tous les rayons, créant un \"trou noir\" radiologique.",
      "B) Parce que des lésions (nodules, foyers infectieux) se cachant dans le lobe inférieur gauche peuvent être totalement masquées par la densité \"eau\" du cœur.",
      "C) Parce que la poche à air gastrique remonte toujours de manière physiologique et cache cette région.",
      "D) Parce que les artères pulmonaires (hiles) croisent cette zone de manière asymétrique.",
      "E) Parce que le faisceau de rayons X n'atteint physiquement pas cette zone anatomique sur un cliché PA."
    ],
    correctAnswer: "B) Parce que des lésions (nodules, foyers infectieux) se cachant dans le lobe inférieur gauche peuvent être totalement masquées par la densité \"eau\" du cœur.",
    explanation: "Le Thorax en 2D est un immense jeu de superpositions (un objet 3D écrasé sur un plan 2D !). Le lobe inférieur du poumon gauche descend très bas, bien en arrière de la masse cardiaque. Une pneumonie débutante ou un cancer qui se trouve ici sera \"caché\" par l'opacité blanche du cœur qui se superpose par-dessus. C'est pour cela qu'il faut toujours scruter le bord gauche de la colonne vertébrale à travers la silhouette cardiaque (vérifier la bonne \"Pénétration\" de votre cliché !), et ne jamais hésiter à demander un cliché de profil au moindre doute."
  }
  // Ajoutez vos QCM 2, 3, 4 et 5 ici en suivant exactement le même modèle !
];
