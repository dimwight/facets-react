import {
  Facets,
  Target,
  newFacetsTargetTrees,
  buildFacetsLayout
} from 'facets-js';
export abstract class Surface{
  constructor(readonly facets:Facets){
    facets.times.doTime=false;
  }
  trace(text){
    if(this.facets.doTrace)console.info('Surface > '+text);
  }
  buildSurface(newTrees:newFacetsTargetTrees,buildLayout:buildFacetsLayout){
    if(true){
      this.facets.buildSurface(newTrees,buildLayout);
      return;
    }
    let times=this.facets.times;
    this.trace('Building surface '+times.elapsed());
    const trees=newTrees(this.facets);
    if(trees instanceof Array)
      (trees as [Target]).forEach(each=>
        this.facets.addContentTree(each));
    else this.facets.addContentTree(trees);
    this.facets.buildTargeterTree();
    this.trace('Built targets, created targeters');
    buildLayout(this.facets);
    this.trace('Attached and laid out facets');
    this.trace('Surface built '+times.elapsed());
  }
}