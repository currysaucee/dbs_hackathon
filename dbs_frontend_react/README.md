# React Admin Template

This project is based on the [CoreUI Free React Admin Template](https://github.com/coreui/coreui-free-react-admin-template). All credits go to the original authors for providing the base template.

## Installation and Setup

### Steps to Install

1. Clone the repository:
```bash
git clone https://github.com/currysaucee/dbs_hackathon.git
cd dbs_hackathon/dbs_frontend_react
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```
npm start
```

4. Navigate to http://localhost:3000 in your browser.

## Folder Structure
The folder structure is organized to separate template code and custom application code for clarity:

- Template Examples: Found in `/views/template_examples`. These are prebuilt components and layouts from the original CoreUI template.
- Main Application Pages: Found in `/views/pages`. Most custom pages and core application functionality reside here.

## Adding Pages or Routes
If you're adding new pages or routes, remember to:

- Update the `Routes.js` file to define the new route.
- Add the route configuration in `App.js` to ensure it works within the app.
- Failing to update both files will result in the page or route not working properly.
- Can `Ctrl + Shift + F` for 'ADD HERE', some of the useful places to edit should pop up. 

## Server and API Endpoint Configuration
All server and endpoint configurations are managed in the `config.js` file, update `config.js` for ease of management and consistency across the project.