import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Uebersicht } from '@/pages/Uebersicht';
import { StufeView } from '@/pages/StufeView';

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Uebersicht />} />
        <Route path="/stufe/:stufeId" element={<StufeView />} />
      </Routes>
    </BrowserRouter>
  );
}
