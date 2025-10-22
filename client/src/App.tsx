import './App.css';
import './fonts.css';
import { Routes, Route } from 'react-router';

import { SignUp } from './1_Pages/Sign Up';

import { Header } from './2_Components/Header';
import { Footer } from './2_Components/Footer';
import { Hobbies } from './1_Pages/Hobbies';
import { Calendar } from './1_Pages/Calendar';
import { Metrics } from './1_Pages/Metrics';
import { Goals } from './1_Pages/Goals';

function App() {
  return (
    <>
      <div className="app-container">

        <Header />
        <Routes>
          <Route path='/sign-up' element={<SignUp />} />
          <Route path="/" element={<Footer />}>
            <Route path="/hobbies" element={<Hobbies />} />
            <Route index element={<Calendar />} />
            <Route path="/metrics" element={<Metrics />} />
            <Route path="/goals" element={<Goals />} />
          </Route>
        </Routes>
      </div>
    </>
  );
}

export default App;
