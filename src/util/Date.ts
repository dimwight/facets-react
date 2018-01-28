import {SkippableItem} from './_globals';
import {format,addDays} from "date-fns";
export class DayItem implements SkippableItem<Date>{
  constructor(public readonly date:Date){}
  newSkipped(skip:number):DayItem{
    return new DayItem(addDays(this.date,skip))
  }
  weekDay():string{
    return format(this.date,'ddd MMMM D');
  }
  month(){
    return format(this.date,'MMMM');
  }
  year(){
    return format(this.date,'YYYY');
  }
}
export namespace DateTitles{
  export const App='DateSelecting',Chooser='Select Date',
    Year='Year',Month='Month',Day='Day';
}


