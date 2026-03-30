# Conceptual Report: SecureNote Application

## 1. JS Engine vs. Runtime
[cite_start]In this application, JavaScript is executed in two different environments[cite: 44]:
* **Frontend (Browser Runtime):** The JavaScript code (`app.js`) runs in the user's web browser. [cite_start]The browser provides the Runtime Environment (including Web APIs like the DOM and Fetch API) and uses a JavaScript Engine (such as V8 in Chrome) to parse and execute the code[cite: 45].
* [cite_start]**Backend (Node.js Runtime):** The server code (`server.js`) runs on the Node.js Runtime Environment[cite: 21]. [cite_start]Node.js also uses the V8 engine to execute JavaScript[cite: 45], but instead of Web APIs, it provides server-side APIs (like the HTTP module and file system access) to handle network requests and responses.

## 2. DOM (Document Object Model)
[cite_start]Since this project uses Vanilla JavaScript [cite: 33][cite_start], the frontend updates the screen through direct DOM tree manipulation[cite: 46]. 
When a user adds or deletes a note, the JavaScript functions (e.g., `renderNotes()`) interact with the DOM by using methods like `document.getElementById()` to select elements. [cite_start]It then dynamically updates the HTML content (using `innerHTML` or appending new elements) to reflect the current state of the `notes` array without needing to reload the entire web page[cite: 37].

## 3. HTTP/HTTPS
* [cite_start]**Request/Response Cycle:** When a user clicks "Submit" to add a note, the frontend Fetch API initiates an HTTP POST request to the backend[cite: 28, 39, 48]. [cite_start]The backend validates the request, creates the note, and sends back an HTTP response with a status code `201 Created`[cite: 30]. The frontend receives this response and triggers the DOM update.
* [cite_start]**Headers:** During this POST request, we send the `Content-Type: application/json` header (to indicate JSON data) and the `Authorization` header containing our SECRET_TOKEN[cite: 28, 48].
* [cite_start]**Importance of HTTPS:** Even though HTTP is used locally, HTTPS is crucial for production[cite: 49]. HTTPS encrypts the data transmitted between the client and the server. Without it, sensitive information like the `Authorization` header (our secret token) and the content of the notes would be sent as plain text, making them vulnerable to interception (Man-in-the-Middle attacks).

## 4. Environment Variables
* [cite_start]**Why store SECRET_TOKEN in the backend `.env`?** The `.env` file is kept securely on the server and is excluded from version control (via `.gitignore`)[cite: 25]. [cite_start]This ensures that sensitive configuration data is never exposed to the public[cite: 17].
* [cite_start]**What if we put it in the frontend?** If we hardcode the `SECRET_TOKEN` in the frontend code, anyone can open the browser's Developer Tools, inspect the source code, and steal the token[cite: 50, 51]. [cite_start]Attackers could then use this token to bypass our application UI and send direct, unauthorized API requests to our backend to create, read, or delete data[cite: 28, 29].