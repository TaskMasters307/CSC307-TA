# CSC-307-TA
CSC 307 Team Assignment: Arian Houschmand, Trey Martin, Sameer Nadeem, Duy Nguyen, Austin Voong

Contributing Steps:

  To get started:
  
    1. git clone https://github.com/austinvoong/CSC-307-TA
    2. cd CSC-307-TA
    3. git checkout -b <your branch name> 
    
  To install dependencies:
  
    1. npm install
    2. npm install react react-dom
    3. npm install -g nodemon
    4. npm install express
    5. npm install mongoose
    6. npm install cors
    
  To install prettier: # Prettier is our styler of choice
  
    1. On VSCode, install the Prettier extension
    2. Ensure Prettier is set as default formatter
    3. "format": "prettier --write './**/*.{js,jsx,ts,tsx,css,md,json}' --config ./.prettierrc", add this to package.json
    4. To automatically format code, ctrl + shift + f (Windows) and cmd + shift + p -> Format Document (Mac)
    5. npm install --save-dev prettier, this will ensure all contributors are using the same version of Prettier
    
  Style guide, please follow this when writing your code!
  
    1. React/JSX: https://airbnb.io/javascript/react/
    
  Submitting code:
  
    1. Ensure all code properly works and passes tests
    2. Ensure all code is properly formatted using Prettier and the above style guide
    3. git add <>
    4. git commit -m ""
    5. git push origin <your branch name>
