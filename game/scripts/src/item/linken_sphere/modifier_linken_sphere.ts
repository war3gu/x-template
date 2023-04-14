

import { BaseModifier, registerModifier } from "../../utils/dota_ts_adapter";
import { reloadable } from "../../utils/tstl-utils";

@reloadable
@registerModifier()
class modifier_linken_sphere extends BaseModifier{
    constructor(){
        print("modifier_linken_sphere constructor")
        super()
    }

    DeclareFunctions(): ModifierFunction[] {
        return [ModifierFunction.ABSORB_SPELL]
    }

    GetAbsorbSpell(event: ModifierAbilityEvent): 0 | 1 {
        const hAbility = this.GetAbility()
        if(hAbility.IsCooldownReady())
        {
            hAbility.StartCooldown(hAbility.GetCooldown(hAbility.GetLevel()))

            return 1
        }
        else
        {
            return  0
        }
    }
}