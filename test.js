var ConllU = require('./conllu.js');
var assert = require('assert');

console.log('Running test suite for conllu.js...');

// Test 1: Module export
assert(ConllU.Document, 'Document class should exist');
assert(ConllU.Sentence, 'Sentence class should exist');
assert(ConllU.Element, 'Element class should exist');

// Test 2: Basic strict parsing
var sampleStrict = `1\tThey\tthey\tPRON\tPRN\tCase=Nom|Num=Plur\t2\tnsubj\t4:nsubj\t_
2\tbuy\tbuy\tVERB\tVBP\tNum=Plur|Per=3|Tense=Pres\t0\troot\t_\t_
3\tand\tand\tCONJ\tCC\t_\t2\tcc\t_\t_
4\tsell\tsell\tVERB\tVBP\tNum=Plur|Per=3|Tense=Pres\t2\tconj\t_\t_
5\tbooks\tbook\tNOUN\tNNS\tNum=Plur\t2\tdobj\t4:dobj\t_
6\t.\t.\tPUNCT\t.\t_\t2\tpunct\t_\t_
`;

var docStrict = new ConllU.Document();
docStrict.parse(sampleStrict);
assert.strictEqual(docStrict.error, false, 'Strict document should parse without errors');
assert.strictEqual(docStrict.sentences.length, 1, 'Should parse 1 sentence');
assert.strictEqual(docStrict.sentences[0].elements.length, 6, 'Should have 6 tokens');

var bratData = docStrict.toBrat();
assert.strictEqual(bratData.entities.length, 6, 'Should generate 6 brat entities');
assert(bratData.relations.length > 0, 'Should have relations');

// Test 3: CoNLL-U v2 - space in FORM and LEMMA in strict mode (e.g. numbers with space separator like "1 234")
var v2Strict = `1\t1 234\t1 234\tNUM\tCD\tNumType=Card\t0\troot\t_\t_\n`;
var docV2Strict = new ConllU.Document();
docV2Strict.parse(v2Strict);
assert.strictEqual(docV2Strict.error, false);
assert.strictEqual(docV2Strict.sentences[0].elements[0].form, '1 234');
assert.strictEqual(docV2Strict.sentences[0].elements[0].lemma, '1 234');

// Test 4: CoNLL-U v2 - space in FORM and LEMMA in loose mode with 2+ spaces
var v2Loose = `1  1 234  1 234  NUM  CD  NumType=Card  0  root  _  _\n`;
var docV2Loose = new ConllU.Document();
docV2Loose.parse(v2Loose, null, false);
assert.strictEqual(docV2Loose.error, false);
assert.strictEqual(docV2Loose.sentences[0].elements[0].form, '1 234');
assert.strictEqual(docV2Loose.sentences[0].elements[0].lemma, '1 234');

// Test 5: Fallback single space in loose mode
var looseSingle = `1  word  lemma  NOUN  NN  _  0  root  _  _\n`;
var docLooseSingle = new ConllU.Document();
docLooseSingle.parse(looseSingle, null, false);
assert.strictEqual(docLooseSingle.error, false);
assert.strictEqual(docLooseSingle.sentences[0].elements[0].form, 'word');

// Test 6: Empty nodes and includeEmpty option in toBrat
var emptyNodeData = `# visual-style 6 7 obj color:red
# visual-style 5.1 5 nsubj color:red
# visual-style 2 5.1 conj color:red
# visual-style 5 6 remnant color:blue
# visual-style 2 5 conj color:blue
1\tI\t_\t_\t_\t_\t2\tnsubj\t_\t_
2\tlike\t_\t_\t_\t_\t0\troot\t_\t_
3\ttea\t_\t_\t_\t_\t2\tobj\t_\t_
4\tand\t_\t_\t_\t_\t5\tcc\t_\t_
5\tyou\t_\t_\t_\t_\t2\tconj\t5.1:nsubj\t_
5.1\tE5.1\t_\t_\t_\t_\t_\t_\t2:conj\t_
6\trum\t_\t_\t_\t_\t5\tremnant\t5.1:obj\t_
7\t.\t_\t_\t_\t_\t2\tpunct\t_\t_
`;

var docEmpty = new ConllU.Document();
docEmpty.parse(emptyNodeData);
assert.strictEqual(docEmpty.error, false, 'Empty nodes example should parse without error');

var bratNoEmpty = docEmpty.toBrat(null, false);
assert.strictEqual(bratNoEmpty.entities.length, 7, 'Empty node should not be in entities when includeEmpty=false');

var bratWithEmpty = docEmpty.toBrat(null, true);
assert.strictEqual(bratWithEmpty.entities.length, 8, 'Empty node should be in entities when includeEmpty=true');
assert.strictEqual(bratWithEmpty.entities[5][0], 'S1-T5.1');

console.log('All tests passed successfully!');
