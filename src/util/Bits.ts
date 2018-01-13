export function traceThing(top,thing?){
  if(top.charAt(0)==='^')return;
  if(!thing)console.log(top);
  else console.info(top,
    JSON.stringify(thing, false ? null : (key, value) => {
      if(false)console.log(key);
      if(key==='date')value=new Date(value).valueOf();
      else 'facets,__parent,notifiable_'.split(',').forEach(check=>{
        if(key===check)value=key;
      });
      return value
    }, 1))
}
export function errorTest (msg?){
  let err=new Error(msg);
  console.log(`Created ${err}...`);
  if(false) throw err;
  else console.log(`..but didn't throw it.`);
}

