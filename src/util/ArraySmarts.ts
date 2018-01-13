import {traceThing} from './_globals';
export class SmartItems<T>{
  constructor(private readonly items:T[]){}
  swapItem(at,down) {
    let src=this.items;
    //  Debug?
    traceThing('^swapItem', { index: at, down: down,src:src });

    //  Guard against string!
    const indexNum=Number(at);

    // Define source and output indices
    const lowerSrc = down?indexNum:indexNum+1,
      upperSrc = down?indexNum-1:indexNum;
    const lowerDest = down ? indexNum-1 : indexNum,
      upperDest = down ? indexNum : indexNum+1;

    //  Check for out of bounds
    const names=['index','lowerSrc','upperSrc','lowerDest','upperDest'];
    [indexNum,lowerSrc,upperSrc,lowerDest,upperDest].forEach((n,at)=>{

      // Index out of bounds?
      if(n<0||n>=src.length)throw new Error(`Index out of range: ${names[at]}=${n}`);
    });

    //  Debug?
    traceThing('^swapItem', { lowerSrc: lowerSrc, upperSrc: upperSrc,
      lowerDest: lowerDest, upperDest:upperDest });

    //  Define unaffected regions
    const top = src.slice(0, lowerDest), tail = src.slice(upperDest+1);

    // Assemble output
    const dest = top.concat(src[lowerSrc],src[upperSrc],tail);

    //  Debug?
    traceThing('^swapItem~', false?{top:top,tail:tail}:{dest:dest});

    // Rebuild source
    src.splice(0,src.length,...dest);

    // Final check?
    traceThing('^swapItem~~', {src:src});
  }
  removeItem(at:number){
    let src=this.items;
    let length=src.length,atEnd=at===length-1;
    let top=src.slice(0,at),tail=atEnd?[]:src.slice(at+1);
    src.splice(0,length,...top,...tail);
    traceThing('^removeItem',{
      at:at,
      atEnd:atEnd,
      list:src
    });
    return atEnd;
  }
  addItem(at:number,createNew:(from)=>T){
    let list=this.items;
    let length=list.length,atEnd=at===length-1;
    let top=list.slice(0,at+1),tail=atEnd?[]:list.slice(at+1),
      add=createNew(list[at]);
    if(!atEnd)
      list.splice(0,length,...top,add,...tail);
    else list.push(add);
    traceThing('^targetStateUpdated',{
      at:at,
      list:list
    });
  }
}
export interface ExtensibleItem<T>{
  newBefore():T
  newAfter():T
}
export class ExtensibleItems<T>{
  constructor(private readonly items:T[]){}

}
