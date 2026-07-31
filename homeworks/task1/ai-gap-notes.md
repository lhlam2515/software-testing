# AI Gap Notes

This file records why human review added checklist items beyond the AI draft, as required by the HW03 assignment.

| ID | Added Item | Why the AI Missed It | Human Rationale |
| --- | --- | --- | --- |
| IA-01-14 | EN/VI language completeness | The initial draft did not fully account for bilingual EMS chrome strings. | EMS has mixed-language surfaces, so this had to be checked explicitly. |
| IA-01-15 | Language switch preserves state | The AI tended to treat language switching as a purely textual concern. | State preservation is part of user control and is easy to miss in generic checklist generation. |
| IA-01-16 | Locale formatting and time-zone label | The draft did not focus on locale-sensitive date/time rendering. | EMS shows date/time values that users need to interpret correctly. |
| IA-01-17 | Vietnamese diacritics integrity | The AI overlooked font and overflow problems specific to Vietnamese text. | This is a realistic EMS risk because the interface uses Vietnamese strings of varying length. |
| IA-02-15 | Dropdown consistency | The draft overemphasized generic form validation and under-specified select control behavior. | Select controls are common in EMS and need precise checklist coverage. |
| IA-02-16 | Checkbox/radio behavior | The AI missed keyboard and label interaction rules for choice controls. | These controls are interaction-critical and frequently overlooked in broad prompts. |
| IA-02-17 | Disabled state clarity | The AI did not explicitly capture discoverability of disabled-state reasons. | Disabled controls are a common source of confusion and usability loss. |
| IA-02-18 | Long value / long label resilience | The draft did not cover layout breakage caused by long content. | EMS screens include admin data and labels that can overflow. |
| IA-02-19 | Consistent validation trigger | The AI did not explicitly compare blur-vs-submit validation behavior. | Mixed validation timing is a common usability defect in forms. |
| IA-02-20 | Rich-text read-view fidelity | The AI under-specified editor output verification. | EMS uses rich-text content, so preserving formatting is essential. |
| IA-02-21 | Image aspect ratio and fallback | The AI draft did not cover image rendering quality in enough detail. | Event thumbnails and banners need explicit visual integrity checks. |

