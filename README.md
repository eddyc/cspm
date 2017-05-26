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
A UDO package may be initialised either inside of an empty directory or a directory containing a .udo or .csd file. This is done using the the following commands.

``` javascript
cspm init udo
```
or
``` javascript
cspm init csd
```

This will initialise a setup guide to create a UDO or CSD cpm.json file. If the cpm.json already exists the setup script will try to ascertain information about the module such as name and the various inputs/outputs/macros. If not, these can be manually specified using the command prompt.

For both UDOs and CSDs the init command creates a csp.json file containing the name, version, author, email and description information. For UDOs the various inputs and outputs are also enumerated. For each input/output the name, type, rate, description, maximum and minimum values are also recorded. For CSDs the macros within the file are enumerated and a description of each macro may also be provided.

### Update

A list of available packages must be downloaded from the CSPM registry using the update command before packages can be downloaded. This can be done using the following command:

``` javascript
cspm update
```

### Build
+ #### ReadMe
 If a csp.json file exists inside of a package a README.md file may be generated automatically from the data by invoking:

 ``` javascript

 cspm build readme

 ```
 
No other build commands are implemented at this time.

### Install

Packages may be installed globally using the following command:
``` javascript
cspm install -g MyGreatPackage
```
Packages are installed to the directory specified as Csound's INCDIR environmental variable, this variable must be specified or the installation of packages will fail. If a package to be install contains dependencies, these dependencies will also be installed.

Installing packages locally (e.g in arbitrary folders) is currently unimplemented.
