import {
  Facets,
  newFacetsTargetTrees,
  buildFacetsLayout,
  addOnRetargeted
} from 'facets-js';
export abstract class Surface{
  constructor(readonly facets:Facets){
    facets.times.doTime=false;
  }
  newTrees:newFacetsTargetTrees;
  buildLayout:buildFacetsLayout;
  onRetargeted?:addOnRetargeted;
  buildSurface(){
    this.facets.buildSurface(this.newTrees,this.buildLayout,
      this.onRetargeted);
  }
}