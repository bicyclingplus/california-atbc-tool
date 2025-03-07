# Backend for Caltrans BC tool

## directory structure

* controllers: backend controllers
* data: static data as JSON used by backend
* helpers: code for benefits calculations, debugging, and reports
* routes: backend routes
* schemas: schemas used to validate data from frontend

## top level scripts

### debug.js

generate debugging output for safety benefit calculations

### dump.js

dump a project from mongo to json

### index.js

main express entrypoint for backend server

### network_v4.js

generates benefits for some project definitions using an updated network

### reports.js

create various reports for projects


