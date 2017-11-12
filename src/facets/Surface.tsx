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
  }
  abstract newTrees(ff:Facets):Target|Target[];
  abstract buildLayout(ff:Facets);
  abstract onRetargeted?(ff:Facets,active:string);
  buildSurface(){
    this.facets.buildSurface(this.newTrees,this.buildLayout,
      this.onRetargeted);
  }
}