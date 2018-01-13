import {Facets,} from 'facets-js';
import {
  ExtensibleItems,
  SmartItems,
  traceThing,
} from '../util/_globals';
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
export interface ShowAtOvershoot{
  overshot(belowShowZero:boolean)
}
export class SelectingContent{
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
  private readonly extender:ExtensibleItems;
  private showFrom=0;
  constructor(private readonly items,
              private readonly showLength,
              private readonly facets:Facets,
              private readonly indexingTitle,
              private readonly createNew?:(from)=>any,){
    facets.supplement={
      overshot:belowShowZero=>this.onOvershoot_(belowShowZero),
    }as ShowAtOvershoot;
    this.smarts=new SmartItems(items);
    const length=items.length;
    if(!length) throw new Error('At least one item!');
    else this.extender=items[0].newAfter?new ExtensibleItems(items):null;
    if(length<showLength){
      if(!this.extender) throw new Error('Items not extensible!');
      else this.extender.append(showLength-length+2);
    }
  }
  getShowables():any[]{
    const showables=this.items.slice(this.showFrom,this.showFrom+this.showLength);
    traceThing('^showables:',showables);
    return showables;
  }
  onOvershoot_(belowShowZero){
    const thenFrom=this.showFrom,thenStop=thenFrom+this.showLength;
    if(belowShowZero){
      if(thenFrom>0) this.showFrom--;
    }
    else {
      if(thenStop<this.items.length)this.showFrom++;
    }
    traceThing('^onOvershoot',{
      belowShowZero:belowShowZero,
      thenFrom:thenFrom,
      thenStop:thenStop,
      offset:this.showFrom-thenFrom,
    });
    this.facets.notifyTargetUpdated(this.indexingTitle)
  }
  onOvershoot(belowShowZero){
    const thenFrom=this.showFrom,thenStop=thenFrom+this.showLength;
    if(belowShowZero){
      if(thenFrom>0) this.showFrom--;
      else{
        if(this.extender){
          const prepend=this.showLength;
          this.extender.prepend(prepend);
          this.showFrom+=prepend-1
        }
        if(thenStop<this.items.length)this.showFrom++;
      }
    }
    else if(!belowShowZero){
      if(thenStop<this.items.length) this.showFrom++;
    }
    traceThing('onOvershoot',{
      belowShowZero:belowShowZero,
      thenFrom:thenFrom,
      thenStop:thenStop,
      offset:this.showFrom-thenFrom,
    });
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
    else this.onOvershoot(false);
  }
  swapItemDown(){
    const showThen=this.getShowAt(),itemAt=this.itemAt(showThen);
    this.smarts.swapItem(itemAt,true);
    if(showThen>0) this.setShowAt(showThen-1);
    else this.onOvershoot(true)
  }
  swapItemUp(){
    let showThen=this.getShowAt(),itemAt=this.itemAt(showThen),
      showNow=showThen+1;
    this.smarts.swapItem(itemAt,false);
    if(showNow>=this.showLength){
      this.onOvershoot(false);
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

