const mockEmailService = async () => ({
  sendSignUpEmail: (target: string, uuid: string) =>
    new Promise((resolve) => resolve({ target, uuid })),
});

type MockEmailService = Awaited<ReturnType<typeof mockEmailService>>;

export { mockEmailService };
export type { MockEmailService };
