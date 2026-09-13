export type BoardSketch={diagram:'rays'|'shadow'|'size'|'question';title:string;note:string};
export function validateBoard(value:unknown,phase:unknown):BoardSketch|null{
 if(phase!=='play'||!value||typeof value!=='object')return null;
 const b=value as Record<string,unknown>;
 if(!['rays','shadow','size','question'].includes(String(b.diagram))||typeof b.title!=='string'||typeof b.note!=='string')return null;
 return {diagram:b.diagram as BoardSketch['diagram'],title:b.title.trim().slice(0,42),note:b.note.trim().slice(0,100)};
}
export const boardContract=` You have a small chalkboard in the classroom. Return an optional board field, null unless a sketch helps answer this question or the learner asks to draw, write, or explain. Format: {"diagram":"rays|shadow|size|question","title":"up to 5 simple words","note":"one short sentence, at most 90 characters"}. The app draws accurate chalk diagrams: rays shows straight rays from a lamp; shadow shows an opaque ball blocking rays with a shadow on the wall; size shows a closer ball casting a bigger shadow; question shows the lamp, ball and wall with a question mark. Match your explanation to the chosen drawing. Use the board naturally like a patient teacher, asking one small question. Never pretend to have drawn until the application reports it. During any prediction, board must be null and never reveal the answer. Do not put instructions or unsafe activities on the board. Stay with light and shadows for ages 5–7.`;
