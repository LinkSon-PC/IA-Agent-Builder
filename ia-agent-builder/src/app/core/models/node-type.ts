/**
 * Discriminator for workflow node types.
 *
 * Extend this enum to add new node categories.
 */
export enum NodeType {
  Message = 'message',
  Question = 'question',
  Decision = 'decision',
  Coordinator = 'coordinator'
}
