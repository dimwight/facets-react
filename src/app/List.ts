import {Facets} from 'facets-js';
import {
  SkippableList,
  SmartList,
  traceThing,
} from '../util/_globals';
import {
  SelectingTitles,
  textContents,
} from './_globals';
export interface ItemScroller{
  scrollItems(skip:number):void
}
export class ScrollableList implements ItemScroller{
  private readonly smarts:SmartList;
  private readonly skipper:SkippableList|null;
  private readonly maxLength:number;
  private showFrom=0;
  constructor(private readonly items:any[],
              private readonly showLength:number,
              private readonly facets:Facets,
              private readonly indexingTitle:string,
              private readonly createNew?:(from:any)=>any,){
    this.smarts=new SmartList(items);
    const length=items.length;
    if(!length) throw new Error('At least one item!');
    else this.skipper=items[0].newSkipped?
      new SkippableList(showLength,items): null;
    if(length<showLength){
      if(!this.skipper) throw new Error('Items not extensible!');
      else this.skipper.skipForward(showLength-length,0);
    }
    facets.supplement=this
  }
  getScrolledItems():any[]{
    traceThing('^getScrolledItems:',[this.showFrom]);
    return this.items.slice(this.showFrom,this.showFrom+this.showLength);
  }
  scrollItems(by:number){
    const showLength=this.showLength,showFrom=this.showFrom,
      thenStop=showFrom+showLength;
    const skipper=this.skipper;
    if(!by) return;
    else if(by<0){
      if(showFrom+by>=0) this.showFrom+=by;
      else if(skipper)
        this.showFrom=skipper.skipBack(by*-1,showFrom);
    }
    else{
      traceThing('^scrollItems',{'by':by,'thenStop':thenStop});
      if(thenStop+by<=this.items.length) this.showFrom+=by;
      else if(skipper)
        this.showFrom=skipper.skipForward(by,showFrom);
    }
    this.facets.updateTarget(this.indexingTitle)
  }
  deleteItem(){
    const showThen=this.getShowAt(),itemAt=this.itemAt(showThen);
    const atEnd=this.smarts.removeItem(itemAt);
    if(atEnd)
      this.facets.updateTarget(this.indexingTitle,showThen-1)
  };
  addItem(){
    let showThen=this.getShowAt(),itemAt=this.itemAt(showThen);
    if(!this.createNew) throw new Error('Cannot create new');
    this.smarts.addItem(itemAt,this.createNew);
    if(++showThen<this.showLength) this.setShowAt(showThen);
    else this.scrollItems(1);
  }
  swapItemDown(){
    const showThen=this.getShowAt(),itemAt=this.itemAt(showThen);
    this.smarts.swapItem(itemAt,true);
    if(showThen>0) this.setShowAt(showThen-1);
    else this.scrollItems(-1)
  }
  swapItemUp(){
    let showThen=this.getShowAt(),itemAt=this.itemAt(showThen),
      showNow=showThen+1;
    this.smarts.swapItem(itemAt,false);
    if(showNow>=this.showLength){
      this.scrollItems(1);
      showNow--;
    }
    this.setShowAt(showNow)
  }
  itemAt(showAt:number):number{
    return showAt+this.showFrom;
  }
  getShowAt():number{
    const at=this.facets.getTargetState(this.indexingTitle) as number;
    traceThing('^getShowAt',{'at':at});
    return at;
  }
  setShowAt(at:number){
    traceThing('^setShowAt',{'at':at});
    this.facets.updateTarget(this.indexingTitle,at)
  }
}
export function newListActionTargets(f:Facets,list:ScrollableList){
  return [
    f.newTriggerTarget(SelectingTitles.UpButton,{
      targetStateUpdated:()=>list.swapItemDown(),
    }),
    f.newTriggerTarget(SelectingTitles.DownButton,{
      targetStateUpdated:()=>list.swapItemUp(),
    }),
    f.newTriggerTarget(SelectingTitles.DeleteButton,{
      targetStateUpdated:()=>list.deleteItem(),
    }),
    f.newTriggerTarget(SelectingTitles.NewButton,{
      targetStateUpdated:()=>list.addItem(),
    }),
  ]
}
export function listFacetsRetargeted(f:Facets){
  let items:ScrollableList=f.supplement as ScrollableList;
  traceThing('^listFacetsRetargeted');
  const itemAt=items.itemAt(items.getShowAt());
  f.setTargetLive(SelectingTitles.DeleteButton,textContents.length>1);
  f.setTargetLive(SelectingTitles.UpButton,itemAt>0);
  f.setTargetLive(SelectingTitles.DownButton,
    itemAt<textContents.length-1);
}

