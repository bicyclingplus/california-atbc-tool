import React from 'react';
import 'bootstrap-icons/font/bootstrap-icons.css';

import { readableNumber } from '../helpers/formatting';

// const Tooltip = require('bootstrap/js/dist/tooltip');
import Tooltip from 'bootstrap/js/dist/tooltip';

class ProjectSummary extends React.Component {

    componentDidMount() {
      this.tooltips = [
        new Tooltip(document.getElementById(`project-length-tooltip`)),
      ];
    }

    componentWillUnmount() {
      if(this.tooltips && this.tooltips.length) {
        for(let tooltip of this.tooltips) {
          tooltip.dispose();
        }
      }
    }

    render() {

        const intersections = this.props.intersections;
        const length = this.props.length;

        return (
            <div>
              <h4 className="text-center section-header">Project Reach</h4>

              <ul className="list-unstyled">
                <li>Number of Intersections: {intersections}</li>
                <li>
                  Length: {readableNumber(length)} ft ({readableNumber(length/5280, 2)} mi)
                  <i id={`project-length-tooltip`}
                    className="bi bi-info-circle ms-2"
                    data-bs-toggle="tooltip"
                    data-bs-placement="right"
                    data-bs-html="true"
                    title='Project length is calculated based on unidirectional travel. Both directions of two-way streets and one direction on one-way streets are counted.'>
                  </i>
                </li>
              </ul>
            </div>
        );
    }

}

export default ProjectSummary;