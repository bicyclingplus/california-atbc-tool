import React from 'react';
import Leaflet from 'leaflet';
import { v4 as uuidv4 } from 'uuid';

import symbology from './symbology';

import 'leaflet/dist/leaflet.css';
import 'leaflet-spin/leaflet.spin.min';
import './ProjectMap.css';

// remember larger zoom means closer
// smallest zoom level at which we still display
// features on the map
// any less and we display a warning instead
const ZOOM_CUTOFF = 17;
const MAX_ZOOM = 20;

class ProjectMap extends React.Component {

    constructor(props) {
      super(props);

      this.map = null;
      this.features = null;
      this.wayFeatures = null;
      this.intersectionFeatures = null;
      this.userIntersectionFeatures = null;
      this.userWayPointFeatures = null;
      this.userWayPointLineFeature = null;
      this.userWayFeatures = null;
      this.ways = null;
      this.intersections = null;

      this.state = {
        "userWayPoints": [],
        "showWarning": false,
      }
    }

    componentDidMount() {
      this.updateMap();
    }

    componentDidUpdate(prevProps) {
      // Fit the map to bounds if needed
      if(this.props.bounds !== prevProps.bounds) {
        this.updateMap();
      }

      // If the editing mode or selection mode changes
      // render again to change the stack order of
      // the elements
      if(this.props.mode !== prevProps.mode ||
        this.props.selection !== prevProps.selection) {

        this.renderFeatures();
      }

      // Reset map if needed
      // TODO move this up to parent
      if(this.props.shouldResetMap) {
        this.reset();
      }

      // Cancel the current user way being added
      if(this.props.shouldCancelWay) {
        this.cancel();
      }

      // Finish the current user way being added
      if(this.props.shouldFinishWay > 0) {
        this.finish();
      }

      // re render when selections change
      // TODO re create selectedway/selectedintersection ids arrays here
      // rather than in some cases created for each feature on rendering
      // TODO move bounds calculation up to bctool, not really needed/used
      // here except for leaflet dependency
      if(this.props.selectedWays !== prevProps.selectedWays ||
        this.props.selectedIntersections !== prevProps.selectedIntersections ||
        this.props.userWays !== prevProps.userWays ||
        this.props.userIntersections !== prevProps.userIntersections) {
          this.updateProjectBounds();
          this.renderFeatures();
        }
    }

    styleWay = (feature) => {

      let { selectedWays } = this.props;
      let selectedWayIds = selectedWays.map((w) =>  w.properties.edge_uid);

      return selectedWayIds.includes(feature.properties.edge_uid) ?
        symbology.pre_existing.selected.link :
        symbology.pre_existing.default.link;
    }

    styleUserWay = () => {

      return symbology.user_defined.link;
    }

    calcLengthArray = (latlngs) => {
      let total = latlngs[0].distanceTo(latlngs[1]);

      for(let i = 1; i < latlngs.length - 1; i++) {
        total += latlngs[i].distanceTo(latlngs[i+1]);
      }

      // m to ft
      return total * 3.28084;
    }

    // This can handle multilinestring and linestring
    calcLength = (latlngs) => {

      if(Array.isArray(latlngs[0])) {

        let total = 0;

        for(let i = 0; i < latlngs.length; i++) {
          total += this.calcLengthArray(latlngs[i]);
        }

        return total;
      }

      return this.calcLengthArray(latlngs);
    }

    userWayClicked = (e) => {

      let userWays = structuredClone(this.props.userWays);
      let userIntersections = structuredClone(this.props.userIntersections);
      let { updateUserWaysAndIntersections } = this.props;
      let feature = e.target.feature;

      // remove the clicked interesection
      userWays = userWays.filter((item) => (item.properties.id !== feature.properties.id));

      // remove child intersections
      userIntersections = userIntersections.filter((item) => (item.properties.parent !== feature.properties.id));

      // stop propagation to map
      Leaflet.DomEvent.stopPropagation(e);

      // let the tool know about updated ways
      updateUserWaysAndIntersections(userWays, userIntersections);
    }

