# README

A visual taxonomy explorer to find classifications of and common ancestries between pretty much any known cellular organism(s) (and viruses etc. too).
Available at https://taxonomy.samunstein.link/

## Data

The data is downloaded from https://www.ncbi.nlm.nih.gov/guide/taxonomy/. Specifically the taxdmp.zip file in the FTP listing. 
Extract the archive into `rawdata/`, and use `extract_data.py` script to create `data.json` used by the application.

## Running/Building

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

## Acknowledgements

Use of d3 is heavily based on https://github.com/bumbeishvili/org-chart, but modified to remove unneeded functionality, and otherwise optimized for the large data mass.
