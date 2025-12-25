import httpTrigger from "../api/create-invoice/index";

test("should return invoice URL for valid input", async () => {
  const context: any = { res: {}, log: { error: jest.fn(), log: jest.fn() } };
  const req: any = {
    headers: { "x-user-role": "admin" },
    body: { customerId: "cus_123", amount: 50, description: "Premium Subscription" },
  };

  await httpTrigger(context, req);
  expect(context.res.status).toBe(200);
  expect(context.res.body.success).toBe(true);
});
