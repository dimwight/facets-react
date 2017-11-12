import {
  Facets,
  newFacetsTargetTrees,
  buildFacetsLayout,
  addOnRetargeted,
  Target,
} from 'facets-js';
export abstract class Surface{
  constructor(readonly facets:Facets){
    facets.times.doTime=false;
    facets.onRetargeted=this.onRetargeted;
  }
  abstract newTrees():Target|Target[];
  abstract buildLayout();
  abstract onRetargeted(active:string);
  trace(text){
    if(this.facets.doTrace)console.info('Surface > '+text);
  }
  buildSurface(){
    const ff=this.facets;
    let times=ff.times;
    this.trace('Building surface '+times.elapsed());
    const trees=this.newTrees();
    if(trees instanceof Array)
      (trees as [Target]).forEach(each=>
        ff.addContentTree(each));
    else ff.addContentTree(trees);
    ff.buildTargeterTree();
    this.trace('Built targets, created targeters');
    this.buildLayout();
    this.trace('Attached and laid out facets');
    this.trace('Surface built '+times.elapsed());
  }
}