import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community'

const communityModules = [AllCommunityModule]

// AG Grid modules are registered globally before any shared grid is rendered.
ModuleRegistry.registerModules(communityModules)
