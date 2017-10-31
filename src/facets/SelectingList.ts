import {
  Facets,
} from 'facets-js';
import * as Array from '../util/Array';
import {traceThing}from '../util/export';
export namespace SelectingTitles {
  export let FRAME='Selecting',
    SELECT='Select Content',
    ACTIONS='Actions',
    LIVE='Live',
    NEW='New',
    UP='Move Up',
    DOWN='Move Down',
    DELETE='Delete',
    EDIT='Edit Selection',
    CHARS='Characters';
}
export interface SelectingOvershoot{
  overshot(belowShowZero:boolean)
}
export class SelectingList<T>{
  private showFrom=0;
  private contentIds=0;
  constructor(
    private readonly content:T[],
    private readonly showLength,
    private readonly facets:Facets,
    private readonly indexingTitle,
  ){
    facets.onRetargeted=()=>{
      let at=this.getShowAt();
      facets.setTargetLive(SelectingTitles.DELETE,this.getShowables().length>1);
      facets.setTargetLive(SelectingTitles.UP,at>0);
      facets.setTargetLive(SelectingTitles.DOWN,
        at<content.length-1);
      traceThing('^onRetargeted',this.content);
    };
    facets.supplement={
      overshot:belowShowZero=>this.onOvershoot(belowShowZero),
    }as SelectingOvershoot;
  }
  getShowables():T[]{
    let showables=this.content.slice(this.showFrom, this.showFrom+this.showLength);
    traceThing('showables:',showables);
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
    this.facets.notifyTargetUpdated(SelectingTitles.SELECT)
  }
  contentAt(showThen){
    return showThen+this.showFrom;
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
    Array.addElement(this.content,contentAt,
      src=>({text:'NewContent'+this.contentIds++}));
    this.setShowAt(showThen);
  }
  swapElementUp(){
    let showThen=this.getShowAt(),contentAt=this.contentAt(showThen);
    Array.swapElement(this.content,showThen,true);
    this.setShowAt(showThen-1)
  }
  swapElementDown(){
    let showThen=this.getShowAt(),contentAt=this.contentAt(showThen),
      showNow=showThen+1;
    Array.swapElement(this.content,contentAt,false);
    if(showNow>=this.showLength){
      this.onOvershoot(false);
      showNow--;
    }
    this.setShowAt(showNow)
  }
}

