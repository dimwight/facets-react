import {
  Facets,
  IndexingCoupler,
  IndexingFramePolicy,
  Target,
} from 'facets-js';
import {
  Selecting,
  ScrollableList,
  SelectingTitles as Selectings,
  SimpleTitles as Simples,
  Texts,
} from './_globals';
import {traceThing} from '../util/_globals';
export namespace Trees{
  export function newViewer(facets:Facets){
    return facets.newViewerTarget("Viewer",{
      passViewable:{
        getContent:()=>'Hi there',
        viewerSelectionEdited:(edit:string)=>alert(edit)
      }
    })
  }
  export function newTextual(facets:Facets){
    const first=facets.newTextualTarget(Simples.FirstTextual,{
        passText:'Some text for '+Simples.FirstTextual,
        targetStateUpdated:state=>{
          facets.updateTarget(Simples.SecondTextual,
            Simples.FirstTextual+' has changed to: '+state);
        },
      }),
      second=facets.newTextualTarget(Simples.SecondTextual,{
        passText:'Some text for '+Simples.SecondTextual,
      });
    return facets.newTargetGroup('TextualTest',[first,second]);
  }
  export function newToggling(facets:Facets,setLive:boolean){
    const toggling=facets.newTogglingTarget(Simples.Toggling,{
        passSet:Simples.ToggleStart,
        targetStateUpdated:state=>{
          if(setLive) setSimplesLive(facets,state as boolean)
        },
      }),
      toggled=facets.newTextualTarget(Simples.Toggled,{
        getText:()=>facets.getTargetState(Simples.Toggling)as boolean?'Set':'Not set',
      });
    return facets.newTargetGroup('TogglingTest',[toggling,toggled]);
  }
  export function newTrigger(facets:Facets){
    let triggers:number=0;
    const trigger=facets.newTriggerTarget(Simples.Trigger,{
        targetStateUpdated:(state,title)=>{
          if(++triggers>4) facets.setTargetLive(title,false);
        },
      }),
      triggered=facets.newTextualTarget(Simples.Triggereds,{
        getText:()=>{
          const count=triggers.toString();
          return !facets.isTargetLive(Simples.Trigger)?
            `No more than ${count}!`:count
        },
      });
    return facets.newTargetGroup('TriggerTest',[trigger,triggered]);
  }
  export function newIndexing(facets:Facets){
    const indexing=facets.newIndexingTarget(Simples.Indexing,{
        passIndex:0,
        newUiSelectable:(indexable)=>indexable,
        getIndexables:()=>Simples.TextualIndexables,
      } as IndexingCoupler),
      index=facets.newTextualTarget(Simples.Index,{
        getText:()=>''+facets.getTargetState(Simples.Indexing),
      }),
      indexed=facets.newTextualTarget(Simples.Indexed,{
        getText:()=>Simples.TextualIndexables[facets.getTargetState(Simples.Indexing)as number],
      });
    return facets.newTargetGroup('IndexingTest',[indexing,index,indexed]);
  }
  export function newAllSimples(facets:Facets):Target{
    return facets.newTargetGroup('AllSimples',[
      newTextual(facets),
      newToggling(facets,true),
      newIndexing(facets),
      newTrigger(facets),
    ]);
  }
  export function setSimplesLive(facets:Facets,state:boolean){
    [Simples.FirstTextual,Simples.SecondTextual,
      Simples.Indexed,Simples.Indexing,Simples.Index,
      Simples.Trigger,Simples.Triggereds,
    ].forEach(title=>{
      facets.setTargetLive(title,state);
    })
  }
  export function newSelectingTyped(facets:Facets){
    function listAt():number{
      return facets.getTargetState(frame.indexingTitle as string) as number;
    }
    function getType(indexed:Texts.Content){
      return Texts.Type.getContentType(indexed);
    }
    const frame:IndexingFramePolicy={
      frameTitle:Selectings.Frame,
      indexingTitle:Selectings.Chooser,
      getIndexables:()=>Texts.contents,
      newUiSelectable:(item:Texts.Content)=>item.text,
      newFrameTargets:()=>[
        facets.newTextualTarget(Simples.Indexed,{
          getText:()=>getType(facets.getIndexingState(
            Selectings.Chooser).indexed).name,
        }),
      ]
      ,
      newIndexedTreeTitle:indexed=>Selectings.Selected+getType(indexed).titleTail,
      newIndexedTree:(indexed:Texts.Content,title:string)=>{
        const tail=getType(indexed).titleTail;
        return facets.newTargetGroup(title,tail===''?[
          facets.newTextualTarget(Selectings.TextEditField,{
            passText:indexed.text,
            targetStateUpdated:state=>indexed.text=state as string,
          }),
        ]:[
          facets.newTextualTarget(Selectings.TextEditField+tail,{
            passText:indexed.text,
            targetStateUpdated:state=>indexed.text=state as string,
          }),
          facets.newTextualTarget(Selectings.CharsCount+tail,{
            getText:()=>''+indexed.text.length,
          }),
        ])
      },
    };
    return facets.newIndexingFrame(frame);
  }
  export function newSelectingScrolling(facets:Facets){
      let createNew=(from:Texts.Content)=>({text:from.text+'+'}as Texts.Content);
      const list:ScrollableList=new ScrollableList(Texts.contents,3,facets,Selectings.Chooser,createNew);
      const frame:IndexingFramePolicy={
        frameTitle:Selectings.Frame,
        indexingTitle:Selectings.Chooser,
        newFrameTargets:()=>Selecting.newActionTargets(facets,list),
        getIndexables:()=>list.getScrolledItems(),
        newUiSelectable:(item:Texts.Content)=>item.text,
        newIndexedTreeTitle:indexed=>Selectings.Selected,
        newIndexedTree:(indexed:Texts.Content,title:string)=>{
          traceThing('^newIndexedTargets',{indexed:indexed});
          return facets.newTargetGroup(title,[
            facets.newTextualTarget(Selectings.TextEditField,{
              passText:indexed.text,
              targetStateUpdated:state=>indexed.text=state as string,
            }),
            facets.newTextualTarget(Selectings.CharsCount,{
              getText:()=>''+(facets.getTargetState(Selectings.TextEditField)as string
              ).length,
            }),
          ])
        },
      };
      return facets.newIndexingFrame(frame);
    }
  }
