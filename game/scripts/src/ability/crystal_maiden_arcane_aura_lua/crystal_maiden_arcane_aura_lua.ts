

import { BaseAbility, registerAbility } from "../../utils/dota_ts_adapter";
import { reloadable } from "../../utils/tstl-utils";
import "modifier_crystal_maiden_arcane_aura_lua"
import "modifier_crystal_maiden_arcane_aura_lua_effect"


@reloadable
@registerAbility()
class crystal_maiden_arcane_aura_lua extends BaseAbility{
    constructor(){
        print("crystal_maiden_arcane_aura_lua constructor")
        super()
    }

    GetIntrinsicModifierName(): string {
        return "modifier_crystal_maiden_arcane_aura_lua"
    }

    /*
    GetBehavior(): AbilityBehavior | Uint64 {
        return AbilityBehavior.AURA
    }
    */
}