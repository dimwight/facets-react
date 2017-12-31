import {
  Targety,
  TargetCore,
  Targeter,
  Notifiable,
  Indexing,
  Toggling,
  Textual,
  IndexingFrame,
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
  TargetCoupler,
  IndexingFramePolicy,
} from 'facets-js';
import {traceThing} from './util/_globals';
import {TargeterCore} from './core/TargeterCore';
export function newInstance(trace:boolean):Facets{
  return new Facets();
}
export class Facets{
  readonly times={
    doTime:false,
  };
  private readonly notifiable:Notifiable={
    notify:notice=>{
      traceThing('> Notified with '+this.rootTargeter.title());
      this.rootTargeter.retarget(this.rootTargeter.target());
      this.callOnRetargeted();
      this.rootTargeter.retargetFacets();
    },
  };
  private onRetargeted;
  titleTargeters=new Map<string,Targeter>();
  root:Targety;
  rootTargeter:Targeter;
  buildApp(app: FacetsApp){
    this.onRetargeted=title=>{
      app.onRetargeted(title);
    };
    const trees=app.getContentTrees();
    if(trees instanceof Array)
      (trees as Array<Targety>).forEach(t=>this.addContentTree(t));
    else this.addContentTree((trees as Targety));
    traceThing(' > Building targeter tree for root='+this.root.title());
    if(!this.rootTargeter)this.rootTargeter=(this.root as TargetCore).newTargeter();
    this.rootTargeter.setNotifiable(this.notifiable);
    this.rootTargeter.retarget(this.root);
    this.addTitleTargeters(this.rootTargeter);
    this.callOnRetargeted();
    app.buildLayout();
  }
  private callOnRetargeted(){
    const title=this.root.title();
    traceThing('> Calling onRetargeted with active='+title);
    this.onRetargeted(title);
  }
  addContentTree(tree:Targety){
    this.root=tree;
  }
  newTextualTarget(title,coupler:TextualCoupler):Target{
    const textual=new Textual(title,coupler);
    traceThing('> Created textual title='+title);
    return textual;
  }
  newTogglingTarget(title,coupler:TogglingCoupler):Target{
    const toggling=new Toggling(title,coupler);
    traceThing('> Created toggling title='+title);
    return toggling;
  }
  newTriggerTarget (title,coupler:TargetCoupler):Target{
    const trigger=new TargetCore(title,coupler);
    traceThing('> Created trigger title='+title);
    return trigger;
  }
  newTargetGroup(title,members:Target[]):Target{
    return new TargetCore(title,members as Targety[]);
  }
  addTitleTargeters(t:Targeter){
    const title=t.title();
    const elements:Targeter[]=(t as TargeterCore).titleElements();
    this.titleTargeters.set(title,t);
    traceThing('> Added targeter: title='+title+': elements='+elements.length);
    elements.forEach((e)=>this.addTitleTargeters(e));
  }
  attachFacet(title,updater:FacetUpdater):void{
    const t:Targeter=this.titleTargeters.get(title);
    if(!t)throw new Error('No targeter for '+title);
    traceThing('> Attaching facet: title='+title);
    const facet={
      retarget(ta:Targety){
        traceThing('> Facet retargeted title='+ta.title()+' state='+ta.state());
        updater(ta.state());
      },
    };
    t.attachFacet(facet);
  }
  updateTargetState(title,update:SimpleState):void{
    this.titleTarget(title).updateState(update);
    this.notifiable.notify(title);
  }
  getTargetState(title):SimpleState{
    return this.titleTarget(title).state();
  }
  isTargetLive(title):boolean{
    return this.titleTarget(title).isLive();
  }
  setTargetLive(title,live){
    this.titleTarget(title).setLive(live);
  }
  notifyTargetUpdated(title){
    const target=this.titleTarget(title);
    target.notifyParent();
  }
  titleTarget(title):Targety{
    const got=this.titleTargeters.get(title);
    if(!got)throw new Error('No targeter for '+title);
    return got.target();
  }
  newIndexingTarget(title,coupler:IndexingCoupler):Targety{
    const indexing=new Indexing(title,coupler);
    traceThing('> Created indexing title='+title,{coupler:!coupler.targetStateUpdated});
    return indexing;
  }
  getIndexingState(title: string): IndexingState{
    const i:Indexing=this.titleTarget(title) as Indexing;
    if(!i)throw new Error('No target for title='+title);
    else return {
      uiSelectables:i.uiSelectables(),
      indexed:i.indexed(),
    };
  }
  private indexingFrames;
  newIndexingFrame(p: IndexingFramePolicy): Targety{
    const frameTitle = p.frameTitle?p.frameTitle
      :'IndexingFrame' +this.indexingFrames++,
    indexingTitle = p.indexingTitle?p.indexingTitle
      :frameTitle + '.Indexing';
    const indexing = new Indexing(indexingTitle,{
      getIndexables:title=>p.getIndexables(),
      newUiSelectable:i=>p.newUiSelectable(i)
    });
    traceThing(' > Created indexing '+ indexingTitle);
    const frame = new class extends IndexingFrame{
      lazyElements():Targety[]{
        return p.newFrameTargets()as Targety[]
      }
      protected newIndexedTargets(indexed:any):Targety {
        const titler=p.newIndexedTreeTitle,
          title=titler?titler(indexed):this.title()+'|indexed';
        const newTree=p.newIndexedTree;
        return newTree?newTree(indexed,title)as Targety
          :new TargetCore(title)
      }
    }(frameTitle, indexing);
    traceThing(' > Created indexing frame '+ frameTitle);
    return frame
  }
}
