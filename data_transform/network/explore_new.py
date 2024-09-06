import json
import os

foldername = 'input'
# foldername = 'output'

# filename = 'Final_network_nodes.geojson'
# filename = 'Final_network_nodes1.geojson'
# filename = 'Final_network_links.geojson'
# filename = 'Final_network_links1.geojson'
# filename = 'Final_network_links_merged.geojson'
filename = '2022_07_30_Final_network_nodes.geojson'
# filename = '2022_07_30_Final_network_links.geojson'

geojson = json.load(open(os.path.join(foldername, filename)))

print(json.dumps(geojson['features'][1234]['properties']))
