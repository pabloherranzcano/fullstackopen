sequenceDiagram
    participant browser
    participant server

    Note over browser: El usuario escribe la nota y hace clic en el botón "Save"

    Note right of browser: El JS captura el evento 'submit' y ejecuta e.preventDefault()
    Note right of browser: Se crea la nueva nota y se añade a la lista local: notes.push(note)
    Note right of browser: Se vuelve a renderizar la lista en pantalla inmediatamente: redrawNotes()

    browser->>server: POST https://studies.cs.helsinki.fi/exampleapp/new_note_spa
    activate server
    Note right of browser: Los datos se envían como JSON con Content-type: application/json
    server-->>browser: HTTP status code 201 Created
    deactivate server

    Note right of browser: El navegador permanece en la misma página, sin más solicitudes HTTP