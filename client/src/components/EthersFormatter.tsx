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

// The component to be used to display wei formatted as ethers
// or if needed in the future at any other given place where we need to convert from 1 unit to another
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
