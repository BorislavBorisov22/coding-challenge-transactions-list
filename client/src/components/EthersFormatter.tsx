import { ethers } from "ethers";
import { FC } from "react";

type EthereumUnit =
  | "wei"
  | "kwei"
  | "mwei"
  | "gwei"
  | "szabo"
  | "finney"
  | "ether";

interface EthersFormatterProps {
  fromUnit: EthereumUnit;
  toUnit: EthereumUnit;
  amount: string;
}

export const EthersFormatter: FC<EthersFormatterProps> = ({
  fromUnit,
  toUnit,
  amount,
}) => {
  debugger;
  const amountInWei = ethers.parseUnits(amount, fromUnit);
  const amountInOutputUnit = ethers.formatUnits(amountInWei, toUnit);

  return <>{amountInOutputUnit}</>;
};
