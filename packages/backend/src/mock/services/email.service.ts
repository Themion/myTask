const mockEmailService = async () => ({
  sendEmail: (receiver: string, title: string, body: string) =>
    new Promise((resolve) => resolve({ receiver, title, body })),
});

type MockEmailService = Awaited<ReturnType<typeof mockEmailService>>;

export { mockEmailService };
export type { MockEmailService };
