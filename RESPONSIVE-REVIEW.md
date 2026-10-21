# Responsive review

Tested on the local portfolio in the in-app Chromium browser.

- 54 main-page checks: Home, Projects, Experience, Education, Certifications, Achievements, Resume, Contact, and owner access at 320, 375, 768, 1024, 1366 and 1920 CSS pixels.
- 18 project-detail checks: all 6 projects at 320, 768 and 1366 pixels.
- 10 additional checks: signed-in owner dashboard at 320, 768, 1024, 1366, 1920 and 2560; homepage at 430, 620, 981 and 2560 pixels.
- Every check used the measured browser viewport and looked for visible content outside the page width. No unintended horizontal overflow remained.
- Also checked 844 x 390 landscape menus, mobile navigation to Certifications, and the mobile owner editing dialog.

## Fixes
- Owner media-upload copy and fields stack on narrow screens instead of squeezing into two columns.
- Upload fields no longer stretch to the adjacent text. Narrow-screen search/refresh controls fit the available width.
- Mobile inputs use 16px text and key touch controls have at least 44px height.
- Contact/navigation menus have viewport-aware height limits and scroll on short landscape screens.
- Owner editing dialogs fit the dynamic viewport and scroll internally.

## Limits
Browser viewport testing is not physical-device testing. iOS Safari, Android Chrome and other browser engines were not tested on real hardware.

Changes remain in the local preview for review.
