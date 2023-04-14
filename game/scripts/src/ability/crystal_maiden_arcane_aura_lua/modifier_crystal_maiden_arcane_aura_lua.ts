

import { BaseModifier, registerModifier } from "../../utils/dota_ts_adapter";
import { reloadable } from "../../utils/tstl-utils";

@reloadable
@registerModifier()
class modifier_crystal_maiden_arcane_aura_lua extends BaseModifier{

    constructor(){
        print("modifier_crystal_maiden_arcane_aura_lua constructor")
        
        super()
    }

    IsHidden(): boolean {
        return true
    }

    IsDebuff(): boolean {
        return false
    }

    IsPurgable(): boolean {
        return false
    }

    IsAura(): boolean {
        return !this.GetCaster().PassivesDisabled()
    }

    GetModifierAura(): string {
        return "modifier_crystal_maiden_arcane_aura_lua_effect"
    }

    GetAuraRadius(): number {
        return FIND_UNITS_EVERYWHERE
    }

    GetAuraSearchTeam(): UnitTargetTeam {
        return UnitTargetTeam.FRIENDLY
    }

    GetAuraSearchType(): UnitTargetType {
        return UnitTargetType.HERO+UnitTargetType.BASIC
    }

}
