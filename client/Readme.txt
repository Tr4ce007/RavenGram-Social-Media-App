In package.json
if in windows to run build
"start": "set NODE_OPTIONS=--openssl-legacy-provider && react-scripts start",
"build": "set NODE_OPTIONS=--openssl-legacy-provider && react-scripts build",

In linux Environment to run build
"start": "export NODE_OPTIONS=--openssl-legacy-provider && react-scripts start",
"build": "export NODE_OPTIONS=--openssl-legacy-provider && react-scripts build",