import {
  Targety,
  TargetCore,
  TargeterCore,
  Targeter,
  Notifiable,
  Indexing,
  Toggling,
  Textual,
  IndexingFrame,
} from './core/_globals';
import {
  TargetState,
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
import {traceThing} from '../src/util/_globals';
export function newInstance(trace:boolean):Facets{
  return new Facets(trace);
}
export class Facets{
  trace(msg:string){
    if(this.doTrace)console.log('> '+msg)
  }
  readonly times={
    doTime:false,
  };
  public readonly activeContentTitle="[Active Content Tree]";
  private readonly notifiable:Notifiable={
    notify:notice=>{
      this.trace('Notified with '+this.rootTargeter.title());
      this.rootTargeter.retarget(this.rootTargeter.target());
      this.callOnRetargeted();
      this.rootTargeter.retargetFacets();
    },
  };
  private onRetargeted:(title:string)=>any;
  titleTargeters=new Map<string,Targeter>();
  titleTrees=new Map<string,Targety>();
  root:IndexingFrame;
  rootTargeter:Targeter;
  constructor(private readonly doTrace:boolean){
    let activeTitle=this.activeContentTitle;
    let indexedTargetTitle=()=>this.root.indexedTarget().title();
    const indexing=new Indexing('RootIndexing',{
      getIndexables:()=>{
        const trees:Targety[]=[];
        this.titleTrees.forEach(t=>trees.push(t));
        return trees
      }
    });
    this.root=new class extends IndexingFrame{
      lazyElements(){
        return [
          new Textual(activeTitle,{
            getText:()=>indexedTargetTitle()
          })
        ]
      }
    }('RootFrame',indexing);
  }
  buildApp(app: FacetsApp){
    this.onRetargeted=title=>{
      app.onRetargeted(title);
    };
    const trees=app.newContentTrees();
    if(trees instanceof Array)
      (trees as Array<Targety>).forEach(t=>this.addContentTree(t));
    else this.addContentTree((trees as Targety));
    this.trace('Building targeter tree for root='+this.root.title());
    if(!this.rootTargeter)this.rootTargeter=(this.root as TargetCore).newTargeter();
    this.rootTargeter.setNotifiable(this.notifiable);
    this.rootTargeter.retarget(this.root);
    this.addTitleTargeters(this.rootTargeter);
    this.callOnRetargeted();
    app.buildLayout();
  }
  private callOnRetargeted(){
    const title=this.root.title();
    this.trace('Calling disableAll with active='+title);
    this.onRetargeted(title);
  }
  addContentTree(tree:Targety){
    this.titleTrees.set(tree.title(),tree);
    this.root.indexing().setIndexed(tree)
  }
  activateContentTree(title:string){
    const tree=this.titleTrees.get(title);
    if(!tree)throw new Error('No tree for '+title);
    this.root.indexing().setIndexed(tree);
    this.notifiable.notify(title);
  }
  newTextualTarget(title:string,coupler:TextualCoupler):Target{
    const textual=new Textual(title,coupler);
    this.trace('Created textual title='+title);
    return textual;
  }
  newTogglingTarget(title:string,coupler:TogglingCoupler):Target{
    const toggling=new Toggling(title,coupler);
    this.trace('Created toggling title='+title);
    return toggling;
  }
  newTriggerTarget (title:string,coupler:TargetCoupler):Target{
    const trigger=new TargetCore(title,coupler);
    const passLive=coupler.passLive;
    trigger.setLive(passLive!=null?passLive:true);
    this.trace('Created trigger title='+title);
    return trigger;
  }
  newTargetGroup(title:string,members:Target[]):Target{
    return new TargetCore(title,members as Targety[]);
  }
  addTitleTargeters(t:Targeter){
    const title=t.title();
    const elements:Targeter[]=(t as TargeterCore).titleElements();
    this.titleTargeters.set(title,t);
    this.trace('Added targeter: title='+title+': elements='+elements.length);
    elements.forEach((e)=>this.addTitleTargeters(e));
  }
  attachFacet(title:string,updater:FacetUpdater):void{
    const t:Targeter=this.titleTargeters.get(title)as Targeter;
    if(!t)throw new Error('No targeter for '+title);
    this.trace('Attaching facet: title='+title);
    const facet={
      retarget:(ta:Targety)=>{
        this.trace('Facet retargeted title='+ta.title()+' state='+ta.state());
        updater(ta.state());
      },
    };
    t.attachFacet(facet);
  }
  getTargetState(title:string):TargetState{
    return this.titleTarget(title).state();
  }
  isTargetLive(title:string):boolean{
    return this.titleTarget(title).isLive();
  }
  setTargetLive(title:string,live:boolean){
    this.titleTarget(title).setLive(live);
  }
  updateTarget(title:string,update?:TargetState):void{
    if(update!=null)this.titleTarget(title).updateState(update);
    traceThing('^updateTarget',title);
    this.notifiable.notify(title);
  }
  titleTarget(title:string):Targety{
    const got=this.titleTargeters.get(title);
    if(!got)throw new Error('No targeter for '+title);
    return got.target();
  }
  newIndexingTarget(title:string,coupler:IndexingCoupler):Targety{
    const indexing=new Indexing(title,coupler);
    this.trace('Created indexing title='+title);
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
  private indexingFrames:number;
  newIndexingFrame(p: IndexingFramePolicy): Targety{
    const frameTitle = p.frameTitle?p.frameTitle
      :'IndexingFrame' +this.indexingFrames++,
    indexingTitle = p.indexingTitle?p.indexingTitle
      :frameTitle + '.Indexing';
    const indexing = new Indexing(indexingTitle,{
      getIndexables:()=>p.getIndexables(),
      newUiSelectable:i=>
        !p.newUiSelectable?null:p.newUiSelectable(i)
    });
    this.trace('Created indexing '+ indexingTitle);
    const frame = new class extends IndexingFrame{
      lazyElements():Targety[]{
        return p.newFrameTargets?p.newFrameTargets()as Targety[]:[]
      }
      protected newIndexedTargets(indexed:any):Targety {
        const titler=p.newIndexedTreeTitle,
          title=titler?titler(indexed):this.title()+'|indexed';
        const newTree=p.newIndexedTree;
        return newTree?newTree(indexed,title)as Targety
          :new TargetCore(title)
      }
    }(frameTitle, indexing);
    this.trace('Created indexing frame '+ frameTitle);
    return frame
  }
}
