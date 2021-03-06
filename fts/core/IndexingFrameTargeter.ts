import {
  Indexing,
  TargetCore,
  Targeter,
  Targety,
  IndexingFrame,
} from './_globals';
import {TargeterCore} from './_locals';
export class IndexingFrameTargeter extends TargeterCore{
  titleTargeters=new Map<string,Targeter>();
  indexing:Targeter;
  indexed:Targeter;
  indexingTarget:Indexing;
  indexedTarget:Targety;
  indexedTitle:string;
  retarget(Targety:Targety){
    super.retarget(Targety);
    this.updateToTarget();
    if(!this.indexing){
      this.indexing=this.indexingTarget.newTargeter();
      this.indexing.setNotifiable(this)
    }
    if(this.titleTargeters.size===0){
      let atThen=this.indexingTarget.index();
      for(let at=0; at<this.indexingTarget.indexables().length; at++){
        this.indexingTarget.setIndex(at);
        this.updateToTarget();
        this.indexed=(this.indexedTarget as TargetCore).newTargeter();
        this.indexed.setNotifiable(this);
        this.indexed.retarget(this.indexedTarget);
        this.titleTargeters.set(this.indexedTitle,this.indexed)
      }
      this.indexingTarget.setIndex(atThen);
      this.updateToTarget()
    }
    this.indexing.retarget(this.indexingTarget);
    this.indexed=this.titleTargeters.get(this.indexedTitle)as Targeter;
    if(!this.indexed) throw new Error('No indexed for '+this.indexedTitle);
    this.indexed.retarget(this.indexedTarget)
  }
  retargetFacets(){
    super.retargetFacets();
    this.indexing.retargetFacets();
    this.titleTargeters.forEach(t=>t.retargetFacets())
  }
  titleElements():Targeter[]{
    let list=this.elements();
    list.push(this.indexing);
    this.titleTargeters.forEach(t=>list.push(t));
    return list
  }
  private updateToTarget(){
    let frame=this.target() as IndexingFrame;
    this.indexingTarget=frame.indexing();
    this.indexedTarget=frame.indexedTarget();
    this.indexedTitle=this.indexedTarget.title()
  }
}
