# Resync Edge Cases

Read this file only when an audited case needs multiple CSV rows or a new encoding.

## Multiple requests

Use one CSV row per HTTP request or explicit sequence step. If one audited TC names two path
values, create two suffixed rows that share the same base TC ID. Never merge different audited
TC IDs into one row.

## New encodings

Before adding a column or sentinel, check whether this FR already represents the same meaning:

- omitted field
- empty string
- boundary-length value
- wrong JSON type
- extra body field
- missing, malformed, expired, or wrong-role credential

Reuse the existing representation when it is lossless. Otherwise add the narrowest new encoding
and define its request construction and assertion behavior in `request-template.md` immediately.

## Safe schema extension

When a new column is unavoidable:

1. Choose one semantic responsibility for the column.
2. Backfill every existing row with an explicit neutral value.
3. Update request-variable mapping and generic assertions.
4. Parse the final CSV with a CSV-aware parser.
5. Verify the new encoding on every row that uses it.

Do not normalize unrelated rows while extending the schema.
