import httpTrigger from "../api/create-invoice/index";

test("should return invoice URL for valid input", async () => {
  const context = { res: {}, log: { error: jest.fn(), log: jest.fn() } } as {
    res: any;
    log: { error: jest.Mock; log: jest.Mock };
  };
  const req = {
    headers: { "x-user-role": "admin" },
    body: { customerId: "cus_123", amount: 50, description: "Premium Subscription" },
  } as {
    headers: { [key: string]: string };
    body: { customerId: string; amount: number; description: string };
  };

  await httpTrigger(context, req);
  expect(context.res.status).toBe(200);
  expect(context.res.body.success).toBe(true);
});
