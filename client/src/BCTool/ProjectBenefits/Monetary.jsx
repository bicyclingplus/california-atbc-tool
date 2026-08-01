import { readableNumber, moneyFmt } from '../helpers/formatting';

import "./Monetary.css";

const Monetary = (props) => {

  const {
    benefits,
    timeframe,
    cost,
  } = props;

  const total = (
    benefits.health.total.mean +
    benefits.safety.mean +
    benefits.emissions.ghg.mean +
    benefits.emissions.air_quality.mean
  );

  const ratio = total / cost;

  return(
    <>
    <div className="section-bar">Section 1: <strong>Project-Level Monetary Benefits</strong></div>

    <div className="sec1">

      <div className="ratio-card-wrap">
        <div className="ratio-card">
          <div className="lbl">Benefit-cost ratio</div>
          <div className="val">
            <span>{readableNumber(ratio)} : 1</span>
            <span className="gauge">
              <svg viewBox="0 0 56 32">
                <path
                  d="M4 28 A24 24 0 0 1 52 28"
                  fill="none"
                  stroke="#cfd6df"
                  strokeWidth="6"
                  strokeLinecap="round"
                >
                </path>
                <line x1="28" y1="28" x2="42" y2="10" stroke="#f59f3a" strokeWidth="3" strokeLinecap="round"></line>
                <circle cx="28" cy="28" r="2.5" fill="#1d2939"></circle>
              </svg>
            </span>
          </div>
        </div>
        <div className="ratio-card light">
          <div className="lbl">Total quantified benefit ({timeframe} yr)</div>
          <div className="val">{moneyFmt(total, 0)}</div>
        </div>
      </div>

      <div>

        <div className="category-header"><strong>Benefit by category:</strong> {timeframe}-year estimate</div>

        <div className="cat-row">
          <div className="cat-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="#1d2939" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 12h3l2-5 4 10 2-5h2"></path>
              <circle cx="18" cy="12" r="1.5" fill="#1d2939"></circle>
            </svg>
          </div>
          <div className="cat-label"><strong>Physical activity:</strong> Health</div>
          <div className="cat-amount">{moneyFmt(benefits.health.total.mean)}</div>
        </div>

        <div className="cat-row">
          <div className="cat-icon">
            <svg viewBox="0 0 24 24" fill="#1d2939">
              <path d="M12 2L4 5v6c0 5 3.5 9.5 8 11 4.5-1.5 8-6 8-11V5l-8-3zm0 2.18L18 6v5c0 4.2-2.9 7.9-6 9-3.1-1.1-6-4.8-6-9V6l6-1.82z"></path>
              <path d="M10.5 12.5l1.5 1.5 3.5-3.5-1-1-2.5 2.5-.5-.5z"></path>
            </svg>
          </div>
          <div className="cat-label"><strong>Safety:</strong> Crash &amp; Fatality reduction</div>
          <div className="cat-amount">{moneyFmt(benefits.safety.mean)}</div>
        </div>

        <div className="cat-row">
          <div className="cat-icon">
            <svg viewBox="0 0 24 24" fill="#1d2939">
              <path d="M12 2c-1.5 3-3 4.5-5 6.5C5 11 4 13 4 15a8 8 0 0 0 16 0c0-2-1-4-3-6.5-2-2-3.5-3.5-5-6.5z"></path>
            </svg>
          </div>
          <div className="cat-label"><strong>Greenhouse Gasses</strong> reduction</div>
          <div className="cat-amount">{moneyFmt(benefits.emissions.ghg.mean)}</div>
        </div>

        <div className="cat-row">
          <div className="cat-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="#1d2939" strokeWidth="1.6">
              <circle cx="12" cy="12" r="3"></circle>
              <path d="M12 4 L13.5 7 L10.5 7 Z M12 20 L13.5 17 L10.5 17 Z M4 12 L7 13.5 L7 10.5 Z M20 12 L17 13.5 L17 10.5 Z" fill="#1d2939" stroke="none"></path>
            </svg>
          </div>
          <div className="cat-label"><strong>Air Toxins</strong> reduction</div>
          <div className="cat-amount">{moneyFmt(benefits.emissions.air_quality.mean)}</div>
        </div>
      </div>
    </div>
    </>
  );
};

export default Monetary;
