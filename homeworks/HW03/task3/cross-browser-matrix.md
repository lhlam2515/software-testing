# Cross-Browser / Cross-Platform Matrix

## Coverage Overview

- Scenario: Cross-browser / cross-platform testing for user administration and export flows
- Screens tested: C1 Users list, C2 Assign Role / edit user, C4 Export to Excel
- Required coverage: Windows, macOS, Android; Chrome, Firefox, Edge, Safari, Opera or Samsung Internet; Desktop, Tablet, Phone
- Status: Draft matrix prepared for screenshot capture

## Matrix

| Test ID | Screen | OS | Browser | Device | Status (Pass/Fail) | Evidence filename | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| T3-C1-01 | C1 Users list - search, role/active filters, columns | Windows | Chrome | Desktop | Pass | c1-users-list-windows-chrome-desktop.png | Search, filters, and columns rendered correctly. |
| T3-C1-02 | C1 Users list - search, role/active filters, columns | iOS | Safari | Tablet | Fail | c1-users-list-macos-safari-tablet.png | Table cannot display all columns |
| T3-C1-03 | C1 Users list - search, role/active filters, columns | Android | Chrome | Phone | Fail | c1-users-list-android-samsunginternet-phone.png | Break layout |
| T3-C2-01 | C2 Assign Role / edit user | Windows | Edge | Desktop | Pass | c2-assign-role-windows-edge-desktop.png | Edit form and role selector display correctly. |
| T3-C2-02 | C2 Assign Role / edit user | macOS | Firefox | Desktop | Pass | c2-assign-role-macos-firefox-desktop.png | Form controls and validation styling are intact. |
| T3-C2-03 | C2 Assign Role / edit user | Android | Chrome | Phone | Fail | c2-assign-role-android-chrome-phone.png | Break layout |
| T3-C4-01 | C4 Export to Excel - column completeness and download feedback | Windows | Chrome | Desktop | Pass | c4-export-windows-chrome-desktop.png |Export successfully |
| T3-C4-02 | C4 Export to Excel - column completeness and download feedback | macOS | Safari | Desktop | Pass | c4-export-macos-safari-desktop.png | Download feedback and filename behavior verified. |
| T3-C4-03 | C4 Export to Excel - column completeness and download feedback | Windows | Opera | Desktop | Pass | c4-export-android-opera-tablet.png | Export action is visible and response is understandable on tablet. |

## Notes

- The matrix intentionally does not cover every browser/OS/device combination.
- Each required OS appears at least once.
- Each required browser appears at least once across the three screens.
- Each device class appears at least once across the three screens.
- Replace `Pass` and evidence filenames with real results after screenshots are captured.
