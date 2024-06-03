async function _sleep(ms: number) {
  await new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Sleep {
  export function ms(milliseconds: number) {
    return _sleep(milliseconds);
  }
  
  export function sec(seconds: number) {
    return _sleep(seconds * 1000);
  }
}
