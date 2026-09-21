# OreSight AI — SIH Demo Refresh

This package is a UI/UX refresh of the OreSight AI prototype for an SIH internal-hackathon demonstration.

## What changed

### 1. Discover → Predict → Explain → Recommend
The landing experience now communicates the full solution story in one flow.

### 2. Prospectivity workflow
The Mineral Prospectivity page now starts in a clean "ready to scan" state:
- no pre-selected B27
- no pre-filled 92% score
- no right-side zone analysis before a scan
- explicit AI Scan action
- scan progress states
- ranked candidate zones appear only after scanning
- clicking a detected block opens its evidence panel

### 3. Explainable zone analysis
Zone details emphasize the evidence contributing to the prediction:
- geological compatibility
- remote-sensing anomaly
- terrain suitability
- historical exploration
- borehole correlation
- confidence
- estimated depth
- predicted Mn grade

### 4. Cleaner visual hierarchy
The map is kept unobstructed during scanning. Scan controls and results live outside the map instead of covering candidate blocks.

### 5. Demo-data transparency
The prototype continues to identify outputs as synthetic/demo predictions and does not present them as direct underground detection.

## Run locally

Requirements:
- Node.js 22+

From the project folder:

```bash
npm install
npm run dev
```

Then open:

```text
http://localhost:5173/
```

## Suggested SIH demo sequence

1. Start on the landing page.
2. Click **Explore Mine Intelligence**.
3. Explain that the map starts without a pre-selected answer.
4. Click **Start AI Scan**.
5. During the scan, explain that multiple evidence layers are being fused.
6. After completion, show the ranked candidate zones.
7. Select a zone such as B12 or B27.
8. Explain the evidence behind its score.
9. Open **Inspect Evidence** for the depth/grade/confidence view.
10. Use the existing Command Center and What-If Simulator to demonstrate the Predict → Explain → Recommend continuation.

## Important

The UI is a prototype using synthetic demonstration data. It should be presented as a decision-support demonstration, not as a claim of confirmed underground ore detection or live MOIL operational data.
