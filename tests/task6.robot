*** Settings ***
Library     Browser     	    auto_closing_level=SUITE
Library     CryptoLibrary     variable_decryption=True      #Kryptatut muuttujat puretaan automaattisesti

*** Variables ***
${Email}       crypt:SB4kWYOeVB6F6NnamgH+5KwqGKXKAqRrAgTURbHkD3nFD8caIdqqskN7NaWlDJ/kjfPHcUf2tdWZM8mtoGjdPId84WEl9A==
${Password}    crypt:/9boAH1fAeA2KgIZYTxmYjKuYiV54LNxBFHl23vQmHTlEbBn1snkEonomlYDSD6sXUd8SjIPNp1QNefRDQ==
*** Test Cases ***
Test Web Form
    New Browser     chromium    headless=No     slowMo=2000 ms
    New Context     viewport={'width': 800, 'height': 600}
    New Page        http://localhost:5173/~riikkono/AlignmentGuide/ 

    ${Page Title}=    Get Title
    Should Be Equal As Strings    ${Page Title}    Alignment Guide

    ${login}=    Get Element    xpath=(//a[@href='/~riikkono/AlignmentGuide/login/' and text()='Log in'])[1]
    Click with Options    ${login}

    # Kirjoita käyttäjätunnus ja salasana
    Type Text    css=input[name="email"]    ${Email}
    Type Secret  css=input[name="password"]    $Password

    # Seuraavaksi olisi kirjautumispainikkeen napsauttaminen
     Click with Options   "Login"
