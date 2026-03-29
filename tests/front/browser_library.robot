*** Settings ***
Library    Browser

*** Test Cases ***
Test Web Form Fields
    New Browser    chromium    headless=No    slowMo=2000 ms
    New Page    https://www.selenium.dev/selenium/web/web-form.html

    Wait For Elements State    text=Submit    visible

    # Dropdown (select)
    Wait For Elements State    css=select[name="my-select"]    visible
    Select Options By   css=select[name="my-select"]     value    2
    
    # Datalist
    Type Text   css=input[name="my-datalist"]    New York
    
    # File Input
    Wait For Elements State     css=input[type="file"]      visible
    Upload File By Selector     css=input[type="file"]      C:/Users/Omistaja/downloads/kosinilause.pdf
    

    # Checkbox
    Uncheck Checkbox        css=#my-check-1
    Check Checkbox      css=#my-check-2
    
    # Radio button
    Click   css=#my-radio-2

    # Submit
    Click       text=Submit

    # Verify
    Wait For Elements State     css=#message      visible
    ${msg}=     Get Text    css=#message
    Should Be Equal As Strings     ${msg}      Received!