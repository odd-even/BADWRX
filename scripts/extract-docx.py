#!/usr/bin/env python3
import json
import sys
import zipfile
import xml.etree.ElementTree as ET

W = "{http://schemas.openxmlformats.org/wordprocessingml/2006/main}"

with zipfile.ZipFile(sys.argv[1]) as z:
    root = ET.fromstring(z.read("word/document.xml"))

paras = []
for p in root.iter(f"{W}p"):
    texts = [t.text for t in p.iter(f"{W}t") if t.text]
    if texts:
        paras.append("".join(texts))

print(json.dumps(paras))
