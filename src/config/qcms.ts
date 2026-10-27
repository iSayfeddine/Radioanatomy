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
    question: "QCM 1 : Les critères de qualité (Le piège du \"I\" de SI PC Déchargé)\nVous analysez la radiographie thoracique de face d'un patient dyspnéique. En appliquant le critère d'Inspiration, vous comptez seulement 4 arcs costaux antérieurs au-dessus de la coupole diaphragmatique droite. Quel est le risque majeur d'erreur diagnostique face à ce défaut technique ?",
    options: [
      "A) Une hyperclarté artificielle simulant un pneumothorax bilatéral.",
      "B) Une fausse cardiomégalie associée à un pseudo-syndrome alvéolaire (opacités) aux bases pulmonaires.",
      "C) Un effacement pathologique mais artificiel des apex pulmonaires (sommets).",
      "D) Une déviation apparente de la trachée simulant une masse médiastinale.",
      "E) L'impossibilité d'analyser la poche à air gastrique."
    ],
    correctAnswer: "B) Une fausse cardiomégalie associée à un pseudo-syndrome alvéolaire (opacités) aux bases pulmonaires.",
    explanation: "Excellent réflexe ! Un cliché pris en expiration (ou mauvaise inspiration profonde) est le piège classique. Les poumons ne sont pas gonflés d'air, donc la trame pulmonaire est tassée aux bases, ce qui crée de fausses opacités blanchâtres (on croirait à une pneumonie !). De plus, le cœur, poussé vers le haut par le diaphragme relâché, s'étale transversalement, donnant l'illusion d'un gros cœur (fausse cardiomégalie). Toujours vérifier que vous comptez au moins 6 arcs antérieurs avant de crier à l'insuffisance cardiaque !"
  },
  {
    id: 2,
    question: "QCM 2 : Les Incidences (AP vs PA) et la géométrie\nAux urgences, un patient polytraumatisé instable bénéficie d'une radiographie réalisée au lit en incidence Antéro-Postérieure (AP, la plaque est dans son dos). En la comparant avec un ancien cliché fait debout en Postéro-Antérieure (PA), le cœur et le médiastin semblent massivement élargis. Quelle est l'explication physique exacte ?",
    options: [
      "A) Les rayons X traversent d'abord le sternum, ce qui dévie leur trajectoire et floute les bords du cœur.",
      "B) En incidence AP, le cœur est situé très loin de la plaque (détecteur), ce qui provoque un effet d'agrandissement par divergence du faisceau de rayons X.",
      "C) Le patient étant couché, le sang s'accumule dans le thorax supérieur, dilatant les vaisseaux médiastinaux.",
      "D) La distance tube-détecteur au lit est généralement de 3 mètres au lieu de 2, augmentant la taille de l'image.",
      "E) Les omoplates ne peuvent pas être dégagées en AP, ce qui s'ajoute à l'ombre cardiaque."
    ],
    correctAnswer: "B) En incidence AP, le cœur est situé très loin de la plaque (détecteur), ce qui provoque un effet d'agrandissement par divergence du faisceau de rayons X.",
    explanation: "Pensez à un théâtre d'ombres chinoises ! Si vous approchez votre main de la lampe de poche (le tube à rayons X) et l'éloignez du mur (la plaque), l'ombre de votre main devient géante. Le cœur est un organe antérieur. En AP (rayons entrant par le torse), le cœur est loin de la plaque dans le dos : son ombre s'élargit massivement (jusqu'à 20% !). En PA (rayons entrant par le dos), le cœur est collé contre la plaque sur le torse: sa taille est réelle. Ne diagnostiquez jamais de cardiomégalie avec certitude sur un cliché au lit !"
  },
  {
    id: 3,
    question: "QCM 3 : Les 5 densités fondamentales (Physique appliquée)\nL'analyse des densités est la clé de la radiologie. Vous observez un patient qui présente un épanchement liquidien (hémothorax) du côté droit. Parmi ces affirmations concernant les densités, laquelle illustre parfaitement ce que vous allez observer ?",
    options: [
      "A) Le sang apparaîtra noir (hyperclarté) car il absorbe totalement les rayons X.",
      "B) Le sang partagera la même densité (blanche) que la clavicule, masquant les os environnants.",
      "C) Le sang aura exactement la même densité que le muscle cardiaque, effaçant le bord droit du cœur si l'épanchement le touche.",
      "D) Le tissu adipeux (graisse) pleural se mélangera au sang, créant un aspect en \"verre dépoli\".",
      "E) L'air du poumon droit sain apparaîtra blanc, contrastant avec le sang noir."
    ],
    correctAnswer: "C) Le sang aura exactement la même densité que le muscle cardiaque, effaçant le bord droit du cœur si l'épanchement le touche.",
    explanation: "C'est le secret de l'anatomie radiologique ! Il n'y a que 5 couleurs (densités) : Air (Noir), Graisse (Gris foncé), Eau/Tissus mous (Gris clair/Blanc), Os (Blanc), Métal (Blanc éclatant). Le sang, le pus, les muscles et le cœur ont tous la même densité radiologique : la densité \"EAU\". Si du liquide (sang) vient toucher le cœur (muscle), leurs bords se confondent car les rayons X les traversent de la même façon. C'est la base absolue pour comprendre le fameux \"Signe de la Silhouette\" que vous verrez bientôt !"
  },
  {
    id: 4,
    question: "QCM 4 : Les 5 urgences \"Killers\"\nUn jeune homme de 22 ans, grand et longiligne, arrive aux urgences avec une douleur thoracique brutale et une détresse respiratoire majeure (cyanose, chute de tension). Vous demandez une radio thorax en urgence. Parmi ces 5 urgences vitales absolues, quel signe radiologique réclame un drainage ou une exsufflation immédiate, avant même l'avis du réanimateur ?",
    options: [
      "A) Un élargissement global du médiastin supérieur à 8 cm.",
      "B) Un croissant gazeux bilatéral fin (air) localisé sous les coupoles diaphragmatiques.",
      "C) Une opacité (blanche) totale de l'hémithorax gauche sans déplacement de la trachée.",
      "D) Une hyperclarté (noire) de l'hémithorax droit, sans trame pulmonaire, qui refoule la trachée et le cœur vers la gauche.",
      "E) Un liseré clair bordant le bord gauche de la silhouette cardiaque, remontant vers le cou."
    ],
    correctAnswer: "D) Une hyperclarté (noire) de l'hémithorax droit, sans trame pulmonaire, qui refoule la trachée et le cœur vers la gauche.",
    explanation: "Alerte rouge, c'est le Pneumothorax Sous Tension (ou compressif) ! L'air (hyperclarté = noir total car absence de vaisseaux) entre dans la plèvre mais ne peut plus sortir. La pression augmente, écrase le poumon, et surtout pousse le médiastin (le cœur et la trachée) du côté opposé, pliant les veines caves. Le patient meurt d'un désamorçage cardiaque (choc obstructif). On n'attend pas de scanner, on n'appelle pas le chef : on pique et on exsuffle ! (Note : A = Dissection aortique, B = Pneumopéritoine, E = Pneumomédiastin)."
  },
  {
    id: 5,
    question: "QCM 5 : Les fameuses \"Zones Aveugles\" (Blind spots)\nVous avez méthodiquement analysé les poumons de votre patient de la base au sommet. Cependant, votre tuteur vous rappelle de vérifier les \"Zones aveugles\". Pourquoi l'espace rétrocardiaque (derrière le cœur) est-il une zone aveugle si dangereuse sur un cliché de face ?",
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
];
