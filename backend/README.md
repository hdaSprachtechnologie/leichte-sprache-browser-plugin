# backend

## install
```
pip install pymongo
pip install tornado
pip install nltk
pip install pyphen
```
or run 
`pip install -r requirements.txt` 
### to update the requirements-file
* prepare with `pip install pipreqs`

```
pipreqs D:\hda-git\leichtesprache\src\backend\lesbarserver
```

## run
* double click start.bat
* or enter `python -m lesbarserver`
* test with
  * http://localhost:8888/ -> returns Einfache Sprache works
  * curl -i -X POST -H 'Content-Type: application/json' -d '["Linguistik"]' 
	http://localhost:8888/easywordlist -> returns {"replacements": [{"org": "Linguistik", 
	"easy":  "Sprach\u00b7wissenschaft - Forschung \u00fcber Sprache"}]}
  <!--- * http://localhost:8888/easyword/anything -> returns {original: "bla", easy: "easy", 
  details	"details"} --->

## generate documentation
* use sphinx -- install with 
```
pip install -U Sphinx
pip install sphinx_copybutton
pip install cloud_theme
```
* initialize (since I did it, it is not needed again), I did the following in the folder leichtesprache\docs\lesbarserver
	* `sphinx-quickstart`
	* sys.path.insert in line 15 of source/conf.py must point to lesbarserver with our sources to document
	* added extensions in source/conf.py in line 35 ff 
	* `sphinx-apidoc --implicit-namespaces -a -M -e -o source/ ../../src/backend/lesbarserver`
	* define theme in source/conf.py in line 59ff, see https://cloud-sptheme.readthedocs.io/en/latest/cloud_theme.html#usage
	
* update html doc:
	* navigate to the leichtesprache\docs\lesbarserver 
	* run `make html`
  
## useful links
* https://github.com/Cloud-Player/api in combination with https://github.com/Cloud-Player/web
* https://github.com/faif/python-patterns

## visual studio code
### settings
* file settings.json in folder C:\Users\<logged on user>\AppData\Roaming\Code\User (windows)
* @see https://code.visualstudio.com/docs/python

```
{
    "workbench.colorTheme": "Visual Studio Light",
	"pyhton.linting.pep8Enabled": true,
	"python.linting.pep8Args": ["--ignore=E501"],
	"python.linting.pydocstyleEnabled": true,
	"python.linting.pydocstyleArgs": ["--ignore=D400", "--ignore=D4"],
	"python.autoComplete.addBrackets": true,
	"python.formatting.provider": "autopep8"
}
```

### debugging
* https://code.visualstudio.com/docs/python/python-tutorial

### extensions
* njpwerner.autodocstring 
* Trailing Spaces
