import {Facets,} from 'facets-js';
import {
  SkippableItems,
  SmartItems,
  traceThing,
} from '../util/_globals';
import {SkippableItem} from '../util/ArraySmarts';
export namespace SelectingTitles{
  export const Frame='Selecting',
    Chooser='Select Content',
    Actions='Actions',
    Live='Live',
    NewButton='New',
    UpButton='Move Up',
    DownButton='Move Down',
    DeleteButton='Delete',
    OpenEditButton='Edit',
    TextEditField='Edit Text',
    SaveEditButton='Save',
    CancelEditButton='Cancel',
    CharsCount='Characters';
}
export interface ItemScroller{
  scrollItems(skip:number)
}
export class ScrollableItems implements ItemScroller{
  onFacetsRetargeted=()=>{
    const itemAt=this.itemAt(this.getShowAt());
    const f=this.facets;
    f.setTargetLive(SelectingTitles.DeleteButton,this.items.length>1);
    f.setTargetLive(SelectingTitles.UpButton,itemAt>0);
    f.setTargetLive(SelectingTitles.DownButton,
      itemAt<this.items.length-1);
    traceThing('^onRetargeted',this.items);
  };
  private readonly smarts:SmartItems;
  private readonly extender:SkippableItems;
  private readonly maxLength;
  private showFrom=0;
  constructor(private readonly items,
              private readonly showLength,
              private readonly facets:Facets,
              private readonly indexingTitle,
              private readonly createNew?:(from)=>any,){
    this.maxLength=showLength*3;
    this.smarts=new SmartItems(items);
    const length=items.length;
    if(!length) throw new Error('At least one item!');
    else this.extender=(items[0] as SkippableItem<any>).newSkipped
      ?new SkippableItems(items):null;
    if(length<showLength){
      if(!this.extender) throw new Error('Items not extensible!');
      else this.extender.skipForward(showLength-length);
    }
    facets.supplement=this
  }
  getScrolledItems():any[]{
    traceThing('^getScrolledItems:',this.showFrom);
    const scrolleds=this.items.slice(this.showFrom,this.showFrom+this.showLength);
    return scrolleds;
  }
  scrollItems(skip:number){
    const showLength=this.showLength,maxLength=this.maxLength,
      thenFrom=this.showFrom,thenStop=thenFrom+showLength;
    const extender=this.extender;
    if(!skip)return;
    else if(skip<1){
      if(thenFrom>0) this.showFrom--;
      else if(extender){
        extender.skipBack(showLength);
        this.showFrom+=showLength-1;
        extender.trimItems(maxLength,false);
      }
    }
    else {
      if(thenStop<this.items.length) this.showFrom++;
      else if(extender){
        extender.skipForward(showLength);
        this.showFrom++;
        const count=extender.trimItems(maxLength,true);
        if(count)this.showFrom-=showLength+count;
      }
    }
    this.facets.notifyTargetUpdated(this.indexingTitle)
  }
  deleteItem(){
    const showThen=this.getShowAt(),itemAt=this.itemAt(showThen);
    const atEnd=this.smarts.removeItem(itemAt);
    if(atEnd)
      this.facets.updateTargetState(this.indexingTitle,showThen-1)
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
  itemAt(showAt):number{
    return showAt+this.showFrom;
  }
  getShowAt():number{
    return this.facets.getTargetState(this.indexingTitle) as number;
  }
  setShowAt(at:number){
    this.facets.updateTargetState(this.indexingTitle,at)
  }
  newActionTargets(){
    const f=this.facets;
    return [f.newTriggerTarget(SelectingTitles.UpButton,{
      targetStateUpdated:()=>this.swapItemDown(),
    }),
      f.newTriggerTarget(SelectingTitles.DownButton,{
        targetStateUpdated:()=>this.swapItemUp(),
      }),
      f.newTriggerTarget(SelectingTitles.DeleteButton,{
        targetStateUpdated:()=>this.deleteItem(),
      }),
      f.newTriggerTarget(SelectingTitles.NewButton,{
        targetStateUpdated:()=>this.addItem(),
      }),
    ]
  }
}

