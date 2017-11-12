import {
  Facets,
  Target,
} from 'facets-js';
export type newTargetTrees=(Facets)=>Target|Target[]
export interface AppSpec{
  readonly newTrees: newTargetTrees,
  readonly buildLayout:(Facets)=>void,
}

export abstract class Surface{
  constructor(readonly facets:Facets){
    facets.times.doTime=false;
  }
  trace(text){
    if(this.facets.doTrace)console.info('Surface > '+text);
  }
  buildSurface(defineContent:newTargetTrees,buildLayout:(Facets)=>void){
    let times=this.facets.times;
    this.trace('Building surface '+times.elapsed());
    const content=defineContent(this.facets);
    if(content instanceof Array)
      (content as [Target]).forEach(each=>
        this.facets.addContentTree(each));
    else this.facets.addContentTree(content);
    this.facets.buildTargeterTree();
    this.trace('Built targets, created targeters');
    buildLayout(this.facets);
    this.trace('Attached and laid out facets');
    this.trace('Surface built '+times.elapsed());
  }
}