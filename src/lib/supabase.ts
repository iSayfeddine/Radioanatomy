import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jhydqiymzbimhdhbtdbj.supabase.co';
const supabaseKey = 'sb_publishable_G2jdVuU61cZU9l_tDOZ-TA_jvH_jhIU';

export const supabase = createClient(supabaseUrl, supabaseKey);

export interface Point { x: number; y: number; }
export interface Stroke { points: Point[]; color: string; labelId: string; }
export interface Submission {
  id: string;
  student_name: string;
  strokes: Stroke[];           // Radio de face
  strokes_profil: Stroke[];    // Radio de profil
  created_at: string;
}
