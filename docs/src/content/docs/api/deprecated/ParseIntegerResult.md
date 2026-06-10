---
editUrl: false
next: false
prev: false
title: "ParseIntegerResult"
---

> **ParseIntegerResult** = \{ `kind`: `"empty"`; \} \| \{ `kind`: `"not-a-number"`; `raw`: `string`; \} \| \{ `kind`: `"not-an-integer"`; `parsed`: `number`; `raw`: `string`; \} \| \{ `kind`: `"success"`; `value`: `number`; \}

Defined in: projects/ngx-signal-schema/src/lib/validators/integer-parser.ts:7

:::caution[Deprecated]
This function was exported by mistake and will become internal in the next major release (v2). Don't use it.
:::
