# Evalin

Product scoring and portfolio insights built with Next.js 16, React 19, and pnpm.

## Requirements
- Node 22+ with pnpm `10.26.0` (see `packageManager`)
- Python 3.10+ for Firebase Functions

## Firebase Functions (Python)
```bash
python -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
```

## Web app (Next.js)
```bash
# install deps
pnpm install

# dev server
pnpm dev  # http://localhost:3000

# production
pnpm build && pnpm start
```

