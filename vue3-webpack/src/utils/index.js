import base from './lib/base.js';

import date from './lib/date.js';
import file from './lib/file.js';
import obj from './lib/obj.js';
import query from './lib/query.js';
import string from './lib/string.js';
import tween from './lib/tween.js';
import ui from './lib/ui.js';
import local from './lib/local.js';

let result = base;

Object.assign (
    result,
    date,
    file,
    obj,
    query,
    string,
    tween,
    ui,
    local,
);

export default result;