    wayClicked = (e) => {

      let selectedWays = structuredClone(this.props.selectedWays);
      let selectedIntersections = structuredClone(this.props.selectedIntersections);
      let { updateSelectedWaysAndIntersections } = this.props;

      let selectedWayIds = selectedWays.map((w) =>  w.properties.edge_uid);
      // let selectedIntersectionIds = selectedIntersections.map((i) => i.properties.node_id);

      let feature = e.target.feature;
      let featureId = feature.properties.edge_uid;

      // If this way is already selected, remove it otherwise select it
      if(selectedWayIds.includes(featureId)) {

        // Remove the clicked way from selection and length count
        selectedWays = selectedWays.filter((item) => (item.properties.edge_uid !== featureId));

        // Grab the intersection ids attached to the way we're removing
        let intA = feature.properties.source;
        let intB = feature.properties.target;

        let intAFound = false;
        let intBFound = false;

        // Check all the other selected ways to see if they include this intersection
        for(let way of selectedWays) {

          // Skip this one
          if(way.properties.edge_uid === featureId) {
            continue;
          }

          let source = way.properties.source;
          let target = way.properties.target;

          if(intA === source || intA === target) {
            intAFound = true;
          }

          if(intB === source || intB === target) {
            intBFound = true;
          }
        }

        // If no other selected ways use these intersections, remove them from selection
        if(!intAFound) {
          selectedIntersections = selectedIntersections.filter((item) => (item.properties.node_id !== intA));
        }

        if(!intBFound) {
          selectedIntersections = selectedIntersections.filter((item) => (item.properties.node_id !== intB));
        }
      }
      else {

        let length = this.calcLength(e.target.getLatLngs());

        // double the length for two way streets
        // if(!feature.properties.one_way_ca) {
        //   length *= 2;
        // }

        feature.properties.length = length;
        selectedWays.push(feature);

        // let intA = feature.properties.source;
        // let intB = feature.properties.target;

        // if(!selectedIntersectionIds.includes(intA)) {

        //   // find the feature for this intersection
        //   for(let intersection of this.intersections) {
        //     if(intersection.properties.node_id === intA) {
        //       selectedIntersections.push(intersection);
        //       break;
        //     }
        //   }
        // }

        // if(!selectedIntersectionIds.includes(intB)) {

        //   // find the feature for this intersection
        //   for(let intersection of this.intersections) {
        //     if(intersection.properties.node_id === intB) {
        //       selectedIntersections.push(intersection);
        //       break;
        //     }
        //   }
        // }
      }

      updateSelectedWaysAndIntersections(selectedWays, selectedIntersections);
    }

    onEachWay = (feature, mapLayer) => {
      mapLayer.on({
        click: this.wayClicked,
      });
    }

    onEachUserWay = (feature, mapLayer) => {
      mapLayer.on({
        click: this.userWayClicked,
      });
    }

    onMapMove = () => {

      if(this.map.getZoom() >= ZOOM_CUTOFF) {

        // query current bounds to the server
        let bounds = this.map.getBounds();

        if(!bounds.isValid()) {
          return;
        }

        this.clearFeatures();
        this.map.spin(true);

        let url = `${process.env.PUBLIC_URL}/api/features`;

        url += `?x1=${bounds.getWest()}&x2=${bounds.getEast()}&y1=${bounds.getSouth()}&y2=${bounds.getNorth()}`;

        fetch(url)
          .then((response) => {
            if(!response.ok) {
              throw new Error();
            }
            return response.json();
          })
          .then(
            (result) => {
              this.ways = result.ways.features;
              this.intersections = result.intersections.features;

              this.setState({
                'showWarning': false,
              }, () => {
                this.renderFeatures();
              });
            },
            (error) => {
              console.log(error);
            },
          )
          .catch(error => {
            console.log(`Server says: ${error}`);
          });

      }
      else {
        this.clearFeatures();

        this.setState({
          'showWarning': true,
        });
      }
    }

