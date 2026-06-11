# Source data

Authoritative content for the BADWRX site. Update these files, then run:

```bash
npm run sync:source
```

Or they sync automatically on `npm run build`.

| File | Contents |
|------|----------|
| `BADWRX_Website_Copy_7.docx` | Home, about, packages, and page marketing copy |
| `Pricing_List_BADWRX_Final_43.xlsx` | **WEBSITE DATA** sheet — rifles, specs, colors, optics, calibers, copy blocks; **MASTER DEALER PRICE LIST** — component retail pricing |

Generated output: `src/data/generated/source-data.ts`
