// @ts-ignore
import * as wasm_exported from '../../../../common/Cargo.toml';
import type commonTypes from './common';

const exported = wasm_exported as typeof commonTypes;

export default exported;

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace constants {
  export const
    SUPPORTED_LANGUAGES = exported.constants.SUPPORTED_LANGUAGES,
    LANGUAGES_LEVELS = exported.constants.LANGUAGES_LEVELS;
}
