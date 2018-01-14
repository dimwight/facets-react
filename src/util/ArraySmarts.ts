import {traceThing} from './_globals';
export class SmartItems{
  constructor(private readonly items:any[]){}
  swapItem(at,down){
    const src=this.items;
    //  Debug?
    traceThing('^swapItem',{index:at,down:down,src:src});

    //  Guard against string!
    const indexNum=Number(at);

    // Define source and output indices
    const lowerSrc=down?indexNum:indexNum+1,
      upperSrc=down?indexNum-1:indexNum;
    const lowerDest=down?indexNum-1:indexNum,
      upperDest=down?indexNum:indexNum+1;

    //  Check for out of bounds
    const names=['index','lowerSrc','upperSrc','lowerDest','upperDest'];
    [indexNum,lowerSrc,upperSrc,lowerDest,upperDest].forEach((n,at)=>{

      // Index out of bounds?
      if(n<0||n>=src.length) throw new Error(`Index out of range: ${names[at]}=${n}`);
    });

    //  Debug?
    traceThing('^swapItem',{
      lowerSrc:lowerSrc,upperSrc:upperSrc,
      lowerDest:lowerDest,upperDest:upperDest,
    });

    //  Define unaffected regions
    const top=src.slice(0,lowerDest),tail=src.slice(upperDest+1);

    // Assemble output
    const dest=top.concat(src[lowerSrc],src[upperSrc],tail);

    //  Debug?
    traceThing('^swapItem~',false?{top:top,tail:tail}:{dest:dest});

    // Rebuild source
    src.splice(0,src.length,...dest);

    // Final check?
    traceThing('^swapItem~~',{src:src});
  }
  removeItem(at:number){
    const src=this.items;
    const length=src.length,atEnd=at===length-1;
    const top=src.slice(0,at),tail=atEnd?[]:src.slice(at+1);
    src.splice(0,length,...top,...tail);
    traceThing('^removeItem',{
      at:at,
      atEnd:atEnd,
      list:src,
    });
    return atEnd;
  }
  addItem(at:number,createNew:(from)=>any){
    const list=this.items;
    const length=list.length,atEnd=at===length-1;
    const top=list.slice(0,at+1),tail=atEnd?[]:list.slice(at+1),
      add=createNew(list[at]);
    if(!atEnd)
      list.splice(0,length,...top,add,...tail);
    else list.push(add);
    traceThing('^targetStateUpdated',{
      at:at,
      list:list,
    });
  }
}
export interface SkippableItem<T>{
  newSkipped(skip:number):SkippableItem<T>
}
export class SkippableItems{
  private readonly items:SkippableItem<any>[];
  constructor(items:any[]){
    this.items=items;
  }
  skipBack(count:number){
    const items=this.items;
    while(count-->0) items.unshift(items[0].newSkipped(-1));
    traceThing('skipBack',items.length)
  }
  skipForward(count:number){
    const items=this.items;
    while(count-->0) items.push(items[items.length-1].newSkipped(1));
    traceThing('skipForward',items.length)
  }
  trimItems(max:number,before:boolean):number{
    const items=this.items;
    let trim=items.length-max;
    if(trim<1)return 0;
    if(before)while(trim-->0)items.shift();
    else while(trim-->0)items.pop();
    traceThing('trimItems',items.length);
    return trim
  }
}
