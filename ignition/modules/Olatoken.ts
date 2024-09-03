import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const OlaTokenModule = buildModule("OlaTokenModule", (m) => {


  const OlaToken = m.contract("OlaToken");

  return { OlaToken };

});

export default OlaTokenModule;
