import {traceThing} from './Bits';
export class SmartArray<T>{
  constructor(protected readonly content:T[]){}
  /** Swaps an array element with one of its neighbours.
   * @param src the array
   * @param index of the element to be swapped
   * @param down the direction of the swap
   */
  swapElement(index,down) {
    let src=this.content;
    /*
       1. Define source indices of elements to be swapped.
       2. Define output indices to swap them to.
       3. Split the source array around the swap indices.
       4. Reassemble with the swapped elements.
       */

    //  Debug?
    traceThing('^swapElement', { index: index, down: down,src:src });

    //  Guard against string!
    const indexNum=Number(index);

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
    traceThing('^swapElement', { lowerSrc: lowerSrc, upperSrc: upperSrc,
      lowerDest: lowerDest, upperDest:upperDest });

    //  Define unaffected regions
    const top = src.slice(0, lowerDest), tail = src.slice(upperDest+1);

    // Assemble output
    const dest = top.concat(src[lowerSrc],src[upperSrc],tail);

    //  Debug?
    traceThing('^swapElement~', false?{top:top,tail:tail}:{dest:dest});

    // Rebuild source
    src.splice(0,src.length,...dest);

    // Final check?
    traceThing('^swapElement~~', {src:src});
  }
  removeElement(at:number){
    let src=this.content;
    let length=src.length,atEnd=at===length-1;
    let top=src.slice(0,at),tail=atEnd?[]:src.slice(at+1);
    src.splice(0,length,...top,...tail);
    traceThing('^removeElement',{
      at:at,
      atEnd:atEnd,
      list:src
    });
    return atEnd;
  }
  addElement(at:number,createNew:(selected)=>any){
    let list=this.content;
    let length=list.length,atEnd=at===length-1;
    let top=list.slice(0,at),tail=atEnd?[]:list.slice(at),
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