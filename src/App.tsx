import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ProfilAuswahl } from '@/pages/ProfilAuswahl';
import { ProfilErstellen } from '@/pages/ProfilErstellen';
import { Uebersicht } from '@/pages/Uebersicht';
import { StufeView } from '@/pages/StufeView';
import { Fortschritt } from '@/pages/Fortschritt';
import { ElternGate } from '@/pages/ElternGate';
import { Lexikon } from '@/pages/Lexikon';

const basename = import.meta.env.BASE_URL.replace(/\/$/, '');

export function App() {
  return (
    <BrowserRouter basename={basename}>
      <Routes>
        <Route path="/" element={<ProfilAuswahl />} />
        <Route path="/profil/neu" element={<ProfilErstellen />} />
        <Route path="/ueben" element={<Uebersicht />} />
        <Route path="/stufe/:stufeId" element={<StufeView />} />
        <Route path="/fortschritt" element={<Fortschritt />} />
        <Route path="/eltern" element={<ElternGate />} />
        <Route path="/lexikon" element={<Lexikon />} />
      </Routes>
    </BrowserRouter>
  );
}
