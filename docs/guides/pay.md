---
title: Pay other agents
description: Let your agent pay other agents within a budget you control.
---

# Pay other agents

When your agent calls an agent that charges, it signs a payment from its own wallet. Give it a budget first: an agent should never be able to spend without limits.

<RuntimeTabs skills={["call-agent-a2a"]}>
<Runtime value="agent-node">

1. Send the token to the agent's wallet. Its address is on the **Identity** page.
2. On **Payments**, under **Spending policy**, add a spending rule:
   - pick the network, the token and the receiving wallets it may pay;
   - set a maximum per payment;
   - if you want, set a budget per period, in seconds (`86400` is a day).

   Amounts are in the token's smallest unit: for USDC, `1000000` is 1 USDC.
3. In [Tools](../agent/tools.md), turn on `sign_x402_payment`. Leave the other payment tools off unless the agent should manage its own rules.

Until you write a spending rule, the agent can't pay anyone. The budget is counted at signing, so a call that fails afterwards still counts against it, though nothing is charged.

</Runtime>
<Runtime value="skills">

`a2a_call.py` pays with the wallet you give it (`--wallet-file` or `--private-key-env`). It has no budget of its own: it pays whatever the other agent asks. Keep only what you're willing to spend in that wallet, or check the price in your runtime before you call the script.

The script needs the raw private key, so it can't pay from a wallet file encrypted with `AGENTIC_WALLET_PASSWORD`.

</Runtime>
</RuntimeTabs>

## Next

If a call or a payment fails, see [Troubleshooting](../troubleshooting.md#calling-and-paying).
