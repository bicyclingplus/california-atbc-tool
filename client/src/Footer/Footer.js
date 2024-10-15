import './Footer.css';

import atrc_logo from '../images/atrc_logo.png';
import bp_logo from '../images/logo_bicyclingplus_revised20220623.png';

function Footer() {
  return (
    <footer className="container-fluid">
      <div className="row pt-3 pb-3 ps-2 pe-2 justify-content-between align-items-end">
        <div className="col">
            <a href="https://bicyclingplus.ucdavis.edu/" target="_blank" rel="noreferrer">
              <img id="bp-logo" src={bp_logo} alt="UCDavis Bicyling Plus Research Collaborative Logo" />
            </a>
        </div>
        <div className="col text-end">
          <a href="https://caatpresources.org/" target="_blank" rel="noreferrer">
            <img id="atrc-logo" src={atrc_logo} alt="Active Transportation Resource Center Logo" />
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;