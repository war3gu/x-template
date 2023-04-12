

import { BaseModifier, registerModifier } from "../../utils/dota_ts_adapter";
import { reloadable } from "../../utils/tstl-utils";

@reloadable
@registerModifier()
class modifier_sven_gods_strength_child_lua extends BaseModifier{

    gods_strength_damage_scepter:number
    IsPurgable(): boolean {
        return false
    }

    OnCreated(params: object): void {
        this.gods_strength_damage_scepter = this.GetAbility().GetSpecialValueFor("gods_strength_damage_scepter")
    }

    OnRefresh(params: object): void {
        this.gods_strength_damage_scepter = this.GetAbility().GetSpecialValueFor("gods_strength_damage_scepter")
    }

    DeclareFunctions(): ModifierFunction[] {
        return [ModifierFunction.BASEDAMAGEOUTGOING_PERCENTAGE]
    }

    GetModifierBaseDamageOutgoing_Percentage(event: ModifierAttackEvent): number {
        return this.gods_strength_damage_scepter
    }
}