import { BrowserRouter, Routes, Route } from 'react-router-dom';
import StudentApp from './StudentApp';
import TeacherApp from './TeacherApp';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<StudentApp />} />
        <Route path="/teacher" element={<TeacherApp />} />
      </Routes>
    </BrowserRouter>
  );
}
