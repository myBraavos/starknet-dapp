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

export function strToFeltArr(str: string): BigInt[] {
    const size = Math.ceil(str.length / 31);
    const arr = Array(size);

    let offset = 0;
    for (let i = 0; i < size; i++) {
        const substr = str.substring(offset, offset + 31).split("");
        const ss = substr.reduce(
            (memo, c) => memo + c.charCodeAt(0).toString(16),
            ""
        );
        arr[i] = BigInt("0x" + ss);
        offset += 31;
    }
    return arr;
}


export function feltArrToStr(felts: bigint[]): string {
    return felts.reduce(
        (memo, felt) => memo + Buffer.from(felt.toString(16), "hex").toString(),
        ""
    );
}
