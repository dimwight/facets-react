import {
  Facets,
  Target,
} from 'facets-js';
import {traceThing} from '../util/export';
export interface Layout{
  build(facets:Facets);
}
export abstract class Surface{
  constructor(readonly facets:Facets){}
  trace(text){
    if(this.facets.doTrace)console.info('Surface > '+text);
  }
  buildSurface(){
    this.facets.attachOnRetargeted(this.onRetargeted);
    let times=this.facets.times;
    this.trace('Building surface '+times.elapsed());
    this.facets.buildTargeterTree(this.newTargetTree());
    this.trace('Built targets, created targeters');
    this.buildLayout();
    this.trace('Attached and laid out facets');
    this.trace('Surface built '+times.elapsed());
  }
  abstract newTargetTree():Target;
  abstract buildLayout();
  protected onRetargeted?
}