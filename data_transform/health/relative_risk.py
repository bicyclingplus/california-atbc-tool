import json
import os

data = {
    "Ischemic heart disease": 0.9764,
    "Hypertensive heart disease": 0.9764,
    "Stroke": 0.9697,
    "Alzheimer's disease and other dementias": 0.9666,
    "Diabetes mellitus": 0.9666,
    "Depressive disorders": 0.9695,
    "Colon and rectum cancer": 0.9940,
    "Breast cancer": 0.9813,
    "Tracheal, bronchus, and lung cancer": 0.9771,
}

json.dump(data, open(os.path.join('output', 'relative_risk.json'), 'w'))
