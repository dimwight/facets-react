import {traceThing} from './_globals';
export class SmartList{
  constructor(private readonly items:any[]){}
  swapItem(at:number,down:boolean){
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
  addItem(at:number,createNew:(from:any)=>any){
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
export class SkippableList{
  constructor(
    private readonly baseLength:number,
    private readonly items:SkippableItem<any>[])
  {}
  skipBack(by:number,thenFrom:number){
    const items=this.items;
    const maxLength=this.baseLength*3, skip=Math.max(this.baseLength,by);
    if(skip>maxLength) return this.bigSkip(-skip,thenFrom);
    else for (let add=skip;add>0;add--)
      items.unshift(items[0].newSkipped(-1));
    const adjust=skip+this.trimShift(false,maxLength);
    traceThing('^skipBack',true?this.traceValue(items)
      :{'skip':skip,'adjust':adjust});
    return thenFrom-by+adjust
  }
  skipForward(by:number,thenFrom:number){
    const items=this.items;
    const maxLength=this.baseLength*3,skip=Math.max(this.baseLength,by);
    if(skip>maxLength) return this.bigSkip(skip,thenFrom);
    else for (let add=skip;add>0;add--)
      items.push(items[items.length-1].newSkipped(1));
    const adjust=this.trimShift(true,maxLength);
    traceThing('^skipForward',true?this.traceValue(items)
      :{'skip':skip,'adjust':adjust});
    return thenFrom+by+adjust
  }
  private bigSkip(skip:number,thenFrom:number){
    const items=this.items;
    const first=items[thenFrom];
    items.splice(0);
    items.push(first.newSkipped(skip));
    for(let add=this.baseLength; add>0; add--)
      items.push(items[items.length-1].newSkipped(1));
    traceThing('^bigSkip',true?this.traceValue(items)
      :{'skip':skip});
    return 0;
  }
  private trimShift(before:boolean,maxLength:number):number{
    const items=this.items;
    let trim=items.length-maxLength,count=trim;
    if(false||count<1) return 0;
    if(before) while(count-->0) items.shift();
    else while(count-->0) items.pop();
    const shift=before?-trim:0;
    traceThing('^trimShift',true?this.traceValue(items)
      :{'before':before,'trim':trim,'shift':shift});
    return shift;
  }
  private traceValue(items:SkippableItem<any>[]){
    return [items.length,(items[0]as any).date.valueOf()];
  }
}
