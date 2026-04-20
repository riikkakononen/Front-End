*** Settings ***
Library     Browser    auto_closing_level=KEEP
Variables         load_env.py

*** Test Cases ***
Login to AlignmentGuide
    New Browser    chromium    headless=No      slowMo=2000 ms
    New Context
    New Page       http://localhost:5173/~riikkono/AlignmentGuide/

    ${Page Title}=    Get Title
    Should Be Equal As Strings    ${Page Title}    Alignment Guide

    ${login}=    Get Element    xpath=(//a[@href='/~riikkono/AlignmentGuide/login/' and text()='Log in'])[1]
    Click with Options    ${login}

    Type Text        css=input[name="email"]           ${EMAIL}
    Type Secret      css=input[name="password"]        $PASSWORD


    Click with Options   "Login"