    onMapClick = (e) => {

      let { userWayPoints, showWarning } = this.state;

      let {
        mode,
        selection,
      } = this.props;

      if(showWarning) {
        return;
      }

      if(mode === 'add') {

        if(selection === 'intersection') {

          let userIntersections = structuredClone(this.props.userIntersections);
          let { userWays, updateUserWaysAndIntersections } = this.props;

          // add an intersection to the list at the point of the click
          userIntersections.push({
            "type": "Feature",
            "geometry": {
              "type": "Point",
              "coordinates": [e.latlng.lng, e.latlng.lat]
            },
            "properties": {
              "id": uuidv4(),
              "parent": null,
            }
          });

          updateUserWaysAndIntersections(userWays, userIntersections);
        }
        else if(selection === "way") {

          if(!this.props.isAddingUserWay) {
            this.props.updateUserWayStatus(true);
          }

          userWayPoints.push([e.latlng.lng, e.latlng.lat]);

          this.props.updateNumWaypoints(userWayPoints.length);

          this.setState({
            "userWayPoints": userWayPoints,
          }, this.renderFeatures);
        }
      }
    }

    userPointToLayer = (feature, latlng) => {

      return Leaflet.circleMarker(latlng, symbology.user_defined.intersection);
    }

    userWayPointToLayer = (feature, latlng) => {

      return Leaflet.circleMarker(latlng, symbology.user_defined.waypoint);
    }

    pointToLayer = (feature, latlng) => {

      let { selectedIntersections } = this.props;
      let selectedIntersectionIds = selectedIntersections.map((i) => i.properties.node_id);

      return Leaflet.circleMarker(latlng,
        selectedIntersectionIds.includes(feature.properties.node_id) ?
        symbology.pre_existing.selected.intersection :
        symbology.pre_existing.default.intersection);
    }

    onEachIntersection = (feature, mapLayer) => {
      mapLayer.on({
        click: this.intersectionClicked
      });
    }

    onEachUserIntersection = (feature, mapLayer) => {
      mapLayer.on({
        click: this.userIntersectionClicked,
      });
    }

    userIntersectionClicked = (e) => {

      let userIntersections = structuredClone(this.props.userIntersections);
      let { userWays, updateUserWaysAndIntersections } = this.props;
      let feature = e.target.feature;

      // remove the clicked interesection
      userIntersections = userIntersections.filter((item) => (item.properties.id !== feature.properties.id));

      // stop propagation to map
      Leaflet.DomEvent.stopPropagation(e);

      updateUserWaysAndIntersections(userWays, userIntersections);
    }

    intersectionClicked = (e) => {

      let selectedIntersections = structuredClone(this.props.selectedIntersections);
      let { selectedWays, updateSelectedWaysAndIntersections } = this.props;
      let selectedIntersectionIds = selectedIntersections.map((i) => i.properties.node_id);
      let feature = e.target.feature;
      let featureId = feature.properties.node_id;

      // Check if this intersection is already selected or not
      if(selectedIntersectionIds.includes(featureId)) {

        // Remove from selection
        selectedIntersections = selectedIntersections.filter((item) => (item.properties.node_id !== featureId));
      }
      else {

        // Add to selection
        selectedIntersections.push(feature);
      }

      updateSelectedWaysAndIntersections(selectedWays, selectedIntersections);
    }

    clearFeatures = () => {

        // existing ways
        if(this.wayFeatures) {
          this.map.removeLayer(this.wayFeatures);
        }

        // existing intersections
        if(this.intersectionFeatures) {
          this.map.removeLayer(this.intersectionFeatures);
        }

        // user defined intersections
        if(this.userIntersectionFeatures) {
          this.map.removeLayer(this.userIntersectionFeatures);
        }

        // User defined way in progress of adding
        if(this.userWayPointFeatures) {
          this.map.removeLayer(this.userWayPointFeatures);
        }
        if(this.userWayPointLineFeature) {
          this.map.removeLayer(this.userWayPointLineFeature);
        }

        // User defined ways
        if(this.userWayFeatures) {
          this.map.removeLayer(this.userWayFeatures);
        }
    }

