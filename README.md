# Split Text
Split text is a small JS library that is able to split the contents of HTML tags into lines, words and/or characters.  
## Installation
Download these files and add the file to your HTML page.
`<script type="text/javascript" src="splittext.js"></script>`



## Usage

To split a tag or tags, run `new SplitText("#elementID")`.


The Split Text initialisation function will accept a single or array of any of the following:
 - JS elements
 - jQuery elements
 -  `querySelectorAll` selectors

 `new SplitText("#elementID")` will return a SplitText Object.

The Split text object has properties lines, words and chars which contain arrays of lines, words and chars respectively.

The Split text object also has a method revert() that will undo the changes that were made.

The SplitText function takes a second, optional object parameter.  This can include additional attributes that change the functionality of the program.

Currently, Split Text supports the attributes type, charsClass, linesChars and wordsClass.

Type is a comma separated list list of the type of split to be carried out.  The options are any combination of lines, words and chars.  Note that chars cannot be used by itself at the moment without causing spacing problems.  This should be fixed in a future version.

The three class elements will add a class to each of the split elements.

Two adjacent plus symbols in the class will be replaced by position of that split element.  For example, `new SplitText("#elementID",{linesChars:"line++"})` would produce the line elements
```html
<div class="line1">...</div>
<div class="line2">...</div>
<div class="line3">...</div>
```

Two adjacent asterisks symbols in the charClass will be replaced by the character and the next character.   For example the word `hello` split with the charClass `**` would produce the character elements

```html
<div class="he">h</div>
<div class="el">e</div>
<div class="ll">l</div>
<div class="lo">l</div>
<div>o</div>
```

This makes it very easy to adjust the spacing between letters for advanced typography.  If, for example, you wanted to change the spacing between the letters c and d, you would use the CSS

```css
.cd{
   letter-spacing:-0.1em;
}
```

## Contributing
1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D
## History
###Version 0.1
Will wrap lines, words and/or chars in separate divs and will set the position to any valid CSS position.  If position is set to null, it won't be set and it is up to your css.

#### TODO: 
Need to set positions and sizes for absolute or fixed positioned divs.

## License
MIT License

Copyright (c) 2016 Jonathan Hodgson

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

