sequenceDiagram
    participant browser
    participant server
    
    browser-&gt;&gt;server: GET https://studies.cs.helsinki.fi/exampleapp/notes
    activate server
    server--&gt;&gt;browser: HTML document
    deactivate server
    ... (resto del código)
