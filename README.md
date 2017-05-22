# CSPM: A package manager for Csound

This project is a prototype package management system for the Csound programming language. It is an attempt to enable easy re-use of CSD and UDO files using a centralised repository (living on Github).

Both UDOs and CSD files are accessible by creating an appropriate package for the component, creating a repository and release on Github and by adding the entries to the cspm-registry.

## Installation

CSPM is available from the npm registry and can be installed globally with the following command.
``` javascript
npm install -g cspm
```

## Commands

### Initialisation
A UDO package may be initialised either inside of an empty directory or a directory containing a .udo file. This is done using the the following command.

``` javascript
cspm init udo
```

This will initialise a setup guide to create a UDO cpm.json file. If the UDO already exists the setup script will try to ascertain information about the UDO such as name and the various inputs/outputs. If not, these can be manually specified using the command prompt.

For a UDO file the init command creates a csp.json file containing the name, version, author, email and description information. Further, the various inputs and outputs for the UDO are also enumerated. For each input/output the name, type, rate, description, maximum and minimum values are also recorded.

### Build
#### ReadMe
If a csp.json file exists inside of a package a README.md file may be generated automatically from the data by invoking:

``` javascript

cspm build readme

```
