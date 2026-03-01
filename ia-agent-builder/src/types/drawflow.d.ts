declare module 'drawflow' {
  export type DrawflowEventName =
    | 'nodeCreated'
    | 'nodeRemoved'
    | 'connectionCreated'
    | 'connectionRemoved'
    | 'nodeSelected'
    | 'nodeUnselected'
    | 'moduleCreated'
    | 'moduleChanged'
    | 'import'
    | 'export';

  export interface DrawflowConnectionEvent {
    output_id: string;
    input_id: string;
    output_class: string;
    input_class: string;
  }

  export interface DrawflowExport {
    drawflow: unknown;
  }

  export default class Drawflow {
    constructor(container: HTMLElement);

    editor_mode: 'edit' | 'fixed';

    start(): void;

    clear(): void;

    on(event: DrawflowEventName, callback: (...args: unknown[]) => void): void;

    export(): DrawflowExport;

    import(data: DrawflowExport): void;

    addNode(
      name: string,
      inputs: number,
      outputs: number,
      posX: number,
      posY: number,
      className: string,
      data: unknown,
      html: string
    ): number;

    /** Recalculates and redraws connections for a given node. */
    updateConnectionNodes(id: string | number): void;
  }
}
