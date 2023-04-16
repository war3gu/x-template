

import { BaseModifier, registerModifier } from "../../utils/dota_ts_adapter";
import { reloadable } from "../../utils/tstl-utils";

@reloadable
@registerModifier()
class modifier_crystal_maiden_arcane_aura_lua extends BaseModifier{   //这个是永久的光环，所以不需要一些表现接口的实现。

    //因为是永久光环，自己和光环受众的效果类似，所以效果都在子modifier中实现
    //都不需要转圈，逻辑可以都在子modifier中实现
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
