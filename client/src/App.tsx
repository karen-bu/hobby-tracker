import './App.css';
import './fonts.css';
import { Routes, Route } from 'react-router';

import { HeaderWelcome } from './2_Components/Header-Welcome';
import { HeaderTabs } from './2_Components/Header-Tabs';
import { Hobbies } from './1_Pages/Hobbies';
import { Calendar } from './1_Pages/Calendar';
import { Metrics } from './1_Pages/Metrics';
import { Goals } from './1_Pages/Goals';

function App() {
  return (
    <>
      <HeaderWelcome />
      <Routes>
        <Route path="/" element={<HeaderTabs />}>
          <Route path="/hobbies" element={<Hobbies />} />
          <Route index element={<Calendar />} />
          <Route path="/metrics" element={<Metrics />} />
          <Route path="/goals" element={<Goals />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
