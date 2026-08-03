# Cross-Browser / Cross-Platform Matrix

## Coverage Overview

- Scenario: User administration
- Screens tested: C1 Users list, C2 Assign Role / edit user, C4 Export to Excel
- Evidence basis: existing screenshots in `task3/` and its subfolders

## Matrix

| Test ID | Screen | Browser | Version | OS | Device | Tested feature/page | Result | Observations | Screenshot |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| T3-C1-01 | C1 Users list | Chrome | Not visible | Windows | Desktop | Users Management list | Pass | Layout is stable on desktop; sidebar, search, filters, and table columns render correctly. | ![C1 Windows Chrome Desktop](./C1-users-list/T3-C1-01.png) |
| T3-C1-02 | C1 Users list | Safari | v17.1 | iOS | Tablet | Users Management list | Pass | Responsive layout is preserved on the tablet viewport; the table remains readable and controls stay accessible. | ![C1 iOS Safari Tablet](./C1-users-list/T3-C1-02.png) |
| T3-C1-03 | C1 Users list | Chrome | v14.0 | Android | Phone | Users Management list | Minor Issue | The content is heavily constrained in the phone viewport and part of the page is clipped to the right, but the screen still loads. | ![C1 Android Chrome Phone](./C1-users-list/T3-C1-03.png) |
| T3-C2-01 | C2 Assign Role / edit user | Chrome | Not visible | Windows | Desktop | Edit User dialog | Pass | Modal layout, fields, and action buttons are centered and legible over the dimmed background. | ![C2 Windows Chrome Desktop](./C2-assign-role-edit-user/T3-C2-01.png) |
| T3-C2-02 | C2 Assign Role / edit user | Firefox | Not visible | macOS | Desktop | Edit User dialog | Pass | The dialog structure and form controls remain intact in Firefox on macOS, with no visible overlap. | ![C2 macOS Firefox Desktop](./C2-assign-role-edit-user/T3-C2-02.png) |
| T3-C2-03 | C2 Assign Role / edit user | Chrome | v11.0 | Android | Phone | Edit User dialog | Fail | The viewport is severely constrained on phone, leaving only a narrow portion of the page visible and making the dialog unusable. | ![C2 Android Chrome Phone](./C2-assign-role-edit-user/T3-C2-03.png) |
| T3-C4-01 | C4 Export to Excel | Chrome | Not visible | Windows | Desktop | Users export action | Pass | Export feedback is visible and the table remains aligned after the action. | ![C4 Windows Chrome Desktop](./C4-export-to-excel/T3-C4-01.png) |
| T3-C4-02 | C4 Export to Excel | Safari | Not visible | macOS | Desktop | Users export action | Pass | Export state and table presentation are preserved in Safari on macOS. | ![C4 macOS Safari Desktop](./C4-export-to-excel/T3-C4-02.png) |
| T3-C4-03 | C4 Export to Excel | Opera | Not visible | Windows | Desktop | Users export action | Pass | Export completion is visible and the desktop layout remains consistent in Opera. | ![C4 Windows Opera Desktop](./C4-export-to-excel/T3-C4-03.png) |

## Notes

- Browser version is only recorded when it is visible in the screenshot overlay.
- The matrix uses only evidence already present in the Task 3 folder.
- Minor issues and fail states are limited to what can be seen in the screenshots.
