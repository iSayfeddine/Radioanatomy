import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jhydqiymzbimhdhbtdbj.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpoeWRxaXltemJpbWhkaGJ0ZGJqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI4NDg2OTIsImV4cCI6MjEwODQyNDY5Mn0.wgKGd4MtyXyZojysoEmsh_1K9EXlYn_qx-3i-C1KM6g';

export const supabase = createClient(supabaseUrl, supabaseKey);

export interface Point { x: number; y: number; }
export interface Stroke { points: Point[]; color: string; labelId: string; }
export interface Submission {
  id: string;
  student_name: string;
  strokes: Stroke[];
  created_at: string;
}
