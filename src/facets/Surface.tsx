import {
  Facets,
  Target,
} from 'facets-js';
export abstract class Surface{
  constructor(readonly facets:Facets){
    facets.times.doTime=false;
  }
  trace(text){
    if(this.facets.doTrace)console.info('Surface > '+text);
  }
  buildSurface(){
    let times=this.facets.times;
    this.trace('Building surface '+times.elapsed());
    this.facets.addContentTree(this.defineContent());
    this.facets.buildTargeterTree();
    this.trace('Built targets, created targeters');
    this.buildLayout();
    this.trace('Attached and laid out facets');
    this.trace('Surface built '+times.elapsed());
  }
  defineContent:()=>Target|Target[];
  buildLayout:()=>void;
}