    renderFeatures = () => {

      let { showWarning } = this.state;
      let {
        mode,
        selection,
        userWays,
        userIntersections,
      } = this.props;

      this.clearFeatures();

      if(showWarning) {
        return;
      }

      // TODO refactor to combine onEachFeature handlers
      // abstract out just the feature set

      // existing ways
      this.wayFeatures = Leaflet.geoJSON(this.ways, {
        onEachFeature: mode === "existing" && selection === "way" ? this.onEachWay : null,
        style: this.styleWay,
      });

      // existing intersections
      this.intersectionFeatures = Leaflet.geoJSON(this.intersections, {
        onEachFeature: mode === "existing" && selection !== "way" ? this.onEachIntersection : null,
        pointToLayer: this.pointToLayer,
      });

      // user defined intersections
      let userIntersectionCollection = {
        "type": "FeatureCollection",
        "features": userIntersections,
      };

      this.userIntersectionFeatures = Leaflet.geoJSON(userIntersectionCollection, {
        onEachFeature: mode === "add" && selection !== "way" ? this.onEachUserIntersection : null,
        pointToLayer: this.userPointToLayer,
      });

      // User defined way in progress of adding
      if(this.state.userWayPoints.length) {

        let userWayPointsGeoJSON = {};
        let userWayPointsOpts = {
          pointToLayer: this.userWayPointToLayer,
        };

        if(this.state.userWayPoints.length === 1) {
          userWayPointsGeoJSON = {
            "type": "Feature",
            "geometry": {
              "type": "Point",
              "coordinates": this.state.userWayPoints[0]
            }
          };
        }
        else {
          let userWayPointLineGeoJSON = {
            "type": "Feature",
            "geometry": {
              "type": "LineString",
              "coordinates": this.state.userWayPoints
            }
          };

          let userWaypointLineOpts = {
            style: this.styleUserWay,
          };

          userWayPointsGeoJSON = {
            "type": "FeatureCollection",
            "features": [
              {
                "type": "Feature",
                "geometry": {
                  "type": "Point",
                  "coordinates": this.state.userWayPoints[0]
                }
              },
              {
                "type": "Feature",
                "geometry": {
                  "type": "Point",
                  "coordinates": this.state.userWayPoints[this.state.userWayPoints.length-1]
                }
              },
            ]
          };

          this.userWayPointLineFeature = Leaflet.geoJSON(userWayPointLineGeoJSON, userWaypointLineOpts);
        }

        this.userWayPointFeatures = Leaflet.geoJSON(userWayPointsGeoJSON, userWayPointsOpts);
      }

      // User defined ways
      let userWaysCollection = {
        "type": "FeatureCollection",
        "features": userWays,
      };

      this.userWayFeatures = Leaflet.geoJSON(userWaysCollection, {
        onEachFeature: mode === "add" && selection === "way" ? this.onEachUserWay : null,
        style: this.styleUserWay,
      });

      // stack order
      if(mode === "existing") {
        if(selection === "way") {
          this.userIntersectionFeatures.addTo(this.map);
          this.userWayFeatures.addTo(this.map);

          this.intersectionFeatures.addTo(this.map);
          this.wayFeatures.addTo(this.map);
        }
        else {
          this.userWayFeatures.addTo(this.map);
          this.userIntersectionFeatures.addTo(this.map);

          this.wayFeatures.addTo(this.map);
          this.intersectionFeatures.addTo(this.map);
        }
      }
      else {
        if(selection === "way") {
          this.intersectionFeatures.addTo(this.map);
          this.wayFeatures.addTo(this.map);

          this.userIntersectionFeatures.addTo(this.map);
          this.userWayFeatures.addTo(this.map);

          if(this.state.userWayPoints.length) {
            this.userWayPointFeatures.addTo(this.map);

            if(this.state.userWayPoints.length > 1) {
              this.userWayPointLineFeature.addTo(this.map);
            }
          }
        }
        else {
          this.wayFeatures.addTo(this.map);
          this.intersectionFeatures.addTo(this.map);

          this.userWayFeatures.addTo(this.map);
          this.userIntersectionFeatures.addTo(this.map);
        }
      }

      this.map.spin(false);
    }

