export const fetch_retry = async (
  n: number,
  url: Parameters<typeof fetch>['0'],
  options?: Parameters<typeof fetch>['1']
) => {
  let error;
  for (let i = 0; i < n; i++) {
    try {
      console.log('trying!');
      const res = await fetch(url, options);
      console.log(res);
      if (res.ok) {
        return res;
      }
    } catch (err) {
      error = err;
    }
    await new Promise(r => setTimeout(r, 1000));
  }
  throw error;
};
