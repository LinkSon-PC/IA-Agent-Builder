import { InputType } from './input-type';

/**
 * Declares how a node config should be edited in the UI.
 */
export interface NodeConfigSchema {
  fields: NodeConfigField[];
}

/**
 * Declares one editable field inside a node configuration.
 */
export interface NodeConfigField {
  /** Stable key in the node config object. */
  key: string;

  /** Display label. */
  label: string;

  /** Input rendering type. */
  inputType: InputType;

  /** Whether the field is required. */
  required?: boolean;

  /** Placeholder (optional). */
  placeholder?: string;

  /** Optional description shown as hint. */
  description?: string;
}
