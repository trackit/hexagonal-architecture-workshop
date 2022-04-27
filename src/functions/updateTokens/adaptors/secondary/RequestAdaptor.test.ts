import RequestAdaptor from './RequestAdaptor';

describe('RequestAdaptor', () => {
  describe('get', () => {
    it('should fetch the url', async () => {
      const testURL = 'https://url.com';

      const adaptor = new RequestAdaptor(async (url) => {
        expect(url).toEqual(testURL);

        return {
          json: () => ({
            test: true,
          }),
        };
      });

      expect(await adaptor.get(testURL)).toEqual({ test: true });
    });
  });
});
