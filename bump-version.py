#! /usr/bin/env python3

import xml.etree.ElementTree as ET
import json, sys
from collections import OrderedDict

def updatesJSON(filename, version):
    with open(filename, 'r+') as f:
        bower = json.load(f, object_pairs_hook=OrderedDict)

        # updates version
        bower['version'] = version

        f.seek(0)
        f.write(json.dumps(bower, indent=2))
        f.truncate()

if __name__ == '__main__':
    if len(sys.argv) < 2:
        exit(-1)

    # new version
    version = sys.argv[1]

    #
    # edits config.xml
    #
    ET.register_namespace('', 'http://www.w3.org/ns/widgets')
    ET.register_namespace('cdv', 'http://cordova.apache.org/ns/1.0')

    tree = ET.parse('config.xml')
    root = tree.getroot()

    # fix missing namespace
    root.set("xmlns:cdv", "http://cordova.apache.org/ns/1.0")

    # updates version
    root.set('version', version)

    # write file
    with open('config.xml', 'wb') as f:
        f.write(bytes('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n', 'utf-8'))
        f.write(ET.tostring(root, encoding = 'UTF-8'))

    #
    # edits bower.json and package.json
    #
    updatesJSON('bower.json', version)
    updatesJSON('package.json', version)