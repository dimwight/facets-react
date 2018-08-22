export namespace Texts{
  export class Content{
    constructor(public text:string){}
    clone():Content{
      return new Content(this.text)
    }
    copyClone(clone:Content){
      this.text=clone.text
    }
  }
  export const contents=[
    new Content('Hello world!'),
    new Content('Hello, good evening and welcome!'),
    new Content('Hello Dolly!'),
    new Content('Hello, sailor!'),
  ];
  export class Type{
    constructor(readonly name:string,
                readonly titleTail:string,){}
    static Standard=new Type('Standard','');
    static ShowChars=new Type('ShowChars','|ShowChars');
    static getContentType(content:Content){
      return content.text.length>20?Type.ShowChars:Type.Standard;
    }
  }
}
