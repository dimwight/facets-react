import {Targety,Targeter,TargetCore,Facet} from './_globals';
import { traceThing } from '../util/_globals';
export class TargeterCore implements Targeter{
  private notifiable: any;
  private elements_: Targeter[];
  private title_='Untargeted';
  private target_:Targety;
  notify(notice){
    this.notifiable.notify(notice);
  }
  setNotifiable(notifiable){
    this.notifiable=notifiable;
  }
  retarget(target:Targety){
    if(!target)throw new Error('Missing target');
    this.target_=target;
    const targets:Targety[]=target.elements();
    traceThing('^retarget',targets);
    if(!this.elements_)this.elements_=targets.map<Targeter>(targety=>{
        let element=(targety as TargetCore).newTargeter();
        element.setNotifiable(this);
        return element;
      });
    if(targets.length===this.elements_.length)
      this.elements_.forEach((e,at) =>e.retarget(targets[at]));
    if((<TargetCore>target).notifiesTargeter())target.setNotifiable(this);
  }
  title(){
    return this.target_?this.target_.title():this.title_;
  }
  target():Targety{ 
    if(!this.target_)throw new Error(this.title_);
    else return this.target_;
  }
  elements():Targeter[]{
    return this.elements_;
  }
  private facets_:Facet[]=[];
  attachFacet(f:Facet){
    if(!this.facets_.includes(f))this.facets_.push(f);
    f.retarget(this.target_);
  }
  retargetFacets(){
    this.elements_.forEach(e=>e.retargetFacets());
    this.facets_.forEach(f=>f.retarget(this.target_));
  }
}