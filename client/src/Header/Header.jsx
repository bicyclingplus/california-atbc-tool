import React, { useState, useEffect } from 'react';
import { NavLink } from "react-router-dom";

import './Header.css';
import atrc_logo from '../assets/atrc_logo.png';
import bp_logo from '../assets/logo_bicyclingplus_revised20220623.png';

// const Modal = require('bootstrap/js/dist/modal');

import Modal from 'bootstrap/js/dist/modal';


function Header(props) {

  let [ confirmModal, setConfirmModal ] = useState(null);

  useEffect(() =>  {

    setConfirmModal(new Modal(document.getElementById('bc-tool-confirm'), {
      backdrop: 'static',
    }));

  }, []);

  const openModal = () => {
    confirmModal.show();
  }

  return (
    <>
    <div className="modal" tabIndex="-1" id="bc-tool-confirm">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Start New Project</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to start a new project?</p>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">No</button>
              <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={props.startNewProject}>Yes</button>
            </div>
          </div>
        </div>
      </div>
    <div className="sticky-top">
      <div className="container-fluid top-header">
        <div className="row pt-3 pb-3 ps-2 pe-2 justify-content-between align-items-end">
          <div className="col">
              <a href="https://bicyclingplus.ucdavis.edu/" target="_blank" rel="noreferrer">
                <img id="bp-logo" src={bp_logo} alt="UCDavis Bicyling Plus Research Collaborative Logo"/>
              </a>
          </div>
          <div className="col text-end">
            <a href="https://caatpresources.org/" target="_blank" rel="noreferrer">
              <img id="atrc-logo" src={atrc_logo} alt="Active Transportation Resource Center Logo" />
            </a>
          </div>
        </div>
      </div>
      <nav className="navbar navbar-expand">
        <div className="container-fluid">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 flex-wrap">
            <li className="nav-item ms-3">
              <NavLink className="dropdown-item" to="tool">Tool</NavLink>
            </li>
           <li className="nav-item dropdown ms-5">
            <button className="btn dropdown-toggle btn-link nav-link btn-borderless" id="resourcesDropdown" data-bs-toggle="dropdown" aria-expanded="false">
              Resources
            </button>
            <ul className="dropdown-menu" aria-labelledby="resourcesDropdown">
              <li><NavLink className="dropdown-item" to="technicaldocs">Technical Documentation</NavLink></li>
              <li><NavLink className="dropdown-item" to="litreview">Literature Review</NavLink></li>
              <li><NavLink className="dropdown-item" to="about">About</NavLink></li>
              <li><NavLink className="dropdown-item" to="userguide">User Guide</NavLink></li>
              <li><NavLink className="dropdown-item" to="training">Training</NavLink></li>
            </ul>
            </li>
          </ul>
            <button className="btn btn-lg btn-restart" onClick={openModal}>Start New Project</button>
        </div>
      </nav>
    </div>
  </>
  );
}

export default Header;
