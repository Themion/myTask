const mockEmailService = async () => ({
  sendJoinEmail: (target: string, uuid: string) =>
    new Promise((resolve) => resolve({ target, uuid })),
});

type MockEmailService = Awaited<ReturnType<typeof mockEmailService>>;

export { mockEmailService };
export type { MockEmailService };
