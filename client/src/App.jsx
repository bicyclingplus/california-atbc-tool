import React, { useState } from 'react';
import { Outlet, useNavigate } from "react-router-dom";

import {
  Routes,
  Route,
} from "react-router-dom";

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import Header from './Header/Header';
import Footer from './Footer/Footer';
import BCTool from './BCTool/BCTool';
import TechnicalDocumentation from './TechnicalDocumentation/TechnicalDocumentation';
import LiteratureReview from './LiteratureReview/LiteratureReview';
import About from './About/About';
import UserGuide from './UserGuide/UserGuide';
import Training from './Training/Training';

function App() {

  const [newProject, setNewProject] = useState(true);
  let navigate = useNavigate();

  const startNewProject = () => {
    setNewProject(true);
    navigate('tool');
  }

  const projectStarted = () => {
    setNewProject(false);
  }

  return (
    <div>
      <Header startNewProject={startNewProject} />

      <main role="main" className="main">
        <Routes>
          <Route index element={<BCTool newProject={newProject} projectStarted={projectStarted}/>} />
          <Route path="tool" element={<BCTool newProject={newProject} projectStarted={projectStarted}/>} />
          <Route path="technicaldocs" element={<TechnicalDocumentation />} />
          <Route path="litreview" element={<LiteratureReview />} />
          <Route path="about" element={<About />} />
          <Route path="userguide" element={<UserGuide />} />
          <Route path="training" element={<Training />} />
        </Routes>
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}

export default App;
