import BigNumber from "bignumber.js";
import { number, uint256 } from "starknet";
import { utils } from "ethers";

export function composeUInt256(low: string, high: string) {
    return new BigNumber(low)
        .plus(new BigNumber(high).times(new BigNumber(2).pow(128)))
        .toString(10);
}

export function getUint256CalldataFromBN(bn: number.BigNumberish) {
    return { type: "struct" as const, ...uint256.bnToUint256(bn) };
}

export function parseInputAmountToUint256(input: string, decimals: number = 18) {
    return getUint256CalldataFromBN(utils.parseUnits(input, decimals).toString());
}
