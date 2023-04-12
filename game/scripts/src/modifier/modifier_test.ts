import { BaseModifier, registerModifier } from "../utils/dota_ts_adapter";
import { reloadable } from "../utils/tstl-utils";

@reloadable
@registerModifier()
class modifier_test extends BaseModifier{

    /*
    CheckState(): Partial<Record<ModifierState, boolean>> {
        return {
            //[ModifierState.STUNNED]:true,
            [ModifierState.ATTACK_IMMUNE]:true
        }
    }
    */

    GetStatusEffectName(): string {
        print("xxxxxx")
        return "particles/status_fx/status_effect_earthshaker_arcana.vpcf"
    }
    
    DeclareFunctions(): ModifierFunction[] {
        return [ModifierFunction.ON_UNIT_MOVED]
    }

    //particles/units/heroes/hero_bounty_hunter/bounty_hunter_shuriken_toss_main.vpcf

    OnUnitMoved(event: ModifierUnitEvent): void {
        const target = event.unit

        print("OnUnitMoved", target.GetName())
        ApplyDamage({
            "ability":this.GetAbility(),
            "attacker":this.GetCaster(),
            "damage":10,
            "damage_flags":DamageFlag.NONE,
            "damage_type":DamageTypes.PURE,
            "victim":target
        })
    }
}