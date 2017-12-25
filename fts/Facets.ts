import {
  Targety,
  TargetCore,
  Targeter,
  Notifiable,
  Indexing,
  Toggling
} from './core/_globals';
import {
  SimpleState,
  FacetUpdater,
  TextualCoupler,
  FacetsApp,
  Target,
  IndexingCoupler,
  IndexingState,
  TogglingCoupler,
} from 'facets-js';
import {traceThing} from './util/_globals';
export function newInstance(trace:boolean):Facets{
  return new Facets();
}
export class Facets{
  readonly times={
    doTime:false
  };
  private readonly notifiable:Notifiable={
    notify:notice=>{
      traceThing('> Notified with '+this.rootTargeter.title());
      this.rootTargeter.retarget(this.rootTargeter.target());
      this.rootTargeter.retargetFacets();
    }
  };
  titleTargeters=new Map<string,Targeter>();
  root:Targety;
  rootTargeter:Targeter;
  buildApp(app: FacetsApp){
    let trees=app.getContentTrees();
    if(trees instanceof Array)
      throw new Error('Not implemented for '+(trees as Array<Targety>).length);
    else this.addContentTree((trees as Targety));
    if(!this.rootTargeter)this.rootTargeter=(this.root as TargetCore).newTargeter();
    this.rootTargeter.setNotifiable(this.notifiable);
    this.rootTargeter.retarget(this.root);
    this.addTitleTargeters(this.rootTargeter);
    app.buildLayout();
  }
  addContentTree(tree:Targety){
    this.root=tree;
  }
  newTextualTarget(title:string,coupler:TextualCoupler):Target{
    let textual=new TargetCore(title);
    textual.updateState(coupler.passText||
      (coupler.getText?coupler.getText(title):'No text supplied'));
    traceThing('> Created textual title='+title+' state='+textual.state());
    return textual;
  }
  newTogglingTarget(title:string,coupler:TogglingCoupler):Target{
    let toggling=new Toggling(title,coupler);
    traceThing('> Created toggling title='+title+' state='+toggling.state());
    return toggling;
  }
  newTargetGroup(title:string,members:Target[]):Target{
    return new TargetCore(title,members as Targety[]);
  }
  addTitleTargeters(t:Targeter){
    let title=t.title();
    const elements:Targeter[]=t.elements();
    this.titleTargeters.set(title,t);
    traceThing('> Added targeter: title='+title+': elements='+elements.length);
    elements.forEach((e)=>this.addTitleTargeters(e));
  }
  attachFacet(title:string,updater:FacetUpdater):void{
    let t:Targeter=this.titleTargeters.get(title);
    if(!t)throw new Error('Missing targeter for '+title);
    traceThing('> Attaching facet: title='+title);
    let facet={
      retarget(ta:Targety){
        traceThing('> Facet retargeted title='+ta.title()+' state='+ta.state());
        updater(ta.state());
      }
    };
    t.attachFacet(facet);
  }
  updateTargetState(title:string,update:SimpleState):void{
    this.titleTarget(title).updateState(update);
    this.notifiable.notify(title);
  }
  getTargetState(title:string):SimpleState{
    return this.titleTarget(title).state();
  }
  isTargetLive(title:string):boolean{
    return this.titleTarget(title).isLive();
  }
  titleTarget(title:string):Targety{
    return this.titleTargeters.get(title).target();
  }
  newIndexingTarget(title:string,coupler:IndexingCoupler):Targety{
    let indexing=new Indexing(title,coupler);
    indexing.updateState(coupler.passIndex||0);
    traceThing('> Created indexing title='+title+' state='+indexing.state());
    return indexing;
  }
  getIndexingState(title: string): IndexingState{
    let i:Indexing=this.titleTarget(title) as Indexing;
    if(!i)throw new Error('No target for title='+title);
    else return {
      uiSelectables:i.uiSelectables(),
      indexed:i.indexed(),
    };
  }
}
