import * as fs from 'fs-extra';
import { log } from 'util';

const _winBreak = /\r\n/, _params = /.*(\([^)]+\)).*/;
const unmatchables=[
'interface Target{}',
'interface Times {',
'interface Facets {',
'type SimpleState=string|boolean|number',
'type FacetUpdater=(state: SimpleState) => void',
'supplement: any;',
'function newInstance(trace: boolean): Facets;',
'buildLayout(): void;',
];
const src = 'index.d.ts', dest = 'index_.d.ts', jSweet = 'Facets.d.ts';
let unmatched = [];
function main() {
  let content = fs.readFileSync(src, 'utf8').replace(_winBreak, '\n');
  const sweets: string[] = fs.readFileSync(jSweet, 'utf8').split(_winBreak)
    .map(sweet => {
    if (!sweet.match(/.*[:{].*/)
      || sweet.match(/.*\*|__|\$.*/)
      || sweet.includes('import')
      || sweet.includes('constructor')
      || sweet.includes('namespace')
    ) sweet = '';
    return sweet.trim()
      .replace(/:\s*\(/,' (')
      .replace(/=>/,':')
      .replace('Facets.', '');
  });
  const signatures = content.match(/\/\*\*[^/]+\/\s*\w[^\n]+/g)
    .map(withComment => withComment.trim()
      .replace(/\/\*\*[^/]+\/\s*/, '')
      .replace(/export\s*(.*)/, '$1')
    );
  signatures.forEach(checkSignature);
  fs.writeFileSync(dest, content);
  console.log('signatures=%s, unmatched=', signatures.length, unmatched);
  function checkSignature(sig: string) {
    if(unmatchables.includes(sig))return;
    let marker;
    if (sweets.includes(ts2sweety(sig))) marker = '=';
    else {
      const name = sig.replace(/((\w+\s*)+).*/, '$1').trim();
      sweets.map(check => {
        if (check.replace(/(\w+).*/,'$1')===name) return check;
      }).forEach(nameMatch => {      
        if (nameMatch && (!marker||marker.startsWith('?'))){
          const sweety = ts2sweety(sig,true);
          if(sweety===nameMatch){
            marker = '=';
            if(unmatched.includes(sig)){
              if(unmatched.length===1)unmatched=[];
              else console.log(unmatched);
            }
          }
          else {
            marker ='?' + nameMatch + '\n';
            if(!unmatched.includes(sig))unmatched.push(sig);
          }
        }
      });
      if (!marker) {
        marker = '?' + (true ? '' : name);
        if(!unmatched.includes(sig))unmatched.push(sig);
        if (false) console.log(name);
      }
    }
    if (!marker.startsWith('='))
      content = content.replace(sig, sig + '\n' + marker.trim());
  }
}
function ts2sweety(ts: string,params?) {
  let sweety = ts
    .replace('coupler:', 'c:')
    .replace(/\bTarget\b/g, 'STarget')
    .replace(/\bpolicy\b/, 'p')
    .replace(': () => void', '(): void')
    .replace(': STarget|STarget[]', ': any')
    .replace(': FacetUpdater', ': any')
    .replace(': SimpleState', ': any');
    if (params&&ts.match(_params)) sweety = javaParams(sweety);
    if (false && ts !== sweety) console.log(sweety+'\n'+ts);
  return sweety;
}
function javaParams(java: string) {
  const _param = /\b\w+:/g, params = java.replace(_params, '$1');
  let params_ = params;
  let pAt = 1;
  params_.match(_param).forEach(match => {
    const match_ = match.replace(_param, 'p' + pAt++ + ':');
    params_=params_.replace(match, match_);
  });
  const java_=java.replace(params,params_);
  if(false)console.log(java+'\n',java_);
  return java_;
}
main();