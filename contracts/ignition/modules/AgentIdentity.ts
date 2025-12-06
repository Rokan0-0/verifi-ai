import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const AgentIdentityModule = buildModule("AgentIdentityModule", (m) => {
  const agentIdentity = m.contract("AgentIdentity");
  return { agentIdentity };
});

export default AgentIdentityModule;