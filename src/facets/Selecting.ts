import {
  Facets,
} from 'facets-js';
import * as Array from '../util/Array';
import {traceThing}from '../util/_globals';
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
export class ShowableList<T>{
  private showFrom=0;
  private contentIds=0;
  constructor(
    private readonly content:T[],
    private readonly showLength,
    private readonly facets:Facets,
    private readonly indexingTitle,
  ){
    facets.supplement={
      overshot:belowShowZero=>this.onOvershoot(belowShowZero),
    }as ShowAtOvershoot;
  }
  onFacetsRetargeted=()=>{
    const contentAt=this.contentAt(this.getShowAt());
    const f=this.facets;
    f.setTargetLive(SelectingTitles.DeleteButton,this.content.length>1);
    f.setTargetLive(SelectingTitles.UpButton,contentAt>0);
    f.setTargetLive(SelectingTitles.DownButton,
      contentAt<this.content.length-1);
    traceThing('^onRetargeted',this.content);
  };
  getShowables():T[]{
    const showables=this.content.slice(this.showFrom, this.showFrom+this.showLength);
    traceThing('^showables:',showables);
    return showables;
  }
  onOvershoot(belowShowZero){
    const thenFrom=this.showFrom,thenStop=thenFrom+this.showLength;
    if(belowShowZero&&thenFrom>0)this.showFrom--;
    else if(!belowShowZero&&thenStop<this.content.length)
      this.showFrom++;
    traceThing('^onOvershoot',{
      belowShowZero:belowShowZero,
      thenFrom:thenFrom,
      thenStop:thenStop,
      offset:this.showFrom-thenFrom,
    });
    this.facets.notifyTargetUpdated(SelectingTitles.Chooser)
  }
  contentAt(showAt):number{
    return showAt+this.showFrom;
  }
  getShowAt():number{
    return this.facets.getTargetState(this.indexingTitle) as number;
  }
  setShowAt(at:number){
    this.facets.updateTargetState(this.indexingTitle,at)
  }
  deleteElement(){
    const showThen=this.getShowAt(),contentAt=this.contentAt(showThen);
    const atEnd=Array.removeElement(this.content,contentAt);
    if(atEnd)
      this.facets.updateTargetState(this.indexingTitle,showThen-1)
  };
  addElement(){
    let showThen=this.getShowAt(),contentAt=this.contentAt(showThen);
    Array.addElement(this.content,contentAt+1,
      selected=>({text:'NewContent'+this.contentIds++}));
    if(++showThen<this.showLength)this.setShowAt(showThen);
    else this.onOvershoot(false);
  }
  swapElementDown(){
    const showThen=this.getShowAt(),contentAt=this.contentAt(showThen);
    Array.swapElement(this.content,contentAt,true);
    if(showThen>0)this.setShowAt(showThen-1);
    else this.onOvershoot(true)
  }
  swapElementUp(){
    let showThen=this.getShowAt(),contentAt=this.contentAt(showThen),
      showNow=showThen+1;
    Array.swapElement(this.content,contentAt,false);
    if(showNow>=this.showLength){
      this.onOvershoot(false);
      showNow--;
    }
    this.setShowAt(showNow)
  }
  newActionTargets(){
    const f=this.facets;
    return[f.newTriggerTarget(SelectingTitles.UpButton,{
          targetStateUpdated:()=>this.swapElementDown(),
        }),
        f.newTriggerTarget(SelectingTitles.DownButton,{
          targetStateUpdated:()=>this.swapElementUp(),
        }),
        f.newTriggerTarget(SelectingTitles.DeleteButton,{
          targetStateUpdated:()=>this.deleteElement(),
        }),
        f.newTriggerTarget(SelectingTitles.NewButton,{
          targetStateUpdated:()=>this.addElement(),
        }),
        ]
  }
}

