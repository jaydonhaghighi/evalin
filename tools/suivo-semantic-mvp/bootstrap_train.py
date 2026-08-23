#!/usr/bin/env python3
from __future__ import annotations
import base64
import runpy
import zlib
from pathlib import Path

ROOT = Path(__file__).resolve().parent
payload = "".join(path.read_text(encoding="ascii").strip() for path in sorted(ROOT.glob("payload_*.txt")))
target = ROOT / "train_expanded.py"
target.write_bytes(zlib.decompress(base64.b64decode(payload)))
runpy.run_path(str(target), run_name="__main__")
