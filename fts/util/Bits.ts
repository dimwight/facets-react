/**
 * Simplifies instrumenting code
 * @param top heading for message 
 * @param thing suitable for JSON serialization
 */
export function traceThing(top:string, thing?:any) {

  // Allow for quick disable
  if(top.charAt(0)==='^')return;

  // Allow for callback eg to find and kill circular references
  const callback=(key:string, value:any) => {
    if(false)console.log(key);
    return '|notifiable_|elements_|'.includes(key)?key:value;
  };
  
  // Construct body
  const tail=!thing?'':JSON.stringify(thing, callback, 1);
  
  // Issue complete message
  console.log(top, tail);
}
