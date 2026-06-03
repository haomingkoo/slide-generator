# PDF Ingestion

Use when the input or output involves PDF files.

## Extraction Strategy

1. Determine whether the PDF has a text layer.
2. Extract text with layout when available.
3. Extract tables separately.
4. Render pages to images for visual context only when layout, figures, scans, or visual evidence matter. For long PDFs, render selected pages or low-resolution thumbnails first.
5. Use OCR only for scanned or image-heavy pages.
6. Keep page numbers and coordinates when possible for traceability.

## Source Map

PDF-derived claims should include:

- file path,
- page number,
- section heading if known,
- extracted text excerpt,
- table or figure reference when relevant,
- OCR flag if OCR was used.

## Tables and Figures

Do not treat extracted table text as reliable without checking structure. For figure-heavy PDFs, render page images and inspect the relevant figure before turning it into a chart or claim.

## OCR Caveats

OCR claims should have lower confidence unless verified by another source or human review. If text quality is poor, preserve uncertainty in the claim ledger.

## Exporting PDF

For HTML decks, export to PDF only after browser QA. For PPTX decks, export to PDF after PPTX visual QA.
