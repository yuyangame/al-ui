/**
 * @copyright Maichong Software Ltd. 2016 http://maichong.it
 * @date 2016-11-17
 * @author Liang <liang@maichong.it>
 */

'use strict';

const path = require('path');
const fs = require('fs');
const swig = require('swig');
const cssbeautify = require('cssbeautify');
const vars = require('./vars');
const process = require('child_process');

const rootPath = path.dirname(__dirname) + '/';
const templatesPath = rootPath + 'templates/';


let files = fs.readdirSync(templatesPath);

files.forEach((file) => {
  if (!/\.swig$/.test(file)) return;
  let content = fs.readFileSync(templatesPath + file, 'utf8');
  let less = swig.render(content, { locals: vars });
  let fn = rootPath + 'less/' + file.replace('.swig', '.less');
  fs.writeFileSync(fn, cssbeautify(less, {
    indent: '  ',
    autosemicolon: true
  }));
  process.exec('less2sass ' + fn + ' -o ' + (rootPath + file.replace('.swig', '.scss')), function (a,b,c) {
    
    fs.writeFileSync(rootPath + file.replace('.swig', '.scss'), cssbeautify(fs.readFileSync(rootPath + file.replace('.swig', '.scss'), 'utf8'), {
      indent: '  ',
      autosemicolon: true
    }));
  });
});
