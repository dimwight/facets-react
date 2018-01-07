import {
  Facets,
} from 'facets-js';
import {traceThing,SmartArray}from '../util/_globals';
export namespace SelectingTitles {
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
export class SelectingContent<T> extends SmartArray<T>{
  private showFrom=0;
  constructor(content:T[],
    private readonly showLength,
    private readonly facets:Facets,
    private readonly indexingTitle,
    private readonly createNew?:(selected)=>T,
  ){
    super(content);
    facets.supplement={
      overshot:belowShowZero=>this.onOvershoot(belowShowZero),
    }as ShowAtOvershoot;
  }
  getShowables():T[]{
    const showables=this.items.slice(this.showFrom, this.showFrom+this.showLength);
    traceThing('^showables:',showables);
    return showables;
  }
  onOvershoot(belowShowZero){
    const thenFrom=this.showFrom,thenStop=thenFrom+this.showLength;
    if(belowShowZero&&thenFrom>0)this.showFrom--;
    else if(!belowShowZero&&thenStop<this.items.length)
      this.showFrom++;
    traceThing('^onOvershoot',{
      belowShowZero:belowShowZero,
      thenFrom:thenFrom,
      thenStop:thenStop,
      offset:this.showFrom-thenFrom,
    });
    this.facets.notifyTargetUpdated(SelectingTitles.Chooser)
  }
  deleteItem(){
    const showThen=this.getShowAt(),itemAt=this.itemAt(showThen);
    const atEnd=super.removeItem(itemAt);
    if(atEnd)
      this.facets.updateTargetState(this.indexingTitle,showThen-1)
  };
  addItem(){
    let showThen=this.getShowAt(),itemAt=this.itemAt(showThen);
    super.addItem(itemAt+1,this.createNew);
    if(++showThen<this.showLength)this.setShowAt(showThen);
    else this.onOvershoot(false);
  }
  swapItemDown(){
    const showThen=this.getShowAt(),itemAt=this.itemAt(showThen);
    super.swapItem(itemAt,true);
    if(showThen>0)this.setShowAt(showThen-1);
    else this.onOvershoot(true)
  }
  swapItemUp(){
    let showThen=this.getShowAt(),itemAt=this.itemAt(showThen),
      showNow=showThen+1;
    super.swapItem(itemAt,false);
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
    return[f.newTriggerTarget(SelectingTitles.UpButton,{
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
  onFacetsRetargeted=()=>{
    const itemAt=this.itemAt(this.getShowAt());
    const f=this.facets;
    f.setTargetLive(SelectingTitles.DeleteButton,this.items.length>1);
    f.setTargetLive(SelectingTitles.UpButton,itemAt>0);
    f.setTargetLive(SelectingTitles.DownButton,
      itemAt<this.items.length-1);
    traceThing('^onRetargeted',this.items);
  };
}

