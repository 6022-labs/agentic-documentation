---
id: x402-facilitator
title: x402 facilitator
sidebar_label: x402 facilitator
sidebar_position: 6
description: The 6022 x402 facilitator, what it settles and its API.
---

# x402 facilitator

6022 runs its own [open-source](https://github.com/6022-labs/agentic-x402-facilitator) x402 v2 facilitator. A paid server sends it the payment its caller signed; the facilitator checks it, submits it on-chain from its own wallet, and pays the gas. [Deployments](../deployments.md#x402-facilitators) lists its URLs.

It settles the `exact` scheme, only for the tokens it is configured with, in two ways:

- `eip3009`: the token's own `transferWithAuthorization`, the method USDC uses.
- `permit2`: [Permit2](https://github.com/Uniswap/permit2) through the x402 proxy `x402ExactPermit2Proxy`, for any ERC-20 such as $6022. The payer approves Permit2 (`0x000000000022D473030F116dDEE9F6B43aC78BA3`) once; until then payments get `permit2_allowance_required`.

ERC-7710 is refused with `invalid_payment_requirements`.

## Who it serves

6022's deployments only settle payments to the EVM [wallet addresses](../concepts/identity.md#what-an-identity-is-made-of) of an agent minted in a 6022 collection, for free. The mainnet deployment serves mainnet agents, the testnet one testnet agents. Other payees get `invalid_payment_requirements`.

Payee lookups are cached for 5 minutes: a wallet address you just added can be refused for that long.

## API

| Route | Does |
| --- | --- |
| `POST /verify` | Checks a payment without writing on-chain. |
| `POST /settle` | Checks it again, submits it and waits for the receipt. |
| `GET /supported` | Lists the networks it settles and the address that submits. |
| `GET /health` | Says the service is up. |

`/verify` and `/settle` take `{ "x402Version": 2, "paymentPayload": …, "paymentRequirements": … }`, as the [x402 v2 specification](https://github.com/x402-foundation/x402/blob/main/specs/x402-specification-v2.md) defines.

A refused payment still answers `200`, with `isValid` or `success` set to `false` and a reason code such as `insufficient_funds`.

If the transaction isn't mined in time, `/settle` answers `settlement_pending` with its hash. A retried payment is never sent twice: `/verify` refuses it, and `/settle` returns the same transaction, `settlement_pending` until it is mined, then `success: false` with `invalid_transaction_state`. Check that transaction on-chain to know you were paid.

A request fails with:

- `400` or `413` when the body is not JSON or too large;
- `502` when the chain, its storage or its wallet can't be reached, or the same payment is still being sent: retry later;
- `500` on an unexpected error.

## Run your own

The [source](https://github.com/6022-labs/agentic-x402-facilitator) is MIT-licensed. It runs as one Docker image and needs:

- an RPC URL per chain it settles on, each marked as testnet or mainnet;
- the tokens it settles, each with its transfer methods (`eip3009`, `permit2`) and, for `eip3009`, its EIP-712 name and version;
- a Vault holding the key of the wallet that pays the gas, funded on every chain;
- a Redis, shared by every instance.

`ACCESS__AGENTS_ONLY=false` opens it to any payee. Put it behind a proxy that rate-limits `/settle`: anyone who reaches it can make its wallet pay gas. The [README](https://github.com/6022-labs/agentic-x402-facilitator#readme) lists every setting.

## Next

[Point a 6022 Agent at it](../agent/payments.md#receiving-real-money) with `PAYMENT__RECEIVE__FACILITATORS__<chain id>__BASE_URL`, for example `PAYMENT__RECEIVE__FACILITATORS__137__BASE_URL=https://x402.6022.io`.
