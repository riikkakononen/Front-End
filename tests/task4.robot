*** Settings ***
Library     Browser    auto_closing_level=KEEP
Resource    ag_keywords.robot  

*** Test Cases ***
Login to AlignmentGuide
    New Browser    chromium    headless=No      slowMo=2000 ms
    New Context
    New Page       http://localhost:5173/~riikkono/AlignmentGuide/

    ${Page Title}=    Get Title
    Should Be Equal As Strings    ${Page Title}    Alignment Guide

    ${login}=    Get Element    xpath=(//a[@href='/~riikkono/AlignmentGuide/login/' and text()='Log in'])[1]
    Click with Options    ${login}

    # Kirjoita käyttäjätunnus ja salasana
    Type Text    css=input[name="email"]    ${Email}     # Huom: ${Email} on muuttuja tiedostosta ag_keywords.robot
    Type Secret  css=input[name="password"]    $Password       # Huom: $Password on muuttuja tiedostosta ag_keywords.robot
    
    # Seuraavaksi olisi kirjautumispainikkeen napsauttaminen
     Click with Options   "Login"

    # Etsitään Mental Health
    Hover       css=a[href="/~riikkono/AlignmentGuide/health/"]
    Wait For Elements State     css=a[href*="mentalhealth"]      visible

    # Siirrytään Mental Health -sivulle
    Click       css=a[href*="mentalhealth"]

    # Valitaan mood
    Click       css=button[data-mood="happy"]
    Click       css=button[data-mood="calm"]

    # Kirjoitetaan notes
    Type Text       id=notes        Feeling rested

    # Tallennetaan entry
    Click       id=entry-submit-btn



