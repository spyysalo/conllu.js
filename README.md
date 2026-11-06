conllu.js
=========

CoNLL-U format library for JavaScript (browser & Node.js).

Installation & Usage
--------------------

### Node.js (CommonJS)

```javascript
const ConllU = require('./conllu.js');

const conlluData = `1\tThey\tthey\tPRON\tPRN\tCase=Nom|Num=Plur\t2\tnsubj\t4:nsubj\t_
2\tbuy\tbuy\tVERB\tVBP\tNum=Plur|Per=3|Tense=Pres\t0\troot\t_\t_
3\tand\tand\tCONJ\tCC\t_\t2\tcc\t_\t_
4\tsell\tsell\tVERB\tVBP\tNum=Plur|Per=3|Tense=Pres\t2\tconj\t_\t_
5\tbooks\tbook\tNOUN\tNNS\tNum=Plur\t2\tdobj\t4:dobj\t_
6\t.\t.\tPUNCT\t.\t_\t2\tpunct\t_\t_
`;

const doc = new ConllU.Document();
doc.parse(conlluData);

// Export to brat standoff format
const bratData = doc.toBrat();
console.log(bratData);

// If you want to include empty nodes in brat visualization:
const bratDataWithEmpty = doc.toBrat(null, true);
```

### Browser

Include `conllu.js` in your HTML:

```html
<script src="conllu.js"></script>
<script>
    var doc = new ConllU.Document();
    doc.parse(conlluData);
    var bratData = doc.toBrat();
</script>
```

Testing
-------

To run the automated tests using Node.js:

```bash
node test.js
```

Features & CoNLL-U v2 Support
-----------------------------

- Full support for CoNLL-U v1 and v2 specifications.
- Support for multiword tokens and empty nodes (`ID` formatted as decimals like `5.1`).
- Support for spaces in `FORM` and `LEMMA` (in strict mode with TAB separators, or loose mode with 2+ spaces separating columns).
- Conversion to brat embedded standoff format (`toBrat(logger, includeEmpty)`) with customizable styles and sentence labels.
- Structured comments support: `# sentence-label`, `# visual-style`.
- Validation and automatic repair of common syntax errors.

API Reference
-------------

### `ConllU.Document`

- **`doc.parse(input, [logger], [strict])`**: Parses CoNLL-U text.
  - `input`: String with CoNLL-U data.
  - `logger`: Optional callback `function(message)` to receive error or repair logs.
  - `strict`: Boolean. If `true`, requires strict TAB-separated format. If `false`, allows space-separated loose mode. Defaults to auto-detect.
- **`doc.toBrat([logger], [includeEmpty])`**: Converts parsed sentences into brat embedded standoff format.
  - `includeEmpty`: Boolean (default `false`). Set to `true` to include empty nodes (`ID` like `5.1`) in the brat visualization.
  - Returns an object containing `{ text, entities, relations, attributes, comments, styles, sentlabels, error }`.
- **`doc.sentences`**: Array of `ConllU.Sentence` instances.
- **`doc.error`**: Boolean indicating if any parsing/validation error occurred.

### `ConllU.Sentence`

- **`sentence.id`**: Sentence ID (e.g., `'S1'`).
- **`sentence.elements`**: Array of `ConllU.Element` instances.
- **`sentence.comments`**: Array of comment strings starting with `#`.
- **`sentence.words([includeEmpty])`**: Returns array of word elements (excluding multiword headers, and optionally including empty nodes).
- **`sentence.dependencies([skipHead])`**: Returns array of `[dependentId, headId, deprel]`.

### `ConllU.Element`

Represents a single row in CoNLL-U:
- `element.id`: Word index (`1`), range (`1-2`), or decimal (`5.1`).
- `element.form`: Word form or punctuation symbol.
- `element.lemma`: Lemma or stem.
- `element.upostag`: Universal POS tag.
- `element.xpostag`: Language-specific POS tag.
- `element.feats`: Morphological features.
- `element.head`: Head token index or `0`.
- `element.deprel`: Dependency relation to head.
- `element.deps`: Secondary dependencies (head-deprel pairs).
- `element.misc`: Miscellaneous annotations.
- `element.isWord()`: `true` if integer word ID.
- `element.isMultiword()`: `true` if range ID (e.g., `1-2`).
- `element.isEmptyNode()`: `true` if decimal ID (e.g., `5.1`).

