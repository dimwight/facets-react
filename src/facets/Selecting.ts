import {
  Facets,
} from 'facets-js';
import * as Array from '../util/Array';
import {traceThing}from '../util/export';
import {SimpleTitles} from '../surfaceTest';
export namespace SelectingTitles {
  export let FRAME='Selecting',
    CHOOSER='Select Content',
    ACTIONS='Actions',
    LIVE='Live',
    NEW='New',
    UP='Move Up',
    DOWN='Move Down',
    DELETE='Delete',
    EDIT='Edit Selection',
    CHARS='Characters';
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
    facets.onRetargeted=()=>{
      let contentAt=this.contentAt(this.getShowAt());
      facets.setTargetLive(SelectingTitles.DELETE,this.content.length>1);
      facets.setTargetLive(SelectingTitles.UP,contentAt>0);
      facets.setTargetLive(SelectingTitles.DOWN,
        contentAt<content.length-1);
      traceThing('^onRetargeted',this.content);
    };
    facets.supplement={
      overshot:belowShowZero=>this.onOvershoot(belowShowZero),
    }as ShowAtOvershoot;
  }
  getShowables():T[]{
    let showables=this.content.slice(this.showFrom, this.showFrom+this.showLength);
    traceThing('^showables:',showables);
    return showables;
  }
  onOvershoot(belowShowZero){
    let thenFrom=this.showFrom,thenStop=thenFrom+this.showLength;
    if(belowShowZero&&thenFrom>0)this.showFrom--;
    else if(!belowShowZero&&thenStop<this.content.length)
      this.showFrom++;
    traceThing('^onOvershoot',{
      belowShowZero:belowShowZero,
      thenFrom:thenFrom,
      thenStop:thenStop,
      offset:this.showFrom-thenFrom,
    });
    this.facets.notifyTargetUpdated(SelectingTitles.CHOOSER)
  }
  contentAt(showAt){
    return showAt+this.showFrom;
  }
  getShowAt():number{
    return this.facets.getTargetState(this.indexingTitle) as number;
  }
  setShowAt(at:number){
    this.facets.updateTargetState(this.indexingTitle,at)
  }
  deleteElement(){
    let showThen=this.getShowAt(),contentAt=this.contentAt(showThen);
    let atEnd=Array.removeElement(this.content,contentAt);
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
    let showThen=this.getShowAt(),contentAt=this.contentAt(showThen);
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
    let f=this.facets;
    return[f.newTriggerTarget(SelectingTitles.UP,{
          targetStateUpdated:()=>this.swapElementDown(),
        }),
        f.newTriggerTarget(SelectingTitles.DOWN,{
          targetStateUpdated:()=>this.swapElementUp(),
        }),
        f.newTriggerTarget(SelectingTitles.DELETE,{
          targetStateUpdated:()=>this.deleteElement(),
        }),
        f.newTriggerTarget(SelectingTitles.NEW,{
          targetStateUpdated:()=>this.addElement(),
        }),
        ]
  }
}

