# AI Test Generator Artifacts

Design of the AI-driven API test generator required by REQUIREMENTS.md section 7
(Create level, G9.5). The implementation is the `api-test-generator` agent skill
submitted under `../skills/api-test-generator/`.

```text
test-generator/
├── README.md            this file
├── design-diagram.md    both diagrams, with the design decisions behind them
├── pseudocode.md        pseudocode of the design, Markdown, not runnable
└── diagrams/
    ├── src/             Mermaid sources (.mmd), the editable originals
    └── render/          PNG renders committed for the report and the PDF
```

| File | Content |
| --- | --- |
| `design-diagram.md` | Both diagrams with the design decisions behind them |
| `pseudocode.md` | Pseudocode of the design (Markdown, non-executable by design) |
| `diagrams/src/generator-pipeline.mmd` | Diagram 1, landscape: the seven-stage generator pipeline |
| `diagrams/src/generator-pipeline-portrait.mmd` | Diagram 1, portrait (A4-friendly), same content |
| `diagrams/src/generator-boundaries.mmd` | Diagram 2, landscape: the generator's place in the five-skill pipeline, its boundaries and the human gates |
| `diagrams/src/generator-boundaries-portrait.mmd` | Diagram 2, portrait (A4-friendly), same content |
| `diagrams/render/*.png` | The four PNGs rendered from the sources above, one per `.mmd` |

Rendering, from this directory:

```bash
mmdc -i diagrams/src/<name>.mmd -o diagrams/render/<name>.png -b white -w <width>
```

Width 2400 for the landscape files, 1300 to 1600 for the portrait ones.

The portrait layout states the refinement loop as text on the `Deepen the thin
branch` node instead of a back-arrow, because the back-edge forces the layout
engine to drop the S2 branch to the bottom of the page. Both layouts describe the
same loop.
