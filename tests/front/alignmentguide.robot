*** Settings ***
Library     Browser    auto_closing_level=KEEP
Resource    ag_keywords.robot  

*** Test Cases ***
Login to AlignmentGuide
    New Browser    chromium    headless=No  
    New Page       http://localhost:5173/~riikkono/AlignmentGuide/

    ${Page Title}=    Get Title
    Should Be Equal As Strings    ${Page Title}    Alignment Guide

    ${login}=    Get Element    xpath=(//a[@href='/~riikkono/AlignmentGuide/login/' and text()='Log in'])[1]
    Click with Options    ${login}    delay=3 s

    # Kirjoita käyttäjätunnus ja salasana
    Type Text    id=email    ${Email}     # Huom: ${Email} on muuttuja tiedostosta Keywords.robot
    Type Secret  id=password    $Password       # Huom: $Password on muuttuja tiedostosta Keywords.robot
    
    # Seuraavaksi olisi kirjautumispainikkeen napsauttaminen
     Click with Options   "Login"   delay= 5 s 