    updateMap = () => {

      if(!this.map) {
        this.map = Leaflet.map('map');

        Leaflet.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery &copy; <a href="https://www.mapbox.com/">Mapbox</a>',
            maxZoom: MAX_ZOOM,
            id: 'mapbox/streets-v11',
            tileSize: 512,
            zoomOffset: -1,
            accessToken: process.env.REACT_APP_MAPBOX_TOKEN,
        }).addTo(this.map);

        this.map.on('moveend', () => {
          this.onMapMove();
        });

        this.map.on('click', (e) => {
          this.onMapClick(e);
        });
      }

      this.map.fitBounds(this.props.bounds);
      this.onMapMove();
    }

    reset = () => {

      let { updateAllWaysAndIntersections } = this.props;

      updateAllWaysAndIntersections([], [], [], []);
      this.updateProjectBounds([], [], [], []);

      this.props.mapResetFinished();
      this.props.wayFinished();

      this.cancel();
    }

    cancel = () => {

      this.props.updateUserWayStatus(false);
      this.props.updateNumWaypoints(0);
      this.props.cancelWayFinished();

      this.setState({
        "userWayPoints": [],
      }, this.renderFeatures);
    }

    finish = () => {

      let {
        shouldFinishWay,
        updateUserWaysAndIntersections,
      } = this.props;

      let userWays = structuredClone(this.props.userWays);
      let userIntersections = structuredClone(this.props.userIntersections);

      // 0 == don't call this function
      // 1 == oneway
      // 2 == twoway
      let oneway = shouldFinishWay === 1 ? true : false;

      let newId = uuidv4();
      let length = this.calcLength(Leaflet.GeoJSON.coordsToLatLngs(this.state.userWayPoints));

      if(!oneway) {
        length *= 2;
      }

      // create the geojson and add to list of user defined ways
      userWays.push({
        "type": "Feature",
        "geometry": {
          "type": "LineString",
          "coordinates": this.state.userWayPoints
        },
        "properties": {
          "id": newId,
          "length": length,
          "one_way_ca": oneway,
        }
      });

      userIntersections.push({
        "type": "Feature",
        "geometry": {
          "type": "Point",
          "coordinates": this.state.userWayPoints[0]
        },
        "properties": {
          "id": uuidv4(),
          "parent": newId,
        }
      });

      userIntersections.push({
        "type": "Feature",
        "geometry": {
          "type": "Point",
          "coordinates": this.state.userWayPoints[this.state.userWayPoints.length-1]
        },
        "properties": {
          "id": uuidv4(),
          "parent": newId,
        }
      });

      // let the tool know about updated ways
      updateUserWaysAndIntersections(userWays, userIntersections);

      // get ready to add another new way
      this.cancel();

      // let the tool know we're no longer adding a way
      this.props.wayFinished();
    }

    updateProjectBounds = () => {

      let {
        selectedWays,
        selectedIntersections,
        userWays,
        userIntersections,
        updateProjectBounds,
      } = this.props;

      let bounds = new Leaflet.latLngBounds();

      for(let w of selectedWays) {
        bounds.extend(Leaflet.geoJSON(w).getBounds());
      }

      // technically shouldn't need this because the intersections are the
      // first/last point of a way
      for(let i of selectedIntersections) {
        bounds.extend(Leaflet.geoJSON(i).getBounds());
      }

      for(let w of userWays) {
        bounds.extend(Leaflet.geoJSON(w).getBounds());
      }

      for(let i of userIntersections) {
        bounds.extend(Leaflet.geoJSON(i).getBounds());
      }

      updateProjectBounds(bounds);
    }

    render() {

      let { showWarning } = this.state;

      return (
        <div id="map">
          { showWarning ?
            <div id="map-warning" className="alert position-absolute top-0 start-50 translate-middle-x mt-3 text-center p-1" role="alert">
              Zoom in to select links
            </div>
          : null }
        </div>
      );
    }

}

export default ProjectMap;
