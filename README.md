# VaccineNotifier

VaccineNotifier checks the cowin portal periodically to find vaccination slots available in your pin code and for your age. If found, it will send you emails every minute until the slots are available.

Step 1) Enable application access on your gmail with steps given here:
https://support.google.com/accounts/answer/185833?p=InvalidSecondFactor&visit_id=637554658548216477-2576856839&rd=1  
\
Step 2) Enter the details in the file .env, present in the same folder
\
\
Step 3) On your terminal run: npm i && node index vaccineNotifier.js
\
\

# Api hit every 2 minute you can also changes this time by following the below steps

step 1) go to vaccineNotifire.js file at line no.-27.
\
\
step 2) to set the cronJob time you can visit to this url https://crontab.guru/.
