export const natsWrapper = {
  client: {
    publish: jest
      .fn()
      .mockImplementation(function (
        subject: string,
        data: string,
        callback: () => void
      ) {
        callback();
      }),
  },
};
