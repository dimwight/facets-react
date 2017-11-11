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
    const content=this.defineContent();
    if(content instanceof Array)
      (content as [Target]).forEach(each=>
        this.facets.addContentTree(content));
    else this.facets.addContentTree(content);
    this.facets.buildTargeterTree();
    this.trace('Built targets, created targeters');
    this.buildLayout();
    this.trace('Attached and laid out facets');
    this.trace('Surface built '+times.elapsed());
  }
  defineContent:()=>Target|Target[];
  buildLayout:()=>void